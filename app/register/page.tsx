"use client";

import { useState } from "react";
import Link from "next/link";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const pdpaText = [
  {
    title: "1. ข้อมูลที่เก็บรวบรวม",
    body: "บริษัทเก็บรวบรวมข้อมูลส่วนบุคคล ได้แก่ ชื่อ-นามสกุล อีเมล เบอร์โทรศัพท์ และข้อมูลที่เกี่ยวข้องกับการใช้บริการ เพื่อวัตถุประสงค์ในการให้บริการและพัฒนาระบบ",
  },
  {
    title: "2. วัตถุประสงค์การใช้ข้อมูล",
    body: "บริษัทใช้ข้อมูลส่วนบุคคลเพื่อ (1) ให้บริการแก่ท่าน (2) ปรับปรุงและพัฒนาบริการ (3) ส่งข้อมูลข่าวสารที่เกี่ยวข้อง (4) ปฏิบัติตามกฎหมายที่เกี่ยวข้อง",
  },
  {
    title: "3. การเปิดเผยข้อมูล",
    body: "บริษัทจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านแก่บุคคลภายนอก เว้นแต่ได้รับความยินยอมจากท่านหรือเป็นการปฏิบัติตามกฎหมาย",
  },
  {
    title: "4. ระยะเวลาการเก็บข้อมูล",
    body: "บริษัทจะเก็บรักษาข้อมูลส่วนบุคคลของท่านตลอดระยะเวลาที่ท่านใช้บริการ และจะลบหรือทำให้ข้อมูลไม่สามารถระบุตัวตนได้เมื่อไม่มีความจำเป็น",
  },
  {
    title: "5. สิทธิของเจ้าของข้อมูล",
    body: "ท่านมีสิทธิในการเข้าถึง แก้ไข ลบ และคัดค้านการประมวลผลข้อมูลส่วนบุคคลของท่าน รวมถึงสิทธิในการถอนความยินยอมได้ทุกเมื่อ",
  },
  {
    title: "6. การติดต่อ",
    body: "หากมีข้อสงสัยเกี่ยวกับนโยบายนี้ กรุณาติดต่อ: contact@mrhavefood.com",
  },
];

const inputClass =
  "w-full rounded-xl border border-[#e3dddd] px-4 py-2.5 text-sm outline-none focus:border-(--brand-primary) transition-colors";
const labelClass = "block text-xs font-semibold text-[#45627a] mb-1.5";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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
              <h1 className="font-display text-xl font-bold text-(--brand-primary)">สมัครสมาชิก</h1>
              <p className="text-sm text-[#5c6e7f]">กรอกข้อมูลเพื่อเริ่มต้นใช้งาน</p>
            </div>
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className={labelClass}>ชื่อ-นามสกุล</label>
                <input type="text" required placeholder="ชื่อ นามสกุล" className={inputClass}
                  value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>อีเมล</label>
                <input type="email" required placeholder="example@email.com" className={inputClass}
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>เบอร์โทรศัพท์</label>
                <input type="tel" required placeholder="08X-XXX-XXXX" className={inputClass}
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>รหัสผ่าน</label>
                <input type="password" required placeholder="••••••••" className={inputClass}
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>ยืนยันรหัสผ่าน</label>
                <input type="password" required placeholder="••••••••" className={inputClass}
                  value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
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
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/" className="font-semibold text-(--brand-primary)">กลับหน้าหลัก</Link>
        </p>
      </div>
    </div>
  );
}
