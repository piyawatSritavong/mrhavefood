// End-to-end tests for the SPP v1 receiver and the farm endpoint against a running server.
//
//   PROMOTIONS_TEST_MODE=1 AUTOPOST_SITE_SECRET=<test secret> CRON_SECRET=<test secret> npm start -- -p 3125
//   BASE_URL=http://localhost:3125 AUTOPOST_SITE_SECRET=<same> CRON_SECRET=<same> npm run test:e2e
//
// Uses only the in-memory test store (PROMOTIONS_TEST_MODE=1): never point it at production.
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { test } from "node:test";

const BASE = process.env.BASE_URL ?? "http://localhost:3125";
const SECRET = process.env.AUTOPOST_SITE_SECRET;
const CRON = process.env.CRON_SECRET;
if (!SECRET || !CRON) throw new Error("set AUTOPOST_SITE_SECRET and CRON_SECRET (test values) for the e2e run");

const run = randomUUID().slice(0, 8);
const sign = (ts, raw, secret = SECRET) => `v1=${createHmac("sha256", secret).update(`${ts}.${raw}`).digest("hex")}`;
const now = () => String(Math.floor(Date.now() / 1000));

async function post(body, { key = randomUUID(), ts = now(), secret = SECRET, raw } = {}) {
  const payload = raw ?? JSON.stringify(body);
  const res = await fetch(`${BASE}/api/autopost/v1/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-AutoPost-Timestamp": ts, "X-AutoPost-Signature": sign(ts, payload, secret), "Idempotency-Key": key },
    body: payload,
  });
  return { status: res.status, json: await res.json().catch(() => null) };
}

const page = async (path) => {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, html: await res.text() };
};

const article = (over = {}) => ({
  spp: 1,
  action: "upsert",
  external_id: `e2e:${run}:main`,
  type: "article",
  status: "published",
  locale: "th",
  slug: `e2e-${run}-grab-promo`,
  title: "รวมโค้ด GrabFood ใช้ได้จริง",
  excerpt: "สรุปโค้ด GrabFood ที่ยังใช้ได้",
  body_markdown: "## วิธีใช้โค้ด\n\nกรอกโค้ดตอนชำระเงิน\n\n| แอป | โค้ด |\n|---|---|\n| Grab | FREE200 |",
  tags: ["grab"],
  category: "promotions",
  author: { name: "MrHaveFood Team", persona: null },
  faq: [{ q: "โค้ดใช้ได้ถึงเมื่อไร", a: "ถึงสิ้นเดือน" }],
  sources: [{ title: "Grab", url: "https://www.grab.com/th/food/" }],
  internal_links: [{ anchor: "โปร LINE MAN", path: "/promo/lineman" }],
  seo: { meta_title: "โค้ด GrabFood", keywords: ["โค้ด grab"], canonical_url: null, noindex: false },
  disclosure: "affiliate",
  ...over,
});

test("health requires a valid signature", async () => {
  const bad = await fetch(`${BASE}/api/autopost/v1/health`);
  assert.equal(bad.status, 401);
  const ts = now();
  const ok = await fetch(`${BASE}/api/autopost/v1/health`, { headers: { "X-AutoPost-Timestamp": ts, "X-AutoPost-Signature": sign(ts, "") } });
  assert.equal(ok.status, 200);
  assert.deepEqual(await ok.json(), { ok: true, site: "mrhavefood", spp: 1, sections: ["articles", "reviews"] });
});

test("bad signature and old timestamp are 401", async () => {
  assert.equal((await post(article(), { secret: "wrong-secret-wrong-secret-wrong!!" })).status, 401);
  const old = String(Math.floor(Date.now() / 1000) - 301);
  assert.equal((await post(article(), { ts: old })).status, 401);
});

test("upsert publishes a page with SEO markup; idempotent replay returns the same result", async () => {
  const key = `e2e-${run}-create`;
  const first = await post(article(), { key });
  assert.equal(first.status, 201, JSON.stringify(first.json));
  assert.match(first.json.url, new RegExp(`/articles/e2e-${run}-grab-promo$`));
  const replay = await post(article(), { key });
  assert.equal(replay.status, 201);
  assert.deepEqual(replay.json, first.json);
  const reused = await post(article({ title: "อื่น" }), { key });
  assert.equal(reused.status, 422);

  const { status, html } = await page(`/articles/e2e-${run}-grab-promo`);
  assert.equal(status, 200);
  for (const needle of ['"@type":"Article"', '"@type":"FAQPage"', '"@type":"BreadcrumbList"', "แหล่งอ้างอิง", "คำถามที่พบบ่อย", "affiliate", 'rel="canonical"', "<table"]) {
    assert.ok(html.includes(needle), `page should contain ${needle}`);
  }
  assert.ok((await page("/articles")).html.includes("รวมโค้ด GrabFood ใช้ได้จริง"), "listed on the hub");
  assert.ok((await page("/sitemap.xml")).html.includes(`e2e-${run}-grab-promo`), "in sitemap");
  assert.ok((await page("/llms.txt")).html.includes(`e2e-${run}-grab-promo`), "in llms.txt");
  assert.ok((await page("/rss.xml")).html.includes(`e2e-${run}-grab-promo`), "in RSS");
});

test("second upsert of the same external_id updates in place", async () => {
  const r = await post(article({ title: "รวมโค้ด GrabFood อัปเดตแล้ว" }));
  assert.equal(r.status, 200);
  assert.equal(r.json.updated, true);
  assert.ok((await page(`/articles/e2e-${run}-grab-promo`)).html.includes("อัปเดตแล้ว"));
});

test("slug owned by another external_id is 409", async () => {
  const r = await post(article({ external_id: `e2e:${run}:other` }));
  assert.equal(r.status, 409);
  assert.deepEqual(r.json, { error: "slug_taken" });
});

test("markdown is sanitized (no raw HTML, scripts, handlers or javascript: URLs)", async () => {
  const slug = `e2e-${run}-xss`;
  const body = [
    "<script>alert('xss-script')</script>",
    "<img src=x onerror=alert('xss-onerror')>",
    "<iframe src='https://evil.example'></iframe>",
    "[click](javascript:alert('xss-link'))",
    "![img](javascript:alert('xss-img'))",
    "ปกติ",
  ].join("\n\n");
  assert.equal((await post(article({ external_id: `e2e:${run}:xss`, slug, body_markdown: body }))).status, 201);
  const { html } = await page(`/articles/${slug}`);
  // Raw HTML may appear only as escaped text; it must never become a live tag or URL.
  for (const bad of [/<script>alert/i, /<img[^>]*onerror/i, /<iframe/i, /href="javascript:/i, /src="javascript:/i]) {
    assert.ok(!bad.test(html), `rendered page must not contain ${bad}`);
  }
  assert.ok(html.includes("ปกติ"));
});

test("review page renders the review box and Review JSON-LD", async () => {
  const slug = `e2e-${run}-review`;
  const r = await post(article({
    external_id: `e2e:${run}:review`, slug, type: "review",
    review: { item_name: "LINE MAN", item_type: "SoftwareApplication", rating: 4, best: 5, pros: ["ร้านเยอะ"], cons: ["ค่าส่งช่วงฝนตกสูง"], verdict: "เหมาะกับคนสั่งบ่อย", price_note: null, offers: [] },
  }));
  assert.equal(r.status, 201);
  assert.match(r.json.url, /\/reviews\//);
  const { html } = await page(`/reviews/${slug}`);
  for (const needle of ['"@type":"Review"', '"ratingValue":4', "ข้อดี", "ข้อสังเกต"]) assert.ok(html.includes(needle), needle);
  assert.equal((await page(`/articles/${slug}`)).status, 404, "reviews are not served under /articles");
});

test("draft is hidden from listings and needs a signed preview token", async () => {
  const slug = `e2e-${run}-draft`;
  const external_id = `e2e:${run}:draft`;
  assert.equal((await post(article({ external_id, slug, status: "draft" }))).status, 201);
  assert.equal((await page(`/articles/${slug}`)).status, 404);
  assert.ok(!(await page("/sitemap.xml")).html.includes(slug));
  const token = createHmac("sha256", SECRET).update(`preview:${external_id}`).digest("hex").slice(0, 32);
  const preview = await page(`/articles/${slug}?preview=${token}`);
  assert.equal(preview.status, 200);
  assert.ok(preview.html.includes("noindex"));
});

test("unpublish hides the page and is idempotent", async () => {
  const r = await post({ spp: 1, action: "unpublish", external_id: `e2e:${run}:main` });
  assert.equal(r.status, 200);
  assert.equal(r.json.status, "unpublished");
  assert.equal((await page(`/articles/e2e-${run}-grab-promo`)).status, 404);
  const again = await post({ spp: 1, action: "unpublish", external_id: `e2e:${run}:never-existed` });
  assert.equal(again.status, 200);
});

test("invalid bodies are 422", async () => {
  assert.equal((await post(article({ slug: "NOT OK" }))).status, 422);
  assert.equal((await post(null, { raw: "{broken" })).status, 422);
});

test("farm endpoint: auth, dry run, facts items, no Facebook targets", async () => {
  const unauth = await fetch(`${BASE}/api/promotions/fetch`, { method: "POST" });
  assert.equal(unauth.status, 401);
  const res = await fetch(`${BASE}/api/promotions/fetch`, {
    method: "POST",
    headers: { Authorization: `Bearer ${CRON}`, "Content-Type": "application/json" },
    body: JSON.stringify({ farm_job_id: `e2e-${run}`, trigger: "manual", payload: {}, dry_run: true }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(typeof data.cost_usd, "number");
  assert.ok(Array.isArray(data.items));
  assert.equal(data.dry_run, true);
  for (const item of data.items) {
    assert.equal(item.kind, "mrhavefood.info");
    assert.match(item.dedupe_key, /^mrhavefood:facts:[a-z0-9-]+:\d{4}-\d{2}-\d{2}$/);
    assert.equal(item.targets, undefined, "facts items carry no targets");
    assert.equal(item.handoff.engine, "auto-content");
    assert.ok(item.handoff.payload.facts.length > 0);
    for (const f of item.handoff.payload.facts) assert.match(f.url, /^https:\/\//);
  }
  assert.ok(!JSON.stringify(data).includes("facebook:"), "no facebook targets this round");
  // Rejected source (non-official domain in the fixture) must not be stored.
  assert.ok(data.stats.rejected >= 1);
  const health = await fetch(`${BASE}/api/health`);
  assert.equal(health.status, 200);
});
