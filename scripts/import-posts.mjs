#!/usr/bin/env node
/**
 * import-posts.mjs — publish James's original posts/articles into posts/,
 * FAITHFULLY. This does mechanical cleanup only (strip conversion artifacts,
 * pull out the source URL/date) and never rewrites James's words.
 *
 * Reads the markitdown output in raw/docs/<folder>/*.md and writes
 * posts/<folder>/<slug>.md with clean frontmatter + the verbatim body.
 *
 * Usage:
 *   node scripts/import-posts.mjs                 # both post folders
 *   node scripts/import-posts.mjs --folder "FB Wealthyin50的貼文"
 *   node scripts/import-posts.mjs --list
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, basename, extname, dirname } from 'node:path';
import matter from 'gray-matter';
import { ROOT } from './lib/knowledge.mjs';

const RAW_DOCS = join(ROOT, 'raw', 'docs');
const OUT = join(ROOT, 'posts');
const POST_FOLDERS = ['X及YouTube的貼文', 'FB Wealthyin50的貼文'];

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f) => (args.indexOf(f) >= 0 ? args[args.indexOf(f) + 1] : undefined);
const only = val('--folder');
const listOnly = has('--list');
const folders = only ? [only] : POST_FOLDERS;

function slugify(s) {
  return s
    .trim()
    .replace(/[〖〗【】\[\]（）()「」『』｜|]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}\-_.]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function parseDate(stem) {
  let m = stem.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日/);
  if (m) return `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}`;
  m = stem.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
  if (m) return `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}`;
  return null;
}

function extractEp(stem) {
  // Only the X/YouTube "NNNN貼文" numbering — not FB filenames that start with a year.
  const m = stem.match(/^\s*(\d{2,5})\s*貼文/);
  return m ? m[1] : '';
}

function detectSeries(stem) {
  const m =
    stem.match(/(理財入門|投資哲學|投資心法|投資策略)\s*[\(（]?\s*\d*/) ||
    stem.match(/第\s*[一二三四五六七八九十百零\d]+\s*章/);
  return m ? m[0].trim() : '';
}

// Clean the markitdown body without altering James's text.
function cleanBody(body) {
  let out = body;
  // Source URL: an explicit "來源：<url>" line (X/YouTube) — remove it from the
  // body; otherwise the first URL near the top (FB, which wraps it in markdown).
  let sourceUrl = '';
  const cleanUrl = (u) =>
    u.replace(/[)*\]>]+$/, '').replace(/[?&](?:s|d|mibextid|__cft__|__tn__)=[^\s)]*$/g, '');
  const explicit = out.match(/^\s*來源[:：]\s*<?\**\[?\s*(https?:\/\/[^\s\])>*]+)/m);
  if (explicit) {
    sourceUrl = cleanUrl(explicit[1]);
    out = out.replace(explicit[0], '');
  } else {
    const near = out.slice(0, 600).match(/https?:\/\/[^\s\])>*]+/);
    if (near) sourceUrl = cleanUrl(near[0]);
  }
  out = out
    // drop base64 / local-path images (conversion noise, not James's content)
    .replace(/!\[[^\]]*\]\(data:[^)]*\)/g, '')
    .replace(/!\[[^\]]*\]\((?:file:|[A-Za-z]:\\)[^)]*\)/g, '')
    // strip zero-width + normalize whitespace
    .replace(/[​﻿]/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { body: out, sourceUrl };
}

// Recursively list *.md under dir, returning paths relative to dir.
function listMdRel(dir, prefix = '') {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.')) continue;
    const abs = join(dir, entry);
    const rel = prefix ? `${prefix}/${entry}` : entry;
    if (statSync(abs).isDirectory()) out.push(...listMdRel(abs, rel));
    else if (entry.endsWith('.md')) out.push(rel);
  }
  return out;
}

function importFolder(folder) {
  const dir = join(RAW_DOCS, folder);
  if (!existsSync(dir)) return { total: 0, written: 0 };
  const files = listMdRel(dir).sort();
  let written = 0;
  for (const relFile of files) {
    const subdir = relFile.includes('/') ? relFile.slice(0, relFile.lastIndexOf('/')) : '';
    const stem = basename(relFile, extname(relFile));
    const outPath = join(OUT, folder, subdir, slugify(stem) + '.md');
    if (existsSync(outPath) && !has('--force')) continue;
    if (listOnly) continue;

    const raw = readFileSync(join(dir, relFile), 'utf8');
    const parsed = matter(raw);
    const { body, sourceUrl } = cleanBody(parsed.content);
    if (!body) continue;

    const url = sourceUrl || '';
    const source = /youtube\.com/.test(url)
      ? 'YouTube'
      : /x\.com|twitter\.com/.test(url)
        ? 'X'
        : folder.startsWith('FB')
          ? 'FB'
          : 'X';
    const date = parseDate(stem) || parsed.data.convertedAt || '2016-01-01';
    const fm = [
      '---',
      `title: ${JSON.stringify(stem)}`,
      `date: ${date}`,
      `source: ${source}`,
      url ? `sourceUrl: ${JSON.stringify(url)}` : null,
      `sourceType: ${JSON.stringify(folder)}`,
      detectSeries(stem) ? `series: ${JSON.stringify(detectSeries(stem))}` : null,
      extractEp(stem) ? `ep: ${JSON.stringify(extractEp(stem))}` : null,
      'status: published',
      '---',
      '',
      body,
      '',
    ].filter((l) => l !== null).join('\n');

    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, fm);
    written++;
  }
  return { total: files.length, written };
}

let grand = 0;
for (const folder of folders) {
  const { total, written } = importFolder(folder);
  console.log(`  ${folder}: ${listOnly ? total + ' available' : written + ' imported / ' + total + ' converted'}`);
  grand += written;
}
if (!listOnly) console.log(`✓ ${grand} posts -> ${OUT}`);
