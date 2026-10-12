import { articlePath, type Article } from "./article";

export function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] as string);
}

/** Collapses whitespace/newlines so one-line formats (llms.txt) stay one line. */
export function oneLine(s: string, max = 200): string {
  return s.replace(/\s+/g, " ").trim().slice(0, max);
}

export function indexable(a: Article): boolean {
  return a.status === "published" && !a.seo.noindex;
}

export { articlePath };
