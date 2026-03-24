import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { getRoleHomePath, sessionHasRole, type AuthRole } from "@/lib/auth-role";

export async function requireSignedInSession(callbackUrl: string) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return session;
}

export async function requireRoleSession(
  callbackUrl: string,
  role: AuthRole,
) {
  const session = await requireSignedInSession(callbackUrl);

  if (!sessionHasRole(session, role)) {
    redirect(getRoleHomePath(session.user.role));
  }

  return session;
}
