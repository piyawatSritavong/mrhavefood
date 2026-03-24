import type { Metadata } from "next";
import Link from "next/link";

import { AuthNavActions } from "@/components/auth/auth-nav-actions";
import { CompareIndexClient } from "@/components/compare/compare-index-client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { getAllCompareScenarios, getCompareIndexStats } from "@/lib/compare-data";

export const metadata: Metadata = {
  title: "Compare Food Delivery Prices",
  description:
    "Browse SEO-friendly compare pages for menus and districts across Grab, LINE MAN, and ShopeeFood.",
  alternates: {
    canonical: "/compare",
  },
  openGraph: {
    title: "Compare Food Delivery Prices | MrHaveFood.com",
    description:
      "Browse SEO-friendly compare pages for menus and districts across major delivery apps in Thailand.",
    url: "https://mrhavefood.com/compare",
  },
};

export default async function CompareIndexPage() {
  const [scenarios, stats] = await Promise.all([
    getAllCompareScenarios(),
    getCompareIndexStats(),
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8f3e6_0%,#f2ead8_100%)] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <BackgroundBeams className="opacity-70" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-[linear-gradient(135deg,#ff8d33,#274d32)] font-display text-sm font-bold text-white">
              MF
            </span>
            <div>
              <p className="font-display text-[0.95rem] font-semibold text-[#121517]">
                MrHaveFood.com
              </p>
              <p className="text-[0.72rem] tracking-[0.22em] text-[#5d6157] uppercase">
                Smart Layer for Savvy Eaters
              </p>
            </div>
          </Link>

          <AuthNavActions />
        </div>

        <header className="glass-panel rounded-[2.5rem] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="section-kicker">SEO & Search Surface</p>
              <h1 className="mt-4 font-display type-display-page font-semibold tracking-[-0.05em] text-[#111111]">
                Compare routes สำหรับเมนูและย่าน เริ่มพร้อม index แล้ว
              </h1>
              <p className="type-body mt-6 max-w-2xl text-[#4d584d]">
                หน้านี้เป็นจุดรวม compare pages สำหรับ phase SEO โดยแต่ละเมนูสามารถแตกเป็นหน้า detail
                รายย่านได้ เพื่อรองรับ organic search และ internal linking ต่อจาก homepage
              </p>
            </div>

            <BentoGrid className="auto-rows-[minmax(11rem,auto)] md:grid-cols-3">
              <BentoGridItem
                title="Indexed pages"
                description="หน้า compare ที่พร้อมแตกต่อเป็น organic landing pages"
                header={<p className="type-stat text-[#111111]">{stats.scenarioCount}</p>}
              />
              <BentoGridItem
                title="Platforms"
                description="Grab, LINE MAN และ ShopeeFood ในมุมเปรียบเทียบเดียว"
                header={<p className="type-stat text-[#111111]">3</p>}
              />
              <BentoGridItem
                title="Districts"
                description="แยก intent ตามย่านเพื่อรองรับ search cluster และ internal links"
                header={<p className="type-stat text-[#111111]">{stats.districtCount}</p>}
              />
            </BentoGrid>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white"
            >
              Back to homepage
            </Link>
            <Link
              href="/#compare"
              className="rounded-full border border-[#111111]/10 bg-white px-5 py-3 text-sm font-semibold text-[#111111]"
            >
              View homepage compare section
            </Link>
          </div>
        </header>

        <CompareIndexClient scenarios={scenarios} />
      </div>
    </main>
  );
}
