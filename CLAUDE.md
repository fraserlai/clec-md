# clec-md — LLM-Wiki schema

This file is the **schema** for clec-md: the operating manual an LLM agent
follows to build and maintain this knowledge base. It is based on Karpathy's
[LLM-Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
and the [taiwan-md](https://github.com/frank890417/taiwan-md) product shape.

> **You (the LLM) own the `knowledge/` and `wiki index` layers. The human curates
> sources and asks questions. You do the summarizing, cross-referencing, filing,
> and bookkeeping.**

## What this is

An AI-native, bilingual (**zh-TW** primary / **en** secondary) knowledge base
about **CLEC 投資理財頻道** — James's Chinese-language investing & personal-finance
channel. The philosophy is long-term, low-cost index investing; discipline over
prediction; risk and cash-flow management; and a healthy investing psychology.

The finished product is an Astro website rendered from a markdown SSOT.

## The three layers

1. **`raw/`** — immutable sources. Never edited by hand for meaning.
   - `raw/transcripts/<sourceType>/*.md` — video transcripts (via `npm run transcribe`).
   - `raw/docs/<sourceType>/*.md` — converted docx/pdf/pptx (via `npm run convert-docs`).
   - Each raw file has provenance frontmatter (`sourceFile`, `sourceType`, `kind`, …).
   - Source types mirror the CLEC Drive: `長篇` (long lectures), `短篇` (short clips),
     `CLEC 專題`/`專題` (topics), `緣起今日`, `CLEC 2018 年實體課程`, `投資有聲書推薦`,
     `X及YouTube的貼文`, `FB Wealthyin50的貼文`, `簡報資料` (slides), `閒聊`, `補充教材`.

2. **`knowledge/`** — the wiki you write. Topic-organized markdown.
   - zh-TW (SSOT): `knowledge/<category>/<slug>.md`
   - English: `knowledge/en/<category>/<slug>.md` (mirror the zh-TW slug)
   - Categories are defined in `src/config/categories.mjs` (the `id` is the folder).
   - `knowledge/resources/` — link collections, reading lists.

3. **The schema** — this file + `EDITORIAL.md` (writing conventions).

Plus two navigation files at the repo root:
- **`index.md`** — content catalog (every knowledge page, one line each). Update on every ingest.
- **`log.md`** — append-only history of ingests / queries / lint passes.

The Astro site (`src/`) is a *projection* of `knowledge/`. `npm run sync` copies
`knowledge/<lang>/…` → `src/content/<lang>/…`. Never edit `src/content/` directly.

## Category taxonomy

`investing-mindset` · `life-philosophy` · `relationships` · `asset-allocation` ·
`index-etf` · `retirement-planning` · `risk-cashflow` · `behavioral-finance` ·
`macro-economy` · `qa` · `glossary` · `about`

(`qa` = canonical recurring Clubhouse questions — see the qa contract under Ingest.)

(Canonical list + bilingual names in `src/config/categories.mjs`. Refine as content
grows; changing an `id` changes URLs.)

## Frontmatter contract (knowledge pages)

```yaml
---
title: '章節標題'
description: '一句話摘要（用於卡片與 SEO）'
date: 2025-04-07              # source/publish date
category: 'investing-mindset' # must be a known category id
subcategory: ''               # optional free-form
tags: ['資產配置', '現金流']
difficulty: 'beginner'        # beginner | intermediate | advanced
featured: false
status: 'published'           # draft | published | archived
sources:                      # provenance → raw/ files this page synthesizes
  - '短篇/00421短篇【如何在市場波動中保持信心？…】…'
relatedTopics: []             # slugs of related knowledge pages
lastVerified: 2025-04-07
lastHumanReview: false
---
```

English pages additionally carry `chineseTitle` and `translationStatus`
(`complete` | `partial` | `planned`).

## Page conventions

- **Language:** zh-TW pages in Traditional Chinese (Taiwan phrasing). Transcripts
  are already converted with OpenCC `s2twp`, but fix any residual Simplified terms.
- **30-second overview:** open each substantive page with a `> **30 秒重點**：…` blockquote.
- **Citations:** attribute claims to their source with footnotes `[^1]` linking back to
  the `raw/` file or original video. Minimum ~1 citation per 300 words. See `EDITORIAL.md`.
- **Wikilinks:** use `[[名詞]]` / `[[名詞|顯示文字]]` to link concepts; a glossary page
  should exist for common terms. (`plugins/remark-wikilinks.mjs` renders these.)
- **Not financial advice:** every page inherits the disclaimer; do not phrase content
  as personalized advice. Preserve James's principles faithfully; don't invent specifics.
- **Slugs:** short, URL-safe. Chinese slugs are fine; keep them stable.

## Operations

### Ingest
When new `raw/` sources exist (or the human points at some):
1. Read the raw source(s). Discuss key takeaways with the human.
2. Decide: does this extend an existing knowledge page, or warrant a new one?
3. Write/update the zh-TW page under the right `knowledge/<category>/`. Add citations
   and `sources:` provenance. Add/refresh the English mirror under `knowledge/en/…`.
4. Update cross-references (`[[wikilinks]]`, `relatedTopics`) across affected pages.
5. Update `index.md`. Append an entry to `log.md`.
A single meaty source can touch 5–15 pages. Prefer ingesting related sources together
(e.g. an episode + its `簡報資料` slides + the matching FB/X post by episode number).

#### Clubhouse sessions (長篇) — the bundle + four streams

Most `長篇` files are the Saturday Clubhouse Q&A. **The ingest unit is a bundle, not a
file:** the `長篇` transcript **＋** its `簡報資料` deck (same episode number) **＋** the
`貼文` the deck cites (the deck names them, e.g. 「0009 貼文」). Pull all three before
writing — each holds material the others miss:
- The **deck** carries canonical, precisely-worded doctrine, sometimes text James *skips*
  aloud (「這頁我就不念了，在貼文 XXXX 上面」). It's also the citation hub (which 貼文 / which
  external links) and an alignment skeleton — James walks it in page order (「講義第 3 頁」),
  so the lecture span of the transcript can be structured against it.
- The **transcript** carries the AI/market ad-libs, all Q&A, and all 學員分享 — none of which
  are in the deck.
- On wording conflicts, **deck/貼文 text wins; transcript supplies elaboration.** whisper
  garbles tickers/numbers and has repetition loops that swallow whole segments — cross-check
  against the deck, and don't trust a number that appears only in a degraded transcript run.

A session splits into **four streams**, each filed differently:

1. **開場講授 → concept pages** (the topical categories, as usual). Deck+貼文 authoritative.
2. **學員提問 → `qa/` pages** — see the qa contract below. Transcript-sourced.
3. **學員分享** splits by nature: **regional/practical intel** (China 溢價, HK pledge banks,
   ISA/僑匯 rules…) → region/practical pages (extend `全球納斯達克100指數基金對照` or a
   per-region page); this content *decays*, so keep `lastVerified` tight. **Teaching-quality
   stories** (identity investing, the 爺爺 story) → fold into the relevant concept page as an
   attributed 學員分享 illustration (the way cfnavi promotes them to key points).
4. **外部資源連結** (from the deck) → `knowledge/resources/` link collections.

Skip the deck's **weekly boilerplate** (pCloud links, 不要問 rules, disclaimer, scam
warnings, 訂閱 slides, 市場永遠上漲) — it repeats every week; ingest that doctrine once as
evergreen pages, not per session.

