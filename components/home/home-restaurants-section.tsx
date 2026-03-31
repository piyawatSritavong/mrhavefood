import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function HomeRestaurantsSection() {

  return (
    <section
      id="restaurants"
      data-section-id="restaurants"
      className="w-full min-w-0 bg-white px-3 py-8 sm:px-4 sm:py-12 lg:px-6"
    >
      <div className="mx-auto max-w-7xl space-y-3">
        <div>
          <Badge variant="secondary" className="mb-1.5">
            {"MrHaveFood's Restaurants"}
          </Badge>
          <h2 className="font-display text-base font-bold text-(--brand-primary)">
            {"ร้านอาหารของเรา"}
          </h2>
        </div>

        {/* Skeleton loading */}
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-[#ebe7e7] bg-white p-2.5 animate-pulse">
              <div className="size-17 shrink-0 rounded-lg bg-[#e5e7eb]" />
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-4 w-32 rounded bg-[#e5e7eb]" />
                    <div className="h-4 w-16 rounded-full bg-[#e5e7eb]" />
                  </div>
                  <div className="h-3 w-20 rounded bg-[#e5e7eb]" />
                  <div className="h-3 w-full rounded bg-[#e5e7eb]" />
                  <div className="h-3 w-3/4 rounded bg-[#e5e7eb]" />
                </div>
                <div className="h-6 w-24 rounded-full bg-[#e5e7eb]" />
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl my-4">
          <Image
            src="/assets/Call2ActionMrHaveFoodFooter.jpg"
            alt="MrHaveFood Call to Action"
            width={2606}
            height={246}
            className="w-full object-cover"
            style={{ height: "auto" }}
          />
        </div>
      </div>
    </section>
  );
}
