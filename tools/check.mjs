#!/usr/bin/env node
// Local engineering verification; never dispatches models or configures CI.
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
if (args.some(a => a !== "--mutations")) {
  console.error("Usage: node tools/check.mjs [--mutations]");
  process.exit(2);
}
const checks = [
  ["tools/check-roadmap.mjs"],
  ["tools/check-roadmap-test.mjs"],
  ["tools/check-packaging.mjs"],
  ["bundles/prose-tell-scan/tests/selftest.mjs"],
  ["bundles/prose-tell-scan/tests/acceptance.mjs"],
  ["bundles/prose-outline/tests/selftest.mjs"],
  ["bundles/prose-bible/tests/selftest.mjs"],
  ["bundles/prose-author/tests/selftest.mjs"],
  ["bundles/prose-review/tests/selftest.mjs"],
  ["bundles/prose-review/tests/run-harness-test.mjs"],
  ["bundles/prose-review/tests/revise-harness-test.mjs"],
];
for (const run of ["2026-08-04-b", "2026-08-05-fidelity", "2026-08-05-fidelity-s4", "2026-08-05-voice-cross-author"]) {
  const path = `bundles/prose-review/tests/runs/${run}`;
  checks.push(["bundles/prose-review/tests/run-harness.mjs", "check", path]);
  checks.push(["bundles/prose-review/tests/verify-run.mjs", path]);
}
checks.push(["bundles/prose-author/tests/concurrency.mjs"]);
if (args.includes("--mutations")) checks.push(["bundles/prose-author/tests/mutations.mjs"]);
for (const command of checks) {
  console.log(`\n> node ${command.join(" ")}`);
  const result = spawnSync(process.execPath, command, { cwd: root, stdio: "inherit" });
  if (result.error || result.status !== 0) {
    console.error(result.error?.message ?? `Check failed (${result.signal ?? result.status})`);
    process.exit(result.status || 1);
  }
}
console.log(`\nAll ${checks.length} local commands passed. No model generation or GitHub Actions used.`);
