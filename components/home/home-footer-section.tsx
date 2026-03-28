import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HomeFooterSection() {
  return (
    <footer
      id="footer"
      data-section-id="footer"
      className="flex w-full min-w-0 flex-col justify-center border-t border-[#d9d3d3] bg-white px-3 py-6 sm:min-h-[calc(100dvh-5rem)] sm:px-4 sm:py-10 lg:px-6"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-4">
          <Badge variant="secondary">MrHaveFood.com</Badge>
          <div className="space-y-3">
            <h2 className="font-display text-xl leading-tight text-(--brand-primary) sm:text-2xl lg:text-3xl">
              เปลี่ยนทุกมื้ออาหาร ... ให้เป็นความคุ้มค่าที่ออกแบบได้
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[#5c6e7f] sm:text-base sm:leading-8">
              ยกระดับการสั่งอาหารด้วยมาตรฐานแอปท่องเที่ยวระดับโลก ตัดทุกความลังเลด้วยข้อมูลราคาสุทธิ (Net Price) ที่แม่นยำที่สุด จบปัญหาโลกแตก 'วันนี้กินอะไรดี' ในคลิกเดียว
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-(--brand-primary) p-4 text-white shadow-[0_12px_40px_rgba(0,67,124,0.18)]">
          <p className="text-xs font-semibold text-white/70">พร้อมเริ่มความคุ้มหรือยัง?</p>
          <p className="mt-1.5 font-display text-base leading-tight text-white sm:text-lg">
            ปรึกษา Mr.AI เพื่อหาเมนูโดนใจ หรือเจาะลึกดีลเด็ดประจำย่านของคุณได้เลยตอนนี้
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/coming-soon">
              <Button variant="hero" size="lg">
                คุยกับ Mr.AI
              </Button>
            </Link>
            <Link href="/coming-soon">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/10 text-white! hover:bg-white/16 hover:text-white!"
              >
                เทียบราคาจากทุกแอป
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
