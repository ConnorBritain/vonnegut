/**
 * quote — is a quotation the writer's exact words, at the line it names?
 *
 * Whitespace is the only normalisation, the same rule as prose-research's
 * claims-check: case and punctuation are never "close enough". Shared by
 * prose-brainstorm's angles-check and prose-interview's brief-check as a
 * byte-identical copy, pinned by tools/check-packaging.mjs.
 *
 *   exact      the quote starts on the line it names
 *   misplaced  the exact words are in the text, starting on a different line
 *   drifted    the words match only if case and punctuation are ignored
 *   absent     not in the text in any form
 */
/** Whitespace collapsed, with the 1-based line each kept character came from. */
export function normalisedWithLines(text) {
  let out = "";
  const lines = [];
  let line = 1, pendingSpace = false;
  for (const ch of text) {
    if (/\s/.test(ch)) { if (ch === "\n") line += 1; if (out.length) pendingSpace = true; continue; }
    if (pendingSpace) { out += " "; lines.push(line); pendingSpace = false; }
    out += ch; lines.push(line);
  }
  return { text: out, lines };
}
export const normalise = (s) => s.replace(/\s+/g, " ").trim();
export const loose = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();

/** Every start index of `needle` in `hay`. */
export function indexesOf(hay, needle) {
  const out = [];
  if (!needle) return out;
  for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + 1)) out.push(i);
  return out;
}

/** The status of one quote against one text. */
export function quoteStatus(source, quote, line) {
  const { text, lines } = normalisedWithLines(source);
  const q = normalise(quote);
  const starts = indexesOf(text, q).map((i) => lines[i]);
  if (starts.includes(line)) return { status: "exact" };
  if (starts.length) return { status: "misplaced", found_line: starts[0] };
  const ql = loose(quote);
  if (ql && loose(source).includes(ql)) {
    // Report where: the first source line whose loose form contains the quote's first loose words.
    const head = ql.split(" ").slice(0, 3).join(" ");
    const found = source.split("\n").findIndex((l) => loose(l).includes(head));
    return { status: "drifted", ...(found >= 0 ? { found_line: found + 1 } : {}) };
  }
  return { status: "absent" };
}
