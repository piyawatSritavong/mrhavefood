"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error.digest ?? error.message);
  }, [error]);

  return (
    <div role="alert" className="flex min-h-dvh flex-col items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-xl text-brand-primary">เกิดข้อผิดพลาด</h1>
          <p className="text-sm text-ink-muted">ขออภัย ระบบขัดข้องชั่วคราว ลองใหม่อีกครั้งได้เลย</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center rounded-full bg-brand-primary px-6 text-sm font-semibold text-inverse hover:bg-brand-primary-hover"
          >
            ลองใหม่
          </button>
          <Link href="/" className="inline-flex min-h-11 items-center px-4 text-sm font-semibold text-brand-primary">
            ← กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
