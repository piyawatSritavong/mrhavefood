"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import {
  formatBaht,
  getBestOffer,
  type CompareScenario,
} from "@/lib/home-content";
import { getScenarioHref } from "@/lib/compare-routes";
import { buildPersonalizedRoutePlan } from "@/lib/route-engine";
import { useHomeStore } from "@/lib/stores/use-home-store";

type MemberDashboardProps = {
  scenarios: CompareScenario[];
};

export function MemberDashboard({
  scenarios,
}: MemberDashboardProps) {
  const { data: session } = useSession();
  const favoriteScenarioIds = useHomeStore((state) => state.favoriteScenarioIds);
  const priceAlerts = useHomeStore((state) => state.priceAlerts);
  const rewardPoints = useHomeStore((state) => state.rewardPoints);
  const receiptHistory = useHomeStore((state) => state.receiptHistory);
  const memberSyncStatus = useHomeStore((state) => state.memberSyncStatus);
  const toggleFavoriteScenario = useHomeStore((state) => state.toggleFavoriteScenario);
  const togglePriceAlertEnabled = useHomeStore((state) => state.togglePriceAlertEnabled);
  const removePriceAlert = useHomeStore((state) => state.removePriceAlert);

  const favorites = scenarios.filter((scenario) =>
    favoriteScenarioIds.includes(scenario.id),
  );
  const routePlan = buildPersonalizedRoutePlan({
    favoriteScenarioIds,
    priceAlerts,
    scenarios,
  });
  const routeSaving = routePlan.reduce((total, stop) => total + stop.saving, 0);

  const syncStatusLabel =
    memberSyncStatus === "ready"
      ? "Supabase synced"
      : memberSyncStatus === "saving"
        ? "Saving to Supabase..."
        : memberSyncStatus === "loading"
          ? "Loading member vault..."
          : memberSyncStatus === "error"
            ? "Sync issue"
            : "Guest preview";

  return (
    <div className="grid gap-6">
      <section className="glass-panel rounded-[2.3rem] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Authenticated Member</p>
            <h1 className="type-display-page mt-4 font-display font-semibold tracking-[-0.05em] text-[#111111]">
              สวัสดี {session?.user?.name ?? "Member"}
            </h1>
            <p className="type-body mt-5 max-w-2xl text-[#4d584d]">
              session ของคุณพร้อมแล้ว ตอนนี้ favorite, price alerts, reward points และ receipt history
              ถูก sync จาก Zustand ไปยัง Supabase ผ่าน Prisma API แล้ว
            </p>
            <p className="mt-4 inline-flex rounded-full border border-[#111111]/8 bg-white/70 px-4 py-2 text-sm font-semibold text-[#374437]">
              {syncStatusLabel}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[28rem]">
            <article className="rounded-[1.8rem] bg-white/72 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">Favorites</p>
              <p className="type-stat mt-2 font-display font-semibold text-[#111111]">
                {favorites.length}
              </p>
            </article>
            <article className="rounded-[1.8rem] bg-white/72 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">Alerts</p>
              <p className="type-stat mt-2 font-display font-semibold text-[#111111]">
                {priceAlerts.length}
              </p>
            </article>
            <article className="rounded-[1.8rem] bg-white/72 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">Points</p>
              <p className="type-stat mt-2 font-display font-semibold text-[#111111]">
                {rewardPoints}
              </p>
            </article>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.96fr]">
        <section className="soft-card rounded-[2rem] p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Favorite compare pages</p>
              <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
                Saved menus
              </h2>
            </div>
            <Link
              href="/compare"
              className="rounded-full bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Explore compare pages
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {favorites.length ? (
              favorites.map((scenario) => {
                const bestOffer = getBestOffer(scenario);

                return (
                  <article key={scenario.id} className="rounded-[1.5rem] bg-white/80 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">
                          {scenario.district}
                        </p>
                        <h3 className="type-heading-md mt-2 font-display font-semibold text-[#111111]">
                          {scenario.title}
                        </h3>
                        <p className="font-display mt-2 text-sm leading-[1.7] text-[#566156]">
                          {scenario.restaurant}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="type-stat-sm font-display font-semibold text-[#111111]">
                          {formatBaht(bestOffer.totalPrice)}
                        </p>
                        <p className="mt-1 text-sm text-[#566156]">{bestOffer.note}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={getScenarioHref(scenario)}
                        className="rounded-full bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        Open compare page
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleFavoriteScenario(scenario.id)}
                        className="rounded-full border border-[#111111]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#111111]"
                      >
                        Remove favorite
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="rounded-[1.5rem] bg-white/80 px-5 py-5 text-sm text-[#566156]">
                ยังไม่มีเมนูที่บันทึกไว้ ลองไปที่หน้า compare แล้วกด save favorite
              </p>
            )}
          </div>
        </section>

        <div className="grid gap-6">
          <section className="dark-panel rounded-[2rem] p-6 sm:p-7">
            <p className="text-sm uppercase tracking-[0.18em] text-white/55">Price drop alerts</p>
            <h2 className="type-heading-lg mt-2 font-display font-semibold text-white">
              Active watchers
            </h2>
            <div className="mt-6 space-y-3">
              {priceAlerts.length ? (
                priceAlerts.map((alert) => {
                  const scenario = scenarios.find(
                    (item) => item.id === alert.scenarioId,
                  );

                  return (
                    <div
                      key={alert.id}
                      className="rounded-[1.4rem] border border-white/10 bg-white/7 px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">
                            {scenario?.title ?? "Unknown menu"}
                          </p>
                          <p className="mt-1 text-sm text-white/60">
                            {alert.platform} • target {formatBaht(alert.targetPrice)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => togglePriceAlertEnabled(alert.id)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              alert.enabled
                                ? "bg-[#c8ff89] text-[#1f2813]"
                                : "border border-white/12 text-white"
                            }`}
                          >
                            {alert.enabled ? "On" : "Off"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removePriceAlert(alert.id)}
                            className="rounded-full border border-white/12 px-3 py-1 text-xs font-semibold text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="rounded-[1.4rem] border border-white/10 bg-white/7 px-4 py-4 text-sm text-white/70">
                  ยังไม่มี price alert ในบัญชีนี้
                </p>
              )}
            </div>
          </section>

          <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Receipt history</p>
            <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
              Recent submissions
            </h2>
            <div className="mt-6 space-y-3">
              {receiptHistory.length ? (
                receiptHistory.slice(0, 4).map((receipt) => (
                  <div
                    key={receipt.id}
                    className="rounded-[1.4rem] bg-white/80 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#111111]">{receipt.itemName}</p>
                        <p className="mt-1 text-sm text-[#566156]">{receipt.fileName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#111111]">
                          {formatBaht(receipt.totalPrice)}
                        </p>
                        <p className="mt-1 text-sm text-[#566156]">{receipt.status}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-[1.4rem] bg-white/80 px-4 py-4 text-sm text-[#566156]">
                  ยังไม่มี receipt history ใน store นี้
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="dark-panel rounded-[2rem] p-6 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white/55">Personal route engine</p>
              <h2 className="type-heading-lg mt-2 font-display font-semibold text-white">
                เส้นทางกินที่ประหยัดที่สุดของคุณ
              </h2>
            </div>
            <span className="rounded-full bg-[#c8ff89] px-4 py-2 text-sm font-semibold text-[#1f2813]">
              Save {formatBaht(routeSaving)}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {routePlan.map((stop) => (
              <article
                key={stop.id}
                className="rounded-[1.4rem] border border-white/10 bg-white/7 px-4 py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                      {stop.time}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{stop.item}</p>
                      <p className="mt-1 text-sm text-white/60">
                        {stop.district} • {stop.reason}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#c8ff89]">
                    Save {formatBaht(stop.saving)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
          <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Member actions</p>
          <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
            rewards และ heatmap ใช้งานต่อได้แล้ว
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/rewards"
              className="surface-dark rounded-[1.5rem] bg-[#111111] px-5 py-5 text-white"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">Rewards</p>
              <p className="type-heading-lg mt-3 text-white">
                แลก <span className="font-data">{rewardPoints}</span> แต้ม
              </p>
              <p className="mt-3 text-sm leading-[1.7] text-white/72">
                เปลี่ยน verified receipt points เป็นคูปอง, ส่วนลด และเครดิต mock
              </p>
            </Link>
            <Link
              href="/heatmap"
              className="rounded-[1.5rem] bg-white/80 px-5 py-5 text-[#111111]"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">Heatmap</p>
              <p className="type-heading-lg mt-3 text-[#111111]">
                เปิด 3D map
              </p>
              <p className="mt-3 text-sm leading-[1.7] text-[#566156]">
                ดู worth-it heatmap แบบ spatial พร้อม route view จาก favorites และ alerts ของคุณ
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
