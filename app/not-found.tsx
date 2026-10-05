import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ไม่พบหน้านี้",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <p className="font-display text-6xl font-bold text-brand-primary">404</p>
        <div className="space-y-2">
          <h1 className="text-xl text-brand-primary">ไม่พบหน้านี้</h1>
          <p className="text-sm text-ink-muted">หน้าที่คุณกำลังมองหาอาจถูกย้ายหรือยังไม่พร้อมใช้งาน</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full bg-brand-primary px-6 text-sm font-semibold text-inverse hover:bg-brand-primary-hover"
          >
            ← กลับหน้าหลัก
          </Link>
          <Link href="/#platforms" className="inline-flex min-h-11 items-center px-4 text-sm font-semibold text-brand-primary">
            ดูโปรโมชั่นล่าสุด
          </Link>
        </div>
      </div>
    </div>
  );
}
