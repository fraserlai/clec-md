/**
 * Ingestion configuration for the CLEC content pipeline.
 *
 * Paths are user-/machine-specific (the source lives in a mounted Google Drive
 * folder). Override any of these with environment variables so the scripts stay
 * portable and nothing machine-specific is committed as a hard requirement.
 */
import { homedir } from 'node:os';
import { join } from 'node:path';

const HOME = homedir();

/** Root of the CLEC Google Drive content (the folder with 短篇/長篇/…). */
export const SOURCE_DIR =
  process.env.CLEC_SOURCE_DIR ||
  join(
    HOME,
    'Library/CloudStorage/GoogleDrive-fraser4435@gmail.com/My Drive/Share/CLEC投資理財頻道',
  );

/** whisper.cpp checkout containing the `main` binary and models/. */
export const WHISPER_DIR =
  process.env.WHISPER_DIR || join(HOME, 'Downloads/whisper.cpp');

/** whisper.cpp binary (older builds call it `main`; newer ones `whisper-cli`). */
export const WHISPER_BIN = process.env.WHISPER_BIN || 'main';

/** ggml model file, relative to WHISPER_DIR unless absolute. */
export const WHISPER_MODEL =
  process.env.WHISPER_MODEL || 'models/ggml-large-v3.bin';

/** Whisper source language. */
export const WHISPER_LANG = process.env.WHISPER_LANG || 'zh';

/** markitdown CLI (converts docx/pdf/pptx → markdown). */
export const MARKITDOWN_BIN =
  process.env.MARKITDOWN_BIN ||
  join(HOME, 'workspace/claude-venv/.venv-arm64/bin/markitdown');

/** Where converted raw sources land inside the repo. */
export const RAW_DIR = new URL('../raw/', import.meta.url).pathname;

/**
 * Source subfolders in rough ingestion priority. Long-form lectures and
 * flagship topics first; short clips and social posts fill in the long tail.
 */
export const VIDEO_FOLDERS = [
  '長篇',
  'CLEC 專題',
  '專題',
  '緣起今日',
  'CLEC 2018 年實體課程',
  '短篇',
  '投資有聲書推薦',
  '閒聊',
  '補充教材',
];

export const DOC_FOLDERS = [
  'X及YouTube的貼文',
  'FB Wealthyin50的貼文',
  '簡報資料',
];
