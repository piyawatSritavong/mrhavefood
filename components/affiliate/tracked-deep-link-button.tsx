"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { PlatformKey } from "@/lib/home-content";
import type { DeepLinkSurface } from "@/lib/product-types";
import { cn } from "@/lib/utils";

type TrackedDeepLinkButtonProps = {
  children: React.ReactNode;
  className: string;
  platform: PlatformKey;
  scenarioId: string;
  surface: DeepLinkSurface;
  wrapperClassName?: string;
};

export function TrackedDeepLinkButton({
  children,
  className,
  platform,
  scenarioId,
  surface,
  wrapperClassName,
}: TrackedDeepLinkButtonProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = async () => {
    setErrorMessage(null);

    const response = await fetch("/api/deeplink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        platform,
        scenarioId,
        surface,
      }),
    });

    if (!response.ok) {
      setErrorMessage("Mock deep link unavailable");
      return;
    }

    const payload = (await response.json()) as {
      href: string;
    };

    startTransition(() => {
      router.push(payload.href);
    });
  };

  return (
    <div className={cn("grid gap-2", wrapperClassName)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={className}
      >
        {isPending ? "Preparing handoff..." : children}
      </button>
      {errorMessage ? <p className="text-xs text-[#d15c32]">{errorMessage}</p> : null}
    </div>
  );
}
