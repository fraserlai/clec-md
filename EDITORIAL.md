# EDITORIAL.md — how clec-md pages are written

Conventions for turning raw CLEC sources into knowledge pages. Adapted from
taiwan-md's editorial pipeline for an investing/personal-finance domain.

## Voice & stance

- **Faithful curator, not a new pundit.** The knowledge base represents James's /
  CLEC philosophy: long-term, low-cost, broadly-diversified index investing;
  discipline over prediction; risk and cash-flow control; healthy investing
  psychology. Preserve his positions; don't dilute or "both-sides" them into
  generic advice, and don't invent claims he didn't make.
- **Plain and concrete.** Prefer everyday language and worked examples (the
  channel's style) over jargon. Define terms the first time they appear.
- **Not financial advice.** Never phrase content as a personal recommendation to
  a reader. Describe principles and reasoning. The site-wide disclaimer stands.

## Anti-slop rules (塑膠偵測)

Reject hollow AI filler. A page must earn its length.
- No empty throat-clearing ("In today's fast-paced world…", "投資是一門藝術…").
- Every substantive claim ties to a source (a transcript, doc, or the original
  video) via a footnote. Aim for ≥1 citation per ~300 words.
- Prefer numbers, mechanisms, and specifics from the source over vague summary.
- If the source doesn't support a point, don't make the point.

## Page shape

1. **Frontmatter** — per the contract in `CLAUDE.md`. Always set `sources:` to the
   `raw/` files you synthesized from.
2. **30-second overview** — first block:
   `> **30 秒重點**：…` (zh-TW) / `> **In 30 seconds**: …` (en).
3. **Body** — `##`/`###` sections. Lead with the core idea, then the reasoning,
   then caveats/risks. Use worked examples and comparison tables where the source does.
4. **Citations** — footnotes `[^1]` at point of claim; definitions at the bottom
   pointing to the raw source file and, where known, the original video/episode.
5. **Cross-links** — `[[term]]` to concepts; ensure a `glossary/` page exists for
   common terms. Set `relatedTopics` to sibling page slugs.
6. **Risk note** — where a page describes a strategy (leverage, allocation), state
   the conditions and worst-case, mirroring James's own risk-control framing.

## Bilingual policy

- **zh-TW is the SSOT.** Write/curate it first, in Traditional Chinese (Taiwan
  phrasing). Fix any residual Simplified terms left by transcription.
- **English mirrors the zh-TW page**, same slug, `chineseTitle` set,
  `translationStatus` honest (`complete` / `partial` / `planned`). English is a
  faithful translation/summary, not a different article.

## Transcript hygiene

whisper transcripts arrive as long, largely unpunctuated runs. When synthesizing:
segment into sentences, add punctuation, fix homophone/ASR errors (esp. tickers
like VT/VTI/QQQ, numbers, and names), and quote sparingly. The transcript is a
source to distill — do not paste it verbatim into a knowledge page.

## Quality checklist (五指檢測) before marking a page done

1. **來源** — every claim cited to a raw source?
2. **重點** — is the 30-second overview actually the point?
3. **具體** — numbers/examples/mechanisms, not platitudes?
4. **一致** — no contradiction with existing pages? terms consistent w/ glossary?
5. **雙語** — zh-TW and en say the same thing; frontmatter valid?
