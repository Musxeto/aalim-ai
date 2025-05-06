import os
import json
import time
import socket
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from yt_dlp import YoutubeDL
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed

CHANNEL_URL = "https://www.youtube.com/@Justalayman"
OUTPUT_FOLDER = "transcripts"
FAILED_LOG = "failed_ids.txt"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def get_all_video_ids(channel_url):
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'force_generic_extractor': True,
        'skip_download': True,
        'dump_single_json': True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(channel_url + "/videos", download=False)
        entries = info.get("entries", [])
        return [(entry['id'], entry['title']) for entry in entries if 'id' in entry]

# Fetch transcript with retry + timeout
def fetch_transcript(video_id, retries=3):
    for attempt in range(retries):
        try:
            socket.setdefaulttimeout(10)
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            return " ".join([t["text"] for t in transcript])
        except (TranscriptsDisabled, NoTranscriptFound):
            return None
        except Exception as e:
            time.sleep(2)
    return None

# Save the transcript to JSON
def save_json(video_id, title, transcript):
    out = {
        "video_id": video_id,
        "title": title,
        "transcript": transcript
    }
    with open(f"{OUTPUT_FOLDER}/{video_id}.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

# Worker function for multithreading
def process_video(video_id, title):
    output_path = f"{OUTPUT_FOLDER}/{video_id}.json"
    if os.path.exists(output_path):
        return None  # already exists

    transcript = fetch_transcript(video_id)
    if transcript:
        save_json(video_id, title, transcript)
    else:
        with open(FAILED_LOG, "a", encoding="utf-8") as log:
            log.write(f"{video_id} - {title}\n")
    return video_id

def main():
    print(f"Getting video list from: {CHANNEL_URL}")
    videos = get_all_video_ids(CHANNEL_URL)
    print(f"Found {len(videos)} videos.")

    processed_ids = set(f.split(".")[0] for f in os.listdir(OUTPUT_FOLDER))

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {
            executor.submit(process_video, video_id, title): (video_id, title)
            for video_id, title in videos if video_id not in processed_ids
        }

        for f in tqdm(as_completed(futures), total=len(futures), desc="Fetching transcripts"):
            _ = f.result()

    print("✅ All done!")

if __name__ == "__main__":
    main()
