import assert from "node:assert/strict";
import { test } from "node:test";

import { parseSecrets, previewToken, sppSignature, verifyPreviewToken, verifySppRequest } from "./verify.ts";

// Shared test vector from site-publishing.md §6 — every site and sender must agree.
const SECRET = "spp-test-secret-0123456789abcdef";
const TS = "1760245200";
const RAW = '{"spp":1,"action":"unpublish","external_id":"t:1"}';
const SIG = "v1=0acefa47fccace1343f02e90c8fa598008fbdb5338e9df9058ad554d1b3f3820";

test("contract test vector", () => {
  assert.equal(sppSignature(SECRET, TS, RAW), SIG);
  assert.deepEqual(verifySppRequest({ secrets: [SECRET], timestamp: TS, signature: SIG, rawBody: RAW, nowSeconds: 1760245200 }), { ok: true });
});

test("rejects a bad signature", () => {
  const r = verifySppRequest({ secrets: [SECRET], timestamp: TS, signature: SIG.replace(/.$/, "1"), rawBody: RAW, nowSeconds: 1760245200 });
  assert.deepEqual(r, { ok: false, reason: "bad_signature" });
});

test("rejects a tampered body", () => {
  const r = verifySppRequest({ secrets: [SECRET], timestamp: TS, signature: SIG, rawBody: RAW.replace("t:1", "t:2"), nowSeconds: 1760245200 });
  assert.equal(r.ok, false);
});

test("rejects timestamps outside ±300 s", () => {
  assert.deepEqual(verifySppRequest({ secrets: [SECRET], timestamp: TS, signature: SIG, rawBody: RAW, nowSeconds: 1760245200 + 301 }), { ok: false, reason: "bad_timestamp" });
  assert.deepEqual(verifySppRequest({ secrets: [SECRET], timestamp: TS, signature: SIG, rawBody: RAW, nowSeconds: 1760245200 - 301 }), { ok: false, reason: "bad_timestamp" });
  assert.deepEqual(verifySppRequest({ secrets: [SECRET], timestamp: TS, signature: SIG, rawBody: RAW, nowSeconds: 1760245200 + 300 }), { ok: true });
});

test("accepts any secret during rotation; none configured fails closed", () => {
  const secrets = parseSecrets(` old-secret , ${SECRET} `);
  assert.deepEqual(secrets, ["old-secret", SECRET]);
  assert.equal(verifySppRequest({ secrets, timestamp: TS, signature: SIG, rawBody: RAW, nowSeconds: 1760245200 }).ok, true);
  assert.deepEqual(verifySppRequest({ secrets: parseSecrets(""), timestamp: TS, signature: SIG, rawBody: RAW, nowSeconds: 1760245200 }), { ok: false, reason: "no_secret" });
});

test("GET signs an empty body", () => {
  const sig = sppSignature(SECRET, TS, "");
  assert.equal(verifySppRequest({ secrets: [SECRET], timestamp: TS, signature: sig, rawBody: "", nowSeconds: 1760245200 }).ok, true);
});

test("preview token round-trip", () => {
  const token = previewToken(SECRET, "x:1");
  assert.equal(verifyPreviewToken([SECRET], "x:1", token), true);
  assert.equal(verifyPreviewToken([SECRET], "x:2", token), false);
  assert.equal(verifyPreviewToken([SECRET], "x:1", undefined), false);
});
