"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CompassIcon, MapPinIcon, PercentIcon, TruckIcon } from "@/components/ui/icons";
import { Select } from "@/components/ui/select";
import {
  homeQuickFilters,
  homeZones,
  type HomeQuickFilterId,
  type HomeZoneId,
} from "@/lib/home-experience";
import { cn } from "@/lib/utils";

const quickFilterIcons = {
  "near-me": CompassIcon,
  "biggest-discounts": PercentIcon,
  "free-delivery": TruckIcon,
} as const;

type HomeFilterBarProps = {
  activeQuickFilter: HomeQuickFilterId;
  selectedZoneId: HomeZoneId;
};

export function HomeFilterBar({
  activeQuickFilter,
  selectedZoneId,
}: HomeFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = (nextZoneId: HomeZoneId, nextFilterId: HomeQuickFilterId) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextZoneId === "all") {
      params.delete("zone");
    } else {
      params.set("zone", nextZoneId);
    }

    if (nextFilterId === "all") {
      params.delete("filter");
    } else {
      params.set("filter", nextFilterId);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="sticky top-24 z-30 rounded-[28px] border border-[#e3dddd] bg-white/96 p-4 shadow-[0_16px_50px_rgba(0,67,124,0.1)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center gap-2 text-base font-semibold text-(--brand-primary)">
            <MapPinIcon className="size-6" />
            เลือกโซน
          </div>
          <Select
            value={selectedZoneId}
            onChange={(event) =>
              updateParams(event.target.value as HomeZoneId, activeQuickFilter)
            }
            className="w-full sm:min-w-56"
            aria-label="Select zone"
          >
            {homeZones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeQuickFilter === "all" ? "default" : "outline"}
            size="sm"
            className={cn("rounded-full", activeQuickFilter === "all" && "shadow-none")}
            onClick={() => updateParams(selectedZoneId, "all")}
          >
            ทั้งหมด
          </Button>
          {homeQuickFilters.map((filter) => {
            const Icon = quickFilterIcons[filter.id];
            const isActive = activeQuickFilter === filter.id;

            return (
              <Button
                key={filter.id}
                variant={isActive ? "accent" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => updateParams(selectedZoneId, filter.id)}
              >
                <Icon className="size-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
