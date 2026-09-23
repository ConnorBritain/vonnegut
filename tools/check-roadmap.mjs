#!/usr/bin/env node
/**
 * check-roadmap — the roadmap, its status checklist, the item specs and the
 * bundle manifests must agree with each other.
 *
 *   node tools/check-roadmap.mjs
 *
 * WHAT IT PINS. docs/roadmap/STATUS.md is the one place bundle versions are
 * written down outside the manifests. tools/check-packaging.mjs reads its
 * expected versions from here (readBundleVersions), so there is exactly one
 * pin: bump a manifest and the checks fail until STATUS.md moves too. That
 * forces a STATUS.md edit in the same commit as a release. It does not make the
 * edit meaningful; a reviewer does that.
 *
 * WHY NO GIT. A diff-based "did STATUS.md change in this commit" check cannot
 * run where there is no .git — the mutation sandbox copies the tree without it,
 * and so does any plain copy. A static pin works everywhere the files do.
 */
import { existsSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const STATUSES = ["planned", "in-progress", "shipped"];
const FORMATS = [".claude-plugin", ".codex-plugin", ".cursor-plugin", ".plugin"];
const fail = (message) => { throw new Error(`roadmap: ${message}`); };

function reader(root) {
  return (path) => {
    const file = join(root, path);
    if (!existsSync(file)) fail(`${path} is missing`);
    return readFileSync(file, "utf8");
  };
}

/** The "Bundle versions" table in STATUS.md: { bundle: version }. */
export function readBundleVersions(root = DEFAULT_ROOT) {
  const section = reader(root)("docs/roadmap/STATUS.md").split(/^## /m).find((s) => s.startsWith("Bundle versions"));
  if (!section) fail("STATUS.md has no 'Bundle versions' section");
  const versions = {};
  for (const m of section.matchAll(/^\| ([a-z][a-z0-9-]*) \| (\d+\.\d+\.\d+) \|$/gm)) {
    if (versions[m[1]]) fail(`STATUS.md pins ${m[1]} twice`);
    versions[m[1]] = m[2];
  }
  if (!Object.keys(versions).length) fail("STATUS.md 'Bundle versions' table has no rows");
  return versions;
}

export function checkRoadmap(root = DEFAULT_ROOT) {
  const read = reader(root);
  const roadmap = read("docs/ROADMAP.md");
  const status = read("docs/roadmap/STATUS.md");

  // 1. The sequence table: one row per item, each linking to an existing spec.
  const rows = [...roadmap.matchAll(/^\| (\d+) \| \[([A-Z])\. ([^\]]+)\]\(#[^)]+\) \| [^|]+ \| \[[^\]]+\]\(roadmap\/([^)]+)\) \| ([a-z-]+) \|$/gm)]
    .map((m) => ({ seq: Number(m[1]), letter: m[2], name: m[3], spec: m[4], status: m[5] }));
  if (!rows.length) fail("ROADMAP.md sequence table has no item rows");
  const letters = new Set();
  const roadmapSections = roadmap.split(/^## /m);
  for (const row of rows) {
    if (letters.has(row.letter)) fail(`ROADMAP.md lists item ${row.letter} twice`);
    letters.add(row.letter);
    if (!STATUSES.includes(row.status)) fail(`item ${row.letter} has status '${row.status}'; expected ${STATUSES.join(" | ")}`);
    if (!existsSync(join(root, "docs/roadmap", row.spec))) fail(`spec docs/roadmap/${row.spec} for item ${row.letter} is missing`);
    const section = roadmapSections.find((s) => s.startsWith(`${row.letter}. `));
    if (!section) fail(`ROADMAP.md has no '## ${row.letter}.' section`);
    const stated = /^\*\*Status\.\*\* ([a-z-]+)$/m.exec(section);
    if (!stated) fail(`ROADMAP.md section ${row.letter} has no '**Status.**' line`);
    if (stated[1] !== row.status) fail(`item ${row.letter}: section status '${stated[1]}' differs from table status '${row.status}'`);
  }
  for (const file of readdirSync(join(root, "docs/roadmap")).filter((f) => /^[A-Z]-.*\.md$/.test(f))) {
    if (!rows.some((r) => r.spec === file)) fail(`docs/roadmap/${file} is not linked from ROADMAP.md`);
  }

  // 2. STATUS.md: heading status equals the table; tick counts match the status;
  //    every deliverable id is unique, filed under its own letter, and present in
  //    the spec's Deliverables section.
  const blocks = status.split(/^### /m).slice(1);
  const ids = new Set();
  for (const row of rows) {
    const block = blocks.find((b) => b.startsWith(`${row.letter}. `));
    if (!block) fail(`STATUS.md has no '### ${row.letter}.' section`);
    const head = /^([A-Z])\. (.+?) — ([a-z-]+)\r?\n/.exec(block);
    if (!head) fail(`STATUS.md heading for item ${row.letter} is not '<Letter>. <name> — <status>'`);
    if (head[3] !== row.status) fail(`item ${row.letter}: STATUS.md says '${head[3]}', ROADMAP.md says '${row.status}'`);
    const lines = [...block.matchAll(/^- \[([ x])\] ([A-Z])(\d+) — /gm)];
    if (!lines.length) fail(`item ${row.letter} has no deliverable lines in STATUS.md`);
    const deliverables = read(`docs/roadmap/${row.spec}`).split(/^## /m).find((s) => /^\d+\. Deliverables/.test(s));
    if (!deliverables) fail(`docs/roadmap/${row.spec} has no 'Deliverables' section`);
    let ticked = 0;
    for (const line of lines) {
      const id = line[2] + line[3];
      if (line[2] !== row.letter) fail(`deliverable ${id} is filed under item ${row.letter}`);
      if (ids.has(id)) fail(`duplicate deliverable id ${id}`);
      ids.add(id);
      if (!new RegExp(`^- ${id} — `, "m").test(deliverables)) fail(`deliverable ${id} is not in docs/roadmap/${row.spec}'s Deliverables section`);
      if (line[1] === "x") ticked += 1;
    }
    const consistent = row.status === "shipped" ? ticked === lines.length
      : row.status === "planned" ? ticked === 0
        : ticked > 0 && ticked < lines.length;
    if (!consistent) fail(`item ${row.letter} is '${row.status}' but ${ticked} of ${lines.length} deliverables are ticked`);
  }

  // 3. The version pin: every bundle directory, every manifest, the marketplace
  //    entry and a CHANGELOG heading agree with STATUS.md.
  const versions = readBundleVersions(root);
  const bundles = readdirSync(join(root, "bundles"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
  const pinned = Object.keys(versions).sort();
  if (JSON.stringify(pinned) !== JSON.stringify(bundles)) fail(`STATUS.md pins [${pinned.join(", ")}] but bundles/ holds [${bundles.join(", ")}]`);
  const market = JSON.parse(read(".claude-plugin/marketplace.json"));
  const changelog = read("CHANGELOG.md").split(/^## /m);
  for (const [name, version] of Object.entries(versions)) {
    for (const format of FORMATS) {
      const manifest = JSON.parse(read(`bundles/${name}/${format}/plugin.json`));
      if (manifest.version !== version) fail(`${name}: ${format}/plugin.json says ${manifest.version}, STATUS.md pins ${version}`);
    }
    const entry = market.plugins.find((p) => p.name === name);
    if (!entry) fail(`${name} has no marketplace entry`);
    if (entry.version !== version) fail(`${name}: marketplace says ${entry.version}, STATUS.md pins ${version}`);
    const section = changelog.find((s) => s.startsWith(`${name}\n`) || s.startsWith(`${name}\r\n`));
    if (!section) fail(`CHANGELOG.md has no '## ${name}' section`);
    if (!section.includes(`### [${version}]`)) fail(`CHANGELOG.md section ${name} has no '### [${version}]' entry`);
  }
  return { items: rows.length, deliverables: ids.size, bundles: bundles.length };
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const r = checkRoadmap();
    console.log(`Roadmap passed: ${r.items} items, ${r.deliverables} deliverables, ${r.bundles} bundle versions pinned by STATUS.md and matched by manifests, marketplace and CHANGELOG.`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
