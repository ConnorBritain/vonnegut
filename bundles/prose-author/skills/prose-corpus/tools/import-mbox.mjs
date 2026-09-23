#!/usr/bin/env node
/**
 * import-mbox — candidates from an mbox, one per message the writer sent.
 *
 *   node import-mbox.mjs <file.mbox> --from writer@example.org [--json]
 *
 * `--from` is required. Which address is the writer is exactly the inference
 * this repo refuses to make; messages from any other address are refused by
 * name, and a message with no decodable text part is refused with the reason.
 * Quoted replies, "On … wrote:" introductions and signatures are stripped so
 * only the writer's own words are counted. Nothing is written.
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";
import { candidate, manifest, runImporter } from "./lib/manifest.mjs";
import { readMessage, splitMbox } from "./lib/mime.mjs";

export function importMbox(file, { from }) {
  if (!from || !/^[^\s@]+@[^\s@]+$/.test(from)) throw new Error("--from <address> is required: the importer never guesses which address is the writer");
  const wanted = from.toLowerCase();
  const raw = readFileSync(file, "utf8");
  const messages = splitMbox(raw);
  if (!messages.length) throw new Error(`${basename(file)} has no 'From ' separators; is it an mbox?`);
  const candidates = [], refused = [];
  let n = 0;
  messages.forEach((m, i) => {
    const msg = readMessage(m);
    const path = `message ${i + 1}${msg.headers["message-id"] ? ` ${msg.headers["message-id"]}` : ""}`;
    if (msg.from !== wanted) { refused.push({ path, why: `from ${msg.from || "an unknown sender"}, not ${wanted}` }); return; }
    if (msg.refused) { refused.push({ path, why: msg.refused }); return; }
    if (!msg.text.trim()) { refused.push({ path, why: "nothing left after stripping quoted text and signature" }); return; }
    candidates.push(candidate({ n: ++n, title: msg.subject, date: msg.date, text: msg.text, path, importer: "mbox" }));
  });
  return manifest({ importer: "mbox", source_root: file, candidates, refused, limits: ["Reply stripping is line-based: a quote without '>' markers or an unusual introduction line survives as the writer's text.", "Attachments are never read."] });
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runImporter({ name: "import-mbox", usage: "Usage: node import-mbox.mjs <file.mbox> --from <address> [--json]", flagsWithValue: ["--from"], run: (root, flags, stat) => {
    if (!stat.isFile()) throw new Error(`${basename(root)} is not a file; give the mbox`);
    return importMbox(root, { from: flags.get("--from") });
  } });
}
