---
title: '關於 clec.md'
description: '一個由 AI 維護、整理自 CLEC 投資理財頻道的雙語知識庫。影片轉錄成文字，再整理成有交叉引用的主題頁。'
date: 2026-07-11
category: 'about'
tags: ['關於', 'LLM-Wiki', 'CLEC']
difficulty: 'beginner'
status: 'published'
lastVerified: 2026-07-11
lastHumanReview: false
---

> **30 秒重點**：clec.md 把 CLEC 投資理財頻道上千部影片與文章，轉成可搜尋、可交叉引用的主題知識庫。影片用 whisper 轉錄成繁體中文，文件用 markitdown 轉成 markdown，再由 AI 整理成一頁一頁的主題文章，並持續維護彼此的連結與一致性。

## 這是什麼

clec.md 是一個 **AI 原生、雙語（繁體中文 / English）** 的投資理財知識庫，內容整理自 **CLEC 投資理財頻道**。它遵循 [LLM-Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) 的模式：

- **原始素材（raw）**：頻道的影片轉錄稿與文章，永不竄改，是事實來源。
- **知識庫（knowledge）**：由 AI 撰寫、依主題組織的 markdown 頁面，帶有交叉引用與出處。
- **結構（schema）**：一份設定檔，規範 AI 如何整理、回答與維護這個知識庫。

## 內容怎麼產生

1. **轉錄**：影片經 `ffmpeg` 抽出音訊，再用 `whisper.cpp`（large-v3）辨識為中文，並以 OpenCC 轉為繁體。
2. **轉換**：文件（FB／YouTube 貼文、簡報）用 markitdown 轉成 markdown。
3. **整理**：AI 讀過素材後，摘要成主題頁、建立名詞解釋、串起相關主題，並更新目錄與紀錄。

## 立場與免責

本站忠實呈現 CLEC 的長期指數投資理念，但**僅供教育與參考，不是個人化投資建議**。投資有風險，所有決策請自行負責。
