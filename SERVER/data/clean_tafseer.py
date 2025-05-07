import json

with open("combined_tafseer_dataset.jsonl", "r", encoding="utf-8") as infile, \
     open("cleaned_tafseer_dataset.jsonl", "w", encoding="utf-8") as outfile:
    for i, line in enumerate(infile, 1):
        try:
            json.loads(line)
            outfile.write(line)
        except json.JSONDecodeError:
            print(f"Skipping bad JSON at line {i}")
