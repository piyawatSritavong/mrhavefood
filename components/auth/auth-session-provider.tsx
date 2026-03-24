"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { MemberStateBridge } from "@/components/auth/member-state-bridge";

type AuthSessionProviderProps = {
  children: React.ReactNode;
  session: Session | null;
};

export function AuthSessionProvider({
  children,
  session,
}: AuthSessionProviderProps) {
  return (
    <SessionProvider session={session}>
      <MemberStateBridge />
      {children}
    </SessionProvider>
  );
}
