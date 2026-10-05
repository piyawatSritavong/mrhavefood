import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, type Content } from "@google/generative-ai";

import { clientIp, createRateLimiter } from "@/lib/rate-limit";

const SYSTEM_CONTEXT = `คุณคือ Mr.HaveFood AI ผู้ช่วยอัจฉริยะของแพลตฟอร์ม MrHaveFood.com
ซึ่งเป็นบริการรวมโปรโมชั่นอาหารเดลิเวอรี่ในประเทศไทย (GrabFood, LINE MAN, ShopeeFood, Robinhood)
ตอบคำถามเกี่ยวกับอาหาร โปรโมชั่น และร้านอาหารด้วยภาษาที่เป็นมิตร กระชับ และเป็นประโยชน์
หากไม่ทราบโปรโมชั่นล่าสุดให้แนะนำให้ผู้ใช้ตรวจสอบในแอปของแต่ละแพลตฟอร์มโดยตรง
ปฏิเสธอย่างสุภาพหากผู้ใช้ถามเรื่องที่ไม่เกี่ยวกับอาหารหรือการสั่งอาหาร`;

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY = 10;

const limiter = createRateLimiter({ limit: 10, windowMs: 60_000 });

type HistoryItem = { role: "ai" | "user"; text: string };

function parseHistory(value: unknown): Content[] {
  if (!Array.isArray(value)) return [];
  const items = value
    .filter(
      (m): m is HistoryItem =>
        !!m &&
        typeof m === "object" &&
        (m.role === "ai" || m.role === "user") &&
        typeof m.text === "string",
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role === "ai" ? "model" : "user", parts: [{ text: m.text.slice(0, MAX_MESSAGE_LENGTH) }] }));
  // Gemini requires the history to start with a user turn.
  const firstUser = items.findIndex((m) => m.role === "user");
  return firstUser < 0 ? [] : items.slice(firstUser);
}

export async function POST(req: NextRequest) {
  const { ok, retryAfter } = limiter(clientIp(req));
  if (!ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const apiKey = process.env.GEMINI_CHAT_API_KEY;
  if (!apiKey) {
    console.error("[api/chat] GEMINI_CHAT_API_KEY is not configured");
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }

  let message: string;
  let history: Content[];
  try {
    const body = await req.json();
    if (typeof body?.message !== "string") {
      return NextResponse.json({ error: "message_required" }, { status: 400 });
    }
    message = body.message.trim();
    if (!message) return NextResponse.json({ error: "message_required" }, { status: 400 });
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "message_too_long" }, { status: 413 });
    }
    history = parseHistory(body.history);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_CONTEXT,
      // gemini-2.5 counts thinking tokens toward this cap, so leave headroom.
      generationConfig: { maxOutputTokens: 2048 },
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[api/chat] Gemini request failed:", err);
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }
}
