from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma 
from langchain.embeddings import HuggingFaceEmbeddings
from tqdm import tqdm
import json
import os

def load_dataset(filepath):
    data = []
    with open(filepath, "r", encoding="utf-8") as f:
        for i, line in enumerate(f):
            try:
                data.append(json.loads(line))
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON at line {i+1} in {filepath}: {e}")
    return data

current_dir = os.path.dirname(os.path.abspath(__file__))
video_data = load_dataset(os.path.join(current_dir, "data", "combined_dataset_zakir.jsonl"))
# hadith_data = load_dataset(os.path.join(current_dir, "data", "combined_hadith_dataset.jsonl"))

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)

docs, metadatas = [], []

for item in video_data:
    transcript = item.get("transcript", "")
    if not transcript.strip():
        continue 
    splits = splitter.split_text(transcript)
    for idx, split in enumerate(splits):
        docs.append(split)
        metadatas.append({
            "source_type": "video",
            "video_id": item.get("video_id"),
            "title": item.get("title"),
            "chunk_id": idx
        })

# for item in hadith_data:
#     transcript = item.get("transcript", "")
#     if not transcript.strip():
#         continue  
#     splits = splitter.split_text(transcript)
#     for idx, split in enumerate(splits):
#         docs.append(split)
#         metadatas.append({
#             "source_type": "hadith",
#             "title": item.get("title"),
#             "source": item.get("source"),
#             "hadith_id": item.get("hadith_id"),
#             "chapter_no": item.get("chapter_no"),
#             "hadith_no": item.get("hadith_no"),
#             "chunk_id": idx
#         })

embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
persist_dir = "db"
BATCH_SIZE = 512

if not os.path.exists(persist_dir):
    os.makedirs(persist_dir)

chroma_db = Chroma(
    collection_name="islam_data",
    embedding_function=embedding,
    persist_directory=persist_dir
)

for i in tqdm(range(0, len(docs), BATCH_SIZE), desc=" (: Embedding Chunks"):
    batch_texts = docs[i:i+BATCH_SIZE]
    batch_metas = metadatas[i:i+BATCH_SIZE]
    chroma_db.add_texts(texts=batch_texts, metadatas=batch_metas)

chroma_db.persist()
print("ChromaDB created :)")
