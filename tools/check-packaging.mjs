#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { AGENTS, MARKER, renderAgent } from "../install-prose-codex.mjs";
import { readBundleVersions } from "./check-roadmap.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = p => readFileSync(join(root, p), "utf8");
const json = p => JSON.parse(read(p));
// The one version pin is docs/roadmap/STATUS.md; a bump anywhere else fails here.
const expected = readBundleVersions(root);
const market = json(".claude-plugin/marketplace.json");
assert.equal(market.name, "vonnegut");
assert.deepEqual(market.plugins.map(p => p.name).sort(), Object.keys(expected).sort());
assert.deepEqual(readdirSync(join(root, "bundles")).sort(), Object.keys(expected).sort());
assert.ok(!existsSync(join(root, ".github/workflows")), "No GitHub Actions workflows");
const body = s => {
  const match = /^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/.exec(s);
  assert.ok(match, "Expected frontmatter");
  return match[1];
};
const deployed = [];
for (const [name, version] of Object.entries(expected)) {
  const entry = market.plugins.find(p => p.name === name);
  assert.equal(entry.source, `./bundles/${name}`);
  assert.equal(entry.version, version);
  for (const format of [".claude-plugin", ".codex-plugin", ".cursor-plugin", ".plugin"]) {
    const manifest = json(`bundles/${name}/${format}/plugin.json`);
    assert.equal(manifest.name, name);
    assert.equal(manifest.version, version);
    assert.equal(manifest.repository, "https://github.com/ConnorBritain/vonnegut");
    if (Array.isArray(manifest.agents)) for (const p of manifest.agents) assert.ok(existsSync(join(root, "bundles", name, p)), p);
  }
  const dir = join(root, "bundles", name, "agents");
  if (existsSync(dir)) for (const file of readdirSync(dir).filter(f => f.endsWith(".md"))) {
    const agent = file.slice(0, -3);
    assert.equal(body(read(`bundles/${name}/agents/${file}`)), body(read(`primitives/agents/${agent}/agent.md`)), agent);
    deployed.push(agent);
  }
}
assert.deepEqual(deployed.sort(), [...AGENTS].sort());

// Shared library files ship as byte-identical copies, never as cross-bundle imports
// (docs/ROADMAP.md "No cross-bundle import"). The canonical copy is the first path;
// every other copy must match it exactly, so drift is impossible rather than detected late.
const SHARED_FILES = [
  ["bundles/prose-outline/skills/prose-outline/tools/lib/text-index.mjs", "bundles/prose-bible/skills/prose-bible/tools/lib/text-index.mjs"],
  ["bundles/prose-outline/skills/prose-outline/tools/lib/registry-reader.mjs", "bundles/prose-bible/skills/prose-bible/tools/lib/registry-reader.mjs"],
  ["bundles/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs", "bundles/prose-bible/skills/prose-bible/tools/lib/revision-store.mjs", "bundles/prose-research/skills/prose-research/tools/lib/revision-store.mjs"],
  ["bundles/prose-outline/skills/prose-outline/tools/lib/registry-reader.mjs", "bundles/prose-research/skills/prose-research/tools/lib/registry-reader.mjs"],
  ["bundles/prose-author/skills/prose-corpus/tools/lib/html-text.mjs", "bundles/prose-research/skills/prose-research/tools/lib/html-text.mjs"],
];
for (const [canonical, ...copies] of SHARED_FILES) {
  for (const copy of copies) assert.ok(readFileSync(join(root, canonical)).equals(readFileSync(join(root, copy))), `${copy} must be byte-identical to ${canonical}`);
}
assert.match(read("primitives/agents/prose-pattern-critic/meta.yaml"), /ships:\s*false/);

// Check maintained documentation, not frozen run records or historical handoffs.
const documents = [];
function visit(dir) {
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "tests" || entry.name === "node_modules") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (entry.name.endsWith(".md") && !/PROSE-SYSTEM|RELEASE-|CHANGELOG/.test(entry.name)) documents.push(path);
  }
}
visit("");
for (const file of documents) {
  const text = read(file).replace(/^```[^\n]*\n[\s\S]*?^```[^\n]*$/gm, "");
  for (const match of text.matchAll(/\[[^\]\n]+\]\(([^)\n]+)\)/g)) {
    const link = match[1].split("#")[0];
    if (!link || /^[a-z]+:|[<> ]/.test(link)) continue;
    assert.ok(existsSync(resolve(root, dirname(file), decodeURIComponent(link))), `${file}: broken link ${link}`);
  }
}

// Installation ownership: accept an exact legacy generated wrapper, but never a
// modified one. Exercise the CLI with an isolated config directory, not personal files.
const temp = mkdtempSync(join(tmpdir(), "vonnegut-packaging-"));
try {
  const config = join(temp, "codex");
  mkdirSync(join(config, "agents"), { recursive: true });
  const target = join(config, "agents", `${AGENTS[0]}.toml`);
  const legacy = renderAgent(AGENTS[0]).replace(MARKER, "# Generated by agent-primitives/install-prose-codex.mjs.");
  const run = (...args) => execFileSync(process.execPath, [join(root, "install-prose-codex.mjs"), "--agents-only", ...args], {
    env: { ...process.env, CODEX_HOME: config }, encoding: "utf8", stdio: "pipe",
  });
  writeFileSync(target, legacy + "# a user's custom change\n");
  assert.throws(() => run(), /was not generated/);
  assert.equal(readFileSync(target, "utf8"), legacy + "# a user's custom change\n");
  writeFileSync(target, legacy);
  run(); run("--check");
  assert.equal(readFileSync(target, "utf8"), renderAgent(AGENTS[0]));
} finally { rmSync(temp, { recursive: true, force: true }); }
const bundleCount = Object.keys(expected).length;
console.log(`Packaging passed: ${bundleCount} bundles at the STATUS.md-pinned versions, ${bundleCount * 4} manifests, ${deployed.length} identical prompt bodies, ${SHARED_FILES.length} shared files pinned, held primitive excluded, maintained documentation links, no Actions, safe legacy-wrapper migration.`);
