from fastapi import FastAPI, Request
from pydantic import BaseModel
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.prompts import ChatPromptTemplate
import ollama
import time
import uvicorn

app = FastAPI()

embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

chroma_db = Chroma(
    collection_name="islam_data",
    embedding_function=embedding,
    persist_directory="db"
)

ISLAMIC_QA_PROMPT = """
You are an AI Islamic scholar (Mufti). Answer the question based only on the following context:

<context>
{context}
</context>

Question: {question}

Instructions:
- Answer concisely (2–4 lines).
- Provide evidence from Quran or authentic Hadith if available.
- Mention source if you cite Hadith, If Source Unknown say it's from a scholar.
- If unsure, say: "Allah knows best."
- Don't mention that you are getting any contexts.
"""

class QuestionInput(BaseModel):
    question: str
    k: int = 5 

def query_rag(question: str, k: int = 5) -> str:
    start_time = time.time()

    docs = chroma_db.similarity_search(question, k=k)

    context = "\n\n".join([
        f"Source: {doc.metadata.get('source', 'unknown')}\nTitle: {doc.metadata.get('title')}\nContent: {doc.page_content.strip()}"
        for doc in docs
    ])

    prompt = ChatPromptTemplate.from_template(ISLAMIC_QA_PROMPT).format(
        context=context,
        question=question
    )

    response = ollama.chat(
        model='llama3.2',
        messages=[{'role': 'user', 'content': prompt}],
        options={'temperature': 0.3}
    )

    total_time = time.time() - start_time
    print(f"RAG response time: {total_time:.2f}s")
    return response['message']['content'].strip()

@app.post("/ask")
async def ask_question(data: QuestionInput):
    answer = query_rag(data.question, data.k)
    print(f"question: {data.question}, answer: {answer}")
    return {"question": data.question, "answer": answer}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=7860, reload=True)
