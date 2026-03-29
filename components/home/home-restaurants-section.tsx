import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { fallbackRestaurants } from "@/lib/promotions-data";
import type { Restaurant } from "@/lib/supabase";

type HomeRestaurantsSectionProps = {
  restaurants?: Restaurant[];
};

export function HomeRestaurantsSection({
  restaurants,
}: HomeRestaurantsSectionProps) {
  const items =
    restaurants && restaurants.length > 0 ? restaurants : fallbackRestaurants;

  return (
    <section
      id="restaurants"
      data-section-id="restaurants"
      className="w-full min-w-0 bg-white px-3 py-8 sm:px-4 sm:py-12 lg:px-6"
    >
      <div className="mx-auto max-w-7xl space-y-3">
        <div>
          <Badge variant="secondary" className="mb-1.5">{"MrHaveFood's Restaurants"}</Badge>
          <h2 className="font-display text-base font-bold text-(--brand-primary)">
            {"ร้านอาหารของเรา"}
          </h2>
        </div>

        <div className="space-y-2">
          {items.map((restaurant) => (
            <div
              key={restaurant.id}
              className="flex gap-3 rounded-xl border border-[#ebe7e7] bg-white p-2.5"
            >
              {restaurant.image_url ? (
                <Image
                  src={restaurant.image_url}
                  alt={restaurant.name}
                  width={68}
                  height={68}
                  className="size-17 shrink-0 rounded-lg object-cover"
                  unoptimized
                />
              ) : (
                <div className="size-17 shrink-0 rounded-lg bg-[#f5f0ef]" />
              )}

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-start justify-between gap-1">
                    <p className="font-display text-sm font-bold leading-tight text-(--brand-primary)">
                      {restaurant.name}
                    </p>
                    <Badge variant="secondary" className="shrink-0 border-0 bg-green-50 py-0.5 text-[10px] font-bold text-(--brand-primary)">
                      {"✅ No fees"}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#5c6e7f]">
                    {restaurant.category}
                  </p>
                  {restaurant.description && (
                    <p className="text-[11px] leading-4 text-[#8a9ab0]">
                      {restaurant.description}
                    </p>
                  )}
                </div>

                <a
                  href="/coming-soon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 self-start rounded-full bg-(--brand-primary) px-3 py-1 text-[11px] font-semibold"
                >
                  <span className="text-white inline-flex items-center gap-1.5">
                    <svg
                      className="size-3"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                    สั่งผ่าน LINE
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-1">
          <a href="/coming-soon" className="rounded-full border border-[#e3dddd] px-6 py-2 text-sm font-semibold text-(--brand-primary) transition-colors hover:bg-[#edf4fb]">
            See more
          </a>
        </div>
      </div>
    </section>
  );
}
