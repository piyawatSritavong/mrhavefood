"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { getRoleHomePath } from "@/lib/auth-role";

type AuthNavActionsProps = {
  theme?: "light" | "dark";
};

export function AuthNavActions({
  theme = "light",
}: AuthNavActionsProps) {
  const { data: session, status } = useSession();

  const isDark = theme === "dark";

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            isDark ? "bg-white/10 text-white/70" : "bg-white/70 text-[#121517]"
          }`}
        >
          Loading session
        </span>
      </div>
    );
  }

  if (session?.user) {
    const dashboardHref = getRoleHomePath(session.user.role);
    const dashboardLabel =
      session.user.role === "platform-admin"
        ? "Platform Admin"
        : session.user.role === "merchant-admin"
          ? "Merchant Console"
          : session.user.name ?? "Member";

    return (
      <div className="flex items-center gap-2">
        <Link
          href={dashboardHref}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            isDark
              ? "border border-white/12 bg-white/7 text-white hover:bg-white/12"
              : "bg-white/70 text-[#121517] hover:bg-white"
          }`}
        >
          {dashboardLabel}
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
            isDark
              ? "bg-white text-[#111111]"
              : "bg-[#111111] text-white"
          }`}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/sign-in"
        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          isDark
            ? "border border-white/12 bg-white/7 text-white hover:bg-white/12"
            : "bg-white/70 text-[#121517] hover:bg-white"
        }`}
      >
        Sign in
      </Link>
      <Link
        href="/sign-in?callbackUrl=%2Fmember"
        className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
          isDark
            ? "bg-white text-[#111111]"
            : "bg-[#111111] text-white"
        }`}
      >
        Member
      </Link>
    </div>
  );
}
