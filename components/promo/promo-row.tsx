import { Badge } from "@/components/ui/badge";
import { CopyCodeButton } from "@/components/ui/copy-code-button";
import { formatPromoDates } from "@/lib/format-date";
import { getPlatformMeta, isRealPromoCode, platformTint, promoHref } from "@/lib/promotions-data";
import type { Promotion } from "@/lib/supabase";

export function PromoRow({ promo }: { promo: Promotion }) {
  const meta = getPlatformMeta(promo.platform);
  const href = promoHref(promo);
  const hasCode = isRealPromoCode(promo.promo_code);

  const content = (
    <>
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: platformTint(meta.color, 12) }}
        aria-hidden
      >
        <span className="font-display text-xs font-bold" style={{ color: meta.color }}>
          {meta.abbr}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-brand-primary">
          <span className="sr-only">{meta.label}: </span>
          {promo.campaign_name}
        </span>
        {promo.conditions && <span className="mt-0.5 block text-xs text-ink-muted">{promo.conditions}</span>}
        <span className="mt-1.5 flex flex-wrap items-center gap-2">
          <Badge variant="muted" className="whitespace-nowrap">
            {formatPromoDates(promo.start_date, promo.end_date)}
          </Badge>
          {hasCode && (
            <Badge
              variant="outline"
              className="font-mono font-bold"
              style={{ borderColor: meta.color, color: meta.color }}
            >
              {promo.promo_code}
            </Badge>
          )}
        </span>
      </span>
    </>
  );

  return (
    <div id={`promo-${promo.id}`} className="flex scroll-mt-36 items-center gap-2 rounded-xl border border-border bg-surface p-2.5">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="flex min-w-0 flex-1 items-center gap-3">
          {content}
        </a>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">{content}</div>
      )}
      {hasCode && <CopyCodeButton code={promo.promo_code as string} />}
    </div>
  );
}
