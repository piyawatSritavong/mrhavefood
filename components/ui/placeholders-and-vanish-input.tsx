"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type PlaceholdersAndVanishInputProps = {
  placeholders: string[];
  value: string;
  onValueChange: (nextValue: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  className?: string;
  buttonLabel?: string;
  buttonContent?: ReactNode;
};

export function PlaceholdersAndVanishInput({
  placeholders,
  value,
  onValueChange,
  onSubmit,
  disabled = false,
  className,
  buttonLabel = "ถามเลย",
  buttonContent,
}: PlaceholdersAndVanishInputProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [vanishingText, setVanishingText] = useState<string | null>(null);

  useEffect(() => {
    if (value || placeholders.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % placeholders.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [placeholders, value]);

  useEffect(() => {
    if (!vanishingText) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setVanishingText(null);
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [vanishingText]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedValue = value.trim();

    if (!trimmedValue || disabled) {
      return;
    }

    setVanishingText(trimmedValue);
    onSubmit(trimmedValue);
  };

  return (
    <form
      className={cn("hero-vanish-form", className)}
      onSubmit={handleSubmit}
    >
      <div className="hero-vanish-field">
        {vanishingText ? (
          <span className="hero-vanish-ghost" aria-hidden="true">
            {vanishingText}
          </span>
        ) : null}
        <input
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={value ? "" : placeholders[placeholderIndex]}
          className="hero-vanish-input"
          disabled={disabled}
        />
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="hero-vanish-submit"
        aria-label={buttonLabel}
      >
        {buttonContent ?? buttonLabel}
      </button>
    </form>
  );
}
