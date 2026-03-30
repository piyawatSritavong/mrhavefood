// @ts-check
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ── Supabase ─────────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const supabase    = createClient(supabaseUrl, supabaseKey);

// ── Gemini ───────────────────────────────────────────────────
const GEMINI_KEY  = process.env.GEMINI_PROMOTIONS_API_KEY ?? "";

const THAI_MONTHS = [
  "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
  "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",
];

function buildPrompt() {
  const d = new Date();
  const thaiDate = `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
  return `Role: คุณคือผู้เชี่ยวชาญด้านการวิเคราะห์ตลาดและข้อมูลโปรโมชั่นอาหารเดลิเวอรี่ในประเทศไทย (Thailand Food Delivery Market Analyst)
Task: ช่วยสืบค้นข้อมูลแคมเปญ รหัสส่วนลด (Promo Codes) และโปรโมชั่นล่าสุดจากแพลตฟอร์ม GrabFood, LINE MAN, ShopeeFood และ Robinhood ประจำวันที่ ${thaiDate}
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

function parseJSON(text) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(cleaned);
}

// ── Fallback restaurants ──────────────────────────────────────
const RESTAURANTS = [
  {
    name: "กะเพราตาแป๊ะ",
    category: "อาหารไทย",
    image_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    line_oa_url: "https://line.me/ti/p/@mrhavefood",
    description: "กะเพราหมูกรอบเทพ การันตีความอร่อย สั่งตรงจากร้าน ไม่เสียค่า GP",
    is_active: true,
  },
  {
    name: "ข้าวมันไก่ต้นตำรับ",
    category: "อาหารจีน",
    image_url: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    line_oa_url: "https://line.me/ti/p/@mrhavefood",
    description: "ข้าวมันไก่สูตรเด็ดต้นตำรับ ไก่ต้มนุ่ม ข้าวหอม น้ำจิ้มเข้มข้น",
    is_active: true,
  },
  {
    name: "ส้มตำบ้านไร่",
    category: "อาหารอีสาน",
    image_url: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    line_oa_url: "https://line.me/ti/p/@mrhavefood",
    description: "ส้มตำลาวแซ่บนัว ปลาร้าแท้ๆ ส่งตรงจากร้าน",
    is_active: true,
  },
];

// ── Steps ────────────────────────────────────────────────────
// ── Fallback promotions (used when Gemini quota exceeded) ─────
const FALLBACK_PROMOTIONS = [
  { platform: "GrabFood",   campaign_name: "GSB Debit Card Exclusive",     promo_code: "GSB100",     conditions: "สั่งขั้นต่ำ 300 บาท, ชำระผ่าน GrabPay ด้วยบัตรเดบิต GSB, จำกัด 2 สิทธิ์/คน/เดือน", start_date: "2026-01-01", end_date: "2026-12-31", reference_link: "https://www.grab.com/th/en/blog/gsb_y2026/" },
  { platform: "GrabFood",   campaign_name: "KBank Credit Card Promotion",  promo_code: "KBANKGF",    conditions: "สั่งขั้นต่ำ 500 บาท, ชำระผ่าน GrabPay ด้วยบัตรเครดิต KBank ที่ร่วมรายการ, จำกัด 1 สิทธิ์/คน/เดือน", start_date: "2026-03-01", end_date: "2027-02-28", reference_link: "https://www.grab.com/th/en/blog/kbankgf_2026/" },
  { platform: "LINE MAN",   campaign_name: "KTC VISA Foodie",              promo_code: "KTCVSPD80",  conditions: "สั่งขั้นต่ำ 450 บาท (เฉพาะค่าอาหาร), ชำระผ่านบัตรเครดิต KTC VISA เท่านั้น", start_date: "2026-02-01", end_date: "2026-07-31", reference_link: "https://lineman.line.me/partnership-ktc/" },
  { platform: "LINE MAN",   campaign_name: "Rabbit Rewards Special",       promo_code: "ต้องแลกรับรหัสผ่านแอป Rabbit Rewards", conditions: "สั่งขั้นต่ำ 200 บาท, ใช้ได้เฉพาะร้านที่ร่วมรายการ (GP), จำกัด 1 รหัส/สิทธิ์", start_date: "2025-09-16", end_date: "2026-03-31", reference_link: "https://rewards.rabbit.co.th/" },
  { platform: "LINE MAN",   campaign_name: "LINE MAN MART x Big C",        promo_code: "BIGC200",    conditions: "ช้อปขั้นต่ำ 800 บาท ที่ Big C ผ่านบริการ LINE MAN MART", start_date: "2026-03-01", end_date: "2026-03-31", reference_link: "https://lineman.line.me/how-to-apply-promo-code-2/" },
  { platform: "ShopeeFood", campaign_name: "ShopeeFood x KFC New User",    promo_code: "เก็บคูปองในแอป", conditions: "เฉพาะลูกค้าใหม่, ไม่มีขั้นต่ำ, ใช้ได้กับเมนูที่ร่วมรายการ", start_date: null, end_date: null, reference_link: "https://promotion.thairath.co.th/shopee-food-coupons/" },
  { platform: "ShopeeFood", campaign_name: "ShopeeFood x McDonald's",      promo_code: null,         conditions: "สำหรับทุกผู้ใช้, เฉพาะเมนูเซ็ตที่ร่วมรายการ, ไม่มีขั้นต่ำ", start_date: null, end_date: null, reference_link: "https://promotion.thairath.co.th/shopee-food-coupons/" },
  { platform: "Robinhood",  campaign_name: "Robinhood Food (Current Status)", promo_code: null,      conditions: "ตรวจสอบราคาพิเศษได้ที่หน้าแอปพลิเคชันในส่วน 'ดีลดีร้านดัง'", start_date: "2026-03-01", end_date: "2026-03-31", reference_link: "https://www.robinhood.co.th/" },
];

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-2.0-flash"];

