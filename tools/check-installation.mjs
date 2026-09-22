#!/usr/bin/env node
// Opt-in local packaging smoke test. Requires installed Codex and Claude CLIs,
// but makes no model calls and never changes their personal configurations.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { AGENTS, verifyDeployment } from "../install-prose-codex.mjs";
import { readBundleVersions } from "./check-roadmap.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Every bundle STATUS.md pins is installed and checked; the list is never retyped here.
const BUNDLES = Object.keys(readBundleVersions(root)).sort();
const SKILLS = [["prose-author", "prose-draft"], ["prose-author", "prose-style-tune"], ["prose-author", "prose-corpus"], ["prose-tell-scan", "tell-scan"], ["prose-outline", "prose-outline"], ["prose-bible", "prose-bible"]];
const temp = mkdtempSync(join(tmpdir(), "vonnegut-install-"));
const run = (file, args, env, cwd = temp) => execFileSync(file, args, {
  env: { ...process.env, ...env }, cwd, encoding: "utf8", stdio: "pipe",
  timeout: 60000, killSignal: "SIGKILL", maxBuffer: 8 * 1024 * 1024,
});
try {
  const codex = join(temp, "codex"), claude = join(temp, "claude");
  mkdirSync(codex); mkdirSync(claude);
  const env = { CODEX_HOME: codex, CLAUDE_CONFIG_DIR: claude, PROSE_IDENTITY_DIR: join(temp, "identities") };
  console.log("Installing Codex into an isolated configuration...");
  run(process.execPath, [join(root, "install-prose-codex.mjs")], env);
  run(process.execPath, [join(root, "install-prose-codex.mjs"), "--check"], env);
  console.log("Installing Claude into an isolated configuration...");
  run("claude", ["plugin", "marketplace", "add", root], env);
  for (const name of BUNDLES) {
    run("claude", ["plugin", "install", `${name}@vonnegut`, "--scope", "user"], env);
  }
  const listing = JSON.parse(run("claude", ["plugin", "list", "--json"], env));
  for (const name of BUNDLES) {
    const entry = listing.find(e => e.id === `${name}@vonnegut`);
    assert.ok(entry?.enabled && !entry.errors?.length, `${name}: Claude enabled`);
    verifyDeployment(join(root, "bundles", name), entry.installPath);
  }
  for (const [harness, config] of [["codex", codex], ["claude", claude]]) {
    const tools = join(config, "plugins/cache/vonnegut/prose-author/0.6.0/skills/prose-draft/tools");
    const { installedCompanions } = await import(pathToFileURL(join(tools, "installed-dependencies.mjs")));
    assert.deepEqual(Object.keys(installedCompanions(tools, { harness }, { env: { ...process.env, ...env } })).sort(), ["prose-review", "prose-tell-scan"]);
    const output = run(process.execPath, [join(tools, "prose-runtime.mjs"), "identity", "locate"], env);
    assert.ok(output.includes(env.PROSE_IDENTITY_DIR), `${harness}: shared registry override`);
  }
  if (process.platform !== "win32") {
    console.log("Checking project-scoped loose-file installation...");
    run("bash", [join(root, "install.sh"), "--project"], env);
    for (const name of AGENTS) assert.ok(existsSync(join(temp, ".claude/agents", `${name}.md`)));
    for (const [bundle, skill] of SKILLS) {
      assert.equal(readFileSync(join(temp, ".claude/skills", skill, "SKILL.md"), "utf8"), readFileSync(join(root, "bundles", bundle, "skills", skill, "SKILL.md"), "utf8"));
    }
    assert.ok(existsSync(join(temp, ".claude/tools/fidelity-scan.mjs")));
  } else console.log("Bash loose-file path not evaluated on Windows; exercise install.ps1 separately.");
  console.log("Installation passed: isolated Codex and Claude plugins, exact production bytes, companion discovery, shared-registry resolution; no model calls or personal configuration changes.");
} finally { rmSync(temp, { recursive: true, force: true }); }
