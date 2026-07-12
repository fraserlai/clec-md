import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LANGUAGE, langPrefix } from '../config/languages.mjs';

export type Lang = 'zh-TW' | 'en';
export type AnyEntry = CollectionEntry<'zh-TW'> | CollectionEntry<'en'>;

/** Split a glob-loader id ("<category>/<slug>") into parts. */
export function idParts(id: string): { category: string; slug: string } {
  const parts = id.split('/');
  const slug = parts[parts.length - 1];
  const category = parts.length > 1 ? parts[0] : '';
  return { category, slug };
}

/** All published pages for a language, newest first. */
export async function getPages(lang: Lang): Promise<AnyEntry[]> {
  const entries = (await getCollection(lang as any)) as AnyEntry[];
  return entries
    .filter((e) => e.data.status !== 'draft' && e.data.status !== 'archived')
    .sort((a, b) => +new Date(b.data.date) - +new Date(a.data.date));
}

export async function getPagesByCategory(
  lang: Lang,
  category: string,
): Promise<AnyEntry[]> {
  return (await getPages(lang)).filter((e) => e.data.category === category);
}

/**
 * Prefix an internal path with the configured deploy base
 * (`import.meta.env.BASE_URL`, e.g. '/clec-md/' on GitHub Pages, '/' on a
 * root/custom-domain deploy). Every internal link must go through this so the
 * site works under a subpath.
 */
export function withBase(path: string): string {
  return (import.meta.env.BASE_URL + path.replace(/^\//, '')).replace(
    /\/{2,}/g,
    '/',
  );
}

/** Canonical URL for a page, honoring the default-language (no prefix) rule. */
export function pageUrl(lang: Lang, entry: AnyEntry): string {
  const { slug } = idParts(entry.id);
  return withBase(`${langPrefix(lang)}/${entry.data.category}/${slug}/`);
}

export function categoryUrl(lang: Lang, categoryId: string): string {
  return withBase(`${langPrefix(lang)}/${categoryId}/`);
}

export function homeUrl(lang: Lang): string {
  return withBase(`${langPrefix(lang)}/`);
}

export const isDefaultLang = (lang: string) => lang === DEFAULT_LANGUAGE.code;
