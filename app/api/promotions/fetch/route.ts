import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const VALID_PLATFORMS = ["GrabFood", "LINE MAN", "ShopeeFood", "Robinhood"];

const FALLBACK_RECORDS = [
  { platform: "GrabFood",   campaign_name: "GSB Debit Card Exclusive",     promo_code: "GSB100",     conditions: "สั่งขั้นต่ำ 300 บาท, ชำระผ่าน GrabPay ด้วยบัตรเดบิต GSB, จำกัด 2 สิทธิ์/คน/เดือน", start_date: "2026-01-01", end_date: "2026-12-31", reference_link: "https://www.grab.com/th/en/blog/gsb_y2026/" },
  { platform: "GrabFood",   campaign_name: "KBank Credit Card Promotion",  promo_code: "KBANKGF",    conditions: "สั่งขั้นต่ำ 500 บาท, ชำระผ่าน GrabPay ด้วยบัตรเครดิต KBank ที่ร่วมรายการ, จำกัด 1 สิทธิ์/คน/เดือน", start_date: "2026-03-01", end_date: "2027-02-28", reference_link: "https://www.grab.com/th/en/blog/kbankgf_2026/" },
  { platform: "LINE MAN",   campaign_name: "KTC VISA Foodie",              promo_code: "KTCVSPD80",  conditions: "สั่งขั้นต่ำ 450 บาท (เฉพาะค่าอาหาร), ชำระผ่านบัตรเครดิต KTC VISA เท่านั้น", start_date: "2026-02-01", end_date: "2026-07-31", reference_link: "https://lineman.line.me/partnership-ktc/" },
  { platform: "LINE MAN",   campaign_name: "Rabbit Rewards Special",       promo_code: "แลกรับ Rabbit Rewards", conditions: "สั่งขั้นต่ำ 200 บาท, ใช้ได้เฉพาะร้านที่ร่วมรายการ (GP), จำกัด 1 รหัส/สิทธิ์", start_date: "2025-09-16", end_date: "2026-03-31", reference_link: "https://rewards.rabbit.co.th/" },
  { platform: "LINE MAN",   campaign_name: "LINE MAN MART x Big C",        promo_code: "BIGC200",    conditions: "ช้อปขั้นต่ำ 800 บาท ที่ Big C ผ่านบริการ LINE MAN MART", start_date: "2026-03-01", end_date: "2026-03-31", reference_link: "https://lineman.line.me/how-to-apply-promo-code-2/" },
  { platform: "ShopeeFood", campaign_name: "ShopeeFood x KFC New User",    promo_code: "เก็บคูปองในแอป", conditions: "เฉพาะลูกค้าใหม่, ไม่มีขั้นต่ำ, ใช้ได้กับเมนูที่ร่วมรายการ", start_date: null, end_date: null, reference_link: "https://promotion.thairath.co.th/shopee-food-coupons/" },
  { platform: "ShopeeFood", campaign_name: "ShopeeFood x McDonald's",      promo_code: null,         conditions: "สำหรับทุกผู้ใช้, เฉพาะเมนูเซ็ตที่ร่วมรายการ, ไม่มีขั้นต่ำ", start_date: null, end_date: null, reference_link: "https://promotion.thairath.co.th/shopee-food-coupons/" },
  { platform: "Robinhood",  campaign_name: "Robinhood Food (Current Status)", promo_code: null,      conditions: "ตรวจสอบราคาพิเศษได้ที่หน้าแอปพลิเคชันในส่วน 'ดีลดีร้านดัง'", start_date: "2026-03-01", end_date: "2026-12-31", reference_link: "https://www.robinhood.co.th/" },
];


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

export async function POST() {
  const apiKey = process.env.GEMINI_PROMOTIONS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_PROMOTIONS_API_KEY is not set" }, { status: 500 });
  }

  try {
    // 1. Call Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: buildPrompt() }] }],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: [{ googleSearch: {} }] as any,
    });
    const raw = result.response.text();

    // 2. Parse JSON
    const promotions = parseJSON(raw) as Array<{
      platform: string;
      campaign_name: string;
      promo_code: string | null;
      conditions: string | null;
      start_date: string | null;
      end_date: string | null;
      reference_url: string | null;
    }>;

    // 3. Validate platform names — Gemini sometimes returns error-like records
    const validFromGemini = promotions.filter((p) => VALID_PLATFORMS.includes(p.platform));

    // 4. Supabase — delete ALL existing then insert fresh
    const { createSupabaseAdmin } = await import("@/lib/supabase");
    const supabase = createSupabaseAdmin();
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    await supabase.from("promotions").delete().gte("fetched_at", "1970-01-01T00:00:00Z");

    // 5. Use Gemini data if valid, otherwise fallback
    const source = validFromGemini.length > 0 ? "gemini" : "fallback";
    const cleanRecords =
      validFromGemini.length > 0
        ? validFromGemini.map((p) => ({
            platform: p.platform,
            campaign_name: p.campaign_name,
            promo_code: p.promo_code ?? null,
            conditions: p.conditions ?? null,
            start_date: p.start_date ?? null,
            end_date: p.end_date ?? null,
            reference_link: p.reference_url ?? null,
            fetched_at: new Date().toISOString(),
            is_active: true,
          }))
        : FALLBACK_RECORDS.map((r) => ({ ...r, fetched_at: new Date().toISOString(), is_active: true }));

    const { error: insertError } = await supabase.from("promotions").insert(cleanRecords);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: cleanRecords.length, source, date: today });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
