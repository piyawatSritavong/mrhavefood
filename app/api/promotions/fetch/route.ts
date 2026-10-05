import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const VALID_PLATFORMS = ["GrabFood", "LINE MAN", "ShopeeFood", "Robinhood"];

function buildPrompt(): string {
  return `ให้คุณเป็นผู้เชี่ยวชาญด้านการวิเคราะห์ตลาดและข้อมูลโปรโมชั่นอาหารเดลิเวอรี่ในประเทศไทย (Thailand Food Delivery Market Analyst)
Task: ช่วยสืบค้นข้อมูลแคมเปญ รหัสส่วนลด (Promo Codes) และโปรโมชั่นล่าสุดจากแพลตฟอร์ม GrabFood, LINE MAN, ShopeeFood และ Robinhood ล่าสุด
Search Context: ให้เน้นค้นหาจาก Official Facebook Page, เว็บไซต์ข่าวโปรโมชั่น, และหน้า Landing Page ของแคมเปญที่เปิดเป็นสาธารณะ
Output Format: ให้ตอบกลับเป็น JSON เท่านั้น (ห้ามมีคำเกริ่นนำหรือคำลงท้าย) โดยมีโครงสร้างดังนี้:
[
  {
    "platform": "ชื่อแพลตฟอร์ม (GrabFood / LINE MAN / ShopeeFood / Robinhood)",
    "campaign_name": "ชื่อแคมเปญหรือหัวข้อโปรโมชั่น",
    "description": "รายละเอียดโปรโมชั่นโดยย่อ",
    "promo_code": "รหัสส่วนลด (ถ้ามี ถ้าไม่มีให้ใส่ null)",
    "discount_value": "มูลค่าส่วนลด เช่น 50%, 100 บาท (ถ้ามี)",
    "start_date": "วันเริ่มต้นโปรโมชั่น (รูปแบบ YYYY-MM-DD ถ้าไม่ทราบให้ใส่ null)",
    "end_date": "วันสิ้นสุดโปรโมชั่น (รูปแบบ YYYY-MM-DD ถ้าไม่ทราบให้ใส่ null)",
    "conditions": "เงื่อนไขหลัก (เช่น สั่งขั้นต่ำ 200.-, เฉพาะร้านที่ร่วมรายการ)",
    "reference_url": "ลิงก์อ้างอิงแหล่งที่มาของข้อมูล"
  }
]`;
}

function parseJSON(text: string): unknown[] {
  // Strip markdown code blocks if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(cleaned);
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

type GeminiPromotion = {
  platform: string;
  campaign_name: string;
  promo_code: string | null;
  conditions: string | null;
  start_date: string | null;
  end_date: string | null;
  reference_url: string | null;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const asDate = (v: unknown) => (typeof v === "string" && ISO_DATE.test(v) ? v : null);
const asText = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const asUrl = (v: unknown) => (typeof v === "string" && /^https?:\/\//.test(v) ? v : null);

// Refreshes the promotions table from Gemini + Google Search.
// Protected by CRON_SECRET (Vercel Cron sends it as a Bearer token on GET).
async function refreshPromotions(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_PROMOTIONS_API_KEY;
  if (!apiKey) {
    console.error("[api/promotions/fetch] GEMINI_PROMOTIONS_API_KEY is not configured");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }

  // 1. Ask Gemini. Any failure here leaves the existing rows untouched.
  let valid: GeminiPromotion[];
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: buildPrompt() }] }],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: [{ googleSearch: {} }] as any,
    });
    const parsed = parseJSON(result.response.text());
    valid = (Array.isArray(parsed) ? parsed : [])
      .filter((p): p is GeminiPromotion => !!p && typeof p === "object" && VALID_PLATFORMS.includes((p as GeminiPromotion).platform))
      .filter((p) => asText(p.campaign_name));
  } catch (err) {
    console.error("[api/promotions/fetch] Gemini request or parsing failed:", err);
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }

  if (valid.length === 0) {
    console.warn("[api/promotions/fetch] Gemini returned no usable promotions; keeping existing rows");
    return NextResponse.json({ error: "no_results" }, { status: 502 });
  }

  // 2. Insert the new batch first, then delete the older rows, so a failed
  //    insert never leaves the table empty.
  try {
    const { createSupabaseAdmin } = await import("@/lib/supabase");
    const supabase = createSupabaseAdmin();
    const batchTime = new Date().toISOString();

    const records = valid.map((p) => ({
      platform: p.platform,
      campaign_name: asText(p.campaign_name) as string,
      promo_code: asText(p.promo_code),
      conditions: asText(p.conditions),
      start_date: asDate(p.start_date),
      end_date: asDate(p.end_date),
      reference_link: asUrl(p.reference_url),
      fetched_at: batchTime,
      is_active: true,
    }));

    const { error: insertError } = await supabase.from("promotions").insert(records);
    if (insertError) throw insertError;

    const { error: deleteError } = await supabase.from("promotions").delete().lt("fetched_at", batchTime);
    if (deleteError) {
      // New rows are live; stale ones will be removed on the next successful run.
      console.error("[api/promotions/fetch] failed to delete old rows:", deleteError);
    }

    return NextResponse.json({ success: true, count: records.length, fetched_at: batchTime });
  } catch (err) {
    console.error("[api/promotions/fetch] database write failed:", err);
    return NextResponse.json({ error: "database_error" }, { status: 500 });
  }
}

export const GET = refreshPromotions;
export const POST = refreshPromotions;
