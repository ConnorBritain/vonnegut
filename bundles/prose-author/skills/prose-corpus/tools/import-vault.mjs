#!/usr/bin/env node
/**
 * import-vault — candidates from a Markdown vault (Obsidian, Logseq, a folder
 * of notes).
 *
 *   node import-vault.mjs <vault-dir> [--ignore templates,daily] [--json]
 *
 * Recursive; `.obsidian`, `.git`, `.trash`, `node_modules` and any `--ignore`
 * top-level names are skipped. Frontmatter is read for `title`, `date` or
 * `created`, and `tags`, then stripped from the text. Wiki links `[[Note|alias]]`
 * become their alias, embeds `![[…]]` are dropped. A note that is only a list
 * of links is refused as an index page. Nothing is written.
 */
import { existsSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { candidate, manifest, runImporter } from "./lib/manifest.mjs";
import { isoDate } from "./lib/provenance.mjs";

const SKIP = new Set([".obsidian", ".git", ".trash", "node_modules", ".logseq"]);

export function readNoteFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fields: {}, body: raw };
  const fields = {};
  for (const line of m[1].split(/\r?\n/)) { const f = line.match(/^([\w-]+)\s*:\s*(.*)$/); if (f) fields[f[1].toLowerCase()] = f[2].trim().replace(/^["']|["']$/g, ""); }
  return { fields, body: raw.slice(m[0].length) };
}

export function noteText(body) {
  return body
    .replace(/!\[\[[^\]]*\]\]/g, "")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/^%%[\s\S]*?%%$/gm, "")
    .trim();
}

export function importVault(root, { ignore = [] } = {}) {
  const candidates = [], refused = [];
  const files = [];
  const walk = (dir, depth) => {
    for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.name.startsWith(".") || SKIP.has(e.name) || (depth === 0 && ignore.includes(e.name))) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p, depth + 1);
      else if ([".md", ".markdown"].includes(extname(e.name).toLowerCase())) files.push(p);
    }
  };
  walk(root, 0);
  let n = 0;
  for (const file of files) {
    const rel = relative(root, file);
    const { fields, body } = readNoteFrontmatter(readFileSync(file, "utf8"));
    const text = noteText(body);
    const lines = text.split("\n").filter((l) => l.trim());
    if (!text) { refused.push({ path: rel, why: "empty note" }); continue; }
    if (lines.length >= 3 && lines.every((l) => /^\s*[-*]\s*\[?\[?/.test(l) || /^#/.test(l))) { refused.push({ path: rel, why: "an index of links, not prose" }); continue; }
    const title = fields.title ?? (text.match(/^#\s+(.+)$/m)?.[1] ?? basename(file, extname(file)));
    const date = isoDate(fields.date ?? fields.created ?? fields.published ?? null);
    const c = candidate({ n: ++n, title, date, text, path: rel, importer: "vault" });
    if (fields.tags) c.suggested.why += `; tagged ${fields.tags.replace(/^\[|\]$/g, "")}`;
    candidates.push(c);
  }
  return manifest({ importer: "vault", source_root: root, candidates, refused, limits: ["Daily notes and templates are prose to this importer unless ignored by name; the writer decides what a note is."] });
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runImporter({ name: "import-vault", usage: "Usage: node import-vault.mjs <vault-dir> [--ignore a,b] [--json]", flagsWithValue: ["--ignore"], run: (root, flags, stat) => {
    if (!stat.isDirectory()) throw new Error(`${basename(root)} is not a directory; give the vault folder`);
    return importVault(root, { ignore: (flags.get("--ignore") ?? "").split(",").filter(Boolean) });
  } });
}
