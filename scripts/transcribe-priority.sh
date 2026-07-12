#!/usr/bin/env bash
# Resumable priority transcription: high-value folders first.
# JOBS controls parallelism (encode=ANE, decode=GPU overlap). 3 is safe on 32GB.
set -u
cd "$(dirname "$0")/.."
JOBS="${JOBS:-3}"
for folder in "長篇" "CLEC 專題" "專題" "緣起今日" "CLEC 2018 年實體課程"; do
  echo "===== $(date '+%F %T') START $folder (jobs=$JOBS) ====="
  node scripts/transcribe.mjs --folder "$folder" --jobs "$JOBS"
done
echo "===== $(date '+%F %T') PRIORITY BATCH COMPLETE ====="
