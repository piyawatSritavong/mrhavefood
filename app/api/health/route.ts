import { NextResponse } from "next/server";

import { getPromotionsStore, isTestMode } from "@/lib/farm/store";
import { createSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** Farm health probe: 200 when the site can reach Supabase, 503 otherwise. */
export async function GET() {
  const started = Date.now();
  try {
    if (isTestMode()) {
      await getPromotionsStore().listAll();
    } else {
      const { error } = await createSupabaseAdmin()
        .from("promotions")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
    }
    return NextResponse.json(
      { ok: true, supabase: "ok", latency_ms: Date.now() - started },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[api/health] supabase check failed:", err);
    return NextResponse.json({ ok: false, supabase: "error" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
