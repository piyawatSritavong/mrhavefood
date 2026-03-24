"use client";

import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";

import { rewardsCatalog } from "@/lib/mock-product-content";
import type {
  RewardCatalogItem,
  RewardRedemptionRecord,
} from "@/lib/product-types";
import { useHomeStore } from "@/lib/stores/use-home-store";

export function RewardsHub() {
  const { data: session } = useSession();
  const rewardPoints = useHomeStore((state) => state.rewardPoints);
  const adjustRewardPoints = useHomeStore((state) => state.adjustRewardPoints);
  const [redemptions, setRedemptions] = useState<RewardRedemptionRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeRewardId, setActiveRewardId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    void (async () => {
      const response = await fetch("/api/rewards/history", { cache: "no-store" });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as {
        redemptions: RewardRedemptionRecord[];
      };

      setRedemptions(payload.redemptions);
    })();
  }, [session?.user]);

  const handleRedeem = async (reward: RewardCatalogItem) => {
    setErrorMessage(null);

    if (!session?.user) {
      setErrorMessage("กรุณา sign in ก่อนแลกรางวัล");
      return;
    }

    if (rewardPoints < reward.pointsCost) {
      setErrorMessage("คะแนนไม่พอสำหรับรางวัลนี้");
      return;
    }

    setActiveRewardId(reward.id);

    const response = await fetch("/api/rewards/redeem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rewardId: reward.id }),
    });

    if (!response.ok) {
      setErrorMessage("แลกรางวัลไม่สำเร็จ");
      setActiveRewardId(null);
      return;
    }

    const payload = (await response.json()) as {
      redemption: RewardRedemptionRecord;
    };

    startTransition(() => {
      adjustRewardPoints(-reward.pointsCost);
      setRedemptions((currentRedemptions) => [
        payload.redemption,
        ...currentRedemptions,
      ]);
      setActiveRewardId(null);
    });
  };

  return (
    <div className="grid gap-6">
      <section className="glass-panel rounded-[2.3rem] p-6 sm:p-8">
        <p className="section-kicker">Rewards</p>
        <h1 className="mt-4 font-display type-display-page font-semibold tracking-[-0.05em] text-[#111111]">
          แลกแต้มเป็นส่วนลด คูปอง และเครดิต mock
        </h1>
        <p className="type-body mt-5 max-w-3xl text-[#4d584d]">
          ระบบ rewards ตอนนี้แยกออกมาเป็น flow จริงแล้ว สมาชิกสามารถใช้แต้มจาก receipt verification
          เพื่อแลก mock reward ได้ทันที
        </p>
        <div className="mt-6 inline-flex rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white">
          Available points: {rewardPoints}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
        <section className="grid gap-4 sm:grid-cols-2">
          {rewardsCatalog.map((reward) => (
            <article key={reward.id} className="soft-card rounded-[1.9rem] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">
                    {reward.brand}
                  </p>
                  <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
                    {reward.title}
                  </h2>
                </div>
                {reward.featured ? (
                  <span className="rounded-full bg-[#eef5dd] px-3 py-1 text-xs font-semibold text-[#48612e]">
                    Featured
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-[1.7] text-[#566156]">{reward.summary}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.2rem] bg-white/80 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">Cost</p>
                  <p className="font-data mt-2 text-[#111111]">{reward.pointsCost} pts</p>
                </div>
                <div className="rounded-[1.2rem] bg-white/80 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">Value</p>
                  <p className="font-data mt-2 text-[#111111]">{reward.valueLabel}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#566156]">{reward.stockLabel}</p>
              <button
                type="button"
                onClick={() => void handleRedeem(reward)}
                disabled={isPending || activeRewardId === reward.id}
                className="mt-5 rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white"
              >
                {activeRewardId === reward.id ? "Redeeming..." : "Redeem reward"}
              </button>
            </article>
          ))}
        </section>

        <section className="dark-panel rounded-[2rem] p-6 sm:p-7">
          <p className="text-sm uppercase tracking-[0.18em] text-white/55">Redemption history</p>
          <h2 className="type-heading-lg mt-2 font-display font-semibold text-white">
            Recent claims
          </h2>

          {errorMessage ? (
            <p className="mt-5 rounded-[1.2rem] bg-[#4a1713] px-4 py-3 text-sm text-[#ffd6c9]">
              {errorMessage}
            </p>
          ) : null}

          <div className="mt-6 space-y-3">
            {redemptions.length ? (
              redemptions.map((redemption) => (
                <article key={redemption.id} className="rounded-[1.4rem] border border-white/10 bg-white/7 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{redemption.rewardTitle}</p>
                    <span className="rounded-full bg-[#c8ff89] px-3 py-1 text-xs font-semibold text-[#1f2813]">
                      {redemption.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-white/72">
                    {redemption.pointsCost} pts • code {redemption.claimCode}
                  </p>
                  <p className="mt-2 text-sm text-white/72">{redemption.deliveryLabel}</p>
                </article>
              ))
            ) : (
              <p className="rounded-[1.4rem] border border-white/10 bg-white/7 px-4 py-4 text-sm text-white/72">
                ยังไม่มีรายการแลกรางวัลในบัญชีนี้
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
