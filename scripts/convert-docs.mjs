#!/usr/bin/env node
/**
 * convert-docs.mjs — convert CLEC .docx/.pdf/.pptx documents into markdown in
 * raw/docs/, using the markitdown CLI.
 *
 * These are already-written sources (FB/X/YouTube posts, slide decks), so no
 * transcription is needed — just faithful text extraction. Output is wrapped
 * with provenance frontmatter, matching the transcript format.
 *
 * Resumable: skips docs whose target .md already exists.
 *
 * Usage:
 *   node scripts/convert-docs.mjs --list
 *   node scripts/convert-docs.mjs --folder X及YouTube的貼文 --limit 5
 *   node scripts/convert-docs.mjs
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { join, basename, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { SOURCE_DIR, MARKITDOWN_BIN, RAW_DIR, DOC_FOLDERS } from './config.mjs';

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f) => {
  const i = args.indexOf(f);
  return i >= 0 ? args[i + 1] : undefined;
};
const onlyFolder = val('--folder');
const limit = val('--limit') ? parseInt(val('--limit'), 10) : Infinity;
const listOnly = has('--list');

const EXT = new Set(['.docx', '.pdf', '.pptx']);
const OUT_ROOT = join(RAW_DIR, 'docs');

function listDocs(folder) {
  const dir = join(SOURCE_DIR, folder);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => EXT.has(extname(f).toLowerCase()))
    .sort()
    .map((f) => ({ folder, file: f, abs: join(dir, f) }));
}

function targetPath(folder, file) {
  return join(OUT_ROOT, folder, basename(file, extname(file)) + '.md');
}

function convertOne({ folder, file, abs }) {
  const out = targetPath(folder, file);
  if (existsSync(out)) return 'skip';
  mkdirSync(join(OUT_ROOT, folder), { recursive: true });

  const tmp = join(tmpdir(), `clec-doc-${Date.now()}-${Math.random().toString(36).slice(2)}.md`);
  try {
    const r = spawnSync(MARKITDOWN_BIN, [abs, '-o', tmp], { encoding: 'utf8' });
    if (r.status !== 0) {
      throw new Error((r.stderr || 'markitdown failed').slice(-500));
    }
    const body = readFileSync(tmp, 'utf8').trim();
    const stem = basename(file, extname(file));
    const fm = [
      '---',
      `title: ${JSON.stringify(stem)}`,
      `sourceFile: ${JSON.stringify(join(folder, file))}`,
      `sourceType: ${JSON.stringify(folder)}`,
      `sourceFormat: ${JSON.stringify(extname(file).slice(1))}`,
      `convertedAt: ${new Date().toISOString().slice(0, 10)}`,
      'kind: document',
      '---',
      '',
      body,
      '',
    ].join('\n');
    writeFileSync(out, fm);
    return 'ok';
  } finally {
    rmSync(tmp, { force: true });
  }
}

const folders = onlyFolder ? [onlyFolder] : DOC_FOLDERS;
let pending = [];
for (const folder of folders) {
  for (const d of listDocs(folder)) {
    if (!existsSync(targetPath(d.folder, d.file))) pending.push(d);
  }
}

if (listOnly) {
  const byFolder = {};
  for (const d of pending) byFolder[d.folder] = (byFolder[d.folder] || 0) + 1;
  console.log('Pending document conversions:');
  for (const folder of folders) {
    console.log(`  ${folder}: ${byFolder[folder] || 0} pending / ${listDocs(folder).length} total`);
  }
  console.log(`  TOTAL pending: ${pending.length}`);
  process.exit(0);
}

pending = pending.slice(0, limit);
console.log(`Converting ${pending.length} document(s)…`);
let ok = 0;
for (let i = 0; i < pending.length; i++) {
  const d = pending[i];
  process.stdout.write(`[${i + 1}/${pending.length}] ${d.folder}/${d.file} … `);
  try {
    const r = convertOne(d);
    console.log(r);
    if (r === 'ok') ok++;
  } catch (e) {
    console.log('FAILED');
    console.error('   ' + e.message);
  }
}
console.log(`✓ ${ok} converted → ${OUT_ROOT}`);
