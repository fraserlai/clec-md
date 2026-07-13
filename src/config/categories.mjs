/**
 * CLEC knowledge taxonomy.
 *
 * The `id` is the canonical, URL-safe category slug and the directory name
 * under knowledge/<lang>/<id>/. Display names are bilingual. This taxonomy is
 * topic-oriented (how a reader thinks) — distinct from raw/ which stays
 * organized by source type (短篇 / 長篇 / 貼文 …).
 *
 * Refine this list as real content is ingested; changing an `id` changes URLs.
 */

export const CATEGORIES = [
  {
    id: 'investing-mindset',
    name: { 'zh-TW': '投資理財觀念', en: 'Investing Mindset' },
    description: {
      'zh-TW': '長期投資的核心心法：紀律、耐心、不預測市場。',
      en: 'Core principles of long-term investing: discipline, patience, not timing the market.',
    },
    icon: '🧭',
  },
  {
    id: 'life-philosophy',
    name: { 'zh-TW': '人生哲學與生活', en: 'Life & Philosophy' },
    description: {
      'zh-TW': '富有是天賦、快樂是人權、簡約生活、物質與精神能量——CLEC 不只談投資，更談怎麼過一個值得的人生。',
      en: 'Being rich is a birthright, happiness is a human right, simple living, material vs. spiritual energy — CLEC is about how to live a life worth living, not just investing.',
    },
    icon: '🌱',
  },
  {
    id: 'relationships',
    name: { 'zh-TW': '關係與家庭', en: 'Relationships & Family' },
    description: {
      'zh-TW': '父母、子女、配偶與陪伴：財富自由後，真正決定你快不快樂的是關係。',
      en: 'Parents, children, spouse, and presence: once you have financial freedom, relationships decide your happiness.',
    },
    icon: '👨‍👩‍👧',
  },
  {
    id: 'asset-allocation',
    name: { 'zh-TW': '資產配置', en: 'Asset Allocation' },
    description: {
      'zh-TW': '股債配置、再平衡，以及像 442 這類配置策略的演化。',
      en: 'Stock/bond mixes, rebalancing, and the evolution of allocations like 442.',
    },
    icon: '⚖️',
  },
  {
    id: 'index-etf',
    name: { 'zh-TW': '指數與 ETF 投資', en: 'Index & ETF Investing' },
    description: {
      'zh-TW': '指數化投資、VT/VTI/納指等寬基工具與定期定額。',
      en: 'Index investing, broad-market tools (VT/VTI/Nasdaq), and dollar-cost averaging.',
    },
    icon: '📈',
  },
  {
    id: 'retirement-planning',
    name: { 'zh-TW': '退休與財務規劃', en: 'Retirement & Planning' },
    description: {
      'zh-TW': '退休金試算、提領率、資產活化與人生財務規劃。',
      en: 'Retirement math, withdrawal rates, unlocking assets, and life financial planning.',
    },
    icon: '🌅',
  },
  {
    id: 'risk-cashflow',
    name: { 'zh-TW': '風險與現金流', en: 'Risk & Cash Flow' },
    description: {
      'zh-TW': '現金部位、緊急備用金、借貸投資與極端情境的風險控管。',
      en: 'Cash positions, emergency funds, leveraged investing, and worst-case risk control.',
    },
    icon: '🛡️',
  },
  {
    id: 'behavioral-finance',
    name: { 'zh-TW': '投資心理學', en: 'Behavioral Finance' },
    description: {
      'zh-TW': '市場恐懼、貪婪、過度操作與如何管理自己的情緒。',
      en: 'Fear, greed, overtrading, and managing your own psychology.',
    },
    icon: '🧠',
  },
  {
    id: 'qa',
    name: { 'zh-TW': '學員問答', en: 'Q&A' },
    description: {
      'zh-TW': 'Clubhouse 直播裡一問再問的經典問題——每頁一題，累積 James 歷次的回答與情境變體。',
      en: 'The questions asked over and over in the Clubhouse sessions — one page per recurring question, accumulating James\'s answers and situational variants across dates.',
    },
    icon: '❓',
  },
  {
    id: 'macro-economy',
    name: { 'zh-TW': '總體經濟', en: 'Macroeconomics' },
    description: {
      'zh-TW': '利率、匯率、通膨與總體事件對長期投資的意義。',
      en: 'Rates, currencies, inflation, and what macro events mean for long-term investors.',
    },
    icon: '🌏',
  },
  {
    id: 'glossary',
    name: { 'zh-TW': '名詞解釋', en: 'Glossary' },
    description: {
      'zh-TW': '投資理財名詞的中英對照與白話解釋。',
      en: 'Plain-language, bilingual definitions of investing terms.',
    },
    icon: '📖',
  },
  {
    id: 'about',
    name: { 'zh-TW': '關於', en: 'About' },
    description: {
      'zh-TW': '關於 CLEC、這個知識庫，以及內容如何產生。',
      en: 'About CLEC, this knowledge base, and how the content is made.',
    },
    icon: '💡',
  },
];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id);
}

export function categoryName(id, lang = 'zh-TW') {
  const c = getCategory(id);
  if (!c) return id;
  return c.name[lang] ?? c.name['zh-TW'] ?? id;
}
