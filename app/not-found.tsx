import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <p className="font-display text-6xl font-black text-(--brand-primary)">404</p>
        <div className="space-y-2">
          <h1 className="font-display text-xl font-bold text-(--brand-primary)">ไม่พบหน้านี้</h1>
          <p className="text-sm text-[#5c6e7f]">หน้าที่คุณกำลังมองหาอาจถูกย้ายหรือยังไม่พร้อมใช้งาน</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-(--brand-primary) px-6 py-2.5 text-sm font-semibold"
          style={{ color: "white" }}
        >
          ← กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
