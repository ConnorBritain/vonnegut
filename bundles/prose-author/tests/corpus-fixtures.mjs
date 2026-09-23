#!/usr/bin/env node
/**
 * corpus-fixtures — regenerate or compare the importers' expected manifests.
 *
 *   node tests/corpus-fixtures.mjs            # compare; exit 1 on any difference
 *   node tests/corpus-fixtures.mjs --update   # rewrite fixtures/corpus-imports/expected/*.json
 *
 * Expected files are output, reviewed in the diff, never hand-edited. The
 * absolute `source_root` is replaced by the fixture's name so the files are
 * portable.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const IMPORTS = join(HERE, "fixtures", "corpus-imports");
export const TOOLS = join(HERE, "..", "skills", "prose-corpus", "tools");

export const CASES = [
  { name: "substack", tool: "import-substack.mjs", fn: "importSubstack", root: "substack" },
  { name: "gdocs", tool: "import-gdocs.mjs", fn: "importGdocs", root: "gdocs" },
  { name: "vault", tool: "import-vault.mjs", fn: "importVault", root: "vault", opts: { ignore: ["templates"] } },
  { name: "mbox", tool: "import-mbox.mjs", fn: "importMbox", root: "mbox/writer.mbox", opts: { from: "ana@example.org" } },
];

export async function importCase(c) {
  const m = await import(pathToFileURL(join(TOOLS, c.tool)).href);
  const result = m[c.fn](join(IMPORTS, c.root), c.opts ?? {});
  return { ...result, source_root: `<${c.name}>` };
}

export const render = (r) => `${JSON.stringify(r, null, 2)}\n`;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const update = process.argv.includes("--update");
  let differing = 0;
  for (const c of CASES) {
    const target = join(IMPORTS, "expected", `${c.name}.json`);
    const actual = render(await importCase(c));
    if (update) { writeFileSync(target, actual); console.log(`  wrote ${c.name}.json`); continue; }
    if (existsSync(target) && readFileSync(target, "utf8") === actual) console.log(`  ok   ${c.name}`);
    else { differing += 1; console.log(`  DIFF ${c.name} — rerun with --update and review the diff`); }
  }
  process.exit(differing ? 1 : 0);
}
