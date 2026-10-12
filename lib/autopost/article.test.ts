import assert from "node:assert/strict";
import { test } from "node:test";

import { articlePath, parseSppBody } from "./article.ts";

const PNG_1PX = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const base = { spp: 1, action: "upsert", external_id: "t:a", slug: "grab-food-promo", title: "หัวข้อ", body_markdown: "## เนื้อหา" };
const parse = (o: object) => parseSppBody(JSON.stringify(o));

test("valid minimal upsert gets defaults", () => {
  const r = parse(base);
  assert.ok("action" in r && r.action === "upsert");
  if (r.action !== "upsert") return;
  assert.equal(r.article.type, "article");
  assert.equal(r.article.status, "published");
  assert.equal(r.article.locale, "th");
  assert.equal(articlePath(r.article), "/articles/grab-food-promo");
});

test("unpublish needs only external_id", () => {
  assert.deepEqual(parse({ spp: 1, action: "unpublish", external_id: "t:1" }), { action: "unpublish", external_id: "t:1" });
});

test("rejects wrong spp version, bad slug, unknown type", () => {
  for (const bad of [{ ...base, spp: 2 }, { ...base, slug: "Bad Slug!" }, { ...base, slug: "ab" }, { ...base, type: "podcast" }]) {
    const r = parse(bad);
    assert.ok("error" in r && r.error.status === 422, JSON.stringify(bad));
  }
});

test("reviews need balanced pros and cons", () => {
  const review = { item_name: "LINE MAN", item_type: "SoftwareApplication", pros: ["เร็ว"], cons: [], verdict: "ดี" };
  const r = parse({ ...base, type: "review", review });
  assert.ok("error" in r && r.error.status === 422);
  const ok = parse({ ...base, type: "review", review: { ...review, cons: ["ค่าส่งสูง"], rating: 4 } });
  assert.ok("action" in ok && ok.action === "upsert" && articlePath(ok.article) === "/reviews/grab-food-promo");
  const tooHigh = parse({ ...base, type: "review", review: { ...review, cons: ["x"], rating: 6, best: 5 } });
  assert.ok("error" in tooHigh);
});

test("asset:// references must be sent in images[] with matching bytes", () => {
  const missing = parse({ ...base, body_markdown: "![x](asset://cover.png)" });
  assert.ok("error" in missing);
  const ok = parse({ ...base, body_markdown: "![x](asset://cover.png)", images: [{ name: "cover.png", content_type: "image/png", data_base64: PNG_1PX }] });
  assert.ok("action" in ok);
  const lying = parse({ ...base, images: [{ name: "cover.png", content_type: "image/jpeg", data_base64: PNG_1PX }] });
  assert.ok("error" in lying);
  const svg = parse({ ...base, images: [{ name: "x.svg", content_type: "image/svg+xml", data_base64: "PHN2Zz4=" }] });
  assert.ok("error" in svg);
});

test("only https sources, offers and canonical; internal links must be site paths", () => {
  assert.ok("error" in parse({ ...base, sources: [{ title: "x", url: "javascript:alert(1)" }] }));
  assert.ok("error" in parse({ ...base, seo: { canonical_url: "http://evil.example" } }));
  assert.ok("error" in parse({ ...base, internal_links: [{ anchor: "x", path: "//evil.example" }] }));
  assert.ok("action" in parse({ ...base, internal_links: [{ anchor: "โปร LINE MAN", path: "/promo/lineman" }] }));
});

test("oversized and malformed bodies", () => {
  const big = parseSppBody(JSON.stringify({ ...base, body_markdown: "x".repeat(25 * 1024 * 1024) }));
  assert.ok("error" in big && big.error.status === 413);
  const junk = parseSppBody("{not json");
  assert.ok("error" in junk && junk.error.code === "invalid_json");
});
