import { NextRequest, NextResponse } from "next/server";

import { parseSppBody } from "@/lib/autopost/article";
import { sha256, unpublishArticle, upsertArticle, type IngestResponse } from "@/lib/autopost/ingest";
import { rejectUnsigned } from "@/lib/autopost/request";
import { getArticlesStore } from "@/lib/autopost/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * SPP v1 receiver (AI-Automation-Farm docs/contracts/site-publishing.md).
 * Auto-Post / the farm's SitePublisher upsert or unpublish one article per call.
 */
export async function POST(req: NextRequest) {
  // The signature covers the exact bytes, so read the raw body before any JSON parsing.
  const raw = await req.text();
  const rejected = rejectUnsigned(req.headers, raw);
  if (rejected) return rejected;

  const bodyHash = sha256(raw);
  const idemKey = req.headers.get("idempotency-key")?.slice(0, 200) || null;
  const store = getArticlesStore();

  try {
    if (idemKey) {
      const seen = await store.getIdempotency(idemKey);
      if (seen) {
        if (seen.body_hash !== bodyHash) {
          return NextResponse.json({ error: "idempotency_key_reused" }, { status: 422 });
        }
        return NextResponse.json(seen.response, { status: seen.status_code, headers: { "Idempotent-Replayed": "true" } });
      }
    }

    const parsed = parseSppBody(raw);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error.code, detail: parsed.error.detail }, { status: parsed.error.status });
    }

    const result: IngestResponse =
      parsed.action === "unpublish"
        ? await unpublishArticle(parsed.external_id)
        : await upsertArticle(parsed.article, bodyHash);

    if (idemKey && result.status < 300) {
      await store.putIdempotency({ key: idemKey, body_hash: bodyHash, status_code: result.status, response: result.body });
    }
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error("[autopost] article ingest failed:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