async function callGemini() {
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`   → Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: buildPrompt() }] }],
        // @ts-ignore — googleSearch exists at runtime but not in SDK's Tool type yet
        tools: [{ googleSearch: {} }],
      });
      return parseJSON(result.response.text());
    } catch (err) {
      const is429 = err.message?.includes("429") || err.message?.includes("quota");
      if (is429) {
        console.log(`   ⚠️  ${modelName} quota exceeded, trying next model...`);
        continue;
      }
      throw err;
    }
  }
  return null; // all models failed
}

const VALID_PLATFORMS = ["GrabFood", "LINE MAN", "ShopeeFood", "Robinhood"];

async function seedPromotions() {
  console.log("🤖 Calling Gemini for promotions data...");

  // Delete all existing records first (clears stale/invalid data)
  const { error: delError } = await supabase
    .from("promotions")
    .delete()
    .gte("fetched_at", "1970-01-01T00:00:00Z");
  if (delError) throw new Error(`Delete promotions: ${delError.message}`);
  console.log("   → Cleared existing promotions");

  let records;
  if (!GEMINI_KEY) {
    console.log("   ⚠️  No Gemini key, using fallback data");
    records = FALLBACK_PROMOTIONS;
  } else {
    const promotions = await callGemini();
    if (promotions) {
      const valid = promotions.filter((p) => VALID_PLATFORMS.includes(p.platform));
      console.log(`   → Gemini returned ${promotions.length} total, ${valid.length} with valid platform`);
      if (valid.length > 0) {
        records = valid.map((p) => ({
          platform:       p.platform,
          campaign_name:  p.campaign_name,
          promo_code:     p.promo_code    ?? null,
          conditions:     p.conditions    ?? null,
          start_date:     p.start_date    ?? null,
          end_date:       p.end_date      ?? null,
          reference_link: p.reference_url ?? null,
        }));
      } else {
        console.log("   ⚠️  Gemini returned no valid platform data, using fallback");
        records = FALLBACK_PROMOTIONS;
      }
    } else {
      console.log("   ⚠️  All Gemini models quota exceeded, using fallback data");
      records = FALLBACK_PROMOTIONS;
    }
  }

  const inserts = records.map((r) => ({ ...r, fetched_at: new Date().toISOString(), is_active: true }));
  const { error } = await supabase.from("promotions").insert(inserts);
  if (error) throw new Error(`Insert promotions: ${error.message}`);
  console.log(`✅ Seeded ${inserts.length} promotions`);
}

async function seedRestaurants() {
  console.log("🍽️  Seeding restaurants...");
  const { error: delError } = await supabase
    .from("restaurants")
    .delete()
    .gte("created_at", "1970-01-01T00:00:00Z");
  if (delError) throw new Error(`Delete restaurants: ${delError.message}`);

  const { error } = await supabase.from("restaurants").insert(RESTAURANTS);
  if (error) throw new Error(`Insert restaurants: ${error.message}`);
  console.log(`✅ Seeded ${RESTAURANTS.length} restaurants`);
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log("\n🌱  MrHaveFood — Database Seed\n");

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  }

  await seedPromotions();
  await seedRestaurants();

  console.log("\n🎉  Seed complete!\n");
}

main().catch((err) => {
  console.error("\n❌  Seed failed:", err.message, "\n");
  process.exit(1);
});
