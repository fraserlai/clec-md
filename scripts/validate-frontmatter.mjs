#!/usr/bin/env node
/**
 * validate-frontmatter.mjs — fail fast on malformed knowledge pages before
 * they reach Astro's content collection (which gives noisier errors).
 *
 * Checks: required fields present, category is known, date parseable.
 */
import { ENABLED_LANGUAGE_CODES } from '../src/config/languages.mjs';
import { CATEGORY_IDS } from '../src/config/categories.mjs';
import { readLangPages } from './lib/knowledge.mjs';

const REQUIRED = ['title', 'description', 'date', 'category'];
const errors = [];
let count = 0;

for (const lang of ENABLED_LANGUAGE_CODES) {
  for (const page of readLangPages(lang)) {
    count++;
    const where = `${lang}:${page.relPath}`;
    for (const key of REQUIRED) {
      if (page.data[key] === undefined || page.data[key] === '') {
        errors.push(`${where} — missing "${key}"`);
      }
    }
    if (page.data.category && !CATEGORY_IDS.includes(page.data.category)) {
      errors.push(
        `${where} — unknown category "${page.data.category}" (see src/config/categories.mjs)`,
      );
    }
    if (page.data.date && Number.isNaN(new Date(page.data.date).getTime())) {
      errors.push(`${where} — unparseable date "${page.data.date}"`);
    }
  }
}

if (errors.length) {
  console.error(`✗ frontmatter validation failed (${errors.length}):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✓ frontmatter OK (${count} pages)`);
