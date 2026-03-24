import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { HeatmapExperience } from "@/components/heatmap/heatmap-experience";
import { getAllCompareScenarios } from "@/lib/compare-data";
import { heatZones } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Worth-it Heatmap",
  description:
    "Interactive worth-it heatmap and personalized route view for Bangkok food savings.",
  alternates: {
    canonical: "/heatmap",
  },
};

export default async function HeatmapPage() {
  const scenarios = await getAllCompareScenarios();

  return (
    <DashboardShell
      eyebrow="Visual Value Map"
      title="3D worth-it heatmap และ personal route view"
      description="หน้านี้เติม phase Visual Value Map ให้เป็น dedicated experience ที่ดูย่านคุ้มแบบ spatial และพร้อมต่อยอดเป็น live data layer ในรอบถัดไป"
    >
      <HeatmapExperience zones={heatZones} scenarios={scenarios} />
    </DashboardShell>
  );
}
