import { createHmac, timingSafeEqual } from "node:crypto";

// SPP v1 request signing (AI-Automation-Farm docs/contracts/site-publishing.md §2).
// Keep this file free of path aliases: it is unit-tested directly with `node --test`.

export const MAX_SKEW_SECONDS = 300;

/** "v1=" + hex(hmac_sha256(secret, `${timestamp}.${rawBody}`)) */
export function sppSignature(secret: string, timestamp: string, rawBody: string): string {
  return `v1=${createHmac("sha256", secret).update(`${timestamp}.${rawBody}`, "utf8").digest("hex")}`;
}

/** AUTOPOST_SITE_SECRET may hold several comma-separated secrets during rotation. */
export function parseSecrets(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export type VerifyResult = { ok: true } | { ok: false; reason: "no_secret" | "bad_timestamp" | "bad_signature" };

/** Verify headers against the raw body. GET requests sign an empty body. */
export function verifySppRequest(opts: {
  secrets: string[];
  timestamp: string | null;
  signature: string | null;
  rawBody: string;
  nowSeconds?: number;
}): VerifyResult {
  const { secrets, timestamp, signature, rawBody } = opts;
  if (secrets.length === 0) return { ok: false, reason: "no_secret" };
  if (!timestamp || !/^\d{1,12}$/.test(timestamp) || !signature) return { ok: false, reason: "bad_signature" };
  const now = opts.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > MAX_SKEW_SECONDS) return { ok: false, reason: "bad_timestamp" };
  // Check every secret (no early exit) so timing does not reveal which one matched.
  let match = false;
  for (const secret of secrets) {
    if (safeEqual(sppSignature(secret, timestamp, rawBody), signature)) match = true;
  }
  return match ? { ok: true } : { ok: false, reason: "bad_signature" };
}

/** Draft preview token: hmac(secret, "preview:" + external_id), hex, first secret. */
export function previewToken(secret: string, externalId: string): string {
  return createHmac("sha256", secret).update(`preview:${externalId}`, "utf8").digest("hex").slice(0, 32);
}

export function verifyPreviewToken(secrets: string[], externalId: string, token: string | undefined): boolean {
  if (!token) return false;
  let match = false;
  for (const secret of secrets) {
    if (safeEqual(previewToken(secret, externalId), token)) match = true;
  }
  return match;
}
