/**
 * whisper-segments.mjs — turn whisper.cpp JSON output into a timestamped,
 * Traditional-Chinese transcript body.
 *
 * Why keep timestamps: the Clubhouse (長篇) ingest model wants time anchors so a
 * Q&A page can cite "00570 @ 1:12:30", so the lecture→discussion boundary is
 * machine-findable, and so repetition-loop stretches can be located and
 * re-transcribed by time range. whisper.cpp emits per-segment offsets in its
 * JSON output (`-oj`); we keep them as an `[mm:ss]` prefix on each line.
 *
 * Loop-hallucination stripping runs on the CONVERTED speech text *before* the
 * timestamp prefix is attached, so the detector (shared with the plain-text
 * path) never sees the `[mm:ss]` digits — otherwise every repeated line would
 * carry a different timestamp and dodge de-duplication.
 */
import { loopLineMask } from './clean-transcript.mjs';

/**
 * Parse whisper.cpp `-oj` JSON into segments. Tolerant of missing offsets.
 * @returns {{ fromMs: number, toMs: number, text: string }[]}
 */
export function parseWhisperJson(jsonText) {
  const data = JSON.parse(jsonText);
  const segs = data.transcription;
  if (!Array.isArray(segs)) throw new Error('whisper JSON has no transcription[]');
  return segs
    .map((s) => ({
      fromMs: Number(s?.offsets?.from ?? 0),
      toMs: Number(s?.offsets?.to ?? 0),
      text: String(s?.text ?? '').trim(),
    }))
    .filter((s) => s.text.length > 0);
}

/** Milliseconds → `H:MM:SS` (hour dropped when zero) for a compact anchor. */
export function clock(ms) {
  const t = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/**
 * Build a timestamped transcript body from whisper segments.
 * @param segments  from parseWhisperJson
 * @param convert   Simplified→Traditional converter (opencc s2twp)
 * @returns {{ body: string, removed: number, total: number }}
 */
export function segmentsToBody(segments, convert) {
  const texts = segments.map((s) => convert(s.text).trim());
  const drop = loopLineMask(texts);
  const kept = [];
  for (let i = 0; i < segments.length; i++) {
    if (drop[i] || !texts[i]) continue;
    kept.push(`[${clock(segments[i].fromMs)}] ${texts[i]}`);
  }
  return {
    body: kept.join('\n'),
    removed: drop.filter(Boolean).length,
    total: segments.length,
  };
}
