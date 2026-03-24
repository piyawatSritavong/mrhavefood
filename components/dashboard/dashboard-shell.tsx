import Link from "next/link";

import { AuthNavActions } from "@/components/auth/auth-nav-actions";

type DashboardShellProps = {
  title: string;
  eyebrow: string;
  description: string;
  children: React.ReactNode;
};

export function DashboardShell({
  title,
  eyebrow,
  description,
  children,
}: DashboardShellProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f3e6_0%,#efe6d1_100%)] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-[linear-gradient(135deg,#ff8d33,#274d32)] font-display text-sm font-bold text-white">
              MF
            </span>
            <div>
              <p className="font-display text-[0.95rem] font-semibold text-[#121517]">
                MrHaveFood.com
              </p>
              <p className="text-[0.72rem] tracking-[0.22em] text-[#5d6157] uppercase">
                Smart Layer for Savvy Eaters
              </p>
            </div>
          </Link>

          <AuthNavActions />
        </div>

        <section className="glass-panel mt-10 rounded-[2.3rem] p-6 sm:p-8">
          <p className="section-kicker">{eyebrow}</p>
          <h1 className="mt-4 font-display type-display-page font-semibold tracking-[-0.05em] text-[#111111]">
            {title}
          </h1>
          <p className="type-body mt-5 max-w-3xl text-[#4d584d]">
            {description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/member"
              className="rounded-full bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Member Dashboard
            </Link>
            <Link
              href="/merchant"
              className="rounded-full border border-[#111111]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#111111]"
            >
              Merchant Console
            </Link>
            <Link
              href="/platform-admin"
              className="rounded-full border border-[#111111]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#111111]"
            >
              Platform Admin
            </Link>
          </div>
        </section>

        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}
