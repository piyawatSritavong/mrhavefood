import { NextRequest, NextResponse } from "next/server";

import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import {
  CONSENT_VERSION,
  normalizePhone,
  validateApplication,
  type RestaurantApplicationInput,
} from "@/lib/restaurant-application";
import { createSupabaseAdmin } from "@/lib/supabase";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

export async function POST(req: NextRequest) {
  const { ok, retryAfter } = limiter(clientIp(req));
  if (!ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const input: RestaurantApplicationInput = {
    restaurantName: str(body.restaurantName),
    contactName: str(body.contactName),
    phone: str(body.phone),
    email: str(body.email),
    category: str(body.category),
    address: str(body.address),
  };

  if (body.consent !== true) {
    return NextResponse.json({ error: "consent_required" }, { status: 400 });
  }

  const fieldErrors = validateApplication(input);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ error: "validation_failed", fieldErrors }, { status: 422 });
  }

  try {
    const { error } = await createSupabaseAdmin().from("restaurant_applications").insert({
      restaurant_name: input.restaurantName.trim(),
      contact_name: input.contactName.trim(),
      phone: normalizePhone(input.phone),
      email: input.email.trim().toLowerCase(),
      category: input.category,
      address: input.address.trim(),
      consent_accepted_at: new Date().toISOString(),
      consent_version: CONSENT_VERSION,
    });
    if (error) throw error;
  } catch (err) {
    console.error("[api/restaurant-applications] insert failed:", err);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
