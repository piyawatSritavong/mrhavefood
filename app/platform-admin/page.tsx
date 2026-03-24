import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PlatformAdminDashboard } from "@/components/dashboard/platform-admin-dashboard";
import { requireRoleSession } from "@/lib/auth-guards";

export const metadata: Metadata = {
  title: "Platform Admin",
  description:
    "Platform admin workspace for OCR monitoring, affiliate links, fraud detection, and moderation operations.",
  alternates: {
    canonical: "/platform-admin",
  },
};

export default async function PlatformAdminPage() {
  await requireRoleSession("/platform-admin", "platform-admin");

  return (
    <DashboardShell
      eyebrow="Platform Admin"
      title="Control layer สำหรับ OCR, fraud, moderation และ affiliate economics"
      description="หน้านี้เติมส่วนที่ขาดจาก prompt แรก โดยทำ dashboard overview, AI OCR monitoring, affiliate link manager, fraud detection และ content moderation เป็น working prototype"
    >
      <PlatformAdminDashboard />
    </DashboardShell>
  );
}
