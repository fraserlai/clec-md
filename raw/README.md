# raw/ — source layer (local-only)

This directory holds the **immutable source layer** of the LLM-Wiki:

- `raw/transcripts/<sourceType>/*.md` — video transcripts (`npm run transcribe`)
- `raw/docs/<sourceType>/*.md` — converted docx/pdf/pptx (`npm run convert-docs`)

**These files are deliberately git-ignored** (`raw/*` in `.gitignore`, except this
README). They include full verbatim CLEC material — video transcripts and complete
books (理財聖經, CLEC 寶典). We keep them **local-only** and commit only the *derived*,
cited `knowledge/` pages that synthesize them.

To (re)generate this layer, see `CLAUDE.md` and the ingestion commands in `README.md`.
Sources originate from the CLEC Google Drive and supplementary archives.
