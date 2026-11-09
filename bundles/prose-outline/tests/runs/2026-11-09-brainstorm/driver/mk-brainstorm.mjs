import { mkdirSync, cpSync, writeFileSync } from "node:fs";
const S = process.argv[2], R = process.argv[3];
for (const [t, name] of [["monologue", "starter"], ["rambling", "walk"]]) for (const k of [1, 2, 3]) {
  const d = `${S}/draws/brainstorm/${t}-d${k}`;
  mkdirSync(`${d}/work`, { recursive: true }); mkdirSync(`${d}/store/projects`, { recursive: true });
  cpSync(`${R}/registry/selected`, `${d}/store/registry`, { recursive: true });
  cpSync(`${R}/transcripts/${t}.txt`, `${d}/work/memo.txt`);
  const writerScript = `You recorded a voice memo (memo.txt) and handed it to the assistant to see what pieces it could become.\n\n- If asked whether to save anything (the brief, the angles, the transcript): "Yes, save it as project ${name}."\n- If asked which writing identity to use: "personal".\n- If asked to choose an angle: "Not yet — I'll decide later."\n- You have nothing else to add. Once the angles have been shown and saved (or the assistant asks you nothing), the session is over.`;
  writeFileSync(`${d}/config.json`, JSON.stringify({ cwd: `${d}/work`, outDir: `${d}/out`, plugins: [`${S}/plugins/prose-outline`],
    env: { PROSE_IDENTITY_DIR: `${d}/store/registry`, PROSE_PROJECTS_DIR: `${d}/store/projects` },
    firstMessage: "/prose-outline:prose-brainstorm memo.txt", writerScript, maxTurns: 4 }, null, 2));
}
