#!/usr/bin/env node
/**
 * check-roadmap-test — the roadmap check must refuse each drift it exists for.
 *
 *   node tools/check-roadmap-test.mjs
 *
 * A guard with no failing case is decoration (AGENTS.md). Each case below copies
 * the files the check reads into a temp directory, breaks exactly one thing, and
 * asserts the refusal names it. The working tree is never written to.
 */
import assert from "node:assert/strict";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkRoadmap, readBundleVersions } from "./check-roadmap.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function copy() {
  const dir = mkdtempSync(join(tmpdir(), "vonnegut-roadmap-"));
  cpSync(join(ROOT, "docs"), join(dir, "docs"), { recursive: true });
  cpSync(join(ROOT, ".claude-plugin"), join(dir, ".claude-plugin"), { recursive: true });
  cpSync(join(ROOT, "CHANGELOG.md"), join(dir, "CHANGELOG.md"));
  for (const bundle of readdirSync(join(ROOT, "bundles"))) {
    for (const format of [".claude-plugin", ".codex-plugin", ".cursor-plugin", ".plugin"]) {
      mkdirSync(join(dir, "bundles", bundle, format), { recursive: true });
      cpSync(join(ROOT, "bundles", bundle, format, "plugin.json"), join(dir, "bundles", bundle, format, "plugin.json"));
    }
  }
  return dir;
}
const edit = (dir, path, change) => writeFileSync(join(dir, path), change(readFileSync(join(dir, path), "utf8")));

let cases = 0;
function refuses(name, mutate, pattern) {
  const dir = copy();
  try {
    mutate(dir);
    assert.throws(() => checkRoadmap(dir), pattern, name);
    cases += 1;
    console.log(`  ok   ${name}`);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

// Baseline: the real tree passes, and the versions it reads are the manifests'.
const result = checkRoadmap(ROOT);
assert.ok(result.items >= 7 && result.deliverables >= result.items && result.bundles >= 3, JSON.stringify(result));
const versions = readBundleVersions(ROOT);
for (const [name, version] of Object.entries(versions)) {
  assert.equal(JSON.parse(readFileSync(join(ROOT, "bundles", name, ".claude-plugin/plugin.json"), "utf8")).version, version);
}
console.log(`  ok   baseline passes (${result.items} items, ${result.deliverables} deliverables, ${result.bundles} bundles)`);

const [firstBundle, firstVersion] = Object.entries(versions)[0];
refuses("a manifest version bump without a STATUS.md change is refused",
  (dir) => edit(dir, `bundles/${firstBundle}/.claude-plugin/plugin.json`, (t) => t.replace(`"version": "${firstVersion}"`, '"version": "9.9.9"')),
  new RegExp(`${firstBundle}: .claude-plugin/plugin.json says 9.9.9, STATUS.md pins ${firstVersion.replace(/\./g, "\\.")}`));

refuses("a STATUS.md pin that moves without the manifests is refused",
  (dir) => edit(dir, "docs/roadmap/STATUS.md", (t) => t.replace(`| ${firstBundle} | ${firstVersion} |`, `| ${firstBundle} | 9.9.9 |`)),
  /STATUS\.md pins 9\.9\.9/);

refuses("a pin without a CHANGELOG entry is refused",
  (dir) => {
    for (const format of [".claude-plugin", ".codex-plugin", ".cursor-plugin", ".plugin"]) {
      edit(dir, `bundles/${firstBundle}/${format}/plugin.json`, (t) => t.replace(`"version": "${firstVersion}"`, '"version": "9.9.9"'));
    }
    edit(dir, ".claude-plugin/marketplace.json", (t) => t.replace(`"version": "${firstVersion}"`, '"version": "9.9.9"'));
    edit(dir, "docs/roadmap/STATUS.md", (t) => t.replace(`| ${firstBundle} | ${firstVersion} |`, `| ${firstBundle} | 9.9.9 |`));
  },
  new RegExp(`CHANGELOG\\.md section ${firstBundle} has no '### \\[9\\.9\\.9\\]' entry`));

refuses("a STATUS.md item status that disagrees with ROADMAP.md is refused",
  (dir) => edit(dir, "docs/roadmap/STATUS.md", (t) => t.replace("### A. prose-outline — planned", "### A. prose-outline — in-progress")),
  /item A: STATUS\.md says 'in-progress', ROADMAP\.md says 'planned'/);

refuses("a ROADMAP.md table status that disagrees with its own section is refused",
  (dir) => edit(dir, "docs/ROADMAP.md", (t) => t.replace(/(\| 1 \| \[A\. prose-outline\].*\| )planned \|/, "$1shipped |")),
  /item A: section status 'planned' differs from table status 'shipped'/);

refuses("a ticked deliverable under a planned item is refused",
  (dir) => edit(dir, "docs/roadmap/STATUS.md", (t) => t.replace("- [ ] A1 — ", "- [x] A1 — ")),
  /item A is 'planned' but 1 of \d+ deliverables are ticked/);

refuses("a deliverable missing from its spec is refused",
  (dir) => edit(dir, "docs/roadmap/A-prose-outline.md", (t) => t.replace("- A1 — ", "- A1x — ")),
  /deliverable A1 is not in docs\/roadmap\/A-prose-outline\.md's Deliverables section/);

refuses("a missing spec file is refused",
  (dir) => unlinkSync(join(dir, "docs/roadmap/A-prose-outline.md")),
  /spec docs\/roadmap\/A-prose-outline\.md for item A is missing/);

refuses("a spec file nobody links is refused",
  (dir) => writeFileSync(join(dir, "docs/roadmap/Z-orphan.md"), "# orphan\n"),
  /docs\/roadmap\/Z-orphan\.md is not linked from ROADMAP\.md/);

refuses("a bundle directory absent from the version table is refused",
  (dir) => mkdirSync(join(dir, "bundles", "prose-phantom")),
  /bundles\/ holds \[.*prose-phantom.*\]/);

console.log(`Roadmap check refuses ${cases} drifts and passes the real tree.`);
