import Link from "next/link";

import { platformMeta, platformTint } from "@/lib/promotions-data";

type PlatformLinksProps = {
  /** platform name → affiliate URL (from env, resolved on the server). */
  affiliateLinks: Record<string, string>;
  /** Hide the "ดูโปร" link for the platform whose page this is. */
  current?: string;
};

/** Per-app shortcuts: open the app (affiliate link when configured) and its promo page. */
export function PlatformLinks({ affiliateLinks, current }: PlatformLinksProps) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {Object.values(platformMeta).map((m) => {
        const affiliate = affiliateLinks[m.label];
        return (
          <li key={m.slug} className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-2">
            <a
              href={affiliate ?? m.webUrl}
              target="_blank"
              rel={affiliate ? "sponsored noopener noreferrer" : "noopener noreferrer nofollow"}
              className="inline-flex min-h-11 items-center justify-center rounded-lg text-sm font-semibold"
              style={{ backgroundColor: platformTint(m.color, 12), color: m.color }}
            >
              สั่งผ่าน {m.label}
            </a>
            {current !== m.label && (
              <Link
                href={`/promo/${m.slug}`}
                className="inline-flex min-h-11 items-center justify-center text-xs font-semibold text-brand-primary"
              >
                ดูโปร {m.label} ทั้งหมด →
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
