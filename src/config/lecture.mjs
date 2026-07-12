/**
 * The flagship course: 《價值十億元的投資講座》.
 *
 * This lecture is the core of CLEC — its foundational "101" class. Its three
 * chapters live as regular knowledge pages (so they're also reachable by topic),
 * but this config ties them together as one structured course, powers the home
 * hero, the /lecture hub, and the per-chapter navigation banner.
 */
export const LECTURE = {
  slugId: 'the-ten-billion-lecture',
  title: {
    'zh-TW': '價值十億元的投資講座',
    en: 'The Ten-Billion-Dollar Investment Lecture',
  },
  kicker: {
    'zh-TW': 'CLEC 投資第一堂課',
    en: "CLEC's first class",
  },
  intro: {
    'zh-TW':
      '這門課是 CLEC 的核心——如果你只讀一樣東西，就讀它。三章講完整套投資哲學：為什麼要做資本家、該買什麼、錢怎麼擺。',
    en: 'This is the core of CLEC — if you read only one thing, read this. Three chapters lay out the whole philosophy: why become a capitalist, what to buy, and how to hold it.',
  },
  creed: {
    'zh-TW':
      '富有是天賦・快樂是人權・跳出老鼠籠・長期投資納斯達克100・有錢就買打死不賣・現金是空氣資產配置是活著・投資活著比回報率更重要。',
    en: 'Being rich is a birthright · Happiness is a human right · Escape the rat race · Hold the Nasdaq-100 for the long run · Buy when you have money, never sell · Cash is air, allocation is survival · Staying invested matters more than the rate of return.',
  },
  chapters: [
    {
      n: 1,
      category: 'investing-mindset',
      slug: '勞工還是資本家',
      title: { 'zh-TW': '富有是天賦・跳出老鼠籠', en: 'Being Rich Is a Birthright · Escape the Rat Race' },
      blurb: {
        'zh-TW': '你是勞工還是資本家？為什麼要投資、為什麼做資本家的底層邏輯。',
        en: 'Laborer or capitalist? The bedrock logic of why you invest and why you become a capitalist.',
      },
      tweet: 'https://twitter.com/clec168/status/2071329516484796535',
    },
    {
      n: 2,
      category: 'index-etf',
      slug: '為什麼是納斯達克100',
      title: { 'zh-TW': '長期投資正確的標的', en: 'The Right Long-Term Target' },
      blurb: {
        'zh-TW': '投資什麼、哪個市場：核心是納斯達克100，不是 SPY 或 VT。',
        en: 'What to buy and which market: the core is the Nasdaq-100, not SPY or VT.',
      },
      tweet: 'https://twitter.com/clec168/status/2071585253316313318',
    },
    {
      n: 3,
      category: 'asset-allocation',
      slug: '現金是空氣',
      title: { 'zh-TW': '資產配置：現金是空氣', en: 'Allocation: Cash Is Air' },
      blurb: {
        'zh-TW': '錢具體怎麼擺、退休提領率分級、崩盤那年怎麼辦。',
        en: 'How to actually hold your money, retirement withdrawal tiers, and what to do when it crashes.',
      },
      tweet: 'https://twitter.com/clec168/status/2071585566735700473',
    },
  ],
};

/** If a page (category+slug) is a lecture chapter, return {chapter, index}; else null. */
export function lectureChapterFor(category, slug) {
  const i = LECTURE.chapters.findIndex(
    (c) => c.category === category && c.slug === slug,
  );
  return i === -1 ? null : { chapter: LECTURE.chapters[i], index: i };
}
