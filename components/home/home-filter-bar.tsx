"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { MapPinIcon } from "@/components/ui/icons";
import { Select } from "@/components/ui/select";
import {
  homeQuickFilters,
  homeZones,
  type HomeQuickFilterId,
  type HomeZoneId,
} from "@/lib/home-experience";
import { cn } from "@/lib/utils";

const platformColors: Record<Exclude<HomeQuickFilterId, "all">, string> = {
  "grab": "#00B14F",
  "line-man": "#00C300",
  "shopeefood": "#EE4D2D",
  "foodpanda": "#D70F64",
  "robinhood": "#4A148C",
};

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
    <div className="w-full min-w-0 overflow-hidden rounded-[28px] border border-[#e3dddd] bg-white p-4 shadow-[0_16px_50px_rgba(0,67,124,0.1)]">
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
            className={cn("shrink-0 rounded-full", activeQuickFilter === "all" && "shadow-none")}
            onClick={() => updateParams(selectedZoneId, "all")}
          >
            ทั้งหมด
          </Button>
          {homeQuickFilters.map((filter) => {
            const isActive = activeQuickFilter === filter.id;
            const color = platformColors[filter.id];

            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="shrink-0 rounded-full gap-1.5"
                style={isActive ? { backgroundColor: color, borderColor: color } : {}}
                onClick={() => updateParams(selectedZoneId, filter.id)}
              >
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: isActive ? "white" : color }}
                />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
