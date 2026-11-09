import { mkdirSync, cpSync, writeFileSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const S = process.argv[2], V = "<repo>";
const RO = `${V}/bundles/prose-outline/tests/fixtures`, RA = `${V}/bundles/prose-author/tests/fixtures/outline-handoff`;
const done = JSON.parse(readFileSync(`${RO}/briefs-interview/done.json`, "utf8"));
const narrow = structuredClone(done); narrow.decisions.length.value = { unit: "words", min: 200, max: 300 };
for (const [t, brief] of [["done", done], ["narrow", narrow]]) for (const k of [1, 2, 3]) {
  const d = `${S}/draws/candidates/${t}-d${k}`;
  mkdirSync(`${d}/work`, { recursive: true }); mkdirSync(`${d}/store/projects`, { recursive: true });
  cpSync(`${RO}/registry/selected`, `${d}/store/registry`, { recursive: true });
  writeFileSync(`${d}/work/brief.json`, `${JSON.stringify(brief, null, 2)}\n`);
  const writerScript = `You have a project brief (brief.json) for a piece and asked the assistant for candidate outlines.\n\n- If asked to pick a candidate (or which outline you want): pick the FIRST candidate the assistant showed, naming it by its shape or title.\n- If asked whether to save the one you picked: "Yes, save it as project starter."\n- If asked which writing identity to use: "personal".\n- If asked to adjust anything else: "No, it's fine as it is."\n- You have nothing else to add. Once your pick is saved (or the assistant asks you nothing), the session is over.`;
  writeFileSync(`${d}/config.json`, JSON.stringify({ cwd: `${d}/work`, outDir: `${d}/out`, plugins: [`${S}/plugins/prose-outline`],
    env: { PROSE_IDENTITY_DIR: `${d}/store/registry`, PROSE_PROJECTS_DIR: `${d}/store/projects` },
    firstMessage: "/prose-outline:prose-outline Here's my project brief: brief.json. Show me two or three candidate outlines in different shapes so I can pick one.", writerScript, maxTurns: 4 }, null, 2));
}
const P = `${S}/plugins/prose-author/skills/prose-draft/tools/prose-runtime.mjs`;
for (const [t, outline] of [["approved", "outline.json"], ["open", "outline-open.json"]]) for (const k of [1, 2, 3]) {
  const d = `${S}/draws/draft/${t}-d${k}`;
  mkdirSync(`${d}/work`, { recursive: true });
  cpSync(`${RO}/registry/selected`, `${d}/store/registry`, { recursive: true });
  execFileSync("node", [P, "preferences", "init", "--store", `${d}/store/preferences`, "--id", "personal"], { stdio: "ignore" });
  writeFileSync(`${d}/store/identity.json`, JSON.stringify({ id: "personal", samples_dir: null, profile_file: null, preference_store: `${d}/store/preferences`, history_directory: null, history_identity: null }));
  writeFileSync(`${d}/store/identity-register.txt`, execFileSync("node", [P, "identity", "register", "--config", `${d}/store/identity.json`, "--revision", "2"], { env: { ...process.env, PROSE_IDENTITY_DIR: `${d}/store/registry` }, encoding: "utf8" }));
  cpSync(`${RA}/${outline}`, `${d}/work/outline.json`); cpSync(`${RA}/brief.json`, `${d}/work/brief.json`);
  const writerScript = `You have an approved outline (outline.json) and a project brief (brief.json) and asked the assistant to draft the piece from them.\n\n- If asked whether to go ahead and draft: "Yes, go ahead."\n- If asked which writing identity to use: "personal, the default."\n- If asked whether to carry open questions forward unresolved (allow open questions): "No. Don't draft around them; I'll fix the outline first."\n- If asked to edit the outline or the job yourself: "No, leave them as they are."\n- If asked about running a review afterwards: "Not now."\n- You have nothing else to add. Once a draft is delivered, or the assistant reports it cannot draft and asks you nothing, the session is over.`;
  writeFileSync(`${d}/config.json`, JSON.stringify({ cwd: `${d}/work`, outDir: `${d}/out`, plugins: [`${S}/plugins/prose-author`],
    env: { PROSE_IDENTITY_DIR: `${d}/store/registry`, PROSE_PROJECTS_DIR: `${d}/store/projects` },
    firstMessage: "/prose-author:prose-draft Draft the piece from my approved outline. The outline export is outline.json and the brief is brief.json, both in this directory.", writerScript, maxTurns: 4 }, null, 2));
}
