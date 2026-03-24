import type { Session } from "next-auth";

export const authRoles = [
  "member",
  "merchant-admin",
  "platform-admin",
] as const;

export type AuthRole = (typeof authRoles)[number];

export function isAuthRole(value: unknown): value is AuthRole {
  return (
    value === "member" ||
    value === "merchant-admin" ||
    value === "platform-admin"
  );
}

export function getRoleHomePath(role: AuthRole) {
  switch (role) {
    case "member":
      return "/member";
    case "merchant-admin":
      return "/merchant";
    case "platform-admin":
      return "/platform-admin";
  }
}

export function sessionHasRole(
  session: Session | null,
  roles: AuthRole | AuthRole[],
) {
  if (!session?.user?.role) {
    return false;
  }

  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return allowedRoles.includes(session.user.role as AuthRole);
}
