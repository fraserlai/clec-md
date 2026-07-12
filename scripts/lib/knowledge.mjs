/**
 * Shared helpers for reading the knowledge/ SSOT.
 */
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { ENABLED_LANGUAGE_CODES } from '../../src/config/languages.mjs';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const KNOWLEDGE_DIR = join(ROOT, 'knowledge');
export const CONTENT_DIR = join(ROOT, 'src', 'content');

/** Absolute path to a language's knowledge tree. zh-TW lives at knowledge/, others at knowledge/<lang>/. */
export function langKnowledgeDir(lang) {
  return lang === 'zh-TW' ? KNOWLEDGE_DIR : join(KNOWLEDGE_DIR, lang);
}

/** Recursively list *.md files under dir (skips other-language subtrees for zh-TW). */
export function listMarkdown(dir, { skipDirs = [] } = {}) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.')) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (skipDirs.includes(entry)) continue;
      out.push(...listMarkdown(full, { skipDirs }));
    } else if (entry.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

/** All knowledge markdown files for a language, as {lang, absPath, relPath, data, content}. */
export function readLangPages(lang) {
  const base = langKnowledgeDir(lang);
  // For zh-TW, knowledge/ also contains the other languages as subdirs — skip them.
  const skipDirs =
    lang === 'zh-TW'
      ? ENABLED_LANGUAGE_CODES.filter((c) => c !== 'zh-TW')
      : [];
  return listMarkdown(base, { skipDirs }).map((absPath) => {
    const raw = readFileSync(absPath, 'utf8');
    const { data, content } = matter(raw);
    return { lang, absPath, relPath: relative(base, absPath), data, content };
  });
}
