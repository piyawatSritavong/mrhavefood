import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthNavActions } from "@/components/auth/auth-nav-actions";
import { SignInPanel } from "@/components/auth/sign-in-panel";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { getAuthSession, authRuntimeFlags } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to MrHaveFood.com to save favorites, set alerts, and upload receipt proofs.",
  alternates: {
    canonical: "/sign-in",
  },
};

type SignInPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function SignInPage({
  searchParams,
}: SignInPageProps) {
  const session = await getAuthSession();
  const resolvedSearchParams = await searchParams;
  const callbackUrl = resolvedSearchParams?.callbackUrl ?? "/member";

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8f3e6_0%,#efe6d1_100%)] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <BackgroundBeams className="opacity-85" />

      <div className="relative z-10 mx-auto max-w-7xl">
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

        <section className="mt-10">
          <div className="glass-panel rounded-[2.8rem] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="section-kicker">Auth.js Foundation</p>
                <h1 className="mt-4 font-display type-display-page font-semibold tracking-[-0.05em] text-[#111111]">
                  Sign in flow ที่คุมทั้ง member, merchant และ platform access
                </h1>
                <p className="type-body mt-6 max-w-2xl text-[#4d584d]">
                  ปรับหน้าเข้าสู่ระบบให้เป็น modern clean surface แบบ Aceternity-style โดยยังคง role-based
                  entry points, social mock และ foundation สำหรับ favorites, alerts และ receipt uploads
                </p>
              </div>

              <BentoGrid className="auto-rows-[minmax(11rem,auto)] md:grid-cols-3 lg:grid-cols-1">
                <BentoGridItem
                  title="Role-ready access"
                  description="สลับทดสอบ member, merchant-admin และ platform-admin ได้จากหน้าเดียว"
                  header={<p className="type-stat-sm text-[#111111]">3 roles</p>}
                />
                <BentoGridItem
                  title="Social entry"
                  description="Google และ Facebook พร้อมต่อ provider จริงภายหลังโดยไม่ต้องเปลี่ยน UX ใหม่"
                  header={<p className="type-stat-sm text-[#111111]">OAuth</p>}
                />
                <BentoGridItem
                  title="Session foundation"
                  description="หลัง sign in แล้ว state ฝั่ง member จะพร้อมไปต่อกับ favorites, alerts และ rewards"
                  header={<p className="type-stat-sm text-[#111111]">Zustand + Auth</p>}
                />
              </BentoGrid>
            </div>

            <div className="mt-10">
              <SignInPanel
                demoProviderEnabled={authRuntimeFlags.demoProviderEnabled}
                demoAccounts={authRuntimeFlags.demoAccounts}
                hasFacebookProvider={authRuntimeFlags.hasFacebookProvider}
                hasGoogleProvider={authRuntimeFlags.hasGoogleProvider}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
