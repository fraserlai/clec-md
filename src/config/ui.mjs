/** Small UI string table for the two enabled languages. */
export const UI = {
  'zh-TW': {
    siteName: 'clec.md',
    tagline: '一個關於投資、理財與人生的 AI 原生知識庫',
    subtitle: '整理自 CLEC——不只投資，更是生活方式、心態與關係',
    categoriesHeading: '主題分類',
    latestHeading: '最新整理',
    readMore: '閱讀',
    backHome: '回首頁',
    inCategory: '分類',
    sources: '資料來源',
    relatedTopics: '相關主題',
    disclaimer:
      '本站內容整理自 CLEC，僅供教育與參考，非個人化投資、醫療、心理或財務建議。CLEC 關心身心健康，但我們不是醫療或心理專業人員；健康、情緒或心理等任何需求，請諮詢合格的專業人士。投資有風險，決策請自行負責。',
    notFound: '找不到頁面',
    notFoundBody: '這個頁面不存在，或還沒有被整理出來。',
    langLabel: 'English',
    empty: '這個分類還沒有內容，內容正在陸續整理中。',
  },
  en: {
    siteName: 'clec.md',
    tagline: 'An AI-native knowledge base on investing, money & life',
    subtitle: 'Distilled from CLEC — not just investing, but lifestyle, mindset & relationships',
    categoriesHeading: 'Topics',
    latestHeading: 'Latest',
    readMore: 'Read',
    backHome: 'Home',
    inCategory: 'Category',
    sources: 'Sources',
    relatedTopics: 'Related topics',
    disclaimer:
      'Content is distilled from CLEC for education only — not personalized investment, medical, mental-health, or financial advice. CLEC cares about wellbeing, but we are not medical or mental-health professionals; for any health, emotional, or psychological need, consult a qualified professional. Investing carries risk; decisions are your own.',
    notFound: 'Page not found',
    notFoundBody: 'This page does not exist, or has not been written yet.',
    langLabel: '中文',
    empty: 'Nothing here yet — content is being curated.',
  },
};

export function t(lang, key) {
  return (UI[lang] ?? UI['zh-TW'])[key] ?? key;
}
