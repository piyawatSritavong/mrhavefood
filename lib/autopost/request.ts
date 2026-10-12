import { NextResponse } from "next/server";

import { parseSecrets, verifySppRequest } from "./verify";

/** Verifies an SPP v1 request; returns a 401/503 response to send, or null when it passes. */
export function rejectUnsigned(headers: Headers, rawBody: string): NextResponse | null {
  const result = verifySppRequest({
    secrets: parseSecrets(process.env.AUTOPOST_SITE_SECRET),
    timestamp: headers.get("x-autopost-timestamp"),
    signature: headers.get("x-autopost-signature"),
    rawBody,
  });
  if (result.ok) return null;
  if (result.reason === "no_secret") {
    console.error("[autopost] AUTOPOST_SITE_SECRET is not configured");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  // Never log the signature, the secret or the body.
  console.warn(`[autopost] rejected request: ${result.reason}`);
  return NextResponse.json({ error: "bad_signature" }, { status: 401 });
}
