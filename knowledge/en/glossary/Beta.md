---
title: 'Beta (with QQQ = 1.0 as the Benchmark)'
chineseTitle: 'Beta（以 QQQ = 1.0 為基準）'
description: 'CLEC uses QQQ as the Beta 1.0 benchmark (not SPY). QLD (2×) = 2.0, TQQQ (3×) = 3.0, cash = 0.0. Multiply each asset''s beta by its weight and sum to get your whole portfolio''s beta.'
date: 2026-05-08
category: 'glossary'
subcategory: 'Risk measures'
tags: ['Beta', 'leverage', 'QQQ', 'QLD', 'TQQQ', 'asset allocation', 'risk']
difficulty: 'intermediate'
status: 'published'
translationStatus: 'complete'
sources:
  - '教學資料/【Beta 的計算】.pdf'
relatedTopics: ['聰明再平衡法', '現金是空氣', '為什麼是納斯達克100']
lastVerified: 2026-05-08
lastHumanReview: false
---

> **In 30 seconds**: Beta measures how much an asset (or a whole portfolio) moves relative to a benchmark. CLEC's twist: it uses [[為什麼是納斯達克100|QQQ]] as the Beta 1.0 benchmark, not the conventional SPY. Multiply each asset's beta by its weight, sum them, and you get your portfolio's beta. **"A vague correct beats a precise wrong."**[^1]

## CLEC's beta table

| Asset | Beta |
|---|---|
| QQQ (00662) | 1.0 (benchmark) |
| QLD (00670L, 2× leverage) | 2.0 |
| TQQQ (3× leverage) | 3.0 |
| Cash / money market / BOXX / 00864B | 0.0 |

James is blunt: those who insist SPY should be Beta 1.0 are "pedants stuck in the past" — for someone investing long-term in the Nasdaq, QQQ is the benchmark that matches their portfolio.[^1]

## Computing portfolio beta

**Portfolio beta = Σ (asset beta × asset weight)**

Example: QQQ 60%, QLD 10%, TQQQ 10%, cash 20%
> beta = 60%×1.0 + 10%×2.0 + 10%×3.0 + 20%×0.0 = **1.1**

Two common allocations:[^1]

- 70% QQQ + 20% QLD + 10% cash → 0.7 + 0.4 + 0 = **1.1**
- 80% QQQ + 10% QLD + 10% cash → 0.8 + 0.2 + 0 = **1.0**

## Why it's useful

Beta shows at a glance **how much volatility you carry relative to QQQ**. Beta = 1.0 means roughly the volatility of pure QQQ; > 1.0 means you've amplified volatility and drawdown (usually via [[聰明再平衡法|leveraged funds]]); < 1.0 means you've dampened it (usually via a [[現金是空氣|cash position]]). It's a ruler for adjusting your "[[現金是空氣|chili]]."

> ⚠️ This is CLEC's simplified beta (treating the leverage multiple directly as beta), different from the academic beta computed via historical regression. For education and allocation intuition only — not investment advice.

[^1]: CLEC James, "Calculating Beta." Converted source: `raw/docs/教學資料/【Beta 的計算】 .pdf`.
