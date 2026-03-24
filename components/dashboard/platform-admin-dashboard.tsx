import { OpsConsole } from "@/components/dashboard/ops-console";
import { platformConsole } from "@/lib/admin-content";

export function PlatformAdminDashboard() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {platformConsole.metrics.map((metric) => (
          <article key={metric.label} className="soft-card rounded-[1.8rem] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">{metric.label}</p>
            <p className="type-stat mt-2 font-display font-semibold text-[#111111]">
              {metric.value}
            </p>
            <p className="mt-3 text-sm leading-[1.7] text-[#566156]">{metric.note}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
          <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Dashboard Overview</p>
          <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
            ร้านที่กำลังเป็นกระแส
          </h2>

          <div className="mt-6 space-y-3">
            {platformConsole.trendingStores.map((store) => (
              <article key={store.name} className="rounded-[1.5rem] bg-white/80 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="type-heading-md font-display font-semibold text-[#111111]">
                      {store.name}
                    </p>
                    <p className="mt-2 text-sm text-[#566156]">{store.district}</p>
                  </div>
                  <span className="rounded-full bg-[#111111] px-3 py-1 text-xs font-semibold text-white">
                    Trending
                  </span>
                </div>
                <p className="mt-4 text-sm leading-[1.7] text-[#566156]">{store.reason}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dark-panel rounded-[2rem] p-6 sm:p-7">
          <p className="text-sm uppercase tracking-[0.18em] text-white/55">AI OCR Monitoring</p>
          <h2 className="type-heading-lg mt-2 font-display font-semibold text-white">
            Human-in-the-loop queue
          </h2>

          <div className="mt-6 space-y-3">
            {platformConsole.ocrQueue.map((item) => (
              <article key={item.fileName} className="rounded-[1.4rem] border border-white/10 bg-white/7 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{item.fileName}</p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    {item.confidence}
                  </span>
                </div>
                <p className="mt-3 text-sm text-white/72">{item.extracted}</p>
                <p className="mt-3 text-sm font-semibold text-[#c8ff89]">{item.status}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="soft-card rounded-[2rem] p-6 sm:p-7">
          <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Affiliate Link Manager</p>
          <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
            Outbound performance
          </h2>

          <div className="mt-6 space-y-3">
            {platformConsole.affiliateLinks.map((item) => (
              <article key={item.channel} className="rounded-[1.4rem] bg-white/80 p-4">
                <p className="font-semibold text-[#111111]">{item.channel}</p>
                <p className="mt-2 text-sm text-[#566156]">
                  CTR {item.ctr} • revenue {item.revenue}
                </p>
                <p className="mt-3 text-sm font-semibold text-[#111111]">{item.status}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 sm:p-7">
          <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">Fraud Detection</p>
          <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
            Signals to investigate
          </h2>

          <div className="mt-6 space-y-3">
            {platformConsole.fraudCases.map((item) => (
              <article key={`${item.account}-${item.signal}`} className="rounded-[1.4rem] bg-white/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[#111111]">{item.signal}</p>
                  <span className="rounded-full bg-[#fff1cf] px-3 py-1 text-xs font-semibold text-[#8a5d08]">
                    {item.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#566156]">{item.account}</p>
                <p className="mt-3 text-sm leading-[1.7] text-[#566156]">{item.action}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dark-panel rounded-[2rem] p-6 sm:p-7">
          <p className="text-sm uppercase tracking-[0.18em] text-white/55">Content Moderation</p>
          <h2 className="type-heading-lg mt-2 font-display font-semibold text-white">
            Queue
          </h2>

          <div className="mt-6 space-y-3">
            {platformConsole.moderationQueue.map((item) => (
              <article key={`${item.source}-${item.target}`} className="rounded-[1.4rem] border border-white/10 bg-white/7 p-4">
                <p className="font-semibold text-white">{item.target}</p>
                <p className="mt-2 text-sm text-white/70">{item.source} • {item.issue}</p>
                <p className="mt-3 text-sm font-semibold text-[#c8ff89]">{item.status}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="dark-panel rounded-[2rem] p-6 sm:p-7">
        <p className="text-sm uppercase tracking-[0.18em] text-white/55">Working ops workflow</p>
        <h2 className="type-heading-lg mt-2 font-display font-semibold text-white">
          OCR, fraud, moderation และ affiliate events
        </h2>
        <p className="type-body mt-3 max-w-3xl text-white/72">
          ส่วนนี้โหลดจาก API mock จริงและอัปเดตสถานะ queue ได้ ไม่ใช่แค่ static dashboard แล้ว
        </p>
        <div className="mt-6">
          <OpsConsole />
        </div>
      </section>
    </div>
  );
}
