"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { getRoleHomePath, type AuthRole } from "@/lib/auth-role";

type DemoAccount = {
  email: string;
  name: string;
  password: string;
  role: AuthRole;
};

type SignInPanelProps = {
  demoProviderEnabled: boolean;
  demoAccounts: DemoAccount[];
  hasFacebookProvider: boolean;
  hasGoogleProvider: boolean;
};

export function SignInPanel({
  demoProviderEnabled,
  demoAccounts,
  hasFacebookProvider,
  hasGoogleProvider,
}: SignInPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultDemoAccount = demoAccounts[0];
  const [email, setEmail] = useState(defaultDemoAccount?.email ?? "");
  const [password, setPassword] = useState(defaultDemoAccount?.password ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const callbackUrl = searchParams.get("callbackUrl") ?? "/member";
  const mockSocialAccount =
    demoAccounts.find((account) => account.role === "member") ??
    defaultDemoAccount;

  const signInWithDemoAccount = async (account: DemoAccount) => {
    const result = await signIn("credentials", {
      email: account.email,
      password: account.password,
      redirect: false,
      callbackUrl: getRoleHomePath(account.role),
    });

    if (result?.error) {
      setErrorMessage("mock social sign-in ไม่สำเร็จ");
      return;
    }

    startTransition(() => {
      router.push(result?.url ?? getRoleHomePath(account.role));
      router.refresh();
    });
  };

  const handleDemoSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setErrorMessage("Email หรือ password ไม่ถูกต้อง");
      return;
    }

    startTransition(() => {
      router.push(result?.url ?? callbackUrl);
      router.refresh();
    });
  };

  const signInWithRolePreset = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  const handleSocialSignIn = async (
    provider: "google" | "facebook",
    configured: boolean,
  ) => {
    setErrorMessage(null);

    if (configured) {
      await signIn(provider, { callbackUrl });
      return;
    }

    if (!demoProviderEnabled || !mockSocialAccount) {
      setErrorMessage("social mock ยังไม่พร้อมใน environment นี้");
      return;
    }

    await signInWithDemoAccount(mockSocialAccount);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="glass-panel rounded-[2rem] p-6 sm:p-7">
        <p className="text-sm uppercase tracking-[0.18em] text-[#6b705f]">OAuth / Social</p>
        <h2 className="type-heading-lg mt-2 font-display font-semibold text-[#111111]">
          Sign in ด้วย provider จริงหรือ mock social
        </h2>
        <p className="type-body mt-4 text-[#586257]">
          Google และ Facebook พร้อมต่อ provider จริงผ่าน env ได้ทันที ส่วนตอนนี้มี mock role accounts
          สำหรับ member, merchant และ platform admin
        </p>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={() => void handleSocialSignIn("google", hasGoogleProvider)}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition-all"
          >
            {hasGoogleProvider ? "Continue with Google" : "Continue with Google (mock)"}
          </button>

          <button
            type="button"
            onClick={() => void handleSocialSignIn("facebook", hasFacebookProvider)}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#1877f2] px-5 py-3 text-sm font-semibold text-white transition-all"
          >
            {hasFacebookProvider
              ? "Continue with Facebook"
              : "Continue with Facebook (mock)"}
          </button>
        </div>

        <div className="mt-6 rounded-[1.4rem] border border-[#111111]/8 bg-white/75 p-4">
          <p className="text-sm font-semibold text-[#111111]">Role presets</p>
          <div className="mt-3 grid gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => signInWithRolePreset(account)}
                className="flex items-center justify-between rounded-[1rem] border border-[#111111]/8 bg-white px-4 py-3 text-left text-sm"
              >
                <span>
                  {account.name}
                  <span className="mt-1 block text-xs text-[#6b705f]">
                    {account.email}
                  </span>
                </span>
                <span className="rounded-full bg-[#eef5dd] px-3 py-1 text-xs font-semibold text-[#48612e]">
                  {account.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </article>

      <article className="dark-panel rounded-[2rem] p-6 sm:p-7">
        <p className="text-sm uppercase tracking-[0.18em] text-white/55">Prototype access</p>
        <h2 className="type-heading-lg mt-2 font-display font-semibold text-white">
          Demo role sign-in
        </h2>
        <p className="type-body mt-4 text-white/72">
          local prototype นี้รองรับ role-based demo credentials เพื่อทดสอบ member, merchant และ platform admin
          flows ได้ทันที
        </p>

        {demoProviderEnabled ? (
          <form className="mt-6 grid gap-4" onSubmit={handleDemoSignIn}>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                className="rounded-[1.2rem] border border-white/10 bg-white/7 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="rounded-[1.2rem] border border-white/10 bg-white/7 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
              />
            </label>

            {errorMessage ? (
              <p className="rounded-[1.1rem] bg-[#4a1713] px-4 py-3 text-sm text-[#ffd6c9]">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#111111]"
            >
              {isPending ? "Signing in..." : "Sign in with selected demo role"}
            </button>
          </form>
        ) : (
          <div className="mt-6 rounded-[1.3rem] border border-white/10 bg-white/7 px-4 py-4 text-sm text-white/72">
            Demo credentials ถูกปิดอยู่ใน environment นี้
          </div>
        )}

        <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/7 p-4 text-sm text-white/72">
          <p className="font-semibold text-white">Role landing paths</p>
          <div className="mt-3 grid gap-2">
            {demoAccounts.map((account) => (
              <p key={account.email}>
                {account.role}: {getRoleHomePath(account.role)}
              </p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
