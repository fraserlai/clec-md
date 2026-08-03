---
name: add-post
description: Add a new CLEC 貼文 (X/YouTube or FB post) that the human pasted as text, and optionally ingest it into the wiki. Use when the user pastes a post like "0044貼文【…】日期：2026年7月31日" plus a post link and says add it to posts/, publish it, or ingest it.
---

# Add a new 貼文

The human pastes a post (usually a 學員來信 + James's reply) plus its URL. You file it
through the **pipeline**, never by hand-writing into `posts/`.

```
paste → raw/docs/<folder>/<原標題>.md → npm import-posts → posts/<folder>/<slug>.md
```

`posts/` is **generated**. Editing it directly gets overwritten and loses provenance.

## Step 1 — parse the paste

| Field | Where it comes from |
|---|---|
| ep number | leading digits of `NNNN貼文` |
| title | the full first line, e.g. `0044貼文【…】日期：2026年7月31日` |
| date | the `YYYY年M月D日` in the title (**not** the letter's 「於 … 寫道」 date) |
| URL | the `post link:` / `來源：` line the human included |
| folder | `X及YouTube的貼文` for x.com / youtube.com; `FB Wealthyin50的貼文` for facebook.com |

Duplicate ep numbers are common — James reuses a number for unrelated posts (two `0029`,
two `0031`, two `0035`, three `0038`). **Never renumber** — the ep is James's, not ours —
but the generated `ep:` field **disambiguates collisions as `0038-1` / `0038-2` / `0038-3`**,
oldest-first. `import-posts.mjs` (`assignEps`) does this automatically across the whole
folder; you never hand-write a suffix. Two consequences:

- **Re-run with `--force` after adding a post that collides**, or its siblings keep their
  stale un-suffixed `ep`. A plain run skips files whose target already exists.
- Suffixes are **positional**: a newly-added post dated *earlier* than existing siblings
  shifts theirs. Harmless — `ep` is metadata, not part of the slug or URL.

Two posts collide only if their **titles differ**; identical titles would collide on the
slug too, and the second would silently overwrite the first. Check before writing.

Gaps (0035 → 0044) are normal too — don't fill them.

## Step 2 — write the raw source doc

Write `raw/docs/<folder>/<原標題>.md` — filename is the title verbatim, 【】 and all.

```yaml
---
title: "0044貼文【你不是不配富有，而是被教育成不敢富有！】日期：2026年7月31日"
sourceFile: "X及YouTube的貼文/0044貼文【…】日期：2026年7月31日.docx"
sourceType: "X及YouTube的貼文"
sourceFormat: "text"
convertedAt: 2026-07-31
kind: document
note: "原文由人工貼入（尚無 .docx 原稿）；若日後補上 docx，需以 convert-docs --force 覆蓋。"
---

來源：<https://x.com/CLEC168/status/…>

<the post, verbatim>
```

- **The `來源：<URL>` line is load-bearing** — `import-posts.mjs` reads `sourceUrl` from it and
  strips it from the body. Keep the angle brackets.
- `sourceFormat: "text"` + the `note` mark this as hand-pasted rather than markitdown output.
  Real conversions use `sourceFormat: "docx"` and no note. The note matters because
  `convert-docs` **skips** any doc whose target `.md` exists — a later real `.docx` needs `--force`.
- **Body is verbatim.** Do not fix James's typography, tighten his sentences, or drop the tail
  boilerplate (`從我的iPad傳送` / `喜歡我們貼文 請按讚…` / `撰稿：James`) — peers keep it.
  Keep the human's paragraph breaks; they read better than the collapsed markitdown output.

## Step 3 — import

```bash
node scripts/import-posts.mjs --folder "X及YouTube的貼文"
```

Then read the generated `posts/<folder>/<slug>.md` and check `date`, `ep`, and `sourceUrl`
landed. A leading empty `>` line is a known artifact of URL-stripping and appears on every
post — leave it, consistency wins.

If the body was wrong, fix `raw/docs/…` and re-run with `--force` (it skips existing targets).

`raw/` and `src/content/` are gitignored; only `posts/` shows up in `git status`.

## Step 4 — ingest (only if the user asked)

"Add the post" stops at step 3. If they also said **ingest**, follow `CLAUDE.md` → Operations →
Ingest, plus:

1. **Cross-check the corpus before making a qa page.** A 學員來信 + reply is Q&A, so it usually
   belongs in `qa/` — but the contract is *one page per canonical question*, not per post.
   `grep -rho ".\{60\}<phrase>.\{60\}" raw/transcripts raw/docs` for the question's several
   phrasings, and check `index.md`'s qa section. If it's been asked before, **append a dated
   entry** to the existing page instead of creating one.
2. **Also extend the concept page(s)** the post reinforces — a post rarely earns a page alone.
   A qa page links to doctrine; it does not restate it.
3. **Only file what James actually said.** If the letter asked two things and he answered one,
   don't invent the rest: add a clearly-labelled 編按 / "Editor's note" section that routes the
   unanswered half to existing pages via wikilinks, and say it's editorial.
4. **Anonymize.** 學員 given-names never reach `knowledge/`; use role descriptors
   (`一位學員` / `a member`). `raw/` and `posts/` stay as-is.
5. **English mirror** every page you touch (`knowledge/en/…`, same slug), add
   `chineseTitle` + `translationStatus`.
6. Cite the post as `sources: ['X及YouTube的貼文/0044貼文【…】日期：2026年7月31日']` and footnote it
   to the generated `posts/…` path.
7. Update `index.md` (mark `· zh-TW · en`) and append to `log.md`.

## Step 5 — verify

```bash
npm test && npm run sync
```

Report the post path, the ingest decisions (new pages vs extended), and anything you
deliberately left out.
