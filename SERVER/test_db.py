from langchain_community.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
import time

embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
chroma_db = Chroma(
    collection_name="islam_data",
    embedding_function=embedding,
    persist_directory="db"
)

def build_context_only(question, k=5):
    start_time = time.time()
    docs = chroma_db.similarity_search(question, k=k)

    context = "\n\n".join([
        f"Source Type: {doc.metadata.get('source_type', 'unknown')}\n"
        f"Title: {doc.metadata.get('title', 'unknown')}\n"
        f"Content: {doc.page_content}"
        for doc in docs
    ])
    print(f"⚡ Built context in {time.time() - start_time:.2f}s\n")
    return context

if __name__ == "__main__":
    while True:
        query = input("Enter your Islamic question (or 'exit'): ")
        if query.lower() == "exit":
            break
        print("\n Retrieved Context:\n")
        print(build_context_only(query))
        print("\n" + "="*60 + "\n")
        print(" Total documents in DB:", chroma_db._collection.count()) 