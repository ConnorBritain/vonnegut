#!/usr/bin/env node
/**
 * prose-outline selftest.
 *
 *   node bundles/prose-outline/tests/selftest.mjs
 *
 * Grows one deliverable at a time (docs/roadmap/A-prose-outline.md). Every
 * case builds its scratch state under the OS temp directory and touches
 * nothing in the repo. No model is dispatched.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(HERE, "..");
const SKILL = join(BUNDLE, "skills", "prose-outline");

let passed = 0;
let failed = 0;
const failures = [];
function check(name, condition, detail = "") {
  if (condition) {
    passed += 1;
    process.stdout.write(`  ok   ${name}\n`);
  } else {
    failed += 1;
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    process.stdout.write(`  FAIL ${name}${detail ? ` — ${detail}` : ""}\n`);
  }
}
const group = (title) => process.stdout.write(`\n${title}\n`);

/* ------------------------------------------------------------------ */
group("Packaging — a skill-only bundle, four manifests that agree");
{
  const manifests = [".claude-plugin", ".codex-plugin", ".cursor-plugin", ".plugin"]
    .map((f) => JSON.parse(readFileSync(join(BUNDLE, f, "plugin.json"), "utf8")));
  check("all four manifests name prose-outline", manifests.every((m) => m.name === "prose-outline"));
  check("all four manifests carry one version", new Set(manifests.map((m) => m.version)).size === 1);
  check("no manifest declares agents — declaring replaces discovery, and this bundle ships none",
    manifests.every((m) => !("agents" in m)));
  check("the cursor manifest points skill discovery at skills/", manifests[2].skills === "skills");
  check("no description claims a verdict, a score or authorship",
    manifests.every((m) => !/detect|verdict|score|who wrote|authorship/i.test(m.description) || /never/.test(m.description)));
}

/* ------------------------------------------------------------------ */
group("Skill directory — present once A7 lands; until then, absent and said so");
{
  const skill = existsSync(join(SKILL, "SKILL.md"));
  process.stdout.write(`  note ${skill ? "SKILL.md present" : "SKILL.md not yet written (deliverable A7)"}\n`);
  if (skill) {
    const text = readFileSync(join(SKILL, "SKILL.md"), "utf8");
    check("SKILL.md references its tools by relative path, never ${CLAUDE_PLUGIN_ROOT}", !text.includes("CLAUDE_PLUGIN_ROOT"));
  }
}

process.stdout.write(`\n${"─".repeat(60)}\n`);
process.stdout.write(`${passed} passed, ${failed} failed\n`);
if (failed) process.stdout.write(`\nFailures:\n${failures.map((f) => `  - ${f}`).join("\n")}\n`);
process.exit(failed ? 1 : 0);
