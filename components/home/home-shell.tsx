"use client";

import type { MouseEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";

import { AuthNavActions } from "@/components/auth/auth-nav-actions";
import { cn } from "@/lib/cn";
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

  useEffect(() => {
    if (navItems.some((item) => item.section === activeSection)) {
      return;
    }

    setActiveSection("main");
  }, [activeSection, setActiveSection]);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-id]"),
    );

    if (!sections.length) {
      return;
    }

    let frameId = 0;

    const updateActiveSection = () => {
      frameId = 0;

      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 88;
      const probeY = Math.max(
        headerHeight + 24,
        Math.min(window.innerHeight * 0.42, headerHeight + 140),
      );

      const containingSection = sections.find((section) => {
        const rect = section.getBoundingClientRect();

        return rect.top <= probeY && rect.bottom >= probeY;
      });

      if (containingSection) {
        const section = containingSection.dataset.sectionId as SectionId | undefined;

        if (section) {
          setActiveSection(section);
        }

        return;
      }

      const closestSection = sections
        .map((section) => {
          const rect = section.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;

          return {
            distance: Math.abs(sectionCenter - probeY),
            section,
          };
        })
        .sort((sectionA, sectionB) => sectionA.distance - sectionB.distance)[0]?.section;

      const section = closestSection?.dataset.sectionId as SectionId | undefined;

      if (section) {
        setActiveSection(section);
      }
    };

    const queueActiveSectionUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();

    window.addEventListener("scroll", queueActiveSectionUpdate, {
      passive: true,
    });
    window.addEventListener("resize", queueActiveSectionUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", queueActiveSectionUpdate);
      window.removeEventListener("resize", queueActiveSectionUpdate);
    };
  }, [setActiveSection]);

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
    <>
      <div className="site-top-fade pointer-events-none fixed inset-x-0 top-0 z-40 h-28" />

      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-8"
      >
        <div className="site-header-shell mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full px-3 py-2 backdrop-blur-2xl">
          <a
            href="#main"
            className="flex items-center gap-3"
            onClick={(event) => handleNavClick(event, "main")}
          >
            <span className="grid size-11 place-items-center rounded-full bg-[linear-gradient(135deg,#ff8d33,#274d32)] font-display text-sm font-bold text-white">
              MF
            </span>
            <div>
              <p className="site-brand-title font-display text-[0.95rem] font-semibold">
                MrHaveFood.com
              </p>
            </div>
          </a>

          <nav
            aria-label="Primary sections"
            className="hidden lg:block"
          >
            <ol className="flex items-center gap-3 text-sm font-medium text-[#2e342e]">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={activeSection === item.section ? "page" : undefined}
                    onClick={(event) => handleNavClick(event, item.section)}
                    className={cn(
                      "site-nav-link rounded-full px-4 py-2 transition-all",
                      activeSection === item.section && "is-active",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="site-header-actions">
            <AuthNavActions />
          </div>
        </div>
      </header>

      <nav
        aria-label="Section progress"
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      >
        <ol className="flex flex-col gap-3">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(event) => handleNavClick(event, item.section)}
                className="group flex items-center justify-end gap-3"
                aria-current={activeSection === item.section ? "page" : undefined}
              >
                <span
                  className={cn(
                    "site-progress-label rounded-full px-3 py-1 text-xs font-semibold transition-opacity",
                    activeSection === item.section
                      ? "is-active opacity-100"
                      : "opacity-0 group-hover:opacity-100",
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    "site-progress-dot block size-3 rounded-full border transition-transform",
                    activeSection === item.section
                      ? "is-active scale-125"
                      : "is-inactive group-hover:scale-125",
                  )}
                />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <main>{children}</main>
    </>
  );
}
