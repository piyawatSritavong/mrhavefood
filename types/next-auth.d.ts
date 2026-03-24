import type { AuthRole } from "@/lib/auth-role";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: AuthRole;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: AuthRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AuthRole;
  }
}
