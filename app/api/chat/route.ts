import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_CONTEXT = `คุณคือ Mr.HaveFood AI ผู้ช่วยอัจฉริยะของแพลตฟอร์ม MrHaveFood.com
ซึ่งเป็นบริการเปรียบเทียบโปรโมชั่นอาหารเดลิเวอรี่ในประเทศไทย (GrabFood, LINE MAN, ShopeeFood, Robinhood)
ตอบคำถามเกี่ยวกับอาหาร โปรโมชั่น และร้านอาหารด้วยภาษาที่เป็นมิตร กระชับ และเป็นประโยชน์
หากไม่ทราบโปรโมชั่นล่าสุดให้แนะนำให้ผู้ใช้ตรวจสอบในแอปของแต่ละแพลตฟอร์มโดยตรง`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_CHAT_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_CHAT_API_KEY is not set" }, { status: 500 });
  }

  let message: string;
  try {
    const body = await req.json();
    message = body.message?.trim();
    if (!message) return NextResponse.json({ error: "message is required" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_CONTEXT,
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
