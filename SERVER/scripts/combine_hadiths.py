import pandas as pd
import json

# Load CSV
df = pd.read_csv("hadith.csv")
df = df.dropna(subset=["text_en"])

# Build dataset
dataset = []
for _, row in df.iterrows():
    item = {
        "transcript": row["text_en"],
        "title": row.get("chapter", "Unknown Chapter"),
        "hadith_id": row.get("hadith_id"),
        "source": row.get("source"),
        "chapter_no": row.get("chapter_no"),
        "hadith_no": row.get("hadith_no")
    }
    dataset.append(item)

# Save as JSONL
with open("combined_hadith_dataset.jsonl", "w", encoding="utf-8") as f:
    for item in dataset:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")

print("✅ combined_hadith_dataset.jsonl created.")
