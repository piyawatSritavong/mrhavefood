import type { Metadata } from "next";
import Link from "next/link";

type HandoffPageProps = {
  searchParams?: Promise<{
    platform?: string;
    restaurant?: string;
    scenario?: string;
  }>;
};

export const metadata: Metadata = {
  title: "App Handoff",
  description:
    "Mock affiliate/deeplink handoff destination for external delivery apps.",
  alternates: {
    canonical: "/handoff",
  },
};

export default async function HandoffPage({
  searchParams,
}: HandoffPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f3e6_0%,#efe6d1_100%)] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <section className="glass-panel rounded-[2.5rem] p-6 sm:p-8">
          <p className="section-kicker">Mock Deep Link</p>
          <h1 className="mt-4 font-display type-display-page font-semibold tracking-[-0.05em] text-[#111111]">
            handoff ไป {resolvedSearchParams?.platform ?? "delivery app"}
          </h1>
          <p className="type-body mt-6 text-[#4d584d]">
            หน้านี้เป็น placeholder สำหรับ affiliate / deep-link tracking flow ก่อนเชื่อม URL จริงภายนอก
            โดย event ถูกส่งผ่าน backend mock route แล้ว
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Platform", resolvedSearchParams?.platform ?? "unknown"],
              ["Restaurant", resolvedSearchParams?.restaurant ?? "unknown"],
              ["Scenario", resolvedSearchParams?.scenario ?? "unknown"],
            ].map(([label, value]) => (
              <article key={label} className="rounded-[1.5rem] bg-white/75 px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#6b705f]">{label}</p>
                <p className="mt-2 font-semibold text-[#111111]">{value}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/compare"
              className="rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white"
            >
              Back to compare
            </Link>
            <Link
              href="/platform-admin"
              className="rounded-full border border-[#111111]/10 bg-white px-5 py-3 text-sm font-semibold text-[#111111]"
            >
              View affiliate manager
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