#### The `qa/` page contract (canonical recurring questions)

James answers the same few dozen questions across hundreds of sessions. Do **not** make a
page per video's Q&A (that never compounds). Make **one page per canonical question**, and
**append a dated entry** each time it recurs:
- Title = the canonical question; `> **30 秒重點**` = the bottom-line answer.
- A「情境變體」list (the concrete forms people ask it in).
- Dated answer entries, each citing its source session (`長篇/00570 …`), wikilinked to the
  concept page that carries the underlying principle. The page then also shows how the answer
  *evolved* (cf. `從擇時操作到打死不賣`).
- `category: 'qa'`; put the home topic in `subcategory:` (`retirement-planning`, `risk-cashflow`…).
- **A qa page links to doctrine; it does not restate it.** Keep the evergreen mechanism on the
  concept page and let the qa page carry the situational answer + variants.
- **Before creating one, check `index.md`'s qa section** for an existing canonical question —
  usually you append an entry rather than make a new page.

### Query
1. Read `index.md` to find relevant pages; drill into them.
2. Synthesize an answer with citations to knowledge pages / raw sources.
3. **File good answers back into the wiki** — a comparison, a synthesis, a glossary
   entry — so exploration compounds. Then update `index.md` and `log.md`.

### Lint
Periodically health-check: contradictions between pages, stale claims, orphan pages
(no inbound links), important terms lacking a glossary entry, thin/low-citation pages,
zh-TW/en drift, broken wikilinks. Report findings and suggested next sources/questions.

## Ingestion pipeline (raw sourcing)

- `npm run transcribe -- --list` — pending video transcriptions by folder.
- `npm run transcribe -- --folder 長篇 --limit 5` — transcribe a batch. New transcripts
  carry per-segment time anchors (`[mm:ss] …` body lines + `segmentTimestamps: true`), so
  qa pages can cite "00570 @ 1:12:30" and the lecture→Q&A boundary is machine-findable.
  (Files transcribed before 2026-07-13 have no timestamps; re-transcribe to add them.)
- `npm run convert-docs -- --list` / `--folder X及YouTube的貼文` — convert documents.
- `npm run convert-docs -- --folder 簡報資料 --match 00570` — convert one session's deck.
  Deck frontmatter auto-links its `transcriptPair` and `citedPosts` — that's the bundle.
- Paths/binaries are configured in `scripts/config.mjs` (override via env vars).
- ~2,166 videos exist; full transcription is a multi-day resumable background job.
  Both scripts skip already-done files, so just re-run to continue.

## Build / run

- `npm run dev` — sync + Astro dev server (http://localhost:4321).
- `npm run build` / `npm run preview` — production build.
- `npm test` — frontmatter validation.

## Backlog (not yet built)

Search index (minisearch), `llms.txt`, RSS, subcategory taxonomy pages, knowledge
graph viz, OG-image generation, deploy config. Add when the content justifies it.
