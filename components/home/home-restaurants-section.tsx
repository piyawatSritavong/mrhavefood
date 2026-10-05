import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import type { Restaurant } from "@/lib/supabase";

type HomeRestaurantsSectionProps = {
  restaurants: Restaurant[];
};

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <a
      href={restaurant.line_oa_url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="flex gap-3 rounded-xl border border-border bg-surface p-2.5 transition-colors hover:border-border-strong"
    >
      <span className="relative size-17 shrink-0 overflow-hidden rounded-lg bg-surface-subtle">
        {restaurant.image_url ? (
          // Restaurant images come from arbitrary hosts, so skip the optimizer allow-list.
          <Image src={restaurant.image_url} alt="" fill sizes="68px" className="object-cover" unoptimized />
        ) : (
          <span className="grid h-full place-items-center text-2xl" aria-hidden>🍽️</span>
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-between gap-1.5">
        <span className="space-y-0.5">
          <span className="flex items-start justify-between gap-2">
            <span className="text-sm font-semibold text-brand-primary">{restaurant.name}</span>
            {restaurant.category && <Badge variant="muted" className="shrink-0">{restaurant.category}</Badge>}
          </span>
          {restaurant.description && (
            <span className="line-clamp-2 block text-xs text-ink-muted">{restaurant.description}</span>
          )}
        </span>
        <span className="text-xs font-semibold text-success">สั่งผ่าน LINE ได้เลย →</span>
      </span>
    </a>
  );
}

export function HomeRestaurantsSection({ restaurants }: HomeRestaurantsSectionProps) {
  return (
    <section
      id="restaurants"
      data-section-id="restaurants"
      className="w-full min-w-0 bg-surface px-3 py-8 sm:px-4 sm:py-12 lg:px-6"
    >
      <div className="mx-auto max-w-7xl space-y-3">
        <div>
          <Badge variant="secondary" className="mb-1.5">ร้านค้า MrHaveFood</Badge>
          <h2 className="text-base text-brand-primary">ร้านอาหารของเรา สั่งตรงผ่าน LINE ไม่มีค่า GP</h2>
        </div>

        {restaurants.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <li key={r.id}>
                <RestaurantCard restaurant={r} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-border-strong bg-surface p-5 text-center">
            <p className="text-sm font-semibold text-brand-primary">ยังไม่มีร้านในระบบ — ร้านแรกอาจเป็นร้านของคุณ</p>
            <p className="mt-1 text-xs text-ink-muted">ลงทะเบียนฟรี ไม่มีค่า GP ลูกค้าสั่งตรงผ่าน LINE ของร้าน</p>
            <Link href="/register-restaurant" className={buttonClasses({ variant: "accent", className: "mt-3" })}>
              ลงทะเบียนร้านอาหาร
            </Link>
          </div>
        )}

        <div className="my-4 overflow-hidden rounded-card">
          <Image
            src="/assets/call-to-action-footer.webp"
            alt="สมัครเป็นร้านพาร์ทเนอร์ MrHaveFood"
            width={1600}
            height={416}
            sizes="(min-width: 1280px) 1232px, 100vw"
            className="h-auto w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
