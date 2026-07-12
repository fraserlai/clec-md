#!/usr/bin/env node
/**
 * transcribe.mjs — turn CLEC .mp4 videos into Traditional-Chinese markdown
 * transcripts in raw/transcripts/.
 *
 * Pipeline per file:
 *   mp4 --ffmpeg--> 16kHz mono wav --whisper.cpp(large-v3, zh)--> txt
 *       --opencc(s->twp)--> Traditional Chinese --> raw/transcripts/<folder>/<name>.md
 *
 * Resumable: skips any video whose target .md already exists. Safe to Ctrl-C
 * and re-run; only the in-flight file is lost.
 *
 * Usage:
 *   node scripts/transcribe.mjs --list                 # show pending counts
 *   node scripts/transcribe.mjs --folder 長篇 --limit 3 # transcribe 3 from 長篇
 *   node scripts/transcribe.mjs                         # all folders, priority order
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
import { spawnSync, spawn } from 'node:child_process';
import * as OpenCC from 'opencc-js';
import {
  SOURCE_DIR,
  WHISPER_DIR,
  WHISPER_BIN,
  WHISPER_MODEL,
  WHISPER_LANG,
  RAW_DIR,
  VIDEO_FOLDERS,
} from './config.mjs';

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f) => {
  const i = args.indexOf(f);
  return i >= 0 ? args[i + 1] : undefined;
};

const onlyFolder = val('--folder');
const limit = val('--limit') ? parseInt(val('--limit'), 10) : Infinity;
const listOnly = has('--list');
// Process newest-first (highest episode number first) instead of oldest-first.
const desc = has('--desc');
// Concurrency: encode runs on the ANE (Core ML), decode on the GPU (Metal).
// Running several files at once overlaps those stages so both accelerators
// stay busy. ~4.5GB RAM per large-v3 instance → 3 is a safe default on 32GB.
const jobs = Math.max(1, val('--jobs') ? parseInt(val('--jobs'), 10) : 1);

const toTraditional = OpenCC.Converter({ from: 'cn', to: 'twp' });
const OUT_ROOT = join(RAW_DIR, 'transcripts');

function listVideos(folder) {
  const dir = join(SOURCE_DIR, folder);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.mp4'))
    .sort()
    .map((f) => ({ folder, file: f, abs: join(dir, f) }));
}

function targetPath(folder, file) {
  return join(OUT_ROOT, folder, basename(file, extname(file)) + '.md');
}

// Async spawn so multiple transcriptions can run concurrently in one process.
function run(cmd, cmdArgs, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, cmdArgs, { stdio: ['ignore', 'ignore', 'pipe'], ...opts });
    let stderr = '';
    if (child.stderr) child.stderr.on('data', (d) => (stderr += d));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) reject(new Error(`${cmd} failed (${code}): ${stderr.slice(-500)}`));
      else resolve();
    });
  });
}

function ffprobeDuration(abs) {
  const r = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of',
      'default=noprint_wrappers=1:nokey=1', abs],
    { encoding: 'utf8' },
  );
  const d = parseFloat((r.stdout || '').trim());
  return Number.isFinite(d) ? d : null;
}

async function transcribeOne({ folder, file, abs }) {
  const out = targetPath(folder, file);
  if (existsSync(out)) return 'skip';
  mkdirSync(join(OUT_ROOT, folder), { recursive: true });

  const stem = basename(file, extname(file));
  const uniq = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const wav = join(tmpdir(), `clec-${uniq}.wav`);
  const whisperOut = join(tmpdir(), `clec-${uniq}-out`);

  try {
    // 1. extract audio
    await run('ffmpeg', ['-y', '-i', abs, '-ar', '16000', '-ac', '1', '-c:a',
      'pcm_s16le', wav]);

    // 2. whisper.cpp
    await run(join(WHISPER_DIR, WHISPER_BIN),
      ['-m', WHISPER_MODEL, '-l', WHISPER_LANG, '-f', wav, '-otxt', '-of',
        whisperOut, '-nt'],
      { cwd: WHISPER_DIR });

    // 3. Simplified -> Traditional (Taiwan, with phrase conversion)
    const raw = readFileSync(whisperOut + '.txt', 'utf8').trim();
    const text = toTraditional(raw).replace(/\n{3,}/g, '\n\n');

    const duration = ffprobeDuration(abs);
    const fm = [
      '---',
      `title: ${JSON.stringify(stem)}`,
      `sourceFile: ${JSON.stringify(join(folder, file))}`,
      `sourceType: ${JSON.stringify(folder)}`,
      duration ? `durationSec: ${Math.round(duration)}` : null,
      `transcribedAt: ${new Date().toISOString().slice(0, 10)}`,
      'transcriber: whisper.cpp large-v3 (zh) + opencc s2twp',
      'kind: transcript',
      '---',
      '',
      text,
      '',
    ].filter((l) => l !== null).join('\n');

    writeFileSync(out, fm);
    return 'ok';
  } finally {
    rmSync(wav, { force: true });
    rmSync(whisperOut + '.txt', { force: true });
  }
}

// ---- main ----
const folders = onlyFolder ? [onlyFolder] : VIDEO_FOLDERS;
let pending = [];
for (const folder of folders) {
  for (const v of listVideos(folder)) {
    if (!existsSync(targetPath(v.folder, v.file))) pending.push(v);
  }
}

if (listOnly) {
  const byFolder = {};
  for (const v of pending) byFolder[v.folder] = (byFolder[v.folder] || 0) + 1;
  console.log('Pending transcriptions:');
  for (const folder of folders) {
    const total = listVideos(folder).length;
    console.log(`  ${folder}: ${byFolder[folder] || 0} pending / ${total} total`);
  }
  console.log(`  TOTAL pending: ${pending.length}`);
  process.exit(0);
}

if (desc) pending.reverse();
pending = pending.slice(0, limit);
console.log(
  `Transcribing ${pending.length} video(s) with ${jobs} parallel job(s), ${desc ? 'newest-first' : 'oldest-first'}…`,
);

let ok = 0;
let done = 0;
let next = 0;
const total = pending.length;

async function worker() {
  while (next < total) {
    const i = next++;
    const v = pending[i];
    const t0 = Date.now();
    try {
      const r = await transcribeOne(v);
      const secs = ((Date.now() - t0) / 1000).toFixed(0);
      done++;
      console.log(`[${done}/${total}] ${v.folder}/${v.file} … ${r === 'skip' ? 'skip' : `done (${secs}s)`}`);
      if (r === 'ok') ok++;
    } catch (e) {
      done++;
      console.log(`[${done}/${total}] ${v.folder}/${v.file} … FAILED`);
      console.error('   ' + e.message);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(jobs, total) }, () => worker()));
console.log(`✓ ${ok} transcribed → ${OUT_ROOT}`);
