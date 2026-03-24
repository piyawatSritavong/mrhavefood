import { MerchantResponseManager } from "@/components/dashboard/merchant-response-manager";
import { merchantConsole } from "@/lib/admin-content";
import { formatBaht } from "@/lib/home-content";

export function MerchantAdminDashboard() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {merchantConsole.metrics.map((metric) => (
          <article key={metric.label} className="soft-card rounded-[1.8rem] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">{metric.label}</p>
            <p className="type-stat mt-2 font-display font-semibold text-[#111111]">
              {metric.value}
            </p>
            <p className="mt-3 text-sm leading-[1.7] text-[#566156]">{metric.note}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Value Dashboard</p>
              <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
                แข่งกับใคร และคุ้มแค่ไหน
              </h2>
            </div>
            <span className="rounded-full bg-[#eef5dd] px-4 py-2 text-sm font-semibold text-[#48612e]">
              Worth score {merchantConsole.shop.worthScore}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {merchantConsole.competitors.map((item) => (
              <article key={`${item.scenario}-${item.rivalName}`} className="rounded-[1.5rem] bg-white/80 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">
                      {item.scenario}
                    </p>
                    <h3 className="type-heading-md mt-2 font-display font-semibold text-[#111111]">
                      เทียบกับ {item.rivalName}
                    </h3>
                    <p className="mt-2 text-sm leading-[1.7] text-[#566156]">{item.position}</p>
                  </div>
                  <div className="grid gap-2 text-left sm:text-right">
                    <p className="text-sm text-[#5d6258]">
                      ร้านคุณ <span className="font-data text-[#111111]">{formatBaht(item.yourNetPrice)}</span>
                    </p>
                    <p className="font-data text-[#111111]">
                      คู่แข่ง {formatBaht(item.rivalNetPrice)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-6">
          <section className="dark-panel rounded-[2rem] p-6 sm:p-7">
            <p className="text-sm uppercase tracking-[0.18em] text-white/55">Shop Claiming</p>
            <h2 className="type-heading-lg mt-2 font-display font-semibold text-white">
              {merchantConsole.shop.name}
            </h2>
            <p className="mt-3 text-sm leading-[1.7] text-white/72">
              {merchantConsole.shop.district} • {merchantConsole.shop.claimStatus} • response rate{" "}
              {merchantConsole.shop.responseRate}
            </p>

            <div className="mt-6 space-y-3">
              {merchantConsole.shopClaimChecklist.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-[1.3rem] border border-white/10 bg-white/7 px-4 py-3"
                >
                  <span className="text-sm text-white/84">{item.title}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.done
                        ? "bg-[#c8ff89] text-[#1f2813]"
                        : "border border-white/12 text-white"
                    }`}
                  >
                    {item.done ? "Done" : "Need action"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="soft-card rounded-[2rem] p-6 sm:p-7">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Direct Deal Posting</p>
            <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
              No-GP deal queue
            </h2>

            <div className="mt-6 space-y-3">
              {merchantConsole.directDeals.map((deal) => (
                <article key={deal.title} className="rounded-[1.4rem] bg-white/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#111111]">{deal.title}</p>
                    <span className="rounded-full bg-[#111111] px-3 py-1 text-xs font-semibold text-white">
                      {deal.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#566156]">
                    {deal.channel} • {deal.expires}
                  </p>
                  <p className="mt-3 text-sm leading-[1.7] text-[#566156]">{deal.note}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
        <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Response Management</p>
        <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
          รีวิวที่มีตรา Verified
        </h2>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {merchantConsole.verifiedReviews.map((review) => (
            <article key={`${review.author}-${review.status}`} className="rounded-[1.5rem] bg-white/80 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-[#111111]">{review.author}</p>
                <span className="rounded-full bg-[#eef5dd] px-3 py-1 text-xs font-semibold text-[#48612e]">
                  {review.trust}
                </span>
              </div>
              <p className="mt-4 text-sm leading-[1.7] text-[#566156]">{review.summary}</p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-[#111111]">{review.status}</span>
                <button
                  type="button"
                  className="rounded-full border border-[#111111]/10 bg-white px-4 py-2 text-sm font-semibold text-[#111111]"
                >
                  Draft response
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <MerchantResponseManager scenarioId="krapao-thonglor" />
    </div>
  );
}
