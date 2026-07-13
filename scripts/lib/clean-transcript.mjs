/**
 * clean-transcript.mjs — strip Whisper repetition-loop hallucinations.
 *
 * Whisper (greedy decode, unlimited context) falls into a repetition loop on
 * long stretches of silence / dead-air, emitting the same short phrase over and
 * over (e.g. "假設住在假設住在…" then "在假冬在假冬…"). It self-reinforces because
 * it feeds its own decoded text back as context. This filter removes those
 * degenerate lines and reports how many it dropped so callers can flag the file.
 *
 * Two signals, because the loop drifts as it degrades:
 *   1. Per-line "seed": a single short unit repeated to fill the line (紙紙紙…),
 *      or a long line built from a tiny alphabet. Unambiguous — removed on sight.
 *   2. Alphabet-subset grow: the drifted tail is short lines drawn from the same
 *      handful of chars (在假設住冬) but not perfectly periodic. We learn the
 *      loop's alphabet from the seeds, then drop any *low-variety* line built
 *      entirely from that alphabet. Real speech (謝謝老師, 對對對對) uses other
 *      characters and survives even when sitting right next to the loop.
 */

const distinctChars = (s) => new Set(s.replace(/\s/g, '')).size;

/** Is a single line a degenerate repetition on its own? */
export function isLoopLine(line) {
  const s = line.trim();
  if (s.length < 8) return false;
  for (let unit = 1; unit <= 6; unit++) {
    if (s.length % unit !== 0) continue;
    if (s.slice(0, unit).repeat(s.length / unit) === s) return true;
  }
  if (s.length >= 12 && distinctChars(s) <= 4) return true;
  return false;
}

// A line is "low-variety" (loop-candidate) if it's short and drawn from few
// distinct characters. Harmless in isolation; damning in a long run.
const isLowVariety = (line) => {
  const s = line.trim();
  return s.length >= 2 && distinctChars(s) <= 6;
};

const chars = (line) => [...line.trim().replace(/\s/g, '')];
const MIN_SEEDS = 2; // strict-loop lines needed before we trust the alphabet

/**
 * Boolean mask over `lines`: true = drop as a repetition-loop hallucination.
 * Exposed so the timestamped (segment-based) transcription path can reuse the
 * exact same detection on segment texts, before any [mm:ss] prefix is attached.
 * @returns {boolean[]}
 */
export function loopLineMask(lines) {
  const drop = lines.map(isLoopLine); // pass 1: unambiguous seeds

  // Pass 2: only if there's a real loop, learn its alphabet and remove any
  // low-variety line drawn entirely from it (contiguous or not).
  if (drop.filter(Boolean).length >= MIN_SEEDS) {
    const loopAlphabet = new Set();
    lines.forEach((l, i) => {
      if (drop[i]) chars(l).forEach((c) => loopAlphabet.add(c));
    });
    lines.forEach((l, i) => {
      if (drop[i] || !isLowVariety(l)) return;
      const cs = chars(l);
      if (cs.length && cs.every((c) => loopAlphabet.has(c))) drop[i] = true;
    });
  }
  return drop;
}

/**
 * Remove hallucinated repetition lines from a transcript body.
 * @returns {{ text: string, removed: number, total: number }}
 */
export function stripHallucinatedRepeats(text) {
  const lines = text.split('\n');
  const drop = loopLineMask(lines);
  const kept = lines.filter((_, i) => !drop[i]);
  const removed = lines.length - kept.length;
  return {
    text: kept.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
    removed,
    total: lines.length,
  };
}
