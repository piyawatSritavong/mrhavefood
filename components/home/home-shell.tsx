"use client";

import type { MouseEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";

import { HeaderCta } from "@/components/home/header-cta";
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
    if (typeof window !== "undefined") {
      history.scrollRestoration = "manual";
    }
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = 0;
    }
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

  const navLinkClass = (section: SectionId) =>
    cn(
      "inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors duration-300",
      activeSection === section
        ? "bg-surface-brand text-brand-primary"
        : "text-ink-secondary hover:bg-surface-brand hover:text-brand-primary",
    );

  return (
    <div
      ref={scrollContainerRef}
      className="relative h-dvh overflow-x-hidden overflow-y-auto bg-surface scroll-smooth scroll-pt-36 lg:scroll-pt-24"
    >
      <header
        ref={headerRef}
        className="sticky top-0 z-40 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 lg:px-8 lg:py-4"
      >
        <div className="mx-auto max-w-7xl rounded-panel border border-border bg-surface/95 px-3 py-2 shadow-card backdrop-blur-md sm:px-4 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <a
              href="#main"
              onClick={(event) => handleNavClick(event, "main")}
              className="flex min-h-11 items-center"
            >
              <Image
                src="/assets/logo.webp"
                alt="MrHaveFood หน้าแรก"
                width={360}
                height={191}
                className="h-12 w-auto object-contain"
                priority
              />
            </a>

            <nav aria-label="เมนูหลัก" className="hidden lg:block">
              <ol className="flex items-center gap-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(event) => handleNavClick(event, item.section)}
                      aria-current={activeSection === item.section ? "location" : undefined}
                      className={navLinkClass(item.section)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <HeaderCta />
          </div>

          {/* Mobile section links */}
          <nav aria-label="เมนูหลัก (มือถือ)" className="-mx-1 mt-1 overflow-x-auto [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
            <ol className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(event) => handleNavClick(event, item.section)}
                    aria-current={activeSection === item.section ? "location" : undefined}
                    className={navLinkClass(item.section)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
