import Image from "next/image";

import { formatBaht, type CompareScenario } from "@/lib/home-content";
import type { RankedOutboundOrderStat } from "@/lib/home-view-models";

type HomeOrderSectionProps = {
  podiumOrderStats: RankedOutboundOrderStat[];
  scenarios: CompareScenario[];
};

export function HomeOrderSection({
  podiumOrderStats,
  scenarios,
}: HomeOrderSectionProps) {
  const podiumLayout = [
    podiumOrderStats.find((item) => item.rank === 2),
    podiumOrderStats.find((item) => item.rank === 1),
    podiumOrderStats.find((item) => item.rank === 3),
  ].filter((item): item is RankedOutboundOrderStat => Boolean(item));
  const totalOrders = podiumOrderStats.reduce(
    (total, item) => total + item.orderCount,
    0,
  );
  const topPlatform = podiumOrderStats[0];
  const averageBestPrice = Math.round(
    scenarios.reduce((total, scenario) => total + Math.min(...scenario.platforms.map((offer) => offer.totalPrice)), 0) /
      Math.max(1, scenarios.length),
  );

  return (
    <section
      id="order"
      data-section-id="order"
      className="section-shell home-section-muted scroll-mt-24"
    >
      <div className="section-frame max-w-7xl space-y-10 sm:space-y-12">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="type-display-page text-[#111111]">
            ยอดออเดอร์ที่สั่งจาก MrHaveFood ไปยังร้านที่ถูกที่สุด
          </h2>
          <p className="type-body text-[#556054]">
            จัดอันดับ TOP 3 ที่สั่งเยอะที่สุด และคุ้มที่สุด สำหรับคุณ
          </p>
        </div>

        <div className="compare-podium-shell soft-card rounded-[2rem] p-6 sm:p-8">
          <div
            className="compare-podium-stage"
            aria-label="Outbound order ranking"
          >
            {podiumLayout.map((item) => (
              <article
                key={item.key}
                className={[
                  "compare-podium-card",
                  item.rank === 1
                    ? "is-rank-one"
                    : item.rank === 2
                      ? "is-rank-two"
                      : "is-rank-three",
                ].join(" ")}
              >
                <div className="compare-podium-card-top">
                  <p className="type-caption uppercase tracking-[0.18em] text-[#6b705f]">
                    {item.name}
                  </p>
                  <p className="type-caption mt-2 text-[#6b705f]">
                    {item.growthCopy}
                  </p>
                </div>

                <div className="compare-podium-number-wrap">
                  <p className={`compare-podium-number rank-${item.rank}`}>
                    {item.orderCount.toLocaleString("en-US")}
                  </p>
                  <Image
                    src={item.badgeSrc}
                    alt={item.badgeAlt}
                    width={144}
                    height={144}
                    className="compare-podium-badge"
                  />
                </div>

                <div className="compare-podium-base">
                  <span className="compare-podium-rank">{item.rank}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.7rem] border border-[#111111]/8 bg-white px-5 py-5 shadow-[0_18px_50px_rgba(31,28,22,0.06)]">
            <p className="type-caption uppercase tracking-[0.18em] text-[#6b705f]">
              Total outbound
            </p>
            <p className="type-stat mt-3 text-[#111111]">
              {totalOrders.toLocaleString("en-US")}
            </p>
            <p className="type-body mt-2 text-[#556054]">
              ยอดกดสั่งรวมจาก 3 แอปที่เกิดขึ้นผ่านหน้า Home เวอร์ชันนี้
            </p>
          </article>

          <article className="rounded-[1.7rem] border border-[#111111]/8 bg-white px-5 py-5 shadow-[0_18px_50px_rgba(31,28,22,0.06)]">
            <p className="type-caption uppercase tracking-[0.18em] text-[#6b705f]">
              Top platform
            </p>
            <p className="type-stat mt-3 text-[#111111]">{topPlatform?.name ?? "-"}</p>
            <p className="type-body mt-2 text-[#556054]">
              ตอนนี้ {topPlatform?.name ?? "แพลตฟอร์มหลัก"} เป็นอันดับ 1 ของ order handoff ทั้งระบบ
            </p>
          </article>

          <article className="rounded-[1.7rem] border border-[#111111]/8 bg-white px-5 py-5 shadow-[0_18px_50px_rgba(31,28,22,0.06)]">
            <p className="type-caption uppercase tracking-[0.18em] text-[#6b705f]">
              Avg best price
            </p>
            <p className="type-stat mt-3 text-[#111111]">{formatBaht(averageBestPrice)}</p>
            <p className="type-body mt-2 text-[#556054]">
              ราคาเฉลี่ยของดีลที่คุ้มที่สุดจาก scenario ชุดที่แสดงอยู่ตอนนี้
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
