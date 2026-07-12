/**
 * Language registry (MJS mirror of languages.ts).
 *
 * Used by Node-direct scripts and Astro config (astro.config.mjs,
 * scripts/*.mjs). MUST stay in sync with languages.ts.
 *
 * zh-TW is the SSOT / default language. English is a projected translation.
 */

export const LANGUAGES = [
  {
    code: 'zh-TW',
    displayName: '中文',
    hreflang: 'zh-Hant',
    isDefault: true,
    enabled: true,
  },
  {
    code: 'en',
    displayName: 'English',
    hreflang: 'en',
    isDefault: false,
    enabled: true,
  },
];

export const ENABLED_LANGUAGES = LANGUAGES.filter((l) => l.enabled);
export const ENABLED_LANGUAGE_CODES = ENABLED_LANGUAGES.map((l) => l.code);
export const DEFAULT_LANGUAGE =
  LANGUAGES.find((l) => l.isDefault) ?? LANGUAGES[0];

/** URL prefix for a language: '' for the default, '/<code>' otherwise. */
export function langPrefix(code) {
  return code === DEFAULT_LANGUAGE.code ? '' : `/${code}`;
}
