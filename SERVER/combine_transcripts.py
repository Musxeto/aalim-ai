import os
import json

def combine_transcripts(folder="transcripts", output_file="combined_dataset.jsonl"):
    combined = []
    for file in os.listdir(folder):
        if file.endswith(".json"):
            with open(os.path.join(folder, file), "r", encoding="utf-8") as f:
                data = json.load(f)
                combined.append(data)

    with open(output_file, "w", encoding="utf-8") as out:
        for entry in combined:
            out.write(json.dumps(entry, ensure_ascii=False) + "\n")

    print(f"Combined {len(combined)} transcripts into {output_file}")

combine_transcripts()
