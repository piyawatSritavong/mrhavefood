import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MerchantAdminDashboard } from "@/components/dashboard/merchant-admin-dashboard";
import { requireRoleSession } from "@/lib/auth-guards";

export const metadata: Metadata = {
  title: "Merchant Console",
  description:
    "Merchant admin workspace for shop claiming, value dashboard, direct deals, and verified review responses.",
  alternates: {
    canonical: "/merchant",
  },
};

export default async function MerchantPage() {
  await requireRoleSession("/merchant", "merchant-admin");

  return (
    <DashboardShell
      eyebrow="Merchant Admin"
      title="ร้านเห็น value ของตัวเอง และดึงลูกค้ากลับ direct ได้"
      description="prototype นี้ครอบคลุม shop claiming, value dashboard, direct deal posting, และ verified response management ตาม product direction แรกของ MrHaveFood.com"
    >
      <MerchantAdminDashboard />
    </DashboardShell>
  );
}
