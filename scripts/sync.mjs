#!/usr/bin/env node
/**
 * sync.mjs — project the knowledge/ SSOT into src/content/<lang>/ for Astro.
 *
 * knowledge/<category>/<slug>.md          -> src/content/zh-TW/<category>/<slug>.md
 * knowledge/en/<category>/<slug>.md        -> src/content/en/<category>/<slug>.md
 *
 * Runs automatically on predev/prebuild. Idempotent: clears and rewrites
 * src/content/ each run so deletions in knowledge/ propagate.
 */
import { rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { ENABLED_LANGUAGE_CODES } from '../src/config/languages.mjs';
import { CONTENT_DIR, langKnowledgeDir, listMarkdown } from './lib/knowledge.mjs';
import { relative } from 'node:path';

rmSync(CONTENT_DIR, { recursive: true, force: true });

let total = 0;
for (const lang of ENABLED_LANGUAGE_CODES) {
  const srcBase = langKnowledgeDir(lang);
  const skipDirs =
    lang === 'zh-TW'
      ? ENABLED_LANGUAGE_CODES.filter((c) => c !== 'zh-TW')
      : [];
  const files = listMarkdown(srcBase, { skipDirs });
  for (const abs of files) {
    const rel = relative(srcBase, abs);
    const dest = join(CONTENT_DIR, lang, rel);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(abs, dest);
    total++;
  }
  console.log(`  sync ${lang}: ${files.length} pages`);
}
console.log(`✓ synced ${total} knowledge pages -> src/content/`);
