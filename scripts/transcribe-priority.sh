#!/usr/bin/env bash
# Resumable priority transcription: high-value folders first.
set -u
cd "$(dirname "$0")/.."
for folder in "長篇" "CLEC 專題" "專題" "緣起今日" "CLEC 2018 年實體課程"; do
  echo "===== $(date '+%F %T') START $folder ====="
  node scripts/transcribe.mjs --folder "$folder"
done
echo "===== $(date '+%F %T') PRIORITY BATCH COMPLETE ====="
