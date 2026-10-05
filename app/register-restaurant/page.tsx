"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import {
  LIMITS,
  RESTAURANT_CATEGORIES,
  validateApplication,
  type FieldErrors,
  type RestaurantApplicationInput,
} from "@/lib/restaurant-application";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

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
  "w-full min-h-11 rounded-xl border border-border bg-surface px-4 py-2.5 text-base text-ink outline-none transition-colors focus:border-brand-primary aria-invalid:border-danger sm:text-sm";
const labelClass = "mb-1.5 block text-xs font-semibold text-ink-secondary";

const EMPTY_FORM: RestaurantApplicationInput = {
  restaurantName: "",
  contactName: "",
  phone: "",
  email: "",
  category: "",
  address: "",
};

type FieldProps = {
  id: keyof RestaurantApplicationInput;
  label: string;
  error?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
};

function Field({ id, label, error, children }: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": error ? errorId : undefined })}
      {error && <p id={errorId} className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default function RegisterRestaurantPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<RestaurantApplicationInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (key: keyof RestaurantApplicationInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors((errs) => ({ ...errs, [key]: undefined }));
    };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateApplication(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted || status === "submitting") return;
    setStatus("submitting");
    setSubmitError(null);
    try {
      const res = await fetch("/api/restaurant-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consent: true }),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { fieldErrors?: FieldErrors };
      if (res.status === 422 && data.fieldErrors) {
        setErrors(data.fieldErrors);
        setStatus("idle");
        setStep(1);
        return;
      }
      setStatus("error");
      setSubmitError(
        res.status === 429
          ? "ส่งข้อมูลถี่เกินไป กรุณารอสักครู่แล้วลองใหม่"
          : "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      );
    } catch {
      setStatus("error");
      setSubmitError("เชื่อมต่อไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่");
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-5 rounded-card border border-border bg-surface p-6 shadow-card">
        <Link href="/" className="inline-flex min-h-11 items-center" aria-label="MrHaveFood หน้าแรก">
          <Image src="/assets/logo.webp" alt="MrHaveFood" width={360} height={191} className="h-12 w-auto" priority />
        </Link>

        {status === "success" ? (
          <div role="status" className="space-y-4 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-success-surface text-2xl text-success" aria-hidden>✓</div>
            <div className="space-y-1">
              <h1 className="text-xl text-brand-primary">เราได้รับข้อมูลร้านของคุณแล้ว</h1>
              <p className="text-sm text-ink-muted">
                ทีมงานจะติดต่อกลับที่ {form.phone} หรือ {form.email} ภายใน 3 วันทำการ
              </p>
            </div>
            <Link href="/" className={buttonClasses({ className: "w-full" })}>
              กลับหน้าหลัก
            </Link>
          </div>
        ) : (
          <>
            <div className="flex gap-2" aria-hidden>
              <div className="h-1.5 flex-1 rounded-full bg-brand-primary" />
              <div className={cn("h-1.5 flex-1 rounded-full transition-colors", step === 2 ? "bg-brand-primary" : "bg-border")} />
            </div>
            <p className="sr-only" aria-live="polite">ขั้นตอนที่ {step} จาก 2</p>

            {step === 1 ? (
              <>
                <div>
                  <h1 className="text-xl text-brand-primary">ลงทะเบียนร้านอาหาร</h1>
                  <p className="text-sm text-ink-muted">เข้าร่วม MrHaveFood โดยไม่มีค่า GP</p>
                </div>
                <form onSubmit={handleNext} noValidate className="space-y-4">
                  <Field id="restaurantName" label="ชื่อร้านอาหาร" error={errors.restaurantName}>
                    {(p) => (
                      <input {...p} type="text" required maxLength={LIMITS.name} autoComplete="organization"
                        placeholder="ชื่อร้าน" className={inputClass} value={form.restaurantName} onChange={update("restaurantName")} />
                    )}
                  </Field>
                  <Field id="contactName" label="ชื่อผู้ติดต่อ" error={errors.contactName}>
                    {(p) => (
                      <input {...p} type="text" required maxLength={LIMITS.name} autoComplete="name"
                        placeholder="ชื่อ นามสกุล" className={inputClass} value={form.contactName} onChange={update("contactName")} />
                    )}
                  </Field>
                  <Field id="phone" label="เบอร์โทรศัพท์" error={errors.phone}>
                    {(p) => (
                      <input {...p} type="tel" required inputMode="tel" autoComplete="tel" maxLength={12}
                        placeholder="0812345678" className={inputClass} value={form.phone} onChange={update("phone")} />
                    )}
                  </Field>
                  <Field id="email" label="อีเมล" error={errors.email}>
                    {(p) => (
                      <input {...p} type="email" required maxLength={LIMITS.email} autoComplete="email"
                        placeholder="example@email.com" className={inputClass} value={form.email} onChange={update("email")} />
                    )}
                  </Field>
                  <Field id="category" label="ประเภทอาหาร" error={errors.category}>
                    {(p) => (
                      <select {...p} required className={inputClass} value={form.category} onChange={update("category")}>
                        <option value="">เลือกประเภทอาหาร</option>
                        {RESTAURANT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    )}
                  </Field>
                  <Field id="address" label="ที่อยู่ร้าน" error={errors.address}>
                    {(p) => (
                      <input {...p} type="text" required maxLength={LIMITS.address} autoComplete="street-address"
                        placeholder="ที่อยู่ร้านอาหาร" className={inputClass} value={form.address} onChange={update("address")} />
                    )}
                  </Field>
                  <button type="submit" className={buttonClasses({ size: "lg", className: "w-full rounded-xl font-bold" })}>
                    ถัดไป →
                  </button>
                </form>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h1 className="text-xl text-brand-primary">นโยบายความเป็นส่วนตัว</h1>
                  <p className="text-sm text-ink-muted">กรุณาอ่านและยอมรับก่อนดำเนินการต่อ</p>
                </div>
                <div tabIndex={0} className="h-64 space-y-3 overflow-y-auto rounded-xl border border-border p-4 text-sm leading-6 text-ink-muted">
                  <p className="font-semibold text-brand-primary">นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)</p>
                  <p>MrHaveFood.com ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562</p>
                  {pdpaText.map((item) => (
                    <p key={item.title}>
                      <strong className="text-ink-secondary">{item.title}</strong><br />{item.body}
                    </p>
                  ))}
                </div>
                <label className="flex min-h-11 cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-1 size-5 shrink-0 accent-brand-primary" />
                  <span className="text-sm text-ink-muted">
                    ฉันได้อ่านและยอมรับนโยบายความเป็นส่วนตัว (PDPA) ของ MrHaveFood.com
                  </span>
                </label>

                {submitError && (
                  <p role="alert" className="rounded-xl bg-danger-surface px-4 py-3 text-sm text-danger">{submitError}</p>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} disabled={status === "submitting"}
                    className={buttonClasses({ variant: "outline", size: "lg", className: "flex-1 rounded-xl text-ink-secondary" })}>
                    ← ย้อนกลับ
                  </button>
                  <button type="submit" disabled={!accepted || status === "submitting"} aria-busy={status === "submitting"}
                    className={buttonClasses({ size: "lg", className: "flex-1 rounded-xl font-bold" })}>
                    {status === "submitting" ? "กำลังส่ง…" : status === "error" ? "ลองส่งอีกครั้ง" : "ยืนยัน"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
