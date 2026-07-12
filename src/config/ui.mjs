/** Small UI string table for the two enabled languages. */
export const UI = {
  'zh-TW': {
    siteName: 'clec.md',
    tagline: '一個關於長期投資與理財的 AI 原生知識庫',
    subtitle: '整理自 CLEC 投資理財頻道',
    categoriesHeading: '主題分類',
    latestHeading: '最新整理',
    readMore: '閱讀',
    backHome: '回首頁',
    inCategory: '分類',
    sources: '資料來源',
    relatedTopics: '相關主題',
    disclaimer:
      '本站內容整理自 CLEC 投資理財頻道，僅供教育與參考，非個人化投資建議。投資有風險，決策請自行負責。',
    notFound: '找不到頁面',
    notFoundBody: '這個頁面不存在，或還沒有被整理出來。',
    langLabel: 'English',
    empty: '這個分類還沒有內容，內容正在陸續整理中。',
  },
  en: {
    siteName: 'clec.md',
    tagline: 'An AI-native knowledge base on long-term investing & personal finance',
    subtitle: 'Distilled from the CLEC investing channel',
    categoriesHeading: 'Topics',
    latestHeading: 'Latest',
    readMore: 'Read',
    backHome: 'Home',
    inCategory: 'Category',
    sources: 'Sources',
    relatedTopics: 'Related topics',
    disclaimer:
      'Content is distilled from the CLEC investing channel for education only — not personalized financial advice. Investing carries risk; decisions are your own.',
    notFound: 'Page not found',
    notFoundBody: 'This page does not exist, or has not been written yet.',
    langLabel: '中文',
    empty: 'Nothing here yet — content is being curated.',
  },
};

export function t(lang, key) {
  return (UI[lang] ?? UI['zh-TW'])[key] ?? key;
}
