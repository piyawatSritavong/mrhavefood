import { Suspense } from "react";

import { HomePage } from "@/components/home-page";
import type { HomeQuickFilterId, HomeZoneId } from "@/lib/home-experience";

type PageProps = {
  searchParams: Promise<{ zone?: string; filter?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedZoneId = (params.zone ?? "all") as HomeZoneId;
  const activeQuickFilter = (params.filter ?? "all") as HomeQuickFilterId;

  return (
    <Suspense>
      <HomePage
        activeQuickFilter={activeQuickFilter}
        selectedZoneId={selectedZoneId}
      />
    </Suspense>
  );
}
