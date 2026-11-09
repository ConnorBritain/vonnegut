/**
 * shape — a piece's shape as data: ordered parts, which are required, and what
 * share of the length each usually takes.
 *
 * A shape file is `shapes/<name>.md`: frontmatter, then one paragraph on when
 * the shape works and how it fails. The frontmatter is deliberately small so a
 * dependency-free parser can read it exactly:
 *
 *   ---
 *   name: problem-solution
 *   mode: argument                         # argument | beat-sheet
 *   parts:
 *     - problem | required | 0.15-0.30     # part | required|optional | share range
 *     - objection | optional | 0.05-0.20
 *   good_for: newsletter, essay
 *   length_hint: 400-2500                  # words
 *   ---
 *
 * A part may repeat in an outline (one node per question, one per lesson); its
 * share is the sum of its nodes. Shares are starting values, not measurements
 * of good writing, and an outline outside a range is a signal, not a failure.
 */
export const MODES = Object.freeze(["argument", "beat-sheet"]);
const TOKEN = /^[a-z][a-z0-9-]{0,63}$/;
const PROHIBITION = /\b(never|do not|don't|avoid)\b[^.]*\b(word|phrase|say)/i;

/** Parse a shape file. Returns { shape } or { errors } — never throws on bad input. */
export function parseShape(text) {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(String(text).replace(/\r\n?/g, "\n"));
  if (!m) return { errors: ["a shape file is frontmatter between --- lines, then a paragraph"] };
  const errors = [];
  const shape = { parts: [] };
  let inParts = false;
  m[1].split("\n").forEach((line, i) => {
    if (!line.trim()) return;
    const item = /^\s+-\s+(.*)$/.exec(line);
    if (item) {
      if (!inParts) { errors.push(`frontmatter line ${i + 1}: a list item outside parts`); return; }
      const cells = item[1].split("|").map((c) => c.trim());
      const range = /^(\d(?:\.\d+)?)-(\d(?:\.\d+)?)$/.exec(cells[2] ?? "");
      if (cells.length !== 3 || !range) { errors.push(`frontmatter line ${i + 1}: a part is "name | required|optional | min-max"`); return; }
      shape.parts.push({ part: cells[0], required: cells[1], share: [Number(range[1]), Number(range[2])] });
      return;
    }
    const kv = /^([a-z_]+):\s*(.*)$/.exec(line);
    if (!kv) { errors.push(`frontmatter line ${i + 1}: unreadable`); return; }
    inParts = kv[1] === "parts";
    if (inParts) { if (kv[2]) errors.push("parts: the list goes on the lines below"); return; }
    if (Object.hasOwn(shape, kv[1])) { errors.push(`${kv[1]}: given twice`); return; }
    shape[kv[1]] = kv[2];
  });
  shape.paragraph = m[2].trim();
  if (shape.good_for !== undefined) shape.good_for = shape.good_for.split(",").map((s) => s.trim()).filter(Boolean);
  if (shape.length_hint !== undefined) {
    const r = /^(\d+)-(\d+)$/.exec(shape.length_hint);
    shape.length_hint = r ? { min: Number(r[1]), max: Number(r[2]) } : shape.length_hint;
  }
  return errors.length ? { errors } : { shape };
}

/** Errors in a parsed shape. */
export function validateShape(shape, expectedName = null) {
  const errors = [];
  for (const k of Object.keys(shape)) if (!["name", "mode", "parts", "good_for", "length_hint", "paragraph"].includes(k)) errors.push(`unknown key ${k}`);
  if (!TOKEN.test(shape.name ?? "")) errors.push("name must be a lower-case token");
  else if (expectedName && shape.name !== expectedName) errors.push(`name ${shape.name} does not match the file name ${expectedName}`);
  if (!MODES.includes(shape.mode)) errors.push(`mode must be ${MODES.join(" | ")}`);
  if (!Array.isArray(shape.parts) || !shape.parts.length) errors.push("parts must list at least one part");
  else {
    const seen = new Set();
    for (const p of shape.parts) {
      const at = `part ${p.part || "?"}`;
      if (!TOKEN.test(p.part ?? "")) errors.push(`${at}: a part name is a lower-case token`);
      else if (seen.has(p.part)) errors.push(`${at}: listed twice`);
      seen.add(p.part);
      if (!["required", "optional"].includes(p.required)) errors.push(`${at}: required or optional`);
      const [lo, hi] = p.share ?? [];
      if (!(lo >= 0 && hi <= 1 && lo <= hi)) errors.push(`${at}: share range must be within 0–1, min ≤ max`);
    }
    const minRequired = shape.parts.filter((p) => p.required === "required").reduce((a, p) => a + (p.share?.[0] ?? 0), 0);
    const maxAll = shape.parts.reduce((a, p) => a + (p.share?.[1] ?? 0), 0);
    if (minRequired > 1 + 1e-9) errors.push(`the required parts' minimum shares sum to ${round(minRequired)}, more than the whole piece`);
    if (maxAll < 1 - 1e-9) errors.push(`every part's maximum share sums to ${round(maxAll)}, less than the whole piece`);
    if (!shape.parts.some((p) => p.required === "required")) errors.push("at least one part is required");
  }
  if (!Array.isArray(shape.good_for) || !shape.good_for.length || !shape.good_for.every((f) => TOKEN.test(f))) errors.push("good_for lists the forms it suits, as tokens");
  if (!(shape.length_hint && Number.isInteger(shape.length_hint.min) && shape.length_hint.min >= 1 && shape.length_hint.max >= shape.length_hint.min)) errors.push("length_hint is min-max in words");
  if (!shape.paragraph) errors.push("a paragraph after the frontmatter says when the shape works and how it fails");
  else if (PROHIBITION.test(shape.paragraph)) errors.push("the paragraph must not carry a prohibition list; that is a catalog by another name");
  return errors;
}
const round = (x) => Math.round(x * 100) / 100;

/** Parse and validate in one step. */
export function loadShape(text, expectedName = null) {
  const parsed = parseShape(text);
  if (parsed.errors) return { errors: parsed.errors };
  const errors = validateShape(parsed.shape, expectedName);
  return errors.length ? { errors } : { shape: parsed.shape };
}
