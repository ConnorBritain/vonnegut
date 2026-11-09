#!/usr/bin/env node
/**
 * shape-check — validate shape files.
 *
 *   node shape-check.mjs [shapes-dir | shape.md ...] [--json]
 *
 * With no argument, checks this skill's shipped `shapes/`. A personal shapes
 * directory can be checked the same way before it is passed to the outline
 * skill. Exit 0 when every file validates, 1 otherwise, 2 on usage.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadShape } from "./lib/shape.mjs";

export const SHIPPED = join(dirname(fileURLToPath(import.meta.url)), "..", "shapes");

export function shapeFiles(target = SHIPPED) {
  if (!existsSync(target)) throw new Error(`${target} does not exist`);
  return statSync(target).isDirectory() ? readdirSync(target).filter((f) => f.endsWith(".md")).sort().map((f) => join(target, f)) : [target];
}

export function checkShapes(paths) {
  return paths.map((path) => {
    const r = loadShape(readFileSync(path, "utf8"), basename(path, ".md"));
    return { file: basename(path), ok: !r.errors, ...(r.errors ? { errors: r.errors } : { name: r.shape.name, mode: r.shape.mode, parts: r.shape.parts.length }) };
  });
}

/** Every shipped (or given) shape, parsed, by name. */
export function loadShapes(dir = SHIPPED) {
  const out = new Map();
  for (const path of shapeFiles(dir)) {
    const r = loadShape(readFileSync(path, "utf8"), basename(path, ".md"));
    if (r.shape) out.set(r.shape.name, r.shape);
  }
  return out;
}

function main(argv) {
  const json = argv.includes("--json");
  const targets = argv.filter((a) => a !== "--json");
  if (argv.some((a) => a.startsWith("--") && a !== "--json")) { console.error("Usage: node shape-check.mjs [shapes-dir | shape.md ...] [--json]"); return 2; }
  let results;
  try { results = checkShapes((targets.length ? targets : [SHIPPED]).flatMap((t) => shapeFiles(resolve(t)))); }
  catch (e) { console.error(`shape-check: ${e.message}`); return 2; }
  if (json) process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
  else for (const r of results) process.stdout.write(r.ok ? `  ok   ${r.file} (${r.mode}, ${r.parts} parts)\n` : `  FAIL ${r.file}\n${r.errors.map((e) => `       ${e}`).join("\n")}\n`);
  return results.every((r) => r.ok) ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
