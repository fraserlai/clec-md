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

## [2026-07-12] schema | Clubhouse ingest model (bundle + 4 streams + qa category)

Restructured how 長篇 (Clubhouse Q&A) sessions are ingested, after comparing our 00570
transcript + 簡報 deck against cfnavi.org/c00570. Findings that drove it:
- A session is not "lecture + Q&A"; it's FOUR streams: 開場講授 / 學員提問 / 學員分享 /
  外部資源連結. The 分享 often carries the best teaching (cfnavi promotes it to key points).
- Deck holds canonical doctrine James SKIPS aloud (「這頁不念，在貼文0009上」); transcript
  holds all Q&A/分享/ad-libs. Neither alone is complete → ingest unit = BUNDLE
  (transcript + 簡報 + cited 貼文). Deck/貼文 text wins on wording; transcript elaborates.
- whisper repetition loops swallow whole speaker turns (00570 lines 244-254), not just noise.

Built:
- New `qa` category (src/config/categories.mjs; content.config.ts z.enum picks it up
  automatically). Contract: one page per CANONICAL recurring question, append dated entries,
  link to doctrine (don't restate). Codified bundle + 4-stream + qa contract in CLAUDE.md.
- Saved converted 00570 deck → raw/docs/簡報資料/ (markitdown; tables mangled, treat as raw).
- Pilot on 00570 (5 new bilingual pages + 1 update):
  - risk-cashflow/十五年現金流 (講授: 現金流≠現金, extreme-scenario test) — fills empty category
  - risk-cashflow/韓信點兵借貸順序 (講授: 信貸→房貸→質押 by risk attribute)
  - qa/退休需要幾倍年開銷 (提問: 15×/25× by dividend yield; links to 退休需要多少錢 doctrine)
  - qa/帳戶類型該放什麼資產 (提問: QLD→Roth, BOXX/QQQI→Traditional, pair to Beta 1.0)
  - behavioral-finance/身份認同與長期投資 (分享: 大喬's Atomic Habits identity → 打死不賣)
  - Updated asset-allocation/現金是空氣: 現金流 refinement box + 00570 source.
Knowledge base now 24 topic pages × 2 langs (incl. first 2 qa + first 2 risk-cashflow).

Pipeline follow-ups (not done): add 簡報資料 to convert-docs auto-flow (only manual so far);
keep whisper segment timestamps in raw/ (for qa time-anchors + loop detection + lecture/
Q&A boundary); degraded transcripts (loops) need targeted re-transcription. Regional intel
from 00570 (China 溢價 12%, HK broker crackdown, 僑匯) noted but not yet filed into
全球納斯達克100指數基金對照 — next pass.

## [2026-07-13] tooling | Whisper timestamps + bundle-aware 簡報 conversion (pipeline #1+#2)

Did the two pipeline follow-ups from the ingest-model work:

#2 whisper segment timestamps — transcribe.mjs + transcribe-file.mjs now run whisper with
`-oj` (JSON) and emit a timestamped body (`[mm:ss] …` per segment) + `segmentTimestamps: true`
frontmatter; plain-text `-otxt` retained as fallback. Refactored clean-transcript.mjs to
export `loopLineMask()`; new scripts/lib/whisper-segments.mjs (parseWhisperJson / clock /
segmentsToBody) runs the SAME loop-stripper on converted speech text BEFORE attaching the
[mm:ss] prefix (else repeated lines dodge de-dup via differing timestamps). Verified end-to-end
on a 20s clip against the installed whisper build: JSON offsets parse, `[00:00]` anchors emitted,
loops still stripped, opencc still applied. Old transcripts (pre-today) have no timestamps —
re-transcribe to add.

#1 簡報資料 in convert-docs — folder was already in DOC_FOLDERS but never run + frontmatter
was generic. Added `--match <substr>` (convert one session's deck) and bundle-aware frontmatter:
`episode` (parsed from filename), `transcriptPair` (auto-found in raw/transcripts by episode #),
`citedPosts` (scanned from body: "0009 貼文" → ["0007","0009"]), and a `converter` PDF-table
caveat. Ran it on 00570 → replaced the earlier hand-cleaned raw deck (which violated raw/'s
"never edited by hand" rule) with faithful markitdown extraction carrying the auto-linked bundle.
簡報資料 now shows 126 pending / 127 in the pipeline. Docs updated in CLAUDE.md.

Still open: bulk-convert remaining 126 簡報 decks (resumable, run when needed); file 00570
regional intel into 全球納斯達克100指數基金對照; re-transcribe 00570 itself to gain timestamps.

## [2026-07-13] ingest | 00565–00567, 00571, 00572 (5 completed re-transcribed items)

Ingested the 5 newly-timestamped 長篇 completed by the re-transcription job (00568/00569/00570/
00573 already ingested earlier). Bundle = transcript + 簡報 deck. Mostly reinforcing; filed the
distinctive new material:
- NEW risk-cashflow/欠錢不還與資產傳承 (00566) — PAL / buy-borrow-die: 「欠錢能不還就不要還」(甲乙
  流動性比較), when-to-pledge thresholds (TW 1000萬 / CN 250萬 / HK 150萬 / US 80萬; pledgers hold
  30% cash), Schwab PAL inheritance (on-PAL → reregister/replacement; beneficiary → repay+close OR
  use own PAL to inherit w/o selling; step-up basis ≈ no cap-gains), 培養下一代. zh+en.
- EXTENDED qa/退休需要幾倍年開銷 with 00566's retirement-multiple × lifestyle table (15×平淡/20×中等/
  35×較好/50×+優渥). zh+en.
- EXTENDED risk-cashflow/韓信點兵借貸順序 with 00571's 啟動資金 > 省小錢 (borrow 20–100萬 start-capital
  ≫ monthly ±$500; post 0016 math: from 200k, $3000/mo→7y3m to 1M, $2500→7y7m, $2000→8y3m). zh+en.
- EXTENDED risk-cashflow/十五年現金流 with 00567's cash-cushion glide-path (N years out → hold 15−N
  years, +1/yr → 15 at retirement). zh+en.
- CORRECTION (00567, newer-wins): China cash = money-market 511880 (~1%), NOT 161115 (bond/stock
  underlying, principal can lose). Fixed 現金是空氣 + 三層防線 (zh+en); 全球對照 was already correct.

Reinforce-only (no separate page, per precedent): 00565 (等待最笨/立即市價買進 → 現金是空氣單筆買進,
從擇時操作到打死不賣); 00567 (富有是天賦, QQQ 1000→百萬, 巴菲特長壽 → 為什麼是納斯達克100, 勞工還是資本家,
別為錢賣命); 00572 財富獨立宣言 (manifesto → 從擇時操作到打死不賣, 身份認同; 433配置+每年質押2%、隨資產
翻倍重做配置的 worked example → 聰明再平衡法 / 欠錢不還與資產傳承 — file properly next pass).
Knowledge base now 28 topic pages × 2 langs (risk-cashflow 4, qa 4).

Re-transcription job b22amzov0 progress: 8/494 done (00565–00573), newest-first, jobs=3; multi-week ETA.
whisper.cpp note: large-v3-turbo (~5–8× faster, small accuracy cost) available via
`sh ./models/download-ggml-model.sh large-v3-turbo`; Core ML build (-DWHISPER_COREML=1) gives >3×.
Lever to cut the multi-week backlog to days if desired (kept large-v3 for now).

## [2026-07-13] tooling | Switched transcription to large-v3-turbo (~5× faster)

Set up turbo per request. Benchmarked clean (single instance, 60 s Chinese audio): large-v3 **20 s**
vs turbo **4 s** (≈5×, ~15× realtime), quality on par (identical meaning; one 碳/炭 homophone).
flash-attn (`-fa`) hit 3 s but dropped a sentence at a chunk boundary → NOT used (SSOT quality).

Setup: `sh models/download-ggml-model.sh large-v3-turbo` failed (HF Xet storage 403), fetched via
`huggingface_hub.hf_hub_download` instead (installed `huggingface_hub[hf_xet]` into the markitdown venv).
The stale Aug-2024 `main` binary can't load turbo → rebuilt whisper-cli: `cmake -B build
-DCMAKE_BUILD_TYPE=Release && cmake --build build -j --target whisper-cli` (Metal backend).
transcribe.mjs now labels `transcriber:` from the actual model (MODEL_LABEL from WHISPER_MODEL),
so turbo transcripts read `whisper.cpp large-v3-turbo`.

Stopped the large-v3 job b22amzov0 at 15/494 done (00557–00573 timestamped; lost 3 in-flight, resumable)
and relaunched on turbo as **bcvba2i1h**: `WHISPER_BIN=build/bin/whisper-cli
WHISPER_MODEL=models/ggml-large-v3-turbo.bin npm run transcribe -- --folder 長篇 --desc
--redo-untimestamped --jobs 3` → 478 pending (skips the 16 already-timestamped), 3 turbo workers.
The 16 done with large-v3 keep their (higher-tier) transcripts; turbo does the older back-catalog.
Multi-week ETA → now days. Config defaults left as main/large-v3 (turbo via env); runbook in
raw/transcripts/_revisit-no-timestamps.md.

## [2026-07-13] ingest | 00547–00558 batch (13 turbo-completed episodes)

Ingested the distinctive new material from the turbo backlog's first 13 completions (00547–00558;
00565–00573 done earlier). Bundle = timestamped transcript + 簡報 deck. Mostly reinforcing; filed:
- NEW retirement-planning/美國退休帳戶只提撥Roth (00551) — Pre-Tax IRA/401K = 資產毒藥丸: (1) RMD forces
  withdrawals into top bracket, (2) retirement-age Roth conversion still taxed high ($2M @15% → convert
  ~$340k/yr for 10y), (3) DOUBLE taxation as inheritance (estate tax once + heir's income tax on
  principal+growth). Contribution order: Roth → brokerage → never Pre-Tax. Non-US: avoid US accounts
  (→ UCITS). Complements qa/帳戶類型該放什麼資產 (placement) with the account-type doctrine. zh+en.
- EXTENDED risk-cashflow/欠錢不還與資產傳承 (00556) — WHY never repay: repaying shrinks the asset base so
  the 2% drawdown shrinks (5M×2%=100k vs repay→4M×2%=80k); bank's view (stock pledge = safe/liquid
  collateral → bank happy for you not to repay; vs credit/mortgage must be repaid). 433+2% 自動導航. zh+en.

Reinforce-only (logged, not separately filed): 00547 (真正的風險不是下跌/模擬考驗→現金是空氣,三層防線),
00548 (QQQI 股息穩定機制→QQQI), 00549 (投資是選制度/非美籍別碰美國帳戶/年輕人別碰高股息→美國退休帳戶,UCITS),
00550 (不是每個人適合用借來的錢/心理素質→欠錢不還,質押借款), 00552 (稅務繼承錯誤配置→美國退休帳戶),
00553 (QQQI+433 打造15倍現金流→現金是空氣,退休需要多少錢), 00554/00555 (勞工到資本家/諾亞方舟→勞工還是資本家),
00557 (投資秘訣 intro), 00558 (投資是風險控管/週期思維→從擇時操作到打死不賣). Deferred for a proper pass:
00549 年輕人別碰高股息 (age×high-dividend rule) and 00548 QQQI covered-call mechanism could extend those pages.
Knowledge base now 30 topic pages × 2 langs (retirement-planning 5, risk-cashflow 4, qa 4).

## [2026-07-13] transcribe | 00573 (first timestamped transcript) + job cleanup

Transcribed 00573【真正讓我富有的…買進持有打死不賣】(2026-07-11, 211 min, the cfnavi c00573
episode) through the new pipeline → FIRST transcript with `segmentTimestamps: true` and
`[mm:ss]` anchors every ~30s. Verified the real whisper build's `-oj` JSON parses correctly
end-to-end. 00573 is buy-and-hold-themed (not career), so not cited in the career pages below;
it's a good candidate for a full four-stream bundle ingest later.

Job cleanup (user-directed): found 3 overlapping whisper jobs — killed a redundant no-timestamp
00573 job (other session) and an 8.5h `--jobs 2` bulk backlog job (old code, no timestamps;
its output was all on the revisit list anyway). Kept the timestamped 00573 run. See
raw/transcripts/_revisit-no-timestamps.md for the re-transcribe backlog.

## [2026-07-13] ingest | Career-path pages (life-philosophy doctrine + qa) from 00568/00569/00570

Decided taxonomy home for student career questions: NO new top-level category. Doctrine →
life-philosophy; the recurring questions → qa (subcategory: life-philosophy); the answer threads
through investing-mindset / retirement-planning / risk-cashflow via wikilinks; shared 職涯/工作 tag.
Built (zh+en):
- life-philosophy/別為錢賣命 — 15× start thinking retire / 25× retire / >50× still working =
  "用生命換垃圾"; 多活十年 > 多工作十年; 生命 > 金錢 (體檢); 提早離開老鼠籠; 工作是選項 (開店為虧錢).
  Sources 00568 + 00569 + 00570.
- qa/該不該辭職或提早退休 — two-step answer (夠不夠 → 值不值得); variants: 轉職/全職投資/慣老闆/
  toxic workplace. 00570 SF (42, 三班輪, 試算後直接退休), Eason (全職投資自由人), 中敏 (freedom then
  meaningful work not money). Toxic-workplace variant cross-links relationships.
Knowledge base now 26 topic pages × 2 langs (life-philosophy 2, qa 3). npm test/build pending
(Bash classifier was temporarily down at write time — re-run `npm test` + `npm run build`).
[Later same day: validated — npm test OK (56 pages), build green.]

## [2026-07-13] transcribe | 長篇 full backlog re-transcription launched (00572→00001, timestamped)

Added `--redo-untimestamped` (alias `--overwrite`) to transcribe.mjs: re-transcribes existing
outputs lacking `segmentTimestamps: true`, and overwrites each only when its new version is
ready (no missing-file window); files already timestamped are skipped (so 00573 is left alone).
`hasTimestamps()` reads the frontmatter flag. Launched background job b22amzov0:
`transcribe --folder 長篇 --desc --redo-untimestamped --jobs 3` → 493 pending / 494 (all but
00573), newest-first. Multi-day resumable job; re-run to continue. 32GB RAM → jobs=3 (~13.5GB).

## [2026-07-13] ingest | 00573 bundle (transcript+簡報) → 1 new qa + property/buy-hold extensions

First bundle ingest using a TIMESTAMPED transcript (cites carry @mm:ss). 00573 is mostly
reinforcing (打死不賣 / 保險解約 / 現金+槓桿演變 / 市場與我無關), so filed as:
- NEW qa/保單該不該解約還是等期滿 (zh+en) — the dominant recurring question in 00573 (asked 5+×:
  @12:30, @1:31:30, @2:52:30, @3:07:30, @3:09:30). Answer: 立即解約, 等期滿=沉沒成本虧更大; 唯一保
  定期壽險+必要險. subcategory glossary → links [[儲蓄險與壽險陷阱]].
- EXTENDED retirement-planning/房地產 (zh+en) with 00573's age×assets four-line home rule
  (年輕不買/中年有錢不用/沒錢不能/有點錢可以) + 50歲6000萬賣房租房原則 + 房子是消費品. New [^3].
- Added 00573 as corroborating source to behavioral-finance/從擇時操作到打死不賣 (title thesis)
  + cross-linked 身份認同與長期投資.
Bundle note: 00573 簡報 was auto-converted with episode:"00573" but no transcriptPair/citedPosts
(converted before the transcript existed; deck cites no 貼文 numbers). Knowledge base now 27
topic pages × 2 langs (qa 4). Deferred: 00573 非美籍→香港/遺產稅 Q&A (@2:32:30) and Traditional→Roth
conversion-pace math (@2:52:00) — reinforce existing UCITS / Roth-placement pages, next pass.

## [2026-07-13] ingest | 00559/00564/00549/00542/00546/00540 → NEW macro-economy category + 5 pages

Ingested the newer un-ingested completed timestamped 長篇 (gap 00559–00564 + late-2025
00540–00546), newest-first, newer-wins. Opened the previously-empty **macro-economy** category
and cleared the deferred age×high-dividend item. Bundle = timestamped transcript (+deck where it
carried distinctive slides; 00559/00561/00562/00563 decks were boilerplate-only, so content came
from transcripts; 00564 deck was the rich one). Built (zh+en):
- **NEW macro-economy/景氣循環與週期判讀** (00559 @16:30–53:00, +00561) — five loops (消費→庫存→
  投資→信貸→房地產), IPO/新興市場-超車-美國 late-cycle signals, and the key doctrine: **做週期勝率
  <50% (James 自陳~20%), 目的是降報酬換心安/資產平滑, 不是多賺**; discipline = 決定了不要跳來跳去、
  事先預判 (50/100 日均線)。Cross-links 從擇時操作到打死不賣.
- **NEW macro-economy/美元霸權與石油美元** (00559 @38:30–47:00, +00540 @9:30–12:30, +00564 deck
  stablecoin) — James's geopolitical read (flagged as opinion): wars (俄/委/伊朗) = force world
  resources into USD trade → keep printing; 皮肉傷 vs 內傷; stablecoins can't change money's
  nature; individual escape = own 納指100, 做美國的主人 (跳出剝削/內捲循環). Cross-links 勞工還是資本家.
- **NEW qa/年輕人適合買高股息嗎** (00549 @16:30–19:00, +00564, +00559) — DEFERRED item cleared.
  高股息是15倍退休族的現金流解方 (10×高股息+5×成長); **年輕人最大風險=低報酬, 不要碰高股息**; 把現金
  (SGOV/00865B) 轉高股息「會死掉」(跌80%→高股息跌60%)。subcategory investing-mindset.
- **EXTEND 現金是空氣** — 短債 vs 長債 callout (00559/00564): 短債(1/3/6M)≈現金本金保證; 長債
  (30Y)是風險資產, 一點波動就跌20%+; 「留現金」=短債/貨基, 不是長債充數. New [^2].
- **EXTEND qa/該不該辭職或提早退休** — append 00546〈你早就可以退休了只是你不敢〉: 門檻15倍、
  「想退休就退休吧勇敢一點」, 障礙常是心理非財務. New variant + 歷次回答 + [^3].
- **EXTEND retirement-planning/退休需要多少錢** — 00542 的 **2.5% 分水嶺** (≤2.5%/≥40倍 不必高股息;
  >2.5% 要搭 QQQI) + A/B 組合混合解法 (A純指數~2.5%, B=QQQI~11%, 解目標提領率). New [^3].

Reinforce-only (reviewed, logged, not separately filed): 00560 (散戶輸在情緒→從擇時操作,崩盤是朋友),
00561 (週期殘酷真相→景氣循環新頁), 00562 (有錢就買打死不賣→從擇時操作,身份認同), 00563 (投資沒有標準
答案/覺醒→life-philosophy), 00541 (兩倍槓桿不會歸零但需再平衡→聰明再平衡法,質押借款), 00543 (市場恐懼/
房產牢籠→崩盤是朋友,房地產), 00544 (跌十年生存法則→三層防線,十五年現金流), 00545 (家庭悲劇變喜劇/陪伴→
子女是風箏,快樂是人權), 00564 minor (無所謂沒關係都可以 stress mantra; 抱怨只是宣洩情緒不要給建議→
relationships). 00542「QQQ不是科技是最強公司」→ 為什麼是納斯達克100 (reinforce, not edited this pass).
Cross-linked 景氣循環 into 從擇時操作到打死不賣 relatedTopics (avoid orphan). npm test OK (68 pages),
build green (441 pages). Knowledge base now 33 topic pages × 2 langs (macro-economy 2 [new], qa 5).
Re-transcription job b22amzov0/turbo still running below 00540 (older back-catalog).

## [2026-07-14] ingest (loop) | 00532 → 房地產頁擴充：理財型房貸 vs 以房養老

Loop iteration (6h cadence, job 28fd54fc). Re-transcription job has completed 00514–00539
(26 new timestamped 長篇 below the last batch); ingesting newest-first, newer-wins. This run
filed the batch's clearest NEW doctrine:
- EXTEND retirement-planning/房地產與指數基金的退休現金流 (zh+en) — new「活化房產成退休現金流」
  section: **理財型房貸 vs 以房養老** comparison table (lump-sum/salary-repay/accumulation-phase
  tool vs monthly/no-repay/retirement-phase tool), 活化資產→投資美國, borrowing discipline (用薪水還,
  別把信貸+理財型房貸+高股息疊到現金流斷). Source 00532 @04:00–06:30/@21:00–22:30; related 00525/00529/00537.

Deferred to next loop fires (00514–00539 backlog, distinctive candidates spotted):
- 00538 彈性再平衡2.0 (現金15年不減損升級版) → extend 聰明再平衡法 / 十五年現金流.
- 00515/00517 穩定幣解說 (退休者必看/市場跌到零不怕) → extend 美元霸權與石油美元 stablecoin section.
- 00526/00530 QQQ vs VT (「投資VT變貧窮階級」) → extend 為什麼是納斯達克100 or new qa.
- 00527/00528 6000萬→60億 2% 質押滾雪球路徑 → extend 欠錢不還與資產傳承 / 韓信點兵 worked example.
- 00525/00529/00532 以房養老 + 租屋剝削陷阱 → possible qa/該不該以房養老 (doctrine now on 房地產頁).
Reinforce-only: 00514/00533/00534 (活著比回報率重要/先定現金再選Beta→現金是空氣,三層防線), 00531
(TQQQ歸零/配置比房穩→聰明再平衡), 00536 (會投資QQQ的人更閒→life-philosophy), 00516/00524 (中產困境/
知識即革命→勞工還是資本家,美元霸權), 00539 (紀律致富→從擇時操作), 00518/00519/00520/00521/00522/00523
(資產配置/波動是祝福/反詐騙→崩盤是朋友,現金是空氣). Knowledge base 33 topic pages × 2 langs.
Re-transcription job still running below 00514.

## [2026-07-14] ingest (loop, follow-up) | qa/以房養老 + stablecoin + QQQ-vs-VT real returns

Follow-up to the same loop fire after review flagged (a) the batch wasn't fully mined and
(b) a missing qa page. Filed the recurring-question + two clean data-backed extensions:
- NEW qa/該不該以房養老 (zh+en) — canonical recurring question across 00525/00529/00532.
  以房養老不是「缺錢才用」(活化資產去投資); 退休無收入辦不到理財型房貸→以房養老補位; 父母有房鼓勵其
  以房養老 (養房子不如養孩子). Doctrine stays on 房地產頁; qa links to it. subcategory retirement-planning.
- EXTEND macro-economy/美元霸權與石油美元 (zh+en) — stablecoin section expanded from 00517:
  三類穩定幣、中心化本質、真正差別是「效率」(數位1秒 vs SWIFT 2–4天)、Trump 推數位貨幣是霸權的數位競賽。[^4]
- EXTEND index-etf/為什麼是納斯達克100 (zh+en) — real annualized-return callout from 00526:
  17yr QQQ 15.8% / SPY·VOO·VTI ~9.6% / VT 5.7% (VT<1/3 QQQ); 40yr QQQ ~14% / SPY ~8.95%.[^2]
Cross-linked 房地產頁↔該不該以房養老; index.md gains the qa line + updated 房地產 desc.

Consciously DEFERRED (not lost — quality gate, for a proper pass):
- 00538 彈性再平衡2.0 (現金15年不減損升級版) — deck-dependent; whisper run garbled around the
  維持率 tables. Needs 00538 簡報 conversion before filing numbers.
- 00527/00528 6000萬→60億 2% 質押滾雪球 — decades-long projection is assumption-heavy; won't file
  a speculative 60億 figure. Reinforces 欠錢不還與資產傳承 / 韓信點兵 as-is.
Knowledge base now 34 topic pages × 2 langs (qa 6).

## [2026-07-14] ingest (loop, deep-pass) | 00538 彈性再平衡2.0 from deck → 聰明再平衡法

Cleared the two previously-deferred items with proper deck-based sourcing (per "go ahead"):
- EXTEND asset-allocation/聰明再平衡法 (zh+en) — NEW「彈性再平衡2.0」section, sourced from the
  CONVERTED 00538 簡報 (not the garbled transcript). Mechanism: variant of 聰明再平衡 keyed on the
  15-year cash line — 現金<15年時下跌年從原型(QQQ)補槓桿(不消耗現金，現金15年不減損)；現金≥15年時
  回到傳統(從現金補)。下跌年再平衡前提=高點握有>15年現金(18年→可撐3年下跌)。回測 vs 純聰明再平衡
  「贏多輸少」且最低維持率更高 → 對質押者多一層維持率保護。Cross-link 十五年現金流. Source [^2] 00538 deck.
- 00527/00528 6000萬→60億: read 00527 transcript — the「60億」is a deck projection (assumption-heavy);
  transcript substance (2% 質押 + 聰明再平衡把現金移出/現金年數逐年增加 @1:20:30; 房產回報率<2%的估值;
  立即單筆買進) is already covered by 十五年現金流 / 欠錢不還 / 現金是空氣. Confirmed reinforce-only,
  not filed as a headline number.
Knowledge base 34 topic pages × 2 langs. 00514–00539 batch now fully mined (distinctive filed,
rest reinforce-only). Re-transcription job still running below 00514.

## [2026-07-14] ingest (loop) | 00508 香港匯豐質押實務 → 全球對照

Loop fire (job 28fd54fc). Re-transcription completed 00502, 00505–00513 (below 00514); ingesting
newest-first, newer-wins. Filed the batch's clearest distinctive (regional/practical) item:
- EXTEND index-etf/全球納斯達克100指數基金對照 (zh+en) — 香港匯豐匯財組合貸款 operational detail from
  00508: HSBC 可股票質押 (非中國居民可赴港開戶); **QQQ/SGOV 可質押但 BOXX 不可** (現金抵押改用 SGOV/MMF);
  借2%/維持250% 只能一半QQQ一半貨基、不能一開始配槓桿; 管道=匯豐銀行/證券, 家信不能質押, 富途只有 margin
  (利息高，最多借10%). Decaying regional intel → 標註會變動. Source [^2] 00508 @08:00–20:00/@39:30.

Reinforce-only (logged, not separately filed): 00513 (選那斯達克100/AI→為什麼是納斯達克100), 00512
(資產配置模擬全攻略：槓桿/再平衡/現金轉換→聰明再平衡法,彈性再平衡2.0；deck-heavy 模擬器教學), 00511
(風險與現金才是起點→現金是空氣,三層防線), 00510 (活著就能致富→現金是空氣,崩盤是朋友), 00509 (貪婪恐懼/
笑到最後→statistics,崩盤是朋友), 00507 (時間>金錢/資本主義勞動陷阱→別為錢賣命,勞工還是資本家,美元霸權),
00506 (股票融資放大收益→質押借款 融資vs質押), 00505 (Kevin Tsai 客座：簡單長期複利→核心哲學), 00502
(財務槓桿/市場沒有低點只有更高→從擇時操作,聰明再平衡). Knowledge base 34 topic pages × 2 langs.
Re-transcription job still running below 00502.

## [2026-07-14] ingest (loop) | 00501 → NEW glossary/ROA-ROE-ROI

Loop fire (job 28fd54fc). Re-transcription completed 00491–00501, 00503, 00504 (below 00502);
ingesting newest-first, newer-wins. Filed the batch's clearest distinctive (evergreen concept):
- NEW glossary/回報率ROA-ROE-ROI (zh+en) — 三種回報率別搞混: ROA÷總資產; ROE÷自有淨資產(借錢放大);
  ROI÷實際投入部分。Worked example (600萬自有→1500萬全投賺210萬: ROA/ROI=14%, ROE=35%; 留200萬現金
  只投1300萬賺182萬: ROA=12.13%, ROI=14%, ROE=30.3%). 話術陷阱: 投機者只講ROI(投10萬賺3萬=30%)唬人,
  真ROE只3%; 巴菲特看ROE. Cross-linked ↔ 質押借款 (借錢放大ROE). Source 00501 @05:30–11:30.

Reinforce-only (logged, not separately filed): 00504 (槓桿與質押/現金為王→現金是空氣,質押借款),
00503 (市面課程99%割韭菜→核心哲學,值得讀的書), 00500 (資產增值與開銷平衡/花錢看資產心量→別為錢賣命,
退休需要多少錢), 00499 (現金/QQQ/QLD三步；AI時代→現金是空氣,聰明再平衡；deck-heavy), 00498 (質押自動
導航→欠錢不還,現金是空氣), 00497 (一籃新鮮水果勝過爛籃挑短線→為什麼是納斯達克100,從擇時操作), 00496
(全球市場科技浪潮/財富自由哲學→life-philosophy), 00495 (高低點不存在/富人特權→從擇時操作,勞工還是資本家),
00494 (家庭資產活化：理財型房貸＋指數→房地產頁理財型房貸段，corroborating), 00493 (質押與資產配置降風險→
質押借款,聰明再平衡), 00492 (槓桿基金使用技巧與風險→聰明再平衡,彈性再平衡2.0), 00491 (聰明再平衡縮小最大
下跌風險→聰明再平衡). Knowledge base now 35 topic pages × 2 langs (glossary 6). Job still running below 00491.

## [2026-07-14] audit + fix | deck cross-check of past-20h ingests (bundle-model miss)

User flagged that recent loop fires ingested transcript-only, skipping the 簡報 deck (violates the
CLAUDE.md bundle contract). Audited every episode I filed distinctive material from over the past
~20h of loop runs by reading its converted deck:
- **00508 = the real miss** (content-rich topic deck). Deck supplied numbers the degraded transcript
  lacked → FIXED 全球對照 (zh+en): QQQ 抵押率 ~70%, 匯財組合貸款利率 ~4.5–5%, 250% 維持率, 200萬→借4萬
  (2%)/50%QQQ+50%SGOV 範例; and NEW recourse nuance → 房地產頁 (zh+en): 美國房貸無追索權(房子燒了丟給
  銀行)vs 台灣理財型房貸有追索權(仍要還). Footnotes now cite deck vs transcript separately.
- **00501 deck CONFIRMS** the ROA/ROE/ROI numbers I filed (ROA/ROI=210/1500=14%, ROE=210/600=35%;
  house 50萬→ROA 3.33%/ROE 8.33%). No error.
- **00540/00542/00549/00532/00525/00529/00559 decks = boilerplate-only** (routine weekly Clubhouse
  slides). Transcript was correctly the source; nothing lost. Pattern: weekly decks boilerplate,
  topic/special decks (00508/00538/00564/00501) carry the real numbers.
Process fix: replaced loop cron 28fd54fc → **003ba9a4** with a prompt that MANDATES converting+reading
the deck before writing, "deck wins on numbers", and never filing a transcript-only number/ticker/rate.

## [2026-07-15] ingest (loop, bundle-strict) | 00476 → Roth 轉換工具/時機

Loop fire (job 003ba9a4, new bundle-enforcing prompt). Re-transcription completed 00460–00490
(31 eps); ingesting newest-first, newer-wins. Bundle check: ran `convert-docs --match 00476` →
**0 documents (00476 has NO deck)**; proceeded transcript-only and FLAGGED it, avoiding whisper-
garbled calculator example numbers.
- EXTEND retirement-planning/美國退休帳戶只提撥Roth (zh+en) — new「怎麼轉出來」section from 00476:
  學員 Linda 做的中英雙語 Traditional→Roth **轉換計算器**(輸入 IRA餘額/報酬/年齡/收入→每年該轉多少);
  **在低收入年轉**(退休後、未領社安金/未觸發RMD那幾年稅負最輕); **保險話術警告**(保險經紀想把
  Traditional IRA 搬進保單/7702→別上當, link 儲蓄險與壽險陷阱). No-deck caveat added; source [^3].

Reinforce-only (logged, not separately filed): 00490 (勞工撿垃圾/退休房貸是風險→勞工還是資本家,房地產),
00489 (美元霸權/貿易出超國悲哀/QQQ勝SPY→美元霸權,為什麼是納斯達克100), 00488 (AI/台積電/不還本金成長→
欠錢不還), 00487 (最大化成功概率非回報率→統計概率隨機與意外), 00486 (新經濟時代趨勢→macro/景氣循環),
00485 (買房變窮/借錢成富豪→房地產,勞工還是資本家), 00484/00483 (固若金湯資產配置/立即市價買進→現金是空氣,
從擇時操作), 00482/00481/00480/00479/00478/00477 (長期持有/複利/立即投資→為什麼是納斯達克100,從擇時操作),
00475 (極端狀況要有現金/欠債可不還→三層防線,欠錢不還), 00474 (市場永遠起漲點→崩盤是朋友), 00473 (領導者
眼光→life-philosophy), 00472 (高科技製造陷阱/資本主義戰爭→美元霸權,勞工還是資本家), 00471 (投資AI起飛→
為什麼是納斯達克100), 00470 (讓子女富有別讓保險經紀發財→儲蓄險與壽險陷阱,子女是風箏), 00469 (別把股神當
學習對象→從擇時操作), 00468 (階段性財富自由→別為錢賣命), 00467/00466 (欠債更富有/資本家歡迎印錢→欠錢不還,
美元霸權), 00465 (現金無風險獲利/人可以不知不可無知→現金是空氣), 00464/00463 (省稅更富有/跑在國稅局前面→
美國退休帳戶,欠錢不還), 00462 (華爾街的錢都是我的→勞工還是資本家), 00461 (勞力所得85%不屬於你→勞工還是
資本家,美元霸權), 00460 (槓桿基金風險控管/最少必要知識→聰明再平衡,Beta). Knowledge base 35 topic pages ×
2 langs. Job still running below 00460.

## [2026-07-15] ingest (loop, bundle-strict) | 00451 flagship deck → NEW 投資第一堂課 總覽頁

Loop fire (job 003ba9a4). Re-transcription completed 00444–00459 (16 eps); newest-first. Bundle:
converted+READ the 00451 **deck** (content-rich flagship, not boilerplate) before writing.
- NEW investing-mindset/價值一億元的投資人生講座 (zh+en, featured) — OVERVIEW/landing page for CLEC's
  annual 第一堂課 (00451 = 2024《一億元》版; 2026 擴充為《十億元》版). Built from the deck skeleton:
  ①富有是天賦/快樂是人權 ②資本家vs勞工 ③勞工老鼠籠 ④致富鑰匙「金錢能量轉化管道」鏈 ⑤長期持有美國指數
  (有錢就買打死不賣，如地主不賣地) ⑥誰不可投資(承受不了下跌/短期要用的錢→放定存,避免破產) ⑦標的納指100+
  各國ETF、連Schwab consultant 推薦的產品都別照單全收。Links out to 快樂是人權/別為錢賣命/勞工還是資本家/
  為什麼是納斯達克100/從擇時操作/現金是空氣/崩盤是朋友/全球對照 (overview links, doesn't restate).
  Deck return figures 美國指數~8.9%/債券~5.4%/黃金~2.1% cited cautiously (markitdown-blurred → flagged;
  只取最清楚者). Added inbound link from 勞工還是資本家 relatedTopics.

Reinforce-only (logged): 00459 (安全資產配置/利息漲股票歸零都活得怡然→現金是空氣,三層防線), 00458 (資金
不同退休配置不同→退休需要多少錢), 00457 (質押/槓桿/高股息風控不然破產→聰明再平衡,年輕人適合買高股息嗎),
00456 (最佳時機就是現在立即買→從擇時操作,現金是空氣單筆買進), 00455/00450 (怎麼買不重要不用賣才是師傅/錢換
指數是不動產永遠不賣→從擇時操作,為什麼是納斯達克100), 00454 (最重要一堂課:配置/槓桿/質押/再平衡→綜合,聰明
再平衡), 00453 (八風吹不動安全配置→現金是空氣), 00452 (保有現金又維持Beta1.0→Beta,帳戶類型該放什麼資產),
00449 (人生最值得是回憶/時間/思考→快樂是人權,別為錢賣命), 00448 (立即all in長期永遠對/所有操作都錯→從擇時
操作), 00447 (不賣不還/最佳借款管道→韓信點兵,欠錢不還), 00446 (房子拿來住/房產投資是被奴化→房地產), 00445
(財經專家都是妖魔鬼怪→從擇時操作,崩盤是朋友), 00444 (股市房市稅務退休帳戶大哉問/AI→綜合reinforce).
Knowledge base now 36 topic pages × 2 langs (investing-mindset 3). Job still running below 00444.

## [2026-07-15] ingest (loop, bundle-strict) | 00438/00434 → NEW glossary/為什麼不買債券

Loop fire (job 003ba9a4). Re-transcription completed 00422–00443 (22 eps); newest-first. Bundle:
ran convert-docs --match 00439/00442 → **0 docs (no decks)**; 00439's own VIDEO also failed
(episode says "download the deck", but deck not in repo) → 00439 specifics unrecoverable, used only
qualitatively + flagged. Built the anti-bond doctrine from 00438/00434 transcripts (qualitative),
flagging 00438's historical-rate figures as transcript-only.
- NEW glossary/為什麼不買債券 (zh+en) — 長債/公司債基金 風險極高: 跌得比大盤兇/漲得比指數慢/回報低;
  公司債另有信用風險(信貸迴圈尾端爆); 唯一例外=短債≈現金(BIL/SGOV/貨基). Rebuttal to "高利率該買長債避險":
  不要用單一時期下定論; 反例 1986–89 利率~9.85%股市漲~40%(年化~11.8%)、1993–2000 利率~6.5%漲~6倍
  (年化~32%) — **flagged transcript-only, no deck**. 新聞是事後諸葛. Cross-linked ↔ 現金是空氣 短債vs長債.

Reinforce-only (logged): 00443 (立即買不賣/借錢不還/匯率→從擇時操作,欠錢不還), 00442 (25萬撬動1200萬資產/
AI如識字→欠錢不還,質押; **no deck→不敢filed 槓桿倍數**), 00441 (James GPT App上線需GPT-4 Plus→dated tool,
skip), 00440 (離開市場是永久損失→崩盤是朋友), 00439 (高利率常態/債券高風險→折入 為什麼不買債券; 影片failed),
00437 (賣出是煩惱開始→從擇時操作), 00436 (承認無知是知的開始→統計概率), 00435 (賺錢也要花掉/花到剩就好→
別為錢賣命,退休需要多少錢), 00433 (金錢生精神能量/長線賺飽短線虧老→勞工還是資本家,從擇時操作), 00432 (借錢
不還不繳稅→欠錢不還), 00431/00430 (槓桿基金維持beta留現金定期再平衡→聰明再平衡,Beta), 00429 (找到投資屬性/
關鍵在現金流→現金是空氣,十五年現金流), 00428/00427 (資本家好工作/運用金融工具累積資產→勞工還是資本家,欠錢
不還), 00426 (市場永遠成長/金融工具沒對錯只有懂不懂→崩盤是朋友), 00425/00424/00423/00422 (財商/想像/馬太
效應/無為→快樂是人權,勞工還是資本家,從擇時操作). Knowledge base now 37 topic pages × 2 langs (glossary 7).
Job still running below 00422.
