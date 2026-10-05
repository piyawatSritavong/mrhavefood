"use client";

import { useEffect, useState } from "react";

import { CheckIcon, CopyIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type CopyCodeButtonProps = {
  code: string;
  className?: string;
};

export function CopyCodeButton({ code, className }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure context / permissions); the code stays visible to copy manually.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `คัดลอกโค้ด ${code} แล้ว` : `คัดลอกโค้ด ${code}`}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-colors",
        copied ? "bg-success-surface text-success" : "bg-surface-brand text-brand-primary hover:bg-surface-subtle",
        className,
      )}
    >
      {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
      <span aria-live="polite">{copied ? "คัดลอกแล้ว" : "คัดลอกโค้ด"}</span>
    </button>
  );
}
