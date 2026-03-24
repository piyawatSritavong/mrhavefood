import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RewardsHub } from "@/components/rewards/rewards-hub";

export const metadata: Metadata = {
  title: "Rewards",
  description:
    "Browse and redeem mock rewards using points earned from verified receipt submissions.",
  alternates: {
    canonical: "/rewards",
  },
};

export default function RewardsPage() {
  return (
    <DashboardShell
      eyebrow="Rewards"
      title="points-to-value loop สำหรับสายกินที่ช่วยสร้าง truth data"
      description="หน้า rewards นี้เติม gap ของระบบแลกแต้มให้ครบขึ้น โดยเชื่อมกับ reward points ใน Zustand และ mock redemption backend"
    >
      <RewardsHub />
    </DashboardShell>
  );
}
