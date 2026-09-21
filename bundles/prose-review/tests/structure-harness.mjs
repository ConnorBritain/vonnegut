/**
 * structure-harness — what `run-harness.mjs`, `verify-run.mjs` and `selftest.mjs`
 * share about prose-structure-critic's fixtures. Neither runner may import the
 * other, so the three things they must agree on live here once:
 *
 *   1. THE ECHO RULE. `scanSays(scan)` is the verdict a critic would return by
 *      parroting outline-scan: flagged when a section's length ratio is extreme
 *      or a within-section paragraph boundary carries no marker and no lexical
 *      link. It is NOT a finding and the scan never prints it; it exists so the
 *      harness can report the echo baseline - the score a parrot gets - next to
 *      the critic's, and classify fixtures by whether the critic must agree or
 *      disagree with the tool it reads. Change the rule and every class must be
 *      re-derived; the selftest fails until fixtures.json agrees.
 *   2. THE FIXTURE SET. Eight synthetic drafts under fixtures/structure/ (with an
 *      intended outline where the case is about support or order) plus a
 *      leave-one-out negative set of twelve argumentative human essays, listed
 *      by name so the set cannot drift as the corpus grows.
 *   3. THE TASK TEXT the critic receives: the scan JSON, the intended outline if
 *      any, and which mode that puts it in.
 *
 * outline-scan is imported from prose-outline at TEST time only. Shipped code
 * never imports across bundles (PROFILES.md); a harness may, the same way
 * prose-author's tests import tell-scan's provenance reader for parity.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const TESTS = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(TESTS, "..", "..", "..");
export const STRUCTURE_FIXTURES = join(TESTS, "fixtures", "structure");
export const OUTLINE_SCAN = join(REPO, "bundles", "prose-outline", "skills", "prose-outline", "tools", "outline-scan.mjs");
const CORPUS = join(REPO, "bundles", "prose-tell-scan", "tests", "corpus", "human-essays");

export const ECHO_RULE = {
  max_ratio: 3,        // a section three times the median
  min_ratio: 0.34,     // or a third of it
  description: "flagged when balance.max_ratio >= 3, balance.min_ratio <= 0.34, or any within-section paragraph boundary is unmarked",
};

/** The parrot's verdict. Counts in, one of two words out; never a finding. */
export function scanSays(scan) {
  if (scan.status !== "measured") return "CLEAN";
  const { balance, transitions } = scan;
  const extreme = (balance.max_ratio !== null && balance.max_ratio >= ECHO_RULE.max_ratio)
    || (balance.min_ratio !== null && balance.min_ratio <= ECHO_RULE.min_ratio);
  const gap = transitions.unmarked.some((u) => u.same_section);
  return extreme || gap ? "REVISE" : "CLEAN";
}

export async function scanDraft(text, file = "draft.md") {
  const { scanOutline } = await import(pathToFileURL(OUTLINE_SCAN).href);
  return scanOutline(text, { file });
}

export const loadStructureManifest = () => JSON.parse(readFileSync(join(STRUCTURE_FIXTURES, "fixtures.json"), "utf8"));

/**
 * Fixtures for `run-harness.mjs prepare structure`. Synthetic cases stage
 * `draft.md` and, when present, `outline.json`; leave-one-out negatives stage one
 * corpus essay as `draft.md` with no outline (draft-only mode), which is the
 * honest test of "stays quiet on human structure".
 */
export function structureFixtures(opts = {}) {
  const dir = opts.fixturesDir ?? STRUCTURE_FIXTURES;
  const manifest = JSON.parse(readFileSync(join(dir, "fixtures.json"), "utf8"));
  const synthetic = manifest.fixtures.map((f) => ({
    name: f.name,
    kind: f.kind,
    inputs: [
      { as: "draft.md", from: join(dir, f.name, "draft.md") },
      ...(existsSync(join(dir, f.name, "outline.json")) ? [{ as: "outline.json", from: join(dir, f.name, "outline.json") }] : []),
    ],
  }));
  const negatives = (manifest.leave_one_out ?? []).map((rel) => ({
    name: `n-loo-${rel.split("/").pop().replace(/\.txt$/, "")}`,
    kind: "negative",
    inputs: [{ as: "draft.md", from: join(CORPUS, rel) }],
  }));
  return [...synthetic, ...negatives];
}

/** The task text: scan JSON (computed on the STAGED draft), the outline if staged, the mode. */
export async function structureTask(staged) {
  const scan = await scanDraft(staged["draft.md"]);
  const outline = staged["outline.json"] ?? null;
  return [
    "You have a draft, the output of `outline-scan` over it, and" + (outline ? " the outline the writer intended." : " no intended outline."),
    "Report on the draft's structure, following your instructions exactly, including the",
    "mode line, the output contract and the closing one-line verdict.",
    "",
    `Mode: ${outline ? "intended-outline" : "draft-only"}.`,
    "",
    "## outline-scan output",
    "",
    "```json",
    JSON.stringify(scan, null, 1),
    "```",
    ...(outline ? ["", "## intended outline (voice-outline/1 body)", "", "```json", outline.trim(), "```"] : []),
    "",
    "The scan is authoritative on counts. You are authoritative only on consequence.",
  ].join("\n");
}
