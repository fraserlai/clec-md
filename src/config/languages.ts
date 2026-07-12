/**
 * Language registry (TypeScript). MUST stay in sync with languages.mjs.
 * zh-TW is the SSOT / default language; English is a projected translation.
 */

export interface Language {
  code: string;
  displayName: string;
  hreflang: string;
  isDefault: boolean;
  enabled: boolean;
}

export const LANGUAGES: Language[] = [
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
export const DEFAULT_LANGUAGE: Language =
  LANGUAGES.find((l) => l.isDefault) ?? LANGUAGES[0];

export function langPrefix(code: string): string {
  return code === DEFAULT_LANGUAGE.code ? '' : `/${code}`;
}
