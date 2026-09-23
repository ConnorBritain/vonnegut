#!/usr/bin/env node
/**
 * import-substack — candidates from a Substack export folder.
 *
 *   node import-substack.mjs <export-dir> [--json]
 *
 * The export holds `posts.csv` (post_id, post_date, is_published, title,
 * subtitle, …) and `posts/<post_id>.<slug>.html`. Titles and dates come from
 * the CSV; bodies from the HTML. Unpublished posts are still candidates — a
 * draft is the writer's prose too — and say so in `why`. Nothing is written.
 */
import { existsSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { htmlToText, htmlTitle } from "./lib/html-text.mjs";
import { candidate, manifest, runImporter } from "./lib/manifest.mjs";
import { isoDate } from "./lib/provenance.mjs";

/** A small CSV reader: quoted fields, doubled quotes, newlines inside quotes. */
export function parseCsv(text) {
  const rows = []; let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(field); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.length > 1 || r[0] !== "");
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), r[i] ?? ""])));
}

export function importSubstack(root) {
  const csvPath = join(root, "posts.csv");
  if (!existsSync(csvPath)) throw new Error("not a Substack export: posts.csv is missing (export from Settings → Exports and unzip the folder)");
  const postsDir = join(root, "posts");
  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  const files = existsSync(postsDir) ? readdirSync(postsDir).filter((f) => f.endsWith(".html")).sort() : [];
  const candidates = [], refused = [];
  const byId = new Map(rows.map((r) => [r.post_id, r]));
  let n = 0;
  for (const file of files) {
    const id = file.split(".")[0];
    const meta = byId.get(id);
    const html = readFileSync(join(postsDir, file), "utf8");
    const text = htmlToText(html);
    if (!text.trim()) { refused.push({ path: `posts/${file}`, why: "no text after HTML conversion" }); continue; }
    const c = candidate({ n: ++n, title: meta?.title || htmlTitle(html), date: isoDate(meta?.post_date), text, path: `posts/${file}`, importer: "substack" });
    if (meta && /^(false|0|no)$/i.test(meta.is_published ?? "")) c.suggested.why += "; unpublished draft in the export";
    if (!meta) c.suggested.why += "; not listed in posts.csv (no date)";
    candidates.push(c);
  }
  for (const r of rows) if (!files.some((f) => f.startsWith(`${r.post_id}.`))) refused.push({ path: `posts/${r.post_id}.*.html`, why: "listed in posts.csv but no HTML file" });
  return manifest({ importer: "substack", source_root: root, candidates, refused, limits: ["Subtitles are not part of the body; the CSV's is_published flag is reported, not acted on."] });
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runImporter({ name: "import-substack", usage: "Usage: node import-substack.mjs <export-dir> [--json]", run: (root, flags, stat) => {
    if (!stat.isDirectory()) throw new Error(`${basename(root)} is not a directory; give the unzipped export folder`);
    return importSubstack(root);
  } });
}
