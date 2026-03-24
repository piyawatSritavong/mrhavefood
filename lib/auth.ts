import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

import { getRoleHomePath, type AuthRole } from "@/lib/auth-role";

const hasGoogleProvider =
  Boolean(process.env.AUTH_GOOGLE_ID) &&
  Boolean(process.env.AUTH_GOOGLE_SECRET);

const hasFacebookProvider =
  Boolean(process.env.AUTH_FACEBOOK_ID) &&
  Boolean(process.env.AUTH_FACEBOOK_SECRET);

const demoProviderEnabled =
  process.env.AUTH_ENABLE_DEMO === "true" ||
  (!hasGoogleProvider && !hasFacebookProvider);

const demoAccounts = [
  {
    id: "demo-member",
    role: "member",
    name: "MrHaveFood Member",
    email: process.env.AUTH_DEMO_EMAIL ?? "member@mrhavefood.com",
    password: process.env.AUTH_DEMO_PASSWORD ?? "mrhavefood-demo",
  },
  {
    id: "demo-merchant",
    role: "merchant-admin",
    name: "Merchant Console",
    email:
      process.env.AUTH_DEMO_MERCHANT_EMAIL ?? "merchant@mrhavefood.com",
    password:
      process.env.AUTH_DEMO_MERCHANT_PASSWORD ?? "mrhavefood-merchant",
  },
  {
    id: "demo-platform-admin",
    role: "platform-admin",
    name: "Platform Admin",
    email:
      process.env.AUTH_DEMO_PLATFORM_EMAIL ?? "admin@mrhavefood.com",
    password:
      process.env.AUTH_DEMO_PLATFORM_PASSWORD ?? "mrhavefood-admin",
  },
] as const satisfies Array<{
  id: string;
  role: AuthRole;
  name: string;
  email: string;
  password: string;
}>;

const providers: NextAuthOptions["providers"] = [];

if (hasGoogleProvider) {
  providers.push(
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  );
}

if (hasFacebookProvider) {
  providers.push(
    FacebookProvider({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    }),
  );
}

if (demoProviderEnabled) {
  providers.push(
    CredentialsProvider({
      id: "credentials",
      name: "Demo Accounts",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "member@mrhavefood.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const matchedAccount = demoAccounts.find(
          (account) =>
            credentials?.email === account.email &&
            credentials?.password === account.password,
        );

        if (matchedAccount) {
          return {
            id: matchedAccount.id,
            name: matchedAccount.name,
            email: matchedAccount.email,
            role: matchedAccount.role,
          };
        }

        return null;
      },
    }),
  );
}

export const authOptions: NextAuthOptions = {
  // Fallback secret keeps the prototype runnable locally. Replace in deployment.
  secret:
    process.env.AUTH_SECRET ?? "mr-have-food-dev-secret-change-me",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role =
          typeof user.role === "string" ? user.role : "member";
      }

      if (account?.provider === "google" || account?.provider === "facebook") {
        token.role = typeof token.role === "string" ? token.role : "member";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? session.user.email ?? "member";
        session.user.role =
          typeof token.role === "string" ? token.role : "member";
      }

      return session;
    },
  },
};

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export const authRuntimeFlags = {
  hasFacebookProvider,
  hasGoogleProvider,
  demoProviderEnabled,
  demoAccounts,
  getRoleHomePath,
};
