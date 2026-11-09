// render.mjs <out-dir> : write transcript.md (every visible message, tool call and tool
// result, in order; results longer than 80 lines trimmed with a marker) from session.jsonl.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const out = process.argv[2];
const MAX = 80;
const lines = readFileSync(join(out, "session.jsonl"), "utf8").split("\n");
const writer = readFileSync(join(out, "conversation.md"), "utf8").split(/^### /m).filter(Boolean)
  .filter((b) => b.startsWith("Writer")).map((b) => b.replace(/^Writer \(you\)\n\n/, "").trim());
const md = ["# Session transcript", "", "Rendered from the session's stream-json by the harness driver. Tool results longer than",
  `${MAX} lines are trimmed (marked). Scratch paths are shortened: \`<plugins>\` is the plugin copy,`,
  "`<draw>` the draw's directory, `<task>` the session's own scratchpad.", ""];
let turn = 0;
const trim = (t) => { const ls = t.split("\n"); return ls.length > MAX ? `${ls.slice(0, MAX).join("\n")}\n… [${ls.length - MAX} more lines trimmed]` : t; };
for (const line of lines) {
  if (!line.trim()) continue; let ev; try { ev = JSON.parse(line); } catch { continue; }
  if (ev.type === "system" && ev.subtype === "init") {
    md.push(`## Turn ${turn + 1}`, "", `*model reported by init: \`${ev.model}\`*`, "", "**Writer:**", "", (writer[turn] ?? "").split("\n").map((l) => `> ${l}`).join("\n"), "");
    turn += 1;
  }
  if (ev.type === "system" && ev.subtype === "permission_denied") md.push(`*[permission denied by the harness allowlist: ${JSON.stringify(ev.tool_name ?? ev.tool ?? "")}]*`, "");
  if (ev.type === "assistant") for (const b of ev.message?.content ?? []) {
    if (b.type === "text" && b.text.trim()) md.push("**Assistant:**", "", b.text.trim(), "");
    if (b.type === "tool_use") {
      const body = b.name === "Bash" ? b.input.command : b.name === "Write" ? `${b.input.file_path}\n${b.input.content}` : JSON.stringify(b.input, null, 1);
      md.push(`**Tool call — ${b.name}:**`, "", "````", trim(body), "````", "");
    }
  }
  if (ev.type === "user") for (const b of ev.message?.content ?? []) if (b.type === "tool_result") {
    const txt = typeof b.content === "string" ? b.content : (b.content ?? []).map((c) => c.text ?? "").join("");
    md.push(`**Tool result${b.is_error ? " (error)" : ""}:**`, "", "````", trim(txt), "````", "");
  }
  if (ev.type === "result") md.push(`*turn ended: ${ev.subtype}, ${ev.num_turns} model turns, $${(ev.total_cost_usd ?? 0).toFixed(2)}*`, "");
}
writeFileSync(join(out, "transcript.md"), `${md.join("\n")}\n`);
