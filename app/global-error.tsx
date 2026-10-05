"use client";

import "./globals.css";

// Replaces the root layout when it fails, so it must render <html>/<body>.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="th">
      <body className="bg-surface font-sans text-foreground">
        <div role="alert" className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
          <h1 className="text-xl text-brand-primary">เกิดข้อผิดพลาด</h1>
          <p className="mt-2 text-sm text-ink-muted">ขออภัย ระบบขัดข้องชั่วคราว</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-brand-primary px-6 text-sm font-semibold text-inverse"
          >
            ลองใหม่
          </button>
        </div>
      </body>
    </html>
  );
}
