---
title: 'QQQI (Nasdaq High-Income ETF) and the Truth About Return of Capital'
chineseTitle: 'QQQI（納指高股息 ETF）與資本返還的真相'
description: "QQQI is a high-income ETF generating monthly distributions (~1%/month) from the Nasdaq-100 plus covered calls. But its distributions aren't all dividends — part is return of capital, part long-term capital gains; the true dividend portion may be only ~5%. Tax impact is minimal for Taiwan investors; US investors must watch cost-basis erosion."
date: 2026-07-08
category: 'glossary'
subcategory: 'Tools'
tags: ['QQQI', 'high dividend', 'covered call', 'return of capital', 'cash flow', 'retirement', 'tax']
difficulty: 'intermediate'
status: 'published'
translationStatus: 'complete'
sources:
  - '長篇/00576【等待不是策略，買進並長期持有，才是真正的投資之道！】2026年8月1日（股息安全邊際推導 @30:00–33:30、過渡期出場與 joint account @27:30–30:00；含時間軸＋簡報頁）'
  - 'X及YouTube的貼文/0028貼文【QQQI 的真相：台灣投資人不必為資本返還焦慮】日期：2026年7月8日.docx'
relatedTopics: ['現金是空氣', '退休需要多少錢', '全球納斯達克100指數基金對照']
lastVerified: 2026-08-01
lastHumanReview: false
---

> **In 30 seconds**: **QQQI** is a high-income ETF that produces **monthly distributions** (~**1%/month**) from the Nasdaq-100 plus a covered-call strategy. CLEC recommends it only for **retirees** who need cash flow (young investors, who want growth, should avoid it). The key nuance: its distributions aren't all dividends — **part is return of capital, part is long-term capital gains, and the true dividend portion may be only ~5%.** For Taiwan investors, this tax classification is basically negligible.[^1]

## What QQQI is and when to use it

- The underlying is the [[為什麼是納斯達克100|Nasdaq-100]], with a covered-call strategy converting some upside into **steady monthly cash flow.**
- Pro: stable cash flow. Con: **lower long-term total return than pure QQQ** (it gives up some upside).
- CLEC's use: only introduce it in **retirement, above a 3% withdrawal rate**, when you need cash flow (see [[現金是空氣|asset allocation]], [[退休需要多少錢|how much to retire]]). While still accumulating, **avoid** high-dividend funds.

## How much does the dividend shrink in a downturn? "Market −30%, dividend −20%"

00576 gave the arithmetic behind CLEC's "discount it to 70–80%" rule. James backed out a relationship from QQQI's recent price and distribution ranges:[^2]

- Price range roughly **US$41–57**; decline (57−41)÷57 ≈ **28%** (call it 30%).
- Monthly dividend range roughly **US$0.531–0.657**; spread (0.657−0.531)÷0.657 ≈ **19%** (call it 20%).
- Corresponding yields: at the market low (0.531×12)÷41 ≈ **15.5%**; at the high (0.657×12)÷57 ≈ **13.8%** — **the yield is higher at the low**, because the denominator falls faster than the numerator.

**The relationship is "market −30% → dividend −20%," about a two-thirds ratio.** Extrapolated to the stress case: market **−50%** → dividend roughly **−30 to −33%**. So when planning, **discount the peak dividend to 70%**: 0.657 × 70% ≈ 0.46, a yield of (0.46×12)÷57 ≈ **9.7%** — **use a 10% yield as the conservative basis for QQQI.**[^2]

> ⚠️ **This is an extrapolation, not a measurement.** QQQI is young and **has not lived through a full 50% drawdown**; the two-thirds ratio is an assumption, and the price/dividend ranges are James's rounded recent figures. Its purpose is to give you a conservative planning basis, not a forecast.

> 🔗 That 10% basis is exactly where "hold **12×** annual spending in QQQI for retirement" (up from 10×) comes from — allocation tables in [[退休需要多少錢]].

## A transition product: you sell it off about a decade later

CLEC positions QQQI as a **time-limited tool**, not a permanent core holding — which also settles how to think about its tax risk:[^2]

- **The dilemma for non-US residents**: buying QQQI **through a US broker** gets the full dividend but carries **US estate-tax** exposure while held; buying a local substitute runs into **withholding tax**. Neither is clean.
- **The fix is to time-box the exposure**: hold it only while you have 15–17× and need the cash flow; once assets reach roughly **33×** (the Nasdaq-100 sleeve perhaps 4×-ing over ten years), **sell the QQQI at the US broker and move the money to your home-country broker**. The estate-tax exposure ends and the allocation returns to the long-term [[質押借款|pledge]]-withdrawal structure.
- **The risk in the transition is "nothing may happen to you"** — die while holding and the account is still in the US tax net. The mitigation is a **joint account**, so the other party can wire the money out. A personal choice; "just one more avenue."[^2]

## The truth about return of capital

QQQI's monthly "distribution" is roughly: part **return of capital**, part **long-term capital gains**, and only a small part (~5%) true **dividend**.[^1]

### Taiwan investors: basically nothing to worry about

- Whether return of capital or long-term capital gains, the real tax impact is minimal for most Taiwan investors — the true dividend portion is small and usually negligible.
- Taiwan brokers generally **don't** adjust your cost basis for QQQI's return of capital; they keep your **original purchase cost**.[^1]

### US investors: watch cost-basis erosion

- Return of capital gradually **lowers your cost basis.**
- If the basis hits zero, the IRS won't accept a negative basis — return of capital above your basis is treated as **long-term capital gains** and taxed.
- On a future sale, because the basis was reduced, your **capital gain is higher** than if computed from the original cost.[^1]

> ⚠️ Tax rules vary by country and personal status, and change over time. Summarized from a CLEC post for education only — not tax or investment advice. For regional QQQI/high-dividend equivalents (e.g. Hong Kong 3416, Singapore JEPQ.L), see [[全球納斯達克100指數基金對照|Nasdaq-100 funds around the world]].

[^1]: CLEC channel, post "The truth about QQQI: Taiwan investors needn't worry about return of capital," 2026-07-08. Source: `raw/docs/X及YouTube的貼文/0028貼文【QQQI 的真相：台灣投資人不必為資本返還焦慮】日期：2026年7月8日.md`.
[^2]: CLEC James, 長篇 00576 "Waiting Is Not a Strategy — Buy and Hold Long Term Is the Real Way to Invest," 2026-08-01, the transition-product exit and joint account @27:30–30:00, the dividend margin-of-safety derivation @30:00–33:30. Matching deck pages in `raw/docs/簡報資料/00576…` (slides 20–23, with the full arithmetic). Transcript: `raw/transcripts/長篇/00576…`; price and dividend ranges are spoken approximations and the two-thirds extrapolation is an assumption, not a measurement — not to be taken as fixed values.
