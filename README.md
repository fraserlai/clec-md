# clec.md

An **AI-native, bilingual (繁體中文 / English) knowledge base** distilled from the
**CLEC 投資理財頻道** — a Chinese-language long-term investing & personal-finance
channel. Built on Karpathy's [LLM-Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
pattern and shaped after [taiwan-md](https://github.com/frank890417/taiwan-md).

Videos are transcribed (whisper.cpp) and documents converted (markitdown) into an
immutable `raw/` layer; an LLM agent curates them into a topic-organized
`knowledge/` wiki, which an Astro site renders.

## Layout

```
raw/          Immutable sources — transcripts & converted docs (provenance frontmatter)
knowledge/    The wiki (markdown SSOT): knowledge/<category>/*.md (zh-TW) + knowledge/en/…
src/          Astro site (rendered from knowledge/ via scripts/sync.mjs)
scripts/      Ingestion + build tooling
CLAUDE.md     The LLM-Wiki schema — how the agent ingests / queries / lints
EDITORIAL.md  Writing conventions (voice, citations, anti-slop, bilingual policy)
index.md      Content catalog · log.md  Append-only history
```

## Develop

```bash
npm install
npm run dev        # sync + Astro dev at http://localhost:4321
npm run build      # production build to dist/
npm test           # frontmatter validation
```

## Ingest content

Source paths and binaries are configured in `scripts/config.mjs` (override with
env vars: `CLEC_SOURCE_DIR`, `WHISPER_DIR`, `WHISPER_MODEL`, `MARKITDOWN_BIN`).

```bash
# Transcribe videos → raw/transcripts/  (resumable; skips done files)
npm run transcribe -- --list                 # show backlog by folder
npm run transcribe -- --folder 長篇 --limit 10

# Convert docs (docx/pdf/pptx) → raw/docs/
npm run convert-docs -- --list
npm run convert-docs -- --folder X及YouTube的貼文

# Full run (multi-day background job — ~2× realtime on Apple Silicon):
nohup npm run transcribe > transcribe.log 2>&1 &
```

Then, following `CLAUDE.md`, an LLM agent turns `raw/` sources into `knowledge/`
pages, updates `index.md`, and appends to `log.md`.

## Requirements

Node ≥ 22, `ffmpeg`, a whisper.cpp build with a `ggml-large-v3` model, and the
`markitdown` CLI. Not affiliated with CLEC; content is for education only, **not
financial advice**.
