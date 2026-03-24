"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "mr-have-food-theme";

function readThemeMode(): ThemeMode {
  if (typeof document === "undefined") {
    return "light";
  }

  const currentTheme = document.documentElement.dataset.theme;

  return currentTheme === "dark" ? "dark" : "light";
}

function applyThemeMode(nextTheme: ThemeMode) {
  document.documentElement.dataset.theme = nextTheme;
  window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}

export function ThemeToggle() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => readThemeMode());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const handleToggle = () => {
    const nextTheme = themeMode === "dark" ? "light" : "dark";

    setThemeMode(nextTheme);
    applyThemeMode(nextTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
      aria-pressed={themeMode === "dark"}
      onClick={handleToggle}
      className={cn(
        "theme-toggle-fab",
        themeMode === "dark" && "is-dark",
      )}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-knob">
          <span className="theme-toggle-core" />
        </span>
      </span>
      <span className="theme-toggle-copy">
        <span className="theme-toggle-label">
          {themeMode === "dark" ? "Dark mode" : "Light mode"}
        </span>
        <span className="theme-toggle-hint">
          {themeMode === "dark" ? "Switch to light" : "Switch to dark"}
        </span>
      </span>
    </button>
  );
}
