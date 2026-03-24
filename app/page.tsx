import { HomePage } from "@/components/home-page";
import { getAllCompareScenarios } from "@/lib/compare-data";

export default async function Page() {
  const scenarios = await getAllCompareScenarios();

  return <HomePage scenarios={scenarios} />;
}
