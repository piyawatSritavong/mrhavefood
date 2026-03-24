"use client";

import { useEffect, useState, useTransition } from "react";

import type {
  AffiliateEvent,
  FraudCase,
  ModerationCase,
  OcrJob,
} from "@/lib/product-types";

type OpsSnapshot = {
  affiliateEvents: AffiliateEvent[];
  fraudCases: FraudCase[];
  moderationCases: ModerationCase[];
  ocrJobs: OcrJob[];
};

export function OpsConsole() {
  const [snapshot, setSnapshot] = useState<OpsSnapshot | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const response = await fetch("/api/ops", { cache: "no-store" });

      if (!response.ok) {
        if (!cancelled) {
          setErrorMessage("โหลด ops queue ไม่สำเร็จ");
        }
        return;
      }

      const payload = (await response.json()) as OpsSnapshot;

      if (!cancelled) {
        setSnapshot(payload);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateStatus = async (
    entity: "ocr" | "fraud" | "moderation",
    id: string,
    status: string,
  ) => {
    const response = await fetch("/api/ops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entity, id, status }),
    });

    if (!response.ok) {
      setErrorMessage("อัปเดตสถานะไม่สำเร็จ");
      return;
    }

    const payload = (await response.json()) as {
      snapshot: OpsSnapshot;
    };

    startTransition(() => {
      setSnapshot(payload.snapshot);
      setErrorMessage(null);
    });
  };

  if (!snapshot) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-white/7 px-4 py-4 text-sm text-white/72">
        {errorMessage ?? "Loading ops console..."}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {errorMessage ? (
        <p className="rounded-[1.2rem] bg-[#4a1713] px-4 py-3 text-sm text-[#ffd6c9]">
          {errorMessage}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-[1.5rem] border border-white/10 bg-white/7 p-4">
          <p className="text-sm uppercase tracking-[0.18em] text-white/55">OCR queue</p>
          <div className="mt-4 space-y-3">
            {snapshot.ocrJobs.slice(0, 4).map((job) => (
              <article key={job.id} className="rounded-[1.2rem] bg-white/8 p-4">
                <p className="font-semibold text-white">{job.fileName}</p>
                <p className="mt-2 text-sm text-white/70">
                  {job.confidence}% • truth {job.truthScore}
                </p>
                <p className="mt-2 text-sm text-white/70">{job.extractedText}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => void updateStatus("ocr", job.id, "resolved")}
                    className="rounded-full bg-[#c8ff89] px-3 py-1 text-xs font-semibold text-[#1f2813]"
                  >
                    Resolve
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => void updateStatus("ocr", job.id, "human-review")}
                    className="rounded-full border border-white/12 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Send to review
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/7 p-4">
          <p className="text-sm uppercase tracking-[0.18em] text-white/55">Fraud queue</p>
          <div className="mt-4 space-y-3">
            {snapshot.fraudCases.slice(0, 4).map((item) => (
              <article key={item.id} className="rounded-[1.2rem] bg-white/8 p-4">
                <p className="font-semibold text-white">{item.signal}</p>
                <p className="mt-2 text-sm text-white/70">{item.account}</p>
                <p className="mt-2 text-sm text-white/70">{item.action}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => void updateStatus("fraud", item.id, "resolved")}
                    className="rounded-full bg-[#c8ff89] px-3 py-1 text-xs font-semibold text-[#1f2813]"
                  >
                    Resolve
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => void updateStatus("fraud", item.id, "monitoring")}
                    className="rounded-full border border-white/12 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Monitoring
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/7 p-4">
          <p className="text-sm uppercase tracking-[0.18em] text-white/55">Moderation</p>
          <div className="mt-4 space-y-3">
            {snapshot.moderationCases.slice(0, 4).map((item) => (
              <article key={item.id} className="rounded-[1.2rem] bg-white/8 p-4">
                <p className="font-semibold text-white">{item.target}</p>
                <p className="mt-2 text-sm text-white/70">{item.issue}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => void updateStatus("moderation", item.id, "approved")}
                    className="rounded-full bg-[#c8ff89] px-3 py-1 text-xs font-semibold text-[#1f2813]"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => void updateStatus("moderation", item.id, "masked")}
                    className="rounded-full border border-white/12 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Mask
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[1.5rem] border border-white/10 bg-white/7 p-4">
        <p className="text-sm uppercase tracking-[0.18em] text-white/55">Affiliate event feed</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {snapshot.affiliateEvents.slice(0, 6).map((event) => (
            <article key={event.id} className="rounded-[1.2rem] bg-white/8 p-4">
              <p className="font-semibold text-white">{event.label}</p>
              <p className="mt-2 text-sm text-white/70">
                {event.surface} • {event.platform}
              </p>
            </article>
          ))}
          {!snapshot.affiliateEvents.length ? (
            <p className="rounded-[1.2rem] bg-white/8 px-4 py-4 text-sm text-white/72">
              ยังไม่มี affiliate events ใหม่ ลองกด mock deep link จากหน้า compare หรือ homepage
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
