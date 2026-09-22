#!/usr/bin/env node
/**
 * source-intake — take one source in and propose a dossier source entry.
 *
 *   node source-intake.mjs <url | file | file.pdf> [--kind url|file|pdf|notes] [--title T] [--timeout MS] [--json]
 *
 * A URL is fetched with Node's built-in fetch (`file://` reads the file, which
 * is how fixtures stand in for the network); HTML becomes text through the
 * same dependency-free converter prose-author's corpus importer uses; a PDF
 * goes through `pdftotext` when it is on PATH and is otherwise refused with
 * "supply a text export". The proposal carries the text, its sha256 and the
 * retrieval instant. Nothing is written: `research-store.mjs add-source`
 * writes it, and only with --approved.
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { htmlToText, htmlTitle } from "./lib/html-text.mjs";

export const INTAKE_SCHEMA = "source-intake/1";
export const sha256 = (text) => createHash("sha256").update(text, "utf8").digest("hex");

export class IntakeRefusal extends Error { constructor(message, code = 1) { super(message); this.code = code; } }

const isUrl = (s) => /^(https?|file):\/\//i.test(s);

export function guessKind(locator) {
  if (isUrl(locator)) return locator.toLowerCase().startsWith("file://") && /\.pdf$/i.test(locator) ? "pdf" : "url";
  return /\.pdf$/i.test(locator) ? "pdf" : "file";
}

export function pdfToText(path) {
  const which = spawnSync(process.platform === "win32" ? "where" : "which", ["pdftotext"], { encoding: "utf8" });
  if (which.status !== 0) throw new IntakeRefusal("PDF text extraction is not reimplemented here: install pdftotext (poppler) or supply a text export of the PDF", 3);
  const r = spawnSync("pdftotext", ["-layout", "-enc", "UTF-8", path, "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new IntakeRefusal(`pdftotext failed: ${(r.stderr || "").trim() || `exit ${r.status}`}`, 1);
  return r.stdout;
}

async function fetchUrl(locator, timeout) {
  if (locator.toLowerCase().startsWith("file://")) {
    const path = fileURLToPath(locator);
    if (!existsSync(path)) throw new IntakeRefusal(`not found: ${path}`, 1);
    const raw = readFileSync(path, "utf8");
    return { raw, contentType: /\.html?$/i.test(path) ? "text/html" : "text/plain", status: 200 };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(locator, { signal: controller.signal, redirect: "follow", headers: { "user-agent": "prose-research/0.1 (source intake)" } });
    if (!res.ok) throw new IntakeRefusal(`${locator} answered ${res.status}`, 1);
    const contentType = (res.headers.get("content-type") ?? "").toLowerCase();
    if (contentType.includes("application/pdf")) throw new IntakeRefusal("the URL is a PDF; download it and pass the file", 3);
    return { raw: await res.text(), contentType, status: res.status };
  } catch (e) {
    if (e instanceof IntakeRefusal) throw e;
    throw new IntakeRefusal(`could not fetch ${locator}: ${e.name === "AbortError" ? `timed out after ${timeout} ms` : e.message}`, 1);
  } finally { clearTimeout(timer); }
}

export async function intake(locator, { kind = null, title = null, timeout = 15000, now = new Date() } = {}) {
  const k = kind ?? guessKind(locator);
  let text, foundTitle = null;
  if (k === "url") {
    const { raw, contentType } = await fetchUrl(locator, timeout);
    const html = contentType.includes("html") || /^\s*<(!doctype|html)/i.test(raw);
    text = html ? htmlToText(raw) : raw;
    foundTitle = html ? htmlTitle(raw) : null;
  } else if (k === "pdf") {
    const path = locator.toLowerCase().startsWith("file://") ? fileURLToPath(locator) : resolve(locator);
    if (!existsSync(path)) throw new IntakeRefusal(`not found: ${path}`, 1);
    text = pdfToText(path);
  } else if (k === "file" || k === "notes") {
    const path = resolve(locator);
    if (!existsSync(path)) throw new IntakeRefusal(`not found: ${path}`, 1);
    const raw = readFileSync(path, "utf8");
    const html = /\.html?$/i.test(path);
    text = html ? htmlToText(raw) : raw;
    foundTitle = html ? htmlTitle(raw) : null;
  } else throw new IntakeRefusal(`unknown kind ${kind}`, 2);
  if (!text.trim()) throw new IntakeRefusal("the source has no text", 1);
  return {
    schema: INTAKE_SCHEMA,
    source: { id: null, kind: k, locator: k === "url" ? locator : (locator.toLowerCase().startsWith("file://") ? locator : pathToFileURL(resolve(locator)).href), retrieved_at: now.toISOString(), sha256: sha256(text), text_file: `${sha256(text)}.txt`, title: title ?? foundTitle ?? (k === "url" ? null : basename(locator, extname(locator))) },
    text,
    words: (text.match(/\b[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*\b/gu) ?? []).length,
    receipt: "A proposal. Nothing is stored until research-store add-source runs with --approved.",
    limits: ["HTML becomes text heuristically: tables flatten, dynamic pages fetch as their shell, paywalls fetch as the paywall.", "The text is what the source said at retrieved_at; the sha256 pins it."],
  };
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const flags = new Map(); const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--json") flags.set("--json", true);
    else if (["--kind", "--title", "--timeout"].includes(args[i]) && args[i + 1] !== undefined) flags.set(args[i], args[++i]);
    else if (args[i].startsWith("--")) { process.stderr.write("Usage: node source-intake.mjs <url | file | file.pdf> [--kind url|file|pdf|notes] [--title T] [--timeout MS] [--json]\n"); process.exit(2); }
    else positional.push(args[i]);
  }
  if (positional.length !== 1) { process.stderr.write("Usage: node source-intake.mjs <url | file | file.pdf> [--kind url|file|pdf|notes] [--title T] [--timeout MS] [--json]\n"); process.exit(2); }
  intake(positional[0], { kind: flags.get("--kind") ?? null, title: flags.get("--title") ?? null, timeout: Number(flags.get("--timeout") ?? 15000) })
    .then((r) => {
      if (flags.get("--json")) process.stdout.write(`${JSON.stringify(r, null, 2)}\n`);
      else process.stdout.write(`source-intake — ${r.source.kind} ${r.source.locator}\n  title: ${r.source.title ?? "(none)"}\n  words: ${r.words}\n  sha256: ${r.source.sha256}\n  ${r.receipt}\n`);
    })
    .catch((e) => { process.stderr.write(`source-intake: ${e.message}\n`); process.exit(e.code ?? 1); });
}
