"use client";

import type { MouseEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";

import { AuthNavActions } from "@/components/auth/auth-nav-actions";
import { NavThemeButton } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";
import { navItems, type SectionId } from "@/lib/home-content";
import { useHomeStore } from "@/lib/stores/use-home-store";

type HomeShellProps = {
  children: ReactNode;
};

export function HomeShell({
  children,
}: HomeShellProps) {
  const activeSection = useHomeStore((state) => state.activeSection);
  const setActiveSection = useHomeStore((state) => state.setActiveSection);
  const headerRef = useRef<HTMLElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!navItems.some((item) => item.section === activeSection)) {
      setActiveSection("main");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initialise once on mount only

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    container.classList.add("page-snapping");

    return () => {
      container.classList.remove("page-snapping");
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-id]"),
    );

    if (!sections.length || !container) {
      return;
    }

    let frameId = 0;

    const updateActiveSection = () => {
      frameId = 0;

      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 80;
      const probeY = Math.max(headerHeight + 20, container.clientHeight * 0.26);

      const currentSection = sections.find((section) => {
        const rect = section.getBoundingClientRect();

        return rect.top <= probeY && rect.bottom >= probeY;
      });

      const nextSection = currentSection?.dataset.sectionId as SectionId | undefined;

      if (nextSection) {
        setActiveSection(nextSection);
      }
    };

    const queueUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();

    container.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      container.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
    };
  }, [setActiveSection]);

  const isHero = !["discover", "categories", "footer"].includes(activeSection as string);

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    section: SectionId,
  ) => {
    event.preventDefault();
    setActiveSection(section);

    const sectionElement = document.getElementById(section);

    if (!sectionElement) {
      return;
    }

    sectionElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `#${section}`);
  };

  return (
    <div
      ref={scrollContainerRef}
      className="relative h-dvh overflow-y-auto scroll-smooth scroll-pt-20 scroll-px-0"
      style={{
        backgroundImage: "url('/assets/banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      <header
        ref={headerRef}
        className="sticky top-0 z-40 px-4 py-4 sm:px-6 lg:px-8"
      >
        <div className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-3xl border px-3 py-2 backdrop-blur-md transition-all duration-300 sm:gap-4 sm:px-4 sm:py-3",
          isHero
            ? "border-white/15 bg-white/10"
            : "border-[#e3dddd] bg-white/95 shadow-[0_8px_30px_rgba(0,67,124,0.08)]",
        )}>
          <a
            href="#main"
            onClick={(event) => handleNavClick(event, "main")}
            className="flex items-center gap-3"
          >
            <span className="grid size-10 place-items-center rounded-full bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-accent))] font-display text-sm font-bold text-white">
              MF
            </span>
            <div className="hidden min-w-0 sm:block">
              <p className={cn(
                "font-display text-base font-bold leading-none transition-colors duration-300",
                isHero ? "text-white" : "text-(--brand-primary)",
              )}>
                MrHaveFood.com
              </p>
              <p className={cn(
                "mt-1 text-xs leading-none transition-colors duration-300",
                isHero ? "text-white/65" : "text-[#5b6d7d]",
              )}>
                Great promotions deals
              </p>
            </div>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ol className="flex items-center gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(event) => handleNavClick(event, item.section)}
                    aria-current={activeSection === item.section ? "page" : undefined}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300",
                      isHero
                        ? "text-white! hover:bg-white/10"
                        : "text-[#45627a] hover:bg-[#edf4fb] hover:text-(--brand-primary)",
                      activeSection === item.section && (
                        isHero ? "bg-white/15 text-white!" : "bg-[#edf4fb] text-(--brand-primary)"
                      ),
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex items-center gap-2">
            <NavThemeButton />
            <AuthNavActions />
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
