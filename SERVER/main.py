from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.prompts import ChatPromptTemplate
import ollama
import time
import uvicorn
import requests
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, auth, firestore
import requests

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../.env'))

embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

chroma_db = Chroma(
    collection_name="islam_data",
    embedding_function=embedding,
    persist_directory="db"
)

ISLAMIC_QA_PROMPT = """
You are an expert Islamic scholar named **Aalim AI**.

Answer the following question accurately and concisely using authentic Islamic knowledge.

Use the chat history and relevant Islamic knowledge to answer the user's latest question **as part of a flowing conversation**.

**Previous Conversation**:
{chat_history}

**Relevant Knowledge**:
<context>
{context}
</context>

**Latest Question**: {question}

**Rules**:
- Be confident like a scholar while answering.
- Provide a direct answer, even if the context is insufficient.
- Do not mention the context, lack of context, or that you are using general knowledge.
- Do not say "based on what I found" or "the provided text".
- Use Quran and Sahih Hadith as evidence where applicable.
- Mention Hadith sources like Sahih Bukhari, Muslim, etc., when quoted.
- End with "Allah knows best." if there is any doubt.
- Use Github Markdown for formatting.
- Do not say I didn't find anything in providing context,The provided texts etc.
- Do not say you are an AI or model.
"""

class QuestionInput(BaseModel):
    question: str
    token: str
    chat_id: str
    k: int = 5

def verify_firebase_token(token: str):
    try:
        decoded = auth.verify_id_token(token)
        return decoded["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")

def get_user_context(uid: str, chat_id: str, limit: int = 5):
    messages_ref = db.collection("users").document(uid).collection("chats").document(chat_id).collection("messages")
    query = messages_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).limit(limit * 2)
    results = list(query.stream())
    results.reverse() 
    
    context = []
    for doc in results:
        data = doc.to_dict()
        role = data.get("role", "user")
        content = data.get("text", "").strip()
        if role == "user":
            context.append(f"User: {content}")
        elif role == "assistant":
            context.append(f"Assistant: {content}")
    
    return "\n".join(context[-limit*2:])  # Ensure exact count
def store_message(uid: str, chat_id: str, role: str, text: str):
    messages_ref = (
        db.collection("users")
        .document(uid)
        .collection("chats")
        .document(chat_id)
        .collection("messages")
    )
    messages_ref.add({
        "role": role,
        "text": text,
        "timestamp": firestore.SERVER_TIMESTAMP 
    })

def query_rag(question: str, k: int, prior_context: str) -> str:
    docs = chroma_db.similarity_search(question, k=k)
    for i, doc in enumerate(docs):
        print(f"Doc {i+1}: {doc.page_content[:300]}...")
    search_context = "\n\n".join([
        f"Source: {doc.metadata.get('source', 'unknown')}\nTitle: {doc.metadata.get('title')}\nContent: {doc.page_content.strip()}"
        for doc in docs
    ])

    combined_user_message = f"{prior_context}\n\nUser: {question}"
    
    prompt = ChatPromptTemplate.from_template(ISLAMIC_QA_PROMPT).format(
        chat_history=prior_context,
        context=search_context,
        question=combined_user_message
    )

    print(f"Combined context: {combined_user_message}")

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not set")

    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}",
        headers={'Content-Type': 'application/json'},
        json={"contents": [{"parts": [{"text": prompt}]}]}
    )

    # Ollama implementation (commented out)
    # response = ollama.chat(
    #     model='llama3.2',
    #     messages=[{'role': 'user', 'content': prompt}],
    #     options={'temperature': 0.3}
    # )
    # answer = response['message']['content'].strip()

    if response.status_code != 200:
        raise Exception(f"Gemini API failed: {response.text}")

    try:
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    except (KeyError, IndexError):
        raise Exception("Failed to parse Gemini response")

@app.post("/ask")
async def ask_question(data: QuestionInput):
    uid = None
    user_context = ""

    if data.token:
        try:
            uid = verify_firebase_token(data.token)
            if data.chat_id:
                user_context = get_user_context(uid, data.chat_id, limit=5)
        except HTTPException as e:
            if e.status_code == 401:
                # Log the invalid token error and proceed as a guest user
                print("Invalid Firebase token. Proceeding as guest user.")
            else:
                raise e

    answer = query_rag(data.question, data.k, user_context)
    print (f"User context: {user_context}")
    print (f"Answer: {answer}")
    if uid and data.chat_id:
        store_message(uid, data.chat_id, "user", data.question)
        store_message(uid, data.chat_id, "assistant", answer)
    
    return {"question": data.question, "answer": answer}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=7860, reload=True)