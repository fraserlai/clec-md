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

## [2026-07-11] ingest | 價值十億元的投資講座 → 5 bilingual pages

Ingested the flagship lecture (raw/docs/教學資料/價值十億元的投資講座_無圖版_v1.pdf,
3 chapters) into 5 new bilingual knowledge pages:
- investing-mindset/勞工還是資本家 (ch1: labor vs capitalist, rat race, 富有是天賦)
- index-etf/為什麼是納斯達克100 (ch2: QQQ vs SPY vs VT, 火車頭, 200-yr assets)
- asset-allocation/現金是空氣 (ch3: cash buffer, 提領率四檔配置)
- retirement-planning/三層防線 (ch3: 3yr cash + pledge≤20% + wait)
- glossary/質押借款 (pledge vs margin)
Wove wikilinks across all pages; updated index.md. Total knowledge pages now 8×2 langs.

## [2026-07-11] tooling | transcribe --jobs parallel mode

Diagnosed low GPU use: Core ML encoder runs on ANE (not GPU), decoder on Metal,
alternating → single stream underuses hardware. Added --jobs worker pool
(overlaps ANE+GPU). Priority job relaunched at jobs=3 (~2-3× throughput).

## [2026-07-11] ingest | raw/docs/教學資料 strategy notes + 理財聖經 + posts → 6 pages

Ingested the finite high-value docs (deduping lecture variants):
- index-etf/UCITS-ETF-非美國投資人 (from 【UCITS ETF】 note — US estate tax, iShares CNDX)
- asset-allocation/聰明再平衡法 (from 【聰明再平衡法】 note — advanced/leveraged rebalancing)
- glossary/Beta (from 【Beta 的計算】 — QQQ=1.0 convention)
- investing-mindset/值得讀的投資書籍 (from 【值得讀的投資書籍】 reading list)
- behavioral-finance/崩盤是朋友 (from 理財聖經 iron law 3 + lecture — 46% rebound)
- glossary/儲蓄險與壽險陷阱 (from post 0001 — 16yr life insurance = 0.64%)
Knowledge base now 14 topic pages × 2 langs. Empty categories remaining: risk-cashflow, macro-economy.

Deferred/not ingested (redundant or ongoing):
- CLEC寶典 V1.0.0 (繁/簡/英): reviewed — content substantially overlaps 講座/聖經.
- 世界最佳QQQ note, 圖文/簡中 lecture variants: duplicate of existing pages.
- Charles Schwab note: promotional + contains a personal email; skipped for privacy.
- posts 0002/0003, 統計概率隨機, 5 short transcripts: lower priority / partial overlap.
- raw/transcripts/長篇 (~2000 videos): still transcribing (npm run transcribe), ongoing stream.
