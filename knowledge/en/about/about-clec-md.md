---
title: 'About clec.md'
chineseTitle: '關於 clec.md'
description: 'An AI-maintained bilingual knowledge base distilled from the CLEC investing channel. Videos are transcribed to text, then curated into cross-referenced topic pages.'
date: 2026-07-11
category: 'about'
tags: ['about', 'LLM-Wiki', 'CLEC']
difficulty: 'beginner'
status: 'published'
translationStatus: 'complete'
lastVerified: 2026-07-11
lastHumanReview: false
---

> **In 30 seconds**: clec.md turns thousands of videos and posts from the CLEC investing channel into a searchable, cross-referenced topic knowledge base. Videos are transcribed with whisper, documents are converted with markitdown, and an AI curates it all into topic pages while keeping the links and consistency maintained.

## What this is

clec.md is an **AI-native, bilingual (Traditional Chinese / English)** investing knowledge base distilled from the **CLEC investing channel**. It follows the [LLM-Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) pattern:

- **Raw sources** — the channel's video transcripts and posts, never altered; the source of truth.
- **The knowledge base** — AI-written, topic-organized markdown pages with cross-references and citations.
- **The schema** — a config file that governs how the AI curates, answers, and maintains the wiki.

## How the content is made

1. **Transcribe** — `ffmpeg` extracts audio, `whisper.cpp` (large-v3) recognizes the Chinese speech, and OpenCC converts it to Traditional Chinese.
2. **Convert** — documents (FB/YouTube posts, slides) are turned into markdown with markitdown.
3. **Curate** — after reading the sources, the AI distills them into topic pages, builds glossary entries, links related topics, and updates the index and log.

## Stance & disclaimer

This site faithfully represents CLEC's long-term index-investing philosophy, but it is **for education only — not personalized financial advice**. Investing carries risk; all decisions are your own.
