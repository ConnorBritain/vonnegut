#!/usr/bin/env node
/**
 * import-gdocs — candidates from a Google Docs export folder (Takeout or
 * File → Download, one document per file).
 *
 *   node import-gdocs.mjs <folder> [--json]
 *
 * Reads `.html`, `.txt` and `.md`. A `.docx` is refused with the instruction
 * to export as HTML or plain text; this repo carries no zip or OOXML reader
 * (docs/roadmap/D-corpus-ingestion.md §9). Dates: a Takeout `.json` sidecar's
 * `modifiedTime`/`createdTime` when present, else null — never the file's
 * mtime, which is when it was downloaded. Nothing is written.
 */
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { htmlToText, htmlTitle } from "./lib/html-text.mjs";
import { candidate, manifest, runImporter } from "./lib/manifest.mjs";
import { isoDate, stripFrontmatter } from "./lib/provenance.mjs";

const TEXT = new Set([".html", ".htm", ".txt", ".md", ".markdown"]);

export function importGdocs(root) {
  const entries = readdirSync(root, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name).sort();
  const candidates = [], refused = [];
  let n = 0;
  for (const file of entries) {
    const ext = extname(file).toLowerCase();
    if (ext === ".json") continue; // sidecars
    if (ext === ".docx" || ext === ".odt" || ext === ".rtf" || ext === ".pdf") { refused.push({ path: file, why: `${ext} is not read here; export the document as HTML or plain text (File → Download → Web page / Plain text)` }); continue; }
    if (!TEXT.has(ext)) { refused.push({ path: file, why: "not a text export" }); continue; }
    const raw = readFileSync(join(root, file), "utf8");
    const html = ext === ".html" || ext === ".htm";
    const text = html ? htmlToText(raw) : stripFrontmatter(raw).trim();
    if (!text.trim()) { refused.push({ path: file, why: "empty" }); continue; }
    const stem = file.slice(0, -ext.length);
    const sidecar = [`${file}.json`, `${stem}.json`].map((s) => join(root, s)).find((p) => existsSync(p));
    let date = null;
    if (sidecar) { try { const meta = JSON.parse(readFileSync(sidecar, "utf8")); date = isoDate(meta.modifiedTime ?? meta.createdTime ?? meta.modified_time ?? null); } catch { /* an unreadable sidecar is no date */ } }
    const title = (html ? htmlTitle(raw) : null) ?? stem.replace(/[-_]+/g, " ").trim();
    candidates.push(candidate({ n: ++n, title, date, text, path: file, importer: "gdocs" }));
  }
  return manifest({ importer: "gdocs", source_root: root, candidates, refused, limits: ["Google's HTML export carries the document's styling as inline CSS; only text survives. Comments and suggestions are not exported and not read."] });
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runImporter({ name: "import-gdocs", usage: "Usage: node import-gdocs.mjs <folder> [--json]", run: (root, flags, stat) => {
    if (!stat.isDirectory()) throw new Error(`${basename(root)} is not a directory; give the export folder`);
    return importGdocs(root);
  } });
}
