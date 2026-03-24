"use client";

import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";

import type { ReviewRecord } from "@/lib/product-types";

type ReviewPanelProps = {
  scenarioId: string;
  scenarioTitle: string;
};

export function ReviewPanel({
  scenarioId,
  scenarioTitle,
}: ReviewPanelProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [rating, setRating] = useState(5);
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
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
        setReviews(payload.reviews);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [scenarioId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scenarioId,
        rating,
        headline,
        body,
        verified: Boolean(session?.user),
      }),
    });

    if (!response.ok) {
      setErrorMessage("ส่งรีวิวไม่สำเร็จ");
      return;
    }

    const payload = (await response.json()) as { review: ReviewRecord };

    startTransition(() => {
      setReviews((currentReviews) => [payload.review, ...currentReviews]);
      setHeadline("");
      setBody("");
      setRating(5);
    });
  };

  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Reviews</p>
          <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
            ความเห็นจริงจากคนกิน {scenarioTitle}
          </h2>
        </div>
        <span className="rounded-full bg-[#111111] px-4 py-2 text-sm font-semibold text-white">
          {reviews.length} reviews
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-3">
          {reviews.length ? (
            reviews.map((review) => (
              <article key={review.id} className="rounded-[1.5rem] bg-white/80 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[#111111]">{review.authorName}</p>
                  <span className="rounded-full bg-[#fff9ef] px-3 py-1 text-xs font-semibold text-[#8a5d08]">
                    {review.rating}/5
                  </span>
                  {review.verified ? (
                    <span className="rounded-full bg-[#eef5dd] px-3 py-1 text-xs font-semibold text-[#48612e]">
                      Verified
                    </span>
                  ) : null}
                </div>
                <h3 className="type-heading-md mt-4 font-display font-semibold text-[#111111]">
                  {review.headline}
                </h3>
                <p className="type-body mt-3 text-[#566156]">{review.body}</p>
                {review.merchantReply ? (
                  <div className="mt-4 rounded-[1.2rem] bg-[#111111] px-4 py-4 text-sm text-white/82">
                    ร้านตอบกลับ: {review.merchantReply}
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            <p className="rounded-[1.5rem] bg-white/80 px-5 py-5 text-sm text-[#566156]">
              ยังไม่มีรีวิวสำหรับเมนูนี้
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="soft-card rounded-[1.8rem] p-5">
          <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Write review</p>
          <h3 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
            รีวิวพร้อมปักหมุดความคุ้ม
          </h3>
          <p className="type-body mt-3 text-[#566156]">
            guest อ่านได้ทุกคน ส่วน member ที่ login จะถูกติดธง verified mock ให้อัตโนมัติ
          </p>

          <label className="mt-5 grid gap-2">
            <span className="text-sm font-semibold text-[#111111]">Rating</span>
            <select
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="rounded-[1rem] border border-[#111111]/10 bg-white px-4 py-3 text-sm text-[#111111]"
            >
              {[5, 4, 3, 2, 1].map((option) => (
                <option key={option} value={option}>
                  {option}/5
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 grid gap-2">
            <span className="text-sm font-semibold text-[#111111]">Headline</span>
            <input
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              className="rounded-[1rem] border border-[#111111]/10 bg-white px-4 py-3 text-sm text-[#111111]"
              placeholder="สรุปสั้น ๆ ว่าคุ้มหรือไม่"
              required
            />
          </label>

          <label className="mt-4 grid gap-2">
            <span className="text-sm font-semibold text-[#111111]">Review</span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="min-h-32 rounded-[1rem] border border-[#111111]/10 bg-white px-4 py-3 text-sm text-[#111111]"
              placeholder="เล่าว่าราคา net, แอปที่คุ้ม, และคุณภาพอาหารเป็นอย่างไร"
              required
            />
          </label>

          {errorMessage ? (
            <p className="mt-4 rounded-[1rem] bg-[#fde7dc] px-4 py-3 text-sm text-[#a4491f]">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="mt-5 rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white"
          >
            {isPending ? "Submitting..." : "Submit review"}
          </button>
        </form>
      </div>
    </section>
  );
}
