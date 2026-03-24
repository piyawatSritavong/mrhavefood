import type { Metadata } from "next";
import Link from "next/link";

import { AuthNavActions } from "@/components/auth/auth-nav-actions";
import { MemberDashboard } from "@/components/auth/member-dashboard";
import { requireRoleSession } from "@/lib/auth-guards";
import { getAllCompareScenarios } from "@/lib/compare-data";

export const metadata: Metadata = {
  title: "Member Dashboard",
  description:
    "Authenticated member area for saved compare pages, alerts, reward points, and receipt activity.",
  alternates: {
    canonical: "/member",
  },
};

export default async function MemberPage() {
  await requireRoleSession("/member", "member");
  const scenarios = await getAllCompareScenarios();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f3e6_0%,#efe6d1_100%)] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
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

        <div className="mt-10">
          <MemberDashboard scenarios={scenarios} />
        </div>
      </div>
    </main>
  );
}
