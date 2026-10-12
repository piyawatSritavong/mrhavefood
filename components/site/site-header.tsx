import Image from "next/image";
import Link from "next/link";

import { HeaderCta } from "@/components/home/header-cta";

export const SITE_LINKS = [
  { label: "โปรโมชั่น", href: "/#platforms" },
  { label: "บทความ", href: "/articles" },
  { label: "รีวิว", href: "/reviews" },
] as const;

/** Header for content pages (the home page has its own scroll-spy header). */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 rounded-panel border border-border bg-surface/95 px-3 py-2 shadow-card backdrop-blur-md sm:px-4">
        <Link href="/" className="flex min-h-11 items-center">
          <Image src="/assets/logo.webp" alt="MrHaveFood หน้าแรก" width={360} height={191} className="h-12 w-auto" priority />
        </Link>
        <nav aria-label="เมนูหลัก" className="order-3 w-full overflow-x-auto sm:order-none sm:w-auto">
          <ul className="flex items-center gap-1">
            {SITE_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold text-ink-secondary hover:bg-surface-brand hover:text-brand-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <HeaderCta />
      </div>
    </header>
  );
}

export function ContentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="px-3 pb-28 pt-4 sm:px-4 lg:px-6">{children}</main>
    </div>
  );
}
