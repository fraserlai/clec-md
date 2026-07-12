---
title: 'Beta（以 QQQ = 1.0 為基準）'
description: 'CLEC 用 QQQ 當作 Beta 1.0 的基準（不是 SPY）。QLD（2倍）= 2.0、TQQQ（3倍）= 3.0、現金 = 0.0。把每個資產的 beta 乘上配置比例相加，就是你整個組合的 beta。'
date: 2026-05-08
category: 'glossary'
subcategory: '風險度量'
tags: ['Beta', '槓桿', 'QQQ', 'QLD', 'TQQQ', '資產配置', '風險']
difficulty: 'intermediate'
status: 'published'
alternativeNames: ['Beta', 'β', '組合 Beta']
sources:
  - '教學資料/【Beta 的計算】.pdf'
relatedTopics: ['聰明再平衡法', '現金是空氣', '為什麼是納斯達克100']
lastVerified: 2026-05-08
lastHumanReview: false
---

> **30 秒重點**：Beta 衡量一個資產（或整個組合）相對基準的波動大小。CLEC 的特別之處是——**用 [[為什麼是納斯達克100|QQQ]] 當作 Beta 1.0 的基準**，而不是市場慣用的 SPY。把每個資產的 beta 乘上它的配置比例、相加，就是你整個組合的 beta。**「投資模糊的正確，勝過精確的錯誤。」**[^1]

## CLEC 的 beta 對照

| 資產 | Beta |
|---|---|
| QQQ（00662） | 1.0（基準） |
| QLD（00670L，2倍槓桿） | 2.0 |
| TQQQ（3倍槓桿） | 3.0 |
| 現金／貨幣市場基金／BOXX／00864B | 0.0 |

James 直言：外面認為要用 SPY 當 beta 1.0 的，是「食古不化的書匠」——對長期投資納指的人來說，用 QQQ 當基準才貼近自己的組合。[^1]

## 怎麼算組合 beta

**組合 beta = Σ（各資產 beta × 該資產配置比例）**

例：QQQ 60%、QLD 10%、TQQQ 10%、現金 20%
> beta = 60%×1.0 + 10%×2.0 + 10%×3.0 + 20%×0.0 = **1.1**

再看兩個常見配置：[^1]

- 70% QQQ + 20% QLD + 10% 現金 → beta = 0.7 + 0.4 + 0 = **1.1**
- 80% QQQ + 10% QLD + 10% 現金 → beta = 0.8 + 0.2 + 0 = **1.0**

## 為什麼有用

Beta 讓你**一眼看出自己承擔了多少相對 QQQ 的波動**。beta = 1.0 代表整體波動約等於純 QQQ；> 1.0 表示你（多半透過[[聰明再平衡法|槓桿基金]]）加大了波動與潛在回撤；< 1.0（多半靠[[現金是空氣|現金部位]]）則是降低波動。它是你在調「[[現金是空氣|辣椒]]」時的一把量尺。

> ⚠️ 這是 CLEC 自訂的簡化 beta（把槓桿倍數直接當 beta），不同於學術上以歷史迴歸計算的 beta。僅供教育與配置直覺參考，非投資建議。

[^1]: CLEC James，〈Beta 的計算〉。轉換稿見 `raw/docs/教學資料/【Beta 的計算】 .pdf`。
