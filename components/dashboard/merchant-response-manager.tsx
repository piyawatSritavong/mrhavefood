"use client";

import { useEffect, useState, useTransition } from "react";

import type { ReviewRecord } from "@/lib/product-types";

type MerchantResponseManagerProps = {
  scenarioId: string;
};

export function MerchantResponseManager({
  scenarioId,
}: MerchantResponseManagerProps) {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const response = await fetch(`/api/reviews?scenarioId=${scenarioId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { reviews: ReviewRecord[] };

      if (!cancelled) {
        setReviews(payload.reviews.filter((review) => review.verified));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [scenarioId]);

  const handleReply = async (reviewId: string) => {
    const reply = drafts[reviewId]?.trim();

    if (!reply) {
      setErrorMessage("กรุณาพิมพ์คำตอบก่อน");
      return;
    }

    const response = await fetch("/api/reviews/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reviewId,
        reply,
      }),
    });

    if (!response.ok) {
      setErrorMessage("ตอบรีวิวไม่สำเร็จ");
      return;
    }

    const payload = (await response.json()) as { review: ReviewRecord };

    startTransition(() => {
      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === payload.review.id ? payload.review : review,
        ),
      );
      setDrafts((currentDrafts) => ({
        ...currentDrafts,
        [reviewId]: "",
      }));
      setErrorMessage(null);
    });
  };

  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
      <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Response Management</p>
      <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
        ตอบกลับรีวิว Verified
      </h2>

      {errorMessage ? (
        <p className="mt-4 rounded-[1.2rem] bg-[#fde7dc] px-4 py-3 text-sm text-[#a4491f]">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-6 space-y-4">
        {reviews.slice(0, 3).map((review) => (
          <article key={review.id} className="rounded-[1.5rem] bg-white/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-[#111111]">{review.authorName}</p>
              <span className="rounded-full bg-[#eef5dd] px-3 py-1 text-xs font-semibold text-[#48612e]">
                Verified
              </span>
            </div>
            <p className="mt-4 text-sm leading-[1.7] text-[#566156]">{review.body}</p>

            {review.merchantReply ? (
              <div className="mt-4 rounded-[1.1rem] bg-[#111111] px-4 py-4 text-sm text-white/82">
                {review.merchantReply}
              </div>
            ) : (
              <div className="mt-4 grid gap-3">
                <textarea
                  value={drafts[review.id] ?? ""}
                  onChange={(event) =>
                    setDrafts((currentDrafts) => ({
                      ...currentDrafts,
                      [review.id]: event.target.value,
                    }))
                  }
                  className="min-h-24 rounded-[1rem] border border-[#111111]/10 bg-white px-4 py-3 text-sm text-[#111111]"
                  placeholder="ร่างคำตอบของร้านที่จริงใจและชัดเจน"
                />
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => void handleReply(review.id)}
                  className="rounded-full bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  {isPending ? "Saving..." : "Send response"}
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
