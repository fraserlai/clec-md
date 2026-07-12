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

## [2026-07-11] ingest | 世界最佳QQQ → 全球納斯達克100指數基金對照 (consolidated)

Ingested the deferred worldwide-QQQ doc into one big bilingual reference page:
index-etf/全球納斯達克100指數基金對照. Consolidates QQQ equivalents across 14+
markets (US/TW/CN/HK/JP/KR/CA/AU/UK/EU/SG-MY/IN/NZ/BR + Ireland UCITS), with
2×/3× leveraged versions, per-region cash/MMF instruments, high-dividend
retirement versions, and pledge-lending options. Cross-linked from the main
為什麼是納斯達克100 page. Knowledge base now 15 topic pages × 2 langs.

## [2026-07-12] ingest | X及YouTube的貼文 (38 posts) → 4 new pages + house update

Converted all 38 posts. Created bilingual pages from the distinct/new topics:
- retirement-planning/退休需要多少錢 (0015+0009): 15× not 50×; 1440萬 QQQI example; 15-yr cash FLOW
- glossary/QQQI (0028): covered-call high-div; return-of-capital tax truth (TW vs US)
- behavioral-finance/從擇時操作到打死不賣 (0032-0035): CONFLICT resolved — the "全方位操盤術"
  market-timing/stock-picking is James's 2016 method he explicitly abandoned; kept the
  newer doctrine (index + never sell), flagged old parts as superseded.
- behavioral-finance/統計概率隨機與意外 (0030 + 九十四): true/false propositions, 25y vs 5y
  return distributions, randomness/surprise.
Updated retirement-planning/房地產 with 0031 第二版 (30-yr buy-vs-rent calc; newer-wins:
concrete $ version supersedes the older qualitative one).

Conflict-resolution applied (newer index wins): 0032-0035 timing→superseded by buy&hold;
0031 第二版 supersedes 短篇00002 qualitative; 0015 (15×/1440萬) refines the lecture's
50×/33× tiers for the retirement target number.

Remaining posts mostly REINFORCE existing pages (not new pages): 0003/0005/0014/0017→房地產;
0004/0010/0012/0013/0022/0023/0024/0025/0026/0027/0029→勞工還是資本家; 0018/0002→崩盤是朋友;
0019→UCITS/遺產稅; 0007→質押/global table; 0021→為什麼是納斯達克100; 0006→(見證). 0020(中華商場)
/0011(出書) tangential, skipped. Knowledge base now 19 topics × 2 langs.

## [2026-07-12] transcribe | Downloads 00694 lecture ch1 (video, 56min) — running

## [2026-07-12] transcribe+ingest | 講座影片版 ch1/ch2/ch3 (00694/00695/00696)

Transcribed the video versions of the flagship lecture (whisper large-v3 + opencc):
- 00694 ch1 (56min) → done → added as corroborating source to investing-mindset/勞工還是資本家
- 00695 ch2 (42min) → added as source to index-etf/為什麼是納斯達克100
- 00696 ch3 (32min) → added as source to asset-allocation/現金是空氣
These are the spoken versions of the same chapters already ingested from the PDF, so they
corroborate (provenance) rather than spawn redundant pages. Added scripts/transcribe-file.mjs
for one-off arbitrary-path transcription (sequential; coexists with the bulk job).

## [2026-07-12] section | James's Posts & Articles (verbatim)

New `posts` collection (separate from synthesized knowledge/), published faithfully:
- Imported 37 X/YouTube posts + 2 FB (所有文章彙總 index of 167 links + 重要資訊連結).
- scripts/import-posts.mjs does mechanical cleanup only (strip 來源 line + base64
  images + tracking params); never rewrites James's words.
- /posts + /en/posts listing (source badges, newest-first), /posts/[...slug] detail,
  PostLayout with 'View original ↗' + faithfulness note; header nav link.
- Deleted the stray 九十四 post per request.

FB backfill: 270 individual FB articles are Google Drive online-only (readdir sees
only 2; daily sync limit). They import faithfully as they sync — re-run:
  CLEC_SOURCE_DIR=<drive> npm run convert-docs -- --folder "FB Wealthyin50的貼文"
  node scripts/import-posts.mjs --folder "FB Wealthyin50的貼文"
NOT crawling FB: WebFetch returns summarized (non-verbatim) text, which would violate
the 'proofread only, don't modify context' rule. The 彙總 index post links all 167.
