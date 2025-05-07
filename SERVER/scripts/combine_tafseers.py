import csv
import json
import os

input_dir = "./tafseers"
output_file = "./data/combined_tafseer_dataset.jsonl"

csv_files = {
    "Jalalayn": "tafseer_al-jalalayn.csv",
    "Ibn Abbas": "tafseer_Ibn_abbas.csv",
    "Qushairi": "tafseer_al_qushairi.csv",
    "Kashani": "tafseer_kashani.csv"
}

with open(output_file, "w", encoding="utf-8") as out_f:
    for tafsir_name, filename in csv_files.items():
        path = os.path.join(input_dir, filename)
        with open(path, "r", encoding="utf-8") as csv_f:
            reader = csv.DictReader(csv_f)
            for row in reader:
                obj = {
                    "type": "tafsir",
                    "tafsir_name": tafsir_name,
                    "arabic": row.get("Arabic", "").strip(),
                    "text": row.get("Tafseer", "").strip()
                }
                out_f.write(json.dumps(obj, ensure_ascii=False) + "\n")

print("All tafseer files merged into JSONL.")
