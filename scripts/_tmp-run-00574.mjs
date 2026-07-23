// One-off: transcribe a downloaded YouTube audio through the CLEC pipeline,
// matching scripts/transcribe.mjs exactly, and write to raw/transcripts/長篇/.
import { existsSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import * as OpenCC from 'opencc-js';

const REPO = '/Users/fraser/workspace/clec-md';
const { WHISPER_DIR, WHISPER_BIN, WHISPER_MODEL, WHISPER_LANG } = await import(join(REPO, 'scripts/config.mjs'));
const { parseWhisperJson, segmentsToBody } = await import(join(REPO, 'scripts/lib/whisper-segments.mjs'));
const { stripHallucinatedRepeats } = await import(join(REPO, 'scripts/lib/clean-transcript.mjs'));

const SILENCE_FILTER =
  'silenceremove=start_periods=1:start_silence=0.3:start_threshold=-40dB:' +
  'stop_periods=-1:stop_silence=0.3:stop_duration=2:stop_threshold=-40dB';

const toTraditional = OpenCC.Converter({ from: 'cn', to: 'twp' });
const MODEL_LABEL = basename(WHISPER_MODEL).replace(/^ggml-/, '').replace(/\.bin$/, '');

const HERE = '/private/tmp/claude-501/-Users-fraser-workspace-clec-md/af49d21e-c643-4671-8d39-4c455892b16f/scratchpad';
const inputAudio = join(HERE, '00574.wav');
const folder = '長篇';
const stem = '00574【消費才是經濟之母，有錢人消費是道德！】日期：2026年7月18日';
const sourceMp4 = stem + '.mp4'; // provenance label (source is the YouTube video)
const out = join(REPO, 'raw/transcripts', folder, stem + '.md');

const wav = join(HERE, '00574-16k.wav');
const whisperOut = join(HERE, '00574-out');

function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'], ...opts });
  if (r.status !== 0) throw new Error(`${cmd} failed (${r.status})`);
}

function buildBody(whisperOut, convert) {
  const jsonPath = whisperOut + '.json';
  if (existsSync(jsonPath)) {
    const segs = parseWhisperJson(readFileSync(jsonPath, 'utf8'));
    if (segs.length) {
      const { body, removed, total } = segmentsToBody(segs, convert);
      return { body, removed, total, timestamped: true };
    }
  }
  const rawTxt = readFileSync(whisperOut + '.txt', 'utf8').trim();
  const converted = convert(rawTxt).replace(/\n{3,}/g, '\n\n');
  const { text, removed, total } = stripHallucinatedRepeats(converted);
  return { body: text, removed, total, timestamped: false };
}

function ffprobeDuration(abs) {
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1', abs], { encoding: 'utf8' });
  const d = parseFloat((r.stdout || '').trim());
  return Number.isFinite(d) ? d : null;
}

console.log('1/3 ffmpeg silence-trim…');
sh('ffmpeg', ['-y', '-i', inputAudio, '-ar', '16000', '-ac', '1', '-af', SILENCE_FILTER, '-c:a', 'pcm_s16le', wav]);

console.log('2/3 whisper large-v3…');
sh(join(WHISPER_DIR, WHISPER_BIN),
  ['-m', WHISPER_MODEL, '-l', WHISPER_LANG, '-f', wav, '-oj', '-otxt', '-of', whisperOut, '-nt', '-mc', '0'],
  { cwd: WHISPER_DIR });

console.log('3/3 opencc + assemble…');
const { body, removed, total, timestamped } = buildBody(whisperOut, toTraditional);
if (removed > 0) console.warn(`   ⚠ stripped ${removed}/${total} repetition-loop lines`);

const duration = ffprobeDuration(inputAudio);
const fm = [
  '---',
  `title: ${JSON.stringify(stem)}`,
  `sourceFile: ${JSON.stringify(join(folder, sourceMp4))}`,
  `sourceType: ${JSON.stringify(folder)}`,
  duration ? `durationSec: ${Math.round(duration)}` : null,
  'sourceUrl: "https://www.youtube.com/watch?v=jJg841pOAyc"',
  `transcribedAt: ${new Date().toISOString().slice(0, 10)}`,
  `transcriber: whisper.cpp ${MODEL_LABEL} (zh) + opencc s2twp`,
  timestamped ? 'segmentTimestamps: true' : null,
  'kind: transcript',
  '---',
  '',
  body,
  '',
].filter((l) => l !== null).join('\n');

mkdirSync(join(REPO, 'raw/transcripts', folder), { recursive: true });
writeFileSync(out, fm);
rmSync(wav, { force: true });
console.log('✓ wrote ' + out);
