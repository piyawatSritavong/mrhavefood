import { NextRequest, NextResponse } from "next/server";

import { rejectUnsigned } from "@/lib/autopost/request";

export const dynamic = "force-dynamic";

/** Signed connection test for Auto-Post's "เชื่อมต่อเว็บ" button. */
export async function GET(req: NextRequest) {
  const rejected = rejectUnsigned(req.headers, "");
  if (rejected) return rejected;
  return NextResponse.json({ ok: true, site: "mrhavefood", spp: 1, sections: ["articles", "reviews"] });
}
