import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HomeFooterSection() {
  return (
    <footer
      id="footer"
      data-section-id="footer"
      className="flex min-h-[calc(100dvh-5rem)] snap-start flex-col justify-center border-t border-[#d9d3d3] bg-white px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-4">
          <Badge variant="secondary">MrHaveFood.com</Badge>
          <div className="space-y-3">
            <h2 className="font-display text-[2rem] leading-tight text-[var(--brand-primary)] sm:text-[2.4rem]">
              เปลี่ยนทุกมื้ออาหาร... ให้เป็นความคุ้มค่าที่คุณออกแบบได้เอง
            </h2>
            <p className="max-w-2xl text-base leading-8 text-[#5c6e7f]">
              ยกระดับการสั่งอาหารด้วยมาตรฐานแอปท่องเที่ยวระดับโลก ตัดทุกความลังเลด้วยข้อมูลราคาสุทธิ (Net Price) ที่แม่นยำที่สุด จบปัญหาโลกแตก 'วันนี้กินอะไรดี' ในคลิกเดียว
            </p>
          </div>
        </div>

        <div className="rounded-[28px] bg-[var(--brand-primary)] p-6 text-white shadow-[0_18px_60px_rgba(0,67,124,0.18)]">
          <p className="text-sm font-semibold text-white/70">พร้อมเริ่มความคุ้มหรือยัง?</p>
          <p className="mt-2 font-display text-[1.55rem] leading-tight text-white">
            ปรึกษา Mr.AI เพื่อหาเมนูโดนใจ หรือเจาะลึกดีลเด็ดประจำย่านของคุณได้เลยตอนนี้
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="#main">
              <Button variant="hero" size="lg">
                คุยกับ Mr.AI
              </Button>
            </Link>
            <Link href="/compare">
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
