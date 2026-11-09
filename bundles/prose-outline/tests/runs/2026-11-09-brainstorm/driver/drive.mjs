#!/usr/bin/env node
// Harness driver: one skill draw = one `claude -p` session (resumed per turn),
// with an optional simulated writer = a separate stateless `claude -p` per reply
// that sees only the visible conversation and its fixed script.
// Usage: node drive.mjs <config.json>
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const cfg = JSON.parse(readFileSync(process.argv[2], "utf8"));
const out = cfg.outDir;
mkdirSync(out, { recursive: true });
mkdirSync(cfg.cwd, { recursive: true });
const WRITER_CWD = join(out, ".writer-cwd");
mkdirSync(WRITER_CWD, { recursive: true });

const ALLOWED = cfg.allowedTools ?? ["Bash(node:*)", "Bash(mkdir:*)", "Bash(ls:*)", "Bash(cat:*)", "Bash(cp:*)",
  "Bash(wc:*)", "Bash(cd:*)", "Bash(head:*)", "Bash(sha256sum:*)", "Read", "Write", "Edit", "Glob", "Grep", "Skill"];
const DENIED = ["WebFetch", "WebSearch", "Task", "Agent"];

function run(cmd, args, { cwd, env, input, timeoutMs }) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd, env: { ...process.env, ...env }, stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "", stderr = "";
    const t = setTimeout(() => { p.kill("SIGKILL"); stderr += "\n[driver] TIMEOUT"; }, timeoutMs);
    p.stdout.on("data", (d) => { stdout += d; });
    p.stderr.on("data", (d) => { stderr += d; });
    p.on("close", (code) => { clearTimeout(t); resolve({ code, stdout, stderr }); });
    if (input !== undefined) p.stdin.end(input); else p.stdin.end();
  });
}

const conv = []; // {who, text}
const meta = { config: { ...cfg, writerScript: cfg.writerScript ? "(see writer-script.md)" : null }, turns: [], skill_cost_usd: 0, writer_cost_usd: 0, models: {} };
if (cfg.writerScript) writeFileSync(join(out, "writer-script.md"), cfg.writerScript);
let sessionId = null;
let message = cfg.firstMessage;

function convText() {
  return conv.map((c) => `### ${c.who === "writer" ? "Writer (you)" : "Assistant"}\n\n${c.text}\n`).join("\n");
}

for (let turn = 1; turn <= (cfg.maxTurns ?? 1); turn += 1) {
  conv.push({ who: "writer", text: message });
  const args = ["-p", message, "--output-format", "stream-json", "--verbose",
    ...cfg.plugins.flatMap((p) => ["--plugin-dir", p]),
    "--allowedTools", ...ALLOWED, "--disallowedTools", ...DENIED];
  if (sessionId) args.push("--resume", sessionId);
  const started = Date.now();
  const r = await run("claude", args, { cwd: cfg.cwd, env: cfg.env ?? {}, timeoutMs: cfg.turnTimeoutMs ?? 40 * 60 * 1000 });
  appendFileSync(join(out, "session.jsonl"), r.stdout);
  if (r.stderr.trim()) appendFileSync(join(out, "stderr.txt"), `--- turn ${turn}\n${r.stderr}\n`);
  let result = null, model = null;
  for (const line of r.stdout.split("\n")) {
    if (!line.trim()) continue;
    let ev; try { ev = JSON.parse(line); } catch { continue; }
    if (ev.type === "system" && ev.subtype === "init") { sessionId = ev.session_id; model = ev.model; }
    if (ev.type === "result") {
      result = ev;
      meta.skill_cost_usd += ev.total_cost_usd ?? 0;
      for (const [m, u] of Object.entries(ev.modelUsage ?? {})) meta.models[m] = (meta.models[m] ?? 0) + (u.costUSD ?? 0);
    }
  }
  const text = result?.result ?? `[driver] no result (exit ${r.code})`;
  conv.push({ who: "assistant", text });
  meta.turns.push({ turn, exit: r.code, init_model: model, session_id: sessionId, seconds: Math.round((Date.now() - started) / 1000), is_error: result?.is_error ?? null, num_turns: result?.num_turns ?? null, cost_usd: result?.total_cost_usd ?? null });
  writeFileSync(join(out, "conversation.md"), convText());
  writeFileSync(join(out, "meta.json"), JSON.stringify(meta, null, 2));
  if (!result || !cfg.writerScript || turn === (cfg.maxTurns ?? 1)) break;

  // Simulated writer: fresh process, no tools, sees only the visible conversation.
  const sys = `You are role-playing a writer talking to a writing assistant. You are simulated for a test, and you follow a fixed answer script exactly.\n\nRules:\n- Reply only as the writer, briefly (one to three sentences), in plain words.\n- Answer only from the script. Never volunteer opinions, critiques or facts the script does not give you.\n- If the assistant's latest message asks you a question or asks for approval, answer it from the script.\n- If the assistant's latest message asks you nothing, or names a next step for you to take, or the script says the session is over, reply with exactly: [DONE]\n- If it asks something the script does not cover, reply: "No preference — go ahead." unless that would contradict the script.\n- Output only the writer's reply text, nothing else.\n\n## Your script\n\n${cfg.writerScript}`;
  const w = await run("claude", ["-p", "--system-prompt", sys, "--tools", "", "--output-format", "json", "--no-session-persistence"], {
    cwd: WRITER_CWD, env: {}, input: `Here is the conversation so far. Write the writer's next reply.\n\n${convText()}`, timeoutMs: 5 * 60 * 1000,
  });
  let wj = null; try { wj = JSON.parse(w.stdout); } catch { /* */ }
  appendFileSync(join(out, "writer.jsonl"), `${w.stdout.trim()}\n`);
  meta.writer_cost_usd += wj?.total_cost_usd ?? 0;
  const reply = (wj?.result ?? "").trim();
  if (!reply || reply === "[DONE]" || reply.endsWith("[DONE]")) { meta.ended = reply ? "writer-done" : "writer-error"; break; }
  message = reply;
}
meta.ended ??= "max-turns-or-single";
writeFileSync(join(out, "meta.json"), JSON.stringify(meta, null, 2));
// Tool log
const lines = [];
for (const line of readFileSync(join(out, "session.jsonl"), "utf8").split("\n")) {
  if (!line.trim()) continue; let ev; try { ev = JSON.parse(line); } catch { continue; }
  if (ev.type === "system" && ev.subtype === "init") lines.push(`=== session turn (model: ${ev.model})`);
  if (ev.type === "assistant") for (const b of ev.message?.content ?? []) {
    if (b.type === "tool_use") lines.push(`${b.name}: ${b.name === "Bash" ? b.input.command : JSON.stringify(b.input).slice(0, 400)}`);
  }
}
writeFileSync(join(out, "tools.txt"), `${lines.join("\n")}\n`);
console.log(`${out}: ${meta.turns.length} turns, ended=${meta.ended}, skill $${meta.skill_cost_usd.toFixed(2)}, writer $${meta.writer_cost_usd.toFixed(2)}`);
