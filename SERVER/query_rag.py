from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings  # updated import
from langchain.prompts import ChatPromptTemplate
import ollama
import time

# Embedding model
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Vector database
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
- Mention source if you cite Hadith (e.g., Sunan Abi Da'ud).
- If unsure, say: "Allah knows best."
"""

def query_rag(question, k=5):
    start_time = time.time()

    # Retrieve documents
    docs = chroma_db.similarity_search(question, k=k)

    # Format context
    context = "\n\n".join([
        f"Source: {doc.metadata.get('source', 'unknown')}\nContent: {doc.page_content.strip()}"
        for doc in docs
    ])

    # Fill prompt
    prompt = ChatPromptTemplate.from_template(ISLAMIC_QA_PROMPT).format(
        context=context,
        question=question
    )

    # Display debug info
    print(f"\n Context retrieved:\n{context}")
    print("\n Querying LLaMA...")
    print("==================================================")

    # Get response
    response = ollama.chat(
        model='llama3.2',
        messages=[{'role': 'user', 'content': prompt}],
        options={'temperature': 0.3}
    )

    total_time = time.time() - start_time
    answer = response['message']['content'].strip()

    print(f"\n⚡ Answer received in {total_time:.2f} seconds:")
    return answer

if __name__ == "__main__":
    while True:
        question = input("\n🕋 Ask your Islamic question (or type 'exit'): ").strip()
        if question.lower() == 'exit':
            print("📿 Fi amanAllah.")
            break
        print("\n" + "=" * 50)
        print(query_rag(question))
        print("=" * 50 + "\n")
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings  # updated import
from langchain.prompts import ChatPromptTemplate
import ollama
import time

# Embedding model
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Vector database
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
- Mention source if you cite Hadith, If Source Unknown say its from a scholar.
- If unsure, say: "Allah knows best."
- Don't mention that you are getting any contexts.
"""

def query_rag(question, k=5):
    start_time = time.time()

    # Retrieve documents
    docs = chroma_db.similarity_search(question, k=k)

    # Format context
    context = "\n\n".join([
        f"Source: {doc.metadata.get('source', 'unknown')}\nTitle: {doc.metadata.get('title')}\nContent: {doc.page_content.strip()}"
        for doc in docs
    ])

    prompt = ChatPromptTemplate.from_template(ISLAMIC_QA_PROMPT).format(
        context=context,
        question=question
    )

    # Display debug info
    print(f"\n Context retrieved:\n{context}")
    print("\n Querying LLaMA...")
    print("==================================================")

    # Get response
    response = ollama.chat(
        model='llama3.2',
        messages=[{'role': 'user', 'content': prompt}],
        options={'temperature': 0.3}
    )

    total_time = time.time() - start_time
    answer = response['message']['content'].strip()

    print(f"\n⚡ Answer received in {total_time:.2f} seconds:")
    return answer

if __name__ == "__main__":
    while True:
        question = input("\n🕋 Ask your Islamic question (or type 'exit'): ").strip()
        if question.lower() == 'exit':
            print("📿 Fi amanAllah.")
            break
        print("\n" + "=" * 50)
        print(query_rag(question))
        print("=" * 50 + "\n")
