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
 *   node scripts/transcribe.mjs --folder 長篇 --desc --redo-untimestamped
 *                                                       # re-do pre-timestamp transcripts, newest-first
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
import { stripHallucinatedRepeats } from './lib/clean-transcript.mjs';
import { parseWhisperJson, segmentsToBody } from './lib/whisper-segments.mjs';

// ffmpeg silenceremove: drop silence gaps longer than 2s (keeping 0.3s padding
// so words don't glue). Long dead-air is what sends whisper into repetition-loop
// hallucinations; removing it before transcription is the first line of defence.
const SILENCE_FILTER =
  'silenceremove=start_periods=1:start_silence=0.3:start_threshold=-40dB:' +
  'stop_periods=-1:stop_silence=0.3:stop_duration=2:stop_threshold=-40dB';

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
// Re-transcribe existing outputs that predate segment timestamps (to add
// `[mm:ss]` anchors). Files already carrying `segmentTimestamps: true` are left
// alone; each redone file is overwritten only when its new version is ready, so
// there's never a window where a transcript is missing.
const redo = has('--redo-untimestamped') || has('--overwrite');
// Concurrency: encode runs on the ANE (Core ML), decode on the GPU (Metal).
// Running several files at once overlaps those stages so both accelerators
// stay busy. ~4.5GB RAM per large-v3 instance → 3 is a safe default on 32GB.
const jobs = Math.max(1, val('--jobs') ? parseInt(val('--jobs'), 10) : 1);

const toTraditional = OpenCC.Converter({ from: 'cn', to: 'twp' });
const OUT_ROOT = join(RAW_DIR, 'transcripts');
// Label provenance with the actual model in use (e.g. large-v3 or large-v3-turbo).
const MODEL_LABEL = basename(WHISPER_MODEL).replace(/^ggml-/, '').replace(/\.bin$/, '');

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

/** Does an existing transcript already carry per-segment timestamps? */
function hasTimestamps(out) {
  try {
    return /\nsegmentTimestamps:\s*true/.test(readFileSync(out, 'utf8').slice(0, 600));
  } catch {
    return false;
  }
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
  // Skip existing outputs — unless we're redoing untimestamped ones, and this
  // one still lacks timestamps. Never redo a transcript that already has them.
  if (existsSync(out) && (!redo || hasTimestamps(out))) return 'skip';
  mkdirSync(join(OUT_ROOT, folder), { recursive: true });

  const stem = basename(file, extname(file));
  const uniq = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const wav = join(tmpdir(), `clec-${uniq}.wav`);
  const whisperOut = join(tmpdir(), `clec-${uniq}-out`);

  try {
    // 1. extract audio, trimming long silences (see SILENCE_FILTER)
    await run('ffmpeg', ['-y', '-i', abs, '-ar', '16000', '-ac', '1',
      '-af', SILENCE_FILTER, '-c:a', 'pcm_s16le', wav]);

    // 2. whisper.cpp. -oj keeps per-segment timestamps (for time anchors);
    //    -otxt is a fallback. -mc 0 disables carrying decoded text back in as
    //    context, which is what lets a repetition loop feed and reinforce itself.
    await run(join(WHISPER_DIR, WHISPER_BIN),
      ['-m', WHISPER_MODEL, '-l', WHISPER_LANG, '-f', wav, '-oj', '-otxt', '-of',
        whisperOut, '-nt', '-mc', '0'],
      { cwd: WHISPER_DIR });

    // 3. Simplified -> Traditional (Taiwan, with phrase conversion), then strip
    //    any residual whisper repetition-loop hallucination as a backstop.
    //    Prefer the timestamped (JSON) path; fall back to plain text.
    const { body, removed, total, timestamped } = buildBody(whisperOut, toTraditional);
    if (removed > 0) {
      console.warn(`   ⚠ ${file}: stripped ${removed}/${total} repetition-loop lines`);
    }

    const duration = ffprobeDuration(abs);
    const fm = [
      '---',
      `title: ${JSON.stringify(stem)}`,
      `sourceFile: ${JSON.stringify(join(folder, file))}`,
      `sourceType: ${JSON.stringify(folder)}`,
      duration ? `durationSec: ${Math.round(duration)}` : null,
      `transcribedAt: ${new Date().toISOString().slice(0, 10)}`,
      `transcriber: whisper.cpp ${MODEL_LABEL} (zh) + opencc s2twp`,
      timestamped ? 'segmentTimestamps: true' : null,
      'kind: transcript',
      '---',
      '',
      body,
      '',
    ].filter((l) => l !== null).join('\n');

    writeFileSync(out, fm);
    return 'ok';
  } finally {
    rmSync(wav, { force: true });
    rmSync(whisperOut + '.txt', { force: true });
    rmSync(whisperOut + '.json', { force: true });
  }
}

/**
 * Build the transcript body from whisper output, preferring the timestamped
 * JSON (`[mm:ss] …` lines) and falling back to plain text if JSON is missing or
 * unparseable. Both paths run the repetition-loop stripper.
 */
function buildBody(whisperOut, convert) {
  const jsonPath = whisperOut + '.json';
  if (existsSync(jsonPath)) {
    try {
      const segs = parseWhisperJson(readFileSync(jsonPath, 'utf8'));
      if (segs.length) {
        const { body, removed, total } = segmentsToBody(segs, convert);
        return { body, removed, total, timestamped: true };
      }
    } catch {
      /* fall through to plain-text path */
    }
  }
  const rawTxt = readFileSync(whisperOut + '.txt', 'utf8').trim();
  const converted = convert(rawTxt).replace(/\n{3,}/g, '\n\n');
  const { text, removed, total } = stripHallucinatedRepeats(converted);
  return { body: text, removed, total, timestamped: false };
}

// ---- main ----
const folders = onlyFolder ? [onlyFolder] : VIDEO_FOLDERS;
let pending = [];
for (const folder of folders) {
  for (const v of listVideos(folder)) {
    const out = targetPath(v.folder, v.file);
    if (!existsSync(out)) pending.push(v); // missing → transcribe
    else if (redo && !hasTimestamps(out)) pending.push(v); // untimestamped → redo
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
