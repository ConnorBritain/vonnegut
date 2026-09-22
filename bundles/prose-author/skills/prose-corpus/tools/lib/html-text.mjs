/**
 * html-text — dependency-free HTML to plain text for corpus import.
 *
 * Block elements become paragraph breaks, <br> a line break, scripts, styles,
 * head, nav and comments are dropped, entities are decoded, whitespace is
 * collapsed inside a paragraph. It is a heuristic: a table becomes lines, an
 * image its alt text or nothing, and nothing here is a browser.
 */
const DROP = /<(script|style|head|nav|noscript|template|svg|iframe)\b[\s\S]*?<\/\1\s*>/gi;
const BLOCK = /<\/?(?:p|div|h[1-6]|li|ul|ol|blockquote|pre|section|article|header|footer|figure|figcaption|table|tr|hr|dd|dt|dl)\b[^>]*>/gi;
const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", hellip: "…", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", copy: "©", laquo: "«", raquo: "»", middot: "·", bull: "•", eacute: "é", egrave: "è", agrave: "à", ccedil: "ç", ouml: "ö", uuml: "ü", auml: "ä", ntilde: "ñ" };

export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : m;
    }
    return NAMED[code.toLowerCase()] ?? m;
  });
}

export function htmlToText(html) {
  let s = html.replace(/<!--[\s\S]*?-->/g, "").replace(DROP, "");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<img\b[^>]*\balt=["']([^"']*)["'][^>]*>/gi, "$1");
  s = s.replace(BLOCK, "\n\n");
  s = s.replace(/<[^>]+>/g, "");
  s = decodeEntities(s);
  return s.split(/\n{2,}/).map((p) => p.replace(/[ \t\r]+/g, " ").replace(/ ?\n ?/g, "\n").trim()).filter(Boolean).join("\n\n");
}

/** The <title> of a document, decoded, or null. */
export function htmlTitle(html) {
  const m = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) ?? html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? decodeEntities(m[1].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim() || null : null;
}
