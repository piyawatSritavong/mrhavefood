"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { useHomeStore } from "@/lib/stores/use-home-store";

export function HomeFooterSection() {
  const setChatOpen = useHomeStore((s) => s.setChatOpen);

  return (
    <footer
      id="footer"
      data-section-id="footer"
      className="flex w-full min-w-0 flex-col justify-center border-t border-border bg-surface px-3 pb-28 pt-6 min-h-[75dvh] sm:min-h-[calc(100dvh-5rem)] sm:px-4 sm:pt-10 lg:px-6"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-4">
          <Badge variant="secondary">MrHaveFood.com</Badge>
          <div className="space-y-3">
            <h2 className="text-xl leading-tight text-brand-primary sm:text-2xl lg:text-3xl">
              สมัครเป็นพาร์ทเนอร์กับเรา สั่งผ่านไลน์ร้านโดยตรง
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-ink-muted sm:text-base sm:leading-8">
              ยกระดับการสั่งอาหารด้วยมาตรฐานแอปท่องเที่ยวระดับโลก ตัดทุกความลังเลด้วยข้อมูลราคาสุทธิ (Net Price) ที่แม่นยำที่สุด จบปัญหาโลกแตก &apos;วันนี้กินอะไรดี&apos; ในคลิกเดียว
            </p>
            <Link href="/register-restaurant" className={buttonClasses({ variant: "accent", size: "lg" })}>
              ลงทะเบียนร้านอาหาร ฟรี
            </Link>
          </div>
        </div>

        <div className="rounded-card bg-brand-primary p-4 shadow-elevated">
          <p className="text-xs font-semibold text-inverse/70">พร้อมเริ่มความคุ้มหรือยัง?</p>
          <p className="mt-1.5 font-display text-xl leading-tight text-inverse sm:text-lg">
            เปลี่ยนทุกมื้ออาหาร ... ให้เป็นความคุ้มค่าที่ออกแบบได้
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="secondary" size="lg" onClick={() => setChatOpen(true)} aria-haspopup="dialog">
              คุยกับ Mr.AI
            </Button>
            <Button
              size="lg"
              disabled
              aria-disabled="true"
              className="border border-inverse/20 bg-inverse/10 text-inverse"
            >
              เทียบราคาจากทุกแอป · เร็วๆ นี้
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
