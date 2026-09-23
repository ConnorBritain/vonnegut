/**
 * mime — enough of RFC 5322 and RFC 2045 to read a writer's own messages out
 * of an mbox: message splitting on `From ` lines, folded headers, RFC 2047
 * encoded words in headers, multipart bodies, quoted-printable and base64,
 * `text/plain` preferred over `text/html`, and the two things that are never
 * the writer's prose — quoted replies and signatures — stripped.
 *
 * Dependency-free and deliberately conservative: an undecodable part is
 * reported as refused, never guessed at.
 */
import { htmlToText } from "./html-text.mjs";

/** Split an mbox into raw messages. The `From ` separator is at line start, followed by a sender and a date. */
export function splitMbox(text) {
  const lines = text.split(/\r?\n/);
  const messages = [];
  let current = null;
  for (const line of lines) {
    if (/^From \S+ .*\d{4}\s*$/.test(line) || (/^From \S/.test(line) && current === null)) {
      if (current) messages.push(current.join("\n"));
      current = [];
      continue;
    }
    if (current === null) continue; // preamble before the first message
    current.push(line.startsWith(">From ") ? line.slice(1) : line);
  }
  if (current) messages.push(current.join("\n"));
  return messages;
}

export function parseHeaders(raw) {
  const end = raw.search(/\n\n|\n\r\n|^\n/m);
  const head = end === -1 ? raw : raw.slice(0, end);
  const body = end === -1 ? "" : raw.slice(end).replace(/^\n(\r\n)?/, "").replace(/^\n/, "");
  const headers = {};
  for (const line of head.replace(/\r?\n[ \t]+/g, " ").split(/\r?\n/)) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (m) headers[m[1].toLowerCase()] = headers[m[1].toLowerCase()] ? `${headers[m[1].toLowerCase()]}, ${m[2]}` : m[2];
  }
  return { headers, body };
}

/** RFC 2047: =?charset?B|Q?text?= */
export function decodeEncodedWords(s) {
  return s.replace(/=\?([\w-]+)\?([bBqQ])\?([^?]*)\?=/g, (m, charset, enc, text) => {
    try {
      const bytes = enc.toUpperCase() === "B" ? Buffer.from(text, "base64") : Buffer.from(decodeQuotedPrintable(text.replace(/_/g, " "), true), "latin1");
      return new TextDecoder(charset.toLowerCase() === "utf-8" || charset.toLowerCase() === "utf8" ? "utf-8" : charset.toLowerCase()).decode(bytes);
    } catch { return m; }
  }).replace(/\?=\s+=\?/g, "?==?");
}

export function decodeQuotedPrintable(s, header = false) {
  const joined = header ? s : s.replace(/=\r?\n/g, "");
  return joined.replace(/=([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

/** Decode a body to a string per its transfer encoding and charset. Returns null when it cannot. */
export function decodeBody(body, headers) {
  const cte = (headers["content-transfer-encoding"] ?? "7bit").trim().toLowerCase();
  const charset = (headers["content-type"] ?? "").match(/charset="?([\w-]+)"?/i)?.[1]?.toLowerCase() ?? "utf-8";
  let bytes;
  if (cte === "base64") bytes = Buffer.from(body.replace(/\s+/g, ""), "base64");
  else if (cte === "quoted-printable") bytes = Buffer.from(decodeQuotedPrintable(body), "latin1");
  else if (["7bit", "8bit", "binary"].includes(cte)) bytes = Buffer.from(body, charset === "utf-8" ? "utf8" : "latin1");
  else return null;
  try { return new TextDecoder(charset === "utf8" ? "utf-8" : charset).decode(bytes); } catch { return null; }
}

/** Walk a MIME body and return { text, html } for the first text/plain and text/html parts, or a refusal. */
export function extractText(headers, body) {
  const type = (headers["content-type"] ?? "text/plain").split(";")[0].trim().toLowerCase();
  if (type.startsWith("multipart/")) {
    const boundary = headers["content-type"].match(/boundary="?([^";]+)"?/i)?.[1];
    if (!boundary) return { refused: "multipart without a boundary" };
    const parts = body.split(new RegExp(`(?:^|\\r?\\n)--${boundary.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:--)?[ \\t]*(?=\\r?\\n|$)`)).slice(1, -1);
    const found = { text: null, html: null };
    for (const part of parts) {
      const p = parseHeaders(part.replace(/^\r?\n/, ""));
      const r = extractText(p.headers, p.body);
      if (r.text && !found.text) found.text = r.text;
      if (r.html && !found.html) found.html = r.html;
    }
    return found.text || found.html ? found : { refused: "no text part" };
  }
  if (type === "text/plain") { const t = decodeBody(body, headers); return t === null ? { refused: `undecodable ${headers["content-transfer-encoding"]} body` } : { text: t, html: null }; }
  if (type === "text/html") { const t = decodeBody(body, headers); return t === null ? { refused: `undecodable ${headers["content-transfer-encoding"]} body` } : { text: null, html: t }; }
  return { refused: `${type} is not text` };
}

/** Drop quoted replies, the "On … wrote:" line that introduces them, forwarded blocks and the signature. */
export function stripReply(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^-- ?$/.test(line)) break;                                   // signature delimiter
    if (/^-{3,}\s*(Original Message|Forwarded message)/i.test(line)) break;
    if (/^On .{4,200}wrote:\s*$/.test(line) || (/^On .{4,200}$/.test(line) && /wrote:\s*$/.test(lines[i + 1] ?? ""))) break;
    if (/^\s*>/.test(line)) continue;
    out.push(line);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export const addressOf = (header) => (header ?? "").match(/<([^>]+)>/)?.[1]?.toLowerCase() ?? (header ?? "").trim().toLowerCase();

/** Parse one raw message into { headers, subject, from, date, text | refused }. */
export function readMessage(raw) {
  const { headers, body } = parseHeaders(raw);
  const subject = decodeEncodedWords(headers.subject ?? "").trim() || null;
  const from = addressOf(decodeEncodedWords(headers.from ?? ""));
  const date = headers.date ? isoDate(headers.date) : null;
  const r = extractText(headers, body);
  if (r.refused) return { headers, subject, from, date, refused: r.refused };
  const text = r.text ?? htmlToText(r.html);
  return { headers, subject, from, date, text: stripReply(text) };
}

export function isoDate(s) {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}
