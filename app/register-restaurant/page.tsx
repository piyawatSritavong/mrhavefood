"use client";

import { useState } from "react";
import Link from "next/link";

type FormData = {
  restaurantName: string;
  contactName: string;
  phone: string;
  email: string;
  category: string;
  address: string;
};

const categories = [
  "อาหารไทย", "อาหารจีน", "อาหารญี่ปุ่น", "อาหารอีสาน",
  "อาหารตะวันตก", "อาหารทะเล", "ของหวาน/เบเกอรี่", "เครื่องดื่ม", "อื่น ๆ",
];

const pdpaText = [
  {
    title: "1. ข้อมูลที่เก็บรวบรวม",
    body: "บริษัทเก็บรวบรวมข้อมูลส่วนบุคคลและข้อมูลธุรกิจ ได้แก่ ชื่อร้าน ชื่อผู้ติดต่อ อีเมล เบอร์โทรศัพท์ และที่อยู่ เพื่อวัตถุประสงค์ในการลงทะเบียนร้านค้าบนแพลตฟอร์ม",
  },
  {
    title: "2. วัตถุประสงค์การใช้ข้อมูล",
    body: "บริษัทใช้ข้อมูลเพื่อ (1) ลงทะเบียนและยืนยันตัวตนร้านค้า (2) แสดงข้อมูลร้านในระบบ (3) ติดต่อประสานงานกับร้านค้า (4) ปฏิบัติตามกฎหมายที่เกี่ยวข้อง",
  },
  {
    title: "3. การเปิดเผยข้อมูล",
    body: "บริษัทจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านแก่บุคคลภายนอก เว้นแต่ได้รับความยินยอมหรือเป็นการปฏิบัติตามกฎหมาย",
  },
  {
    title: "4. ระยะเวลาการเก็บข้อมูล",
    body: "บริษัทจะเก็บข้อมูลตลอดระยะเวลาที่ร้านค้าอยู่ในระบบ และจะลบหรือทำให้ไม่สามารถระบุตัวตนได้เมื่อไม่มีความจำเป็น",
  },
  {
    title: "5. สิทธิของเจ้าของข้อมูล",
    body: "ท่านมีสิทธิในการเข้าถึง แก้ไข ลบ คัดค้านการประมวลผล และถอนความยินยอมได้ทุกเมื่อ",
  },
  {
    title: "6. การติดต่อ",
    body: "หากมีข้อสงสัยเกี่ยวกับนโยบายนี้ กรุณาติดต่อ: contact@mrhavefood.com",
  },
];

const inputClass =
  "w-full rounded-xl border border-[#e3dddd] px-4 py-2.5 text-sm outline-none focus:border-(--brand-primary) transition-colors";
const labelClass = "block text-xs font-semibold text-[#45627a] mb-1.5";

export default function RegisterRestaurantPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormData>({
    restaurantName: "",
    contactName: "",
    phone: "",
    email: "",
    category: "",
    address: "",
  });
  const [accepted, setAccepted] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#f5f5f5] px-4 py-10">
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-[#e3dddd] bg-white p-6 shadow-[0_8px_30px_rgba(0,67,124,0.08)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-accent))] font-display text-sm font-bold text-white">
            MF
          </span>
          <span className="font-display text-base font-bold text-(--brand-primary)">MrHaveFood.com</span>
        </Link>

        {/* Step bar */}
        <div className="flex gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-(--brand-primary)" />
          <div className={`h-1.5 flex-1 rounded-full transition-colors ${step === 2 ? "bg-(--brand-primary)" : "bg-[#e3dddd]"}`} />
        </div>

        {step === 1 ? (
          <>
            <div>
              <h1 className="font-display text-xl font-bold text-(--brand-primary)">ลงทะเบียนร้านอาหาร</h1>
              <p className="text-sm text-[#5c6e7f]">เข้าร่วม MrHaveFood โดยไม่มีค่า GP</p>
            </div>
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className={labelClass}>ชื่อร้านอาหาร</label>
                <input type="text" required placeholder="ชื่อร้าน" className={inputClass}
                  value={form.restaurantName} onChange={(e) => setForm({ ...form, restaurantName: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>ชื่อผู้ติดต่อ</label>
                <input type="text" required placeholder="ชื่อ นามสกุล" className={inputClass}
                  value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>เบอร์โทรศัพท์</label>
                <input type="tel" required placeholder="08X-XXX-XXXX" className={inputClass}
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>อีเมล</label>
                <input type="email" required placeholder="example@email.com" className={inputClass}
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>ประเภทอาหาร</label>
                <select required className={inputClass}
                  value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">เลือกประเภทอาหาร</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>ที่อยู่ร้าน</label>
                <input type="text" required placeholder="ที่อยู่ร้านอาหาร" className={inputClass}
                  value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <button type="submit"
                className="w-full rounded-xl bg-(--brand-primary) py-2.5 text-sm font-bold transition-opacity hover:opacity-90"
                style={{ color: "white" }}>
                ถัดไป →
              </button>
            </form>
          </>
        ) : (
          <>
            <div>
              <h1 className="font-display text-xl font-bold text-(--brand-primary)">นโยบายความเป็นส่วนตัว</h1>
              <p className="text-sm text-[#5c6e7f]">กรุณาอ่านและยอมรับก่อนดำเนินการต่อ</p>
            </div>
            <div className="h-64 space-y-3 overflow-y-auto rounded-xl border border-[#e3dddd] p-4 text-[13px] leading-6 text-[#5c6e7f]">
              <p className="font-semibold text-(--brand-primary)">นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)</p>
              <p>MrHaveFood.com ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562</p>
              {pdpaText.map((item) => (
                <p key={item.title}>
                  <strong className="text-[#45627a]">{item.title}</strong><br />{item.body}
                </p>
              ))}
            </div>
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 size-4 accent-(--brand-primary)" />
              <span className="text-sm text-[#5c6e7f]">
                ฉันได้อ่านและยอมรับนโยบายความเป็นส่วนตัว (PDPA) ของ MrHaveFood.com
              </span>
            </label>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-[#e3dddd] py-2.5 text-sm font-semibold text-[#45627a] transition-colors hover:bg-[#f5f5f5]">
                ← ย้อนกลับ
              </button>
              <button disabled={!accepted}
                className="flex-1 rounded-xl bg-(--brand-primary) py-2.5 text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ color: "white" }}>
                ยืนยัน
              </button>
            </div>
          </>
        )}

        <p className="text-center text-xs text-[#8a9ab0]">
          สมัครในฐานะสมาชิก?{" "}
          <Link href="/register" className="font-semibold text-(--brand-primary)">สมัครสมาชิก</Link>
        </p>
      </div>
    </div>
  );
}
