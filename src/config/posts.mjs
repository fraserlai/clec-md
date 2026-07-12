/** Display metadata for James's post sources. */
export const SOURCE_META = {
  X: { badge: 'X', view: { 'zh-TW': '在 X 上看原文 ↗', en: 'View on X ↗' } },
  YouTube: {
    badge: 'YouTube',
    view: { 'zh-TW': '在 YouTube 看原文 ↗', en: 'View on YouTube ↗' },
  },
  FB: { badge: 'FB', view: { 'zh-TW': '在 Facebook 看原文 ↗', en: 'View on Facebook ↗' } },
};

export function sourceBadge(s) {
  return SOURCE_META[s]?.badge ?? s;
}
export function viewOriginalLabel(s, lang = 'zh-TW') {
  return SOURCE_META[s]?.view?.[lang] ?? SOURCE_META[s]?.view?.['zh-TW'] ?? '↗';
}
