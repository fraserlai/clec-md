#!/usr/bin/env node
/**
 * transcribe-file.mjs — transcribe one or more arbitrary mp4 paths (not tied to
 * the SOURCE_DIR folder layout) into raw/transcripts/<subdir>/.
 *
 * Usage:
 *   node scripts/transcribe-file.mjs [--subdir 講座] <file.mp4> [file2.mp4 ...]
 *
 * Runs sequentially (one whisper at a time) so it can coexist with the bulk
 * priority job without oversubscribing RAM. Resumable: skips files whose
 * output .md already exists.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import * as OpenCC from 'opencc-js';
import { WHISPER_DIR, WHISPER_BIN, WHISPER_MODEL, WHISPER_LANG, RAW_DIR } from './config.mjs';

const args = process.argv.slice(2);
let subdir = '講座';
const files = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--subdir') subdir = args[++i];
  else files.push(args[i]);
}
if (!files.length) {
  console.error('usage: node scripts/transcribe-file.mjs [--subdir 講座] <file.mp4> ...');
  process.exit(1);
}

const toTraditional = OpenCC.Converter({ from: 'cn', to: 'twp' });
const OUT = join(RAW_DIR, 'transcripts', subdir);
mkdirSync(OUT, { recursive: true });

function run(cmd, a, opts = {}) {
  const r = spawnSync(cmd, a, { stdio: ['ignore', 'ignore', 'pipe'], ...opts });
  if (r.status !== 0) throw new Error(`${cmd} failed (${r.status}): ${(r.stderr || '').toString().slice(-400)}`);
}
function dur(f) {
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1', f], { encoding: 'utf8' });
  const d = parseFloat((r.stdout || '').trim());
  return Number.isFinite(d) ? Math.round(d) : null;
}

for (const abs of files) {
  if (!existsSync(abs)) { console.error('skip (missing): ' + abs); continue; }
  const stem = basename(abs, extname(abs));
  const out = join(OUT, stem + '.md');
  if (existsSync(out)) { console.log('skip (done): ' + stem); continue; }

  const uniq = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const wav = join(tmpdir(), `clec-${uniq}.wav`);
  const wout = join(tmpdir(), `clec-${uniq}-out`);
  const t0 = Date.now();
  console.log(`transcribing (${dur(abs)}s): ${stem} …`);
  try {
    run('ffmpeg', ['-y', '-i', abs, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wav]);
    run(join(WHISPER_DIR, WHISPER_BIN),
      ['-m', WHISPER_MODEL, '-l', WHISPER_LANG, '-f', wav, '-otxt', '-of', wout, '-nt'],
      { cwd: WHISPER_DIR });
    const text = toTraditional(readFileSync(wout + '.txt', 'utf8').trim()).replace(/\n{3,}/g, '\n\n');
    const fm = ['---', `title: ${JSON.stringify(stem)}`,
      `sourceFile: ${JSON.stringify(basename(abs))}`, `sourceType: ${JSON.stringify(subdir)}`,
      `durationSec: ${dur(abs)}`, `transcribedAt: ${new Date().toISOString().slice(0, 10)}`,
      'transcriber: whisper.cpp large-v3 (zh) + opencc s2twp', 'kind: transcript', '---', '', text, ''].join('\n');
    writeFileSync(out, fm);
    console.log(`  done (${((Date.now() - t0) / 1000).toFixed(0)}s) → ${out}`);
  } finally {
    rmSync(wav, { force: true }); rmSync(wout + '.txt', { force: true });
  }
}
console.log('✓ all done');
