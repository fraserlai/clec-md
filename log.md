# clec.md — activity log

Append-only. Newest at the bottom. Each entry starts `## [YYYY-MM-DD] <op> | <what>`
so it stays greppable: `grep "^## \[" log.md | tail -5`.

## [2026-07-11] setup | Repo scaffolded

Stood up clec-md: bilingual (zh-TW/en) Astro site over a `knowledge/` SSOT,
following the LLM-Wiki pattern (raw → knowledge → CLAUDE.md schema). Built the
ingestion pipeline: `scripts/transcribe.mjs` (ffmpeg + whisper.cpp large-v3 +
OpenCC s2twp) and `scripts/convert-docs.mjs` (markitdown). Source corpus:
~2,166 videos + ~640 documents in the CLEC Google Drive.

## [2026-07-11] ingest | Pilot batch (3 shorts + 3 docs)

Transcribed 短篇 00001–00003; converted 3 X/YouTube post docs. Authored seed
pages from them:
- retirement-planning/房地產與指數基金的退休現金流 (from 短篇 00002) — zh-TW + en
- glossary/指數基金 (from 短篇 00001 context) — zh-TW + en
- about/about-clec-md — zh-TW + en

Proved the pipeline end-to-end. Remaining corpus queued; transcription is a
resumable multi-day background job (`npm run transcribe`).
