/**
 * register-suggest — a deterministic guess at register and form, with the reason.
 *
 * Registers are the ones prose-tell-scan ships profiles for (essay, technical,
 * narration, correspondence). Forms are the writer's own vocabulary and only
 * a default is offered. Every suggestion is a guess the writer overrides; the
 * `why` is there so the override is informed.
 */
export const REGISTERS = ["essay", "technical", "narration", "correspondence"];

const SALUTATION = /^(dear|hi|hello|hey)\b[^\n]{0,60}[,:!]?\s*$/im;
const SIGNOFF = /^(best|cheers|thanks|thank you|regards|kind regards|yours|love|warmly|sincerely)[,!.]?\s*$/im;
const CODE = /```|^\s{4}\S|<\/?(code|pre)>|\b(function|const|let|var|import|class|def|return)\b\s*[\w(]/m;
const DIALOGUE = /["“][^"”\n]{3,}["”]\s*,?\s*(he|she|they|I)\s+(said|asked|replied)/i;
const PAST_NARRATIVE = /\b(he|she|they)\s+(walked|looked|turned|said|felt|opened|remembered|stood|sat)\b/gi;

export function suggestRegister({ importer, text, title = null, words = 0 }) {
  const headings = (text.match(/^#{1,6}\s|\n[A-Z][^\n]{0,60}\n[-=]{3,}\n/gm) ?? []).length;
  const paragraphs = text.split(/\n{2,}/).filter(Boolean).length;
  const numbered = (text.match(/^\s*(\d+[.)]|[-*•])\s+/gm) ?? []).length;
  const why = [];
  let register;
  if (importer === "mbox" || (SALUTATION.test(text) && SIGNOFF.test(text))) {
    register = "correspondence"; why.push(importer === "mbox" ? "a message from the mbox" : "opens with a salutation and closes with a sign-off");
  } else if (CODE.test(text) || (headings >= 3 && numbered >= 5)) {
    register = "technical"; why.push(CODE.test(text) ? "contains code" : `${headings} headings and ${numbered} list items`);
  } else if (DIALOGUE.test(text) || (text.match(PAST_NARRATIVE) ?? []).length >= Math.max(3, paragraphs)) {
    register = "narration"; why.push(DIALOGUE.test(text) ? "attributed dialogue" : "third-person past-tense narrative");
  } else {
    register = "essay"; why.push(importer === "substack" ? "a published post" : `${paragraphs} paragraphs of continuous prose`);
  }
  let form;
  if (importer === "substack") form = "newsletter";
  else if (importer === "mbox") form = "email";
  else if (register === "narration") form = words >= 3000 ? "chapter" : "story";
  else if (words < 400) form = "note";
  else if (headings >= 2) form = "article";
  else form = "post";
  if (title) why.push(`titled "${title.slice(0, 40)}${title.length > 40 ? "…" : ""}"`);
  return { register, form, why: why.join("; ") };
}
