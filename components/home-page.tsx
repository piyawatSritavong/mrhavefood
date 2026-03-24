"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { TrackedDeepLinkButton } from "@/components/affiliate/tracked-deep-link-button";
import { AuthNavActions } from "@/components/auth/auth-nav-actions";
import { HeatmapCanvas } from "@/components/heatmap/heatmap-canvas";
import { AIEyes } from "@/components/ui/ai-eyes";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  comparisonApps,
  formatBaht,
  getBestOffer,
  getOfferForPlatform,
  heatZones,
  heroStats,
  navItems,
  type CompareScenario,
  type PlatformKey,
  type SectionId,
} from "@/lib/home-content";
import { buildPersonalizedRoutePlan } from "@/lib/route-engine";
import { useHomeStore } from "@/lib/stores/use-home-store";

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type HomePageProps = {
  scenarios: CompareScenario[];
};

function findScenarioById(scenarios: CompareScenario[], scenarioId: string) {
  return scenarios.find((scenario) => scenario.id === scenarioId);
}

type HeroPromptStarter = {
  id: string;
  label: string;
  prompt: string;
  icon: "budget" | "popular" | "compare" | "district";
};

type HeroChatOffer = {
  isBest: boolean;
  name: string;
  note: string;
  platform: PlatformKey;
  totalPrice: number;
};

type HeroChatStat = {
  helper: string;
  kind: "boxes" | "discount" | "eta";
  label: string;
  tone: "amber" | "mint" | "sky";
  value: string;
};

type HeroChatDeal = {
  cta: string;
  platform: PlatformKey;
  savingsCopy: string;
  scenarioId: string;
};

type HeroChatMessage = {
  deal?: HeroChatDeal;
  id: string;
  insight?: string;
  offers?: HeroChatOffer[];
  role: "assistant" | "user";
  showPromptStarters?: boolean;
  stats?: HeroChatStat[];
  subtext?: string;
  text: string;
};

type HeroAssistantReply = {
  bestOfferPlatform: PlatformKey;
  deal: HeroChatDeal;
  loaderSteps: string[];
  offers: HeroChatOffer[];
  scenario: CompareScenario;
  searchHint: string;
  stats: HeroChatStat[];
  subtext: string;
  summary: string;
  insight: string;
};

const heroPromptStarters: HeroPromptStarter[] = [
  {
    id: "budget-100",
    label: "งบ 100 บาท กินไรได้บ้าง",
    prompt: "ฉันงบ 100 บาท กินไรได้บ้าง",
    icon: "budget",
  },
  {
    id: "popular-nearby",
    label: "เมนูสุดฮิต",
    prompt: "เมนูฮิตวันนี้มีอะไรบ้าง",
    icon: "popular",
  },
  {
    id: "compare-krapao",
    label: "ราคากะเพราหมูวันนี้",
    prompt: "เทียบราคากะเพราให้หน่อย",
    icon: "compare",
  },
  {
    id: "lat-phrao",
    label: "ลาดพร้าวดีสุดคุ้ม",
    prompt: "แถวลาดพร้าวมีอะไรคุ้ม",
    icon: "district",
  },
];

const heroChatPlaceholders = [
  "วันนี้กินอะไรดี",
  "คะน้าหมูกรอบ งบไม่เกิน 120 รวมส่ง",
  "กะเพราหมูสับโซนลาดพร้าว",
  "ร้านถูกสุดวันนี้",
  "มีโปรอะไรบ้าง",
];

function getPlatformMeta(platform: PlatformKey) {
  return comparisonApps.find((app) => app.key === platform) ?? comparisonApps[0];
}

function scoreScenarioMatch(query: string, scenario: CompareScenario) {
  const haystacks = [
    { value: scenario.title.toLowerCase(), score: 5 },
    { value: scenario.restaurant.toLowerCase(), score: 6 },
    { value: scenario.district.toLowerCase(), score: 4 },
    { value: scenario.cuisine.toLowerCase(), score: 2 },
    ...scenario.tags.map((tag) => ({ value: tag.toLowerCase(), score: 2 })),
  ];

  return haystacks.reduce((total, haystack) => {
    if (query.includes(haystack.value)) {
      return total + haystack.score;
    }

    return total;
  }, 0);
}

function extractBudget(query: string) {
  const matchedNumber = query.match(/\d{2,4}/);

  if (!matchedNumber) {
    return null;
  }

  return Number(matchedNumber[0]);
}

function buildHeroAssistantReply(
  query: string,
  scenarios: CompareScenario[],
  fallbackScenario: CompareScenario,
): HeroAssistantReply {
  const normalizedQuery = query.trim().toLowerCase();
  const budget = extractBudget(normalizedQuery);
  const scoredScenarios = scenarios
    .map((scenario) => ({
      scenario,
      score: scoreScenarioMatch(normalizedQuery, scenario),
    }))
    .sort((itemA, itemB) => itemB.score - itemA.score);

  let chosenScenario =
    scoredScenarios[0]?.score > 0 ? scoredScenarios[0].scenario : fallbackScenario;

  if (budget && scoredScenarios[0]?.score === 0) {
    const scenariosWithinBudget = scenarios
      .map((scenario) => ({
        bestOffer: getBestOffer(scenario),
        scenario,
      }))
      .filter((item) => item.bestOffer.totalPrice <= budget)
      .sort((itemA, itemB) => itemA.bestOffer.totalPrice - itemB.bestOffer.totalPrice);

    if (scenariosWithinBudget.length) {
      chosenScenario = scenariosWithinBudget[0].scenario;
    }
  }

  if (normalizedQuery.includes("ลาดพร้าว")) {
    const latPhraoScenario = scenarios.find((scenario) =>
      scenario.district.toLowerCase().includes("thonglor")
        ? false
        : scenario.district.toLowerCase().includes("lat phrao"),
    );

    if (latPhraoScenario) {
      chosenScenario = latPhraoScenario;
    }
  }

  const orderedOffers = [...chosenScenario.platforms].sort(
    (offerA, offerB) => offerA.totalPrice - offerB.totalPrice,
  );
  const bestOffer = orderedOffers[0] ?? getBestOffer(chosenScenario);
  const priciestOffer = orderedOffers[orderedOffers.length - 1] ?? bestOffer;
  const savings = Math.max(16, priciestOffer.totalPrice - bestOffer.totalPrice);
  const socialProofCount = Math.round(
    96 + chosenScenario.rating * 8 + bestOffer.etaMinutes + savings * 0.8,
  );
  const bestPlatformMeta = getPlatformMeta(bestOffer.platform);
  const districtLabel =
    chosenScenario.district.toLowerCase() === "lat phrao"
      ? "ลาดพร้าว"
      : chosenScenario.district;
  const offers = orderedOffers.map((offer) => ({
    isBest: offer.platform === bestOffer.platform,
    name: getPlatformMeta(offer.platform).name,
    note: offer.note,
    platform: offer.platform,
    totalPrice: offer.totalPrice,
  }));

  return {
    bestOfferPlatform: bestOffer.platform,
    deal: {
      cta: `สั่งเลย ประหยัดไป ${formatBaht(savings)}`,
      platform: bestOffer.platform,
      savingsCopy: `ลดจาก ${formatBaht(priciestOffer.totalPrice)}`,
      scenarioId: chosenScenario.id,
    },
    loaderSteps: [
      "[Loading...] กวาดข้อมูลจาก Grab / LINE MAN / ShopeeFood",
      `[Done] ตรวจสอบราคาสุทธิของ ${chosenScenario.title}`,
      `[Finalizing] ล็อกดีล ${bestPlatformMeta.name} ที่คุ้มที่สุดให้คุณ`,
    ],
    offers,
    scenario: chosenScenario,
    searchHint: chosenScenario.restaurant,
    stats: [
      {
        helper: "orders",
        kind: "boxes",
        label: "กล่องฮิตวันนี้",
        tone: "amber",
        value: socialProofCount.toLocaleString("en-US"),
      },
      {
        helper: "vs. app แพงสุด",
        kind: "discount",
        label: "ส่วนต่างที่ประหยัด",
        tone: "mint",
        value: formatBaht(savings),
      },
      {
        helper: bestPlatformMeta.name,
        kind: "eta",
        label: "ส่งถึงไวสุด",
        tone: "sky",
        value: `${bestOffer.etaMinutes} min`,
      },
    ],
    subtext: budget
      ? `สำหรับงบใกล้ ${formatBaht(budget)} ดีลนี้คุมราคาได้ดีที่สุดตอนนี้`
      : "ผมเทียบราคา, ค่าส่ง และส่วนลดให้แบบเรียลไทม์จากชุดข้อมูลหน้าเว็บนี้แล้ว",
    summary: `ผมหาให้แล้ว ${chosenScenario.title} จาก ${chosenScenario.restaurant} คุ้มสุดบน ${bestPlatformMeta.name} สุทธิ ${formatBaht(bestOffer.totalPrice)}`,
    insight:
      districtLabel === "ลาดพร้าว"
        ? `วันนี้ชาวลาดพร้าวสั่งเมนูนี้ไปแล้ว ${socialProofCount} กล่อง คุณคือรายที่ ${socialProofCount + 1}!`
        : `ตอนนี้ย่าน ${districtLabel} มี signal ราคาดีขึ้น ${Math.max(4, bestOffer.discount + 5)}% และมีคนสั่งเมนูนี้ไปแล้ว ${socialProofCount} กล่อง`,
  };
}

export function HomePage({
  scenarios,
}: HomePageProps) {
  const activeSection = useHomeStore((state) => state.activeSection);
  const searchQuery = useHomeStore((state) => state.searchQuery);
  const selectedScenarioId = useHomeStore((state) => state.selectedScenarioId);
  const selectedPlatform = useHomeStore((state) => state.selectedPlatform);
  const favoriteScenarioIds = useHomeStore((state) => state.favoriteScenarioIds);
  const priceAlerts = useHomeStore((state) => state.priceAlerts);
  const rewardPoints = useHomeStore((state) => state.rewardPoints);
  const latestReceipt = useHomeStore((state) => state.latestReceipt);
  const setActiveSection = useHomeStore((state) => state.setActiveSection);
  const setSearchQuery = useHomeStore((state) => state.setSearchQuery);
  const setSelectedScenario = useHomeStore((state) => state.setSelectedScenario);
  const setSelectedPlatform = useHomeStore((state) => state.setSelectedPlatform);
  const toggleFavoriteScenario = useHomeStore((state) => state.toggleFavoriteScenario);
  const createPriceAlert = useHomeStore((state) => state.createPriceAlert);
  const applyReceiptAnalysis = useHomeStore((state) => state.applyReceiptAnalysis);
  const [heroChatInput, setHeroChatInput] = useState("");
  const [heroMessages, setHeroMessages] = useState<HeroChatMessage[]>([
    {
      id: "hero-assistant-intro",
      insight: "ทางลัด เพื่อให้ฉันหาข้อมูลได้เร็วขึ้น",
      role: "assistant",
      showPromptStarters: true,
      subtext: "ไม่รู้จะกินอะไร พิมถามฉันได้เลย ฉันจะหาร้านที่คุ้มที่สุดให้",
      text: "Mr.AI คิดอะไรไม่ บอก",
    },
  ]);
  const [heroLoaderSteps, setHeroLoaderSteps] = useState<string[]>([]);
  const [heroLoaderStepIndex, setHeroLoaderStepIndex] = useState(0);
  const [isHeroThinking, setIsHeroThinking] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const heroThreadRef = useRef<HTMLDivElement | null>(null);
  const heroTimerIds = useRef<number[]>([]);
  const defaultScenario = scenarios[0];
  const clearHeroTimers = () => {
    heroTimerIds.current.forEach((timerId) => window.clearTimeout(timerId));
    heroTimerIds.current = [];
  };

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

      if (!closestSection) {
        return;
      }

      const section = closestSection.dataset.sectionId as SectionId | undefined;

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

  useEffect(() => {
    if (
      !latestReceipt ||
      latestReceipt.status !== "processing" ||
      latestReceipt.ocrConfidence !== null ||
      latestReceipt.reviewStatus !== "queued"
    ) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    void (async () => {
      try {
        const response = await fetch("/api/receipt-ocr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiptId: latestReceipt.id,
            scenarioId: latestReceipt.scenarioId,
            platform: latestReceipt.platform,
            fileName: latestReceipt.fileName,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          confidence: number;
          fraudSignals: string[];
          pointsAwarded: number;
          receiptId: string;
          reviewStatus: "auto-approved" | "human-review";
          truthScore: number;
        };

        if (!cancelled) {
          applyReceiptAnalysis(payload);
        }
      } catch (error) {
        if (!cancelled && error instanceof Error && error.name !== "AbortError") {
          return;
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [applyReceiptAnalysis, latestReceipt]);

  useEffect(() => () => clearHeroTimers(), []);

  useEffect(() => {
    const thread = heroThreadRef.current;

    if (!thread) {
      return;
    }

    thread.scrollTo({
      behavior: "smooth",
      top: thread.scrollHeight,
    });
  }, [heroLoaderStepIndex, heroMessages, isHeroThinking]);

  const deferredSearchQuery = useDeferredValue(searchQuery);

  if (!defaultScenario) {
    return null;
  }

  const filteredScenarios = scenarios.filter((scenario) => {
    if (!deferredSearchQuery.trim()) {
      return true;
    }

    const haystack = [
      scenario.title,
      scenario.restaurant,
      scenario.district,
      scenario.cuisine,
      ...scenario.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(deferredSearchQuery.trim().toLowerCase());
  });

  const visibleScenarios = filteredScenarios.slice(0, 3);
  const selectedScenario =
    findScenarioById(scenarios, selectedScenarioId) ?? defaultScenario;
  const scenarioOffers = [...selectedScenario.platforms].sort(
    (offerA, offerB) => offerA.totalPrice - offerB.totalPrice,
  );
  const bestOffer = getBestOffer(selectedScenario);
  const selectedOffer =
    getOfferForPlatform(selectedScenario, selectedPlatform) ?? bestOffer;
  const selectedPlatformMeta =
    comparisonApps.find((app) => app.key === selectedOffer.platform) ??
    comparisonApps[0];
  const outboundOrderStats = comparisonApps.map((app, index) => {
    const orderCount = scenarios.reduce((total, scenario) => {
      const offer = getOfferForPlatform(scenario, app.key);

      if (!offer) {
        return total;
      }

      return (
        total +
        Math.round(
          160 +
            scenario.rating * 42 +
            offer.etaMinutes * 3 +
            Math.max(0, 225 - offer.totalPrice),
        )
      );
    }, 0) + index * 47;

    return {
      key: app.key,
      name: app.name,
      orderCount,
      growthCopy:
        index === 0
          ? "+12% จากสัปดาห์ก่อน"
          : index === 1
            ? "+18% conversion ดีสุด"
            : "+9% จากโค้ดส่งฟรี",
    };
  });
  const rankedOutboundOrderStats = [...outboundOrderStats]
    .sort((itemA, itemB) => itemB.orderCount - itemA.orderCount)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      badgeSrc: `/assets/pixelBadgeTop${index + 1}.png`,
      badgeAlt: `Top ${index + 1} badge`,
    }));
  const podiumOrderStats = [
    rankedOutboundOrderStats.find((item) => item.rank === 2),
    rankedOutboundOrderStats.find((item) => item.rank === 1),
    rankedOutboundOrderStats.find((item) => item.rank === 3),
  ].filter((item): item is (typeof rankedOutboundOrderStats)[number] => Boolean(item));
  const selectedScenarioIsFavorite = favoriteScenarioIds.includes(
    selectedScenario.id,
  );
  const scenarioAlerts = priceAlerts.filter(
    (alert) => alert.scenarioId === selectedScenario.id,
  );
  const routePlan = buildPersonalizedRoutePlan({
    favoriteScenarioIds,
    priceAlerts,
    scenarios,
  });
  const routePlanTotalSaving = routePlan.reduce(
    (total, stop) => total + stop.saving,
    0,
  );
  const alertPresets = Array.from(
    new Set(
      [bestOffer.totalPrice - 8, bestOffer.totalPrice - 16, bestOffer.totalPrice - 24].filter(
        (price) => price > 79,
      ),
    ),
  );
  const worthItIndex = Math.max(
    68,
    Math.min(
      97,
      Math.round(
        selectedScenario.rating * 15 +
          selectedOffer.discount * 1.5 -
          selectedOffer.deliveryFee,
      ),
    ),
  );
  const gaugeAngle = -90 + worthItIndex * 1.8;
  const liveDealItems = scenarios.slice(0, 6).map((scenario, index) => {
    const lowestOffer = getBestOffer(scenario);
    const highestOffer = [...scenario.platforms].sort(
      (offerA, offerB) => offerB.totalPrice - offerA.totalPrice,
    )[0];
    const savings = Math.max(11, highestOffer.totalPrice - lowestOffer.totalPrice);

    return {
      id: scenario.id,
      title: `User_${String(index + 1).padStart(2, "0")} เพิ่งประหยัด ${formatBaht(savings)}`,
      detail: `จาก ${scenario.title} ที่ ${scenario.restaurant} • ${scenario.district} (Verified Receipt)`,
      badge: index % 2 === 0 ? "verified" : "live",
    };
  });

  const runHeroAssistant = (prompt: string) => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      return;
    }

    clearHeroTimers();
    const reply = buildHeroAssistantReply(trimmedPrompt, scenarios, selectedScenario);

    setHeroChatInput("");
    setSearchQuery(reply.searchHint);
    setSelectedScenario(reply.scenario.id);
    setSelectedPlatform(reply.bestOfferPlatform);
    setHeroMessages((current) => {
      const userMessage: HeroChatMessage = {
        id: `hero-user-${Date.now()}`,
        role: "user",
        text: trimmedPrompt,
      };

      return [...current, userMessage].slice(-5);
    });
    setHeroLoaderSteps(reply.loaderSteps);
    setHeroLoaderStepIndex(0);
    setIsHeroThinking(true);

    heroTimerIds.current.push(
      window.setTimeout(() => {
        setHeroLoaderStepIndex(1);
      }, 700),
    );
    heroTimerIds.current.push(
      window.setTimeout(() => {
        setHeroLoaderStepIndex(2);
      }, 1450),
    );
    heroTimerIds.current.push(
      window.setTimeout(() => {
        setIsHeroThinking(false);
        setHeroMessages((current) => {
          const assistantMessage: HeroChatMessage = {
            deal: reply.deal,
            id: `hero-assistant-${Date.now()}`,
            insight: reply.insight,
            offers: reply.offers,
            role: "assistant",
            stats: reply.stats,
            subtext: reply.subtext,
            text: reply.summary,
          };

          return [...current, assistantMessage].slice(-5);
        });
      }, 2250),
    );
  };

  const handleNavClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
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
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-28 bg-gradient-to-b from-[#f6f0e1]/90 via-[#f6f0e1]/55 to-transparent" />

      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/45 bg-white/55 px-3 py-2 shadow-[0_18px_70px_rgba(35,24,16,0.1)] backdrop-blur-2xl">
          <a
            href="#vision"
            className="flex items-center gap-3"
            onClick={(event) => handleNavClick(event, "vision")}
          >
            <span className="grid size-11 place-items-center rounded-full bg-[linear-gradient(135deg,#ff8d33,#274d32)] font-display text-sm font-bold text-white">
              MF
            </span>
            <div>
              <p className="font-display text-[0.95rem] font-semibold text-[#121517]">
                MrHaveFood.com
              </p>
              <p className="text-[0.72rem] tracking-[0.22em] text-[#5d6157] uppercase">
                Smart Layer for Savvy Eaters
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
                    className={classes(
                      "rounded-full px-4 py-2 transition-all",
                      activeSection === item.section
                        ? "bg-[#111111] text-white"
                        : "hover:bg-white/70",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <AuthNavActions />
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
                  className={classes(
                    "rounded-full px-3 py-1 text-xs font-semibold tracking-[0.18em] text-white transition-opacity",
                    activeSection === item.section
                      ? "bg-[#111111] opacity-100"
                      : "bg-[#111111] opacity-0 group-hover:opacity-100",
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={classes(
                    "block size-3 rounded-full border shadow-[0_0_0_6px_rgba(255,255,255,0.22)] transition-transform",
                    activeSection === item.section
                      ? "scale-125 border-[#111111] bg-[#111111]"
                      : "border-[#111111]/30 bg-white/80 group-hover:scale-125",
                  )}
                />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <main>
        <section
          id="vision"
          data-section-id="vision"
          className="section-shell home-hero-scene scroll-mt-24"
        >
          <BackgroundGradientAnimation containerClassName="hero-gradient-shell" />

          <div className="section-frame max-w-7xl">
            <div className="hero-wow-shell">
              <div className="home-hero-copy">
                <h1 className="home-hero-title">
                  Mr Have Food
                </h1>
                <p className="home-hero-subcopy type-body">
                  วันนี้กินอะไรดี เดี๋ยว MrHaveFood หาเจ้าที่ถูกที่สุดให้
                </p>

                <section className="hero-assistant-shell glass-panel" aria-label="AI deal assistant">
                  <div className="hero-chat-board">
                    <div ref={heroThreadRef} className="hero-chat-thread">
                      {heroMessages.map((message) => {
                        const highestPrice = message.offers
                          ? Math.max(...message.offers.map((offer) => offer.totalPrice))
                          : 0;

                        return (
                          <article
                            key={message.id}
                            className={classes(
                              "hero-chat-message",
                              message.role === "user"
                                ? "is-user"
                                : "is-assistant",
                            )}
                          >
                            <div className="hero-chat-bubble">
                              <p className="type-body text-current text-center">{message.text}</p>
                              {message.subtext ? (
                                <p className="type-caption text-center mt-2 opacity-80">{message.subtext}</p>
                              ) : null}

                              {message.offers ? (
                                <div className="hero-offer-board">
                                  {message.offers.map((offer) => (
                                    <div
                                      key={`${message.id}-${offer.platform}`}
                                      className={classes(
                                        "hero-offer-card",
                                        offer.isBest ? "is-best" : "",
                                      )}
                                    >
                                      <div className="flex items-center justify-between gap-3">
                                        <div>
                                          <p className="type-heading-sm text-[#111111]">
                                            {offer.name}
                                          </p>
                                          <p className="type-caption mt-1 text-[#5f695c]">
                                            {offer.note}
                                          </p>
                                        </div>
                                        <p className="type-heading-md type-price text-[#111111]">
                                          {formatBaht(offer.totalPrice)}
                                        </p>
                                      </div>
                                      <div className="hero-offer-bar-track mt-3">
                                        <span
                                          className={classes(
                                            "hero-offer-bar-fill",
                                            offer.isBest ? "is-best" : "",
                                          )}
                                          style={{
                                            width: `${Math.max(
                                              34,
                                              Math.round((highestPrice / offer.totalPrice) * 100),
                                            )}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : null}

                              {message.stats ? (
                                <div className="hero-stat-grid">
                                  {message.stats.map((stat) => (
                                    <div
                                      key={`${message.id}-${stat.label}`}
                                      className={classes(
                                        "hero-stat-card",
                                        `tone-${stat.tone}`,
                                      )}
                                    >
                                      <span
                                        className={classes(
                                          "hero-stat-glyph",
                                          `kind-${stat.kind}`,
                                        )}
                                        aria-hidden="true"
                                      >
                                        <span />
                                        <span />
                                        <span />
                                      </span>
                                      <div>
                                        <p className="type-caption uppercase tracking-[0.14em] opacity-75">
                                          {stat.label}
                                        </p>
                                        <p className="type-stat-sm mt-1 text-current">
                                          {stat.value}
                                        </p>
                                        <p className="type-caption mt-1 opacity-75">
                                          {stat.helper}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : null}

                              {message.insight ? (
                                <div className="hero-insight-card">
                                  <p className="type-body text-[#384538]">{message.insight}</p>
                                  {message.showPromptStarters ? (
                                    <div className="hero-starter-row is-insight" aria-label="Prompt starters">
                                      {heroPromptStarters.map((starter) => (
                                        <HoverBorderGradient
                                          key={`${message.id}-${starter.id}`}
                                          onClick={() => runHeroAssistant(starter.prompt)}
                                          innerClassName="hero-starter-chip"
                                        >
                                          <span
                                            className={classes(
                                              "hero-starter-icon",
                                              `is-${starter.icon}`,
                                            )}
                                            aria-hidden="true"
                                          />
                                          <span>{starter.label}</span>
                                        </HoverBorderGradient>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              ) : null}

                              {message.deal ? (
                                <TrackedDeepLinkButton
                                  platform={message.deal.platform}
                                  scenarioId={message.deal.scenarioId}
                                  surface="home"
                                  className="hero-deal-lock-button"
                                  wrapperClassName="hero-deal-lock-shell"
                                >
                                  <span>{message.deal.cta}</span>
                                  <span className="hero-deal-lock-subcopy">
                                    {message.deal.savingsCopy}
                                  </span>
                                </TrackedDeepLinkButton>
                              ) : null}
                            </div>
                          </article>
                        );
                      })}

                      {isHeroThinking ? (
                        <article className="hero-chat-message is-assistant">
                          <div className="hero-chat-bubble">
                            <p className="type-body text-current">
                              กำลังสแกนหาดีลที่ดีที่สุดให้คุณ...
                            </p>
                            <div className="mt-4">
                              <MultiStepLoader
                                steps={heroLoaderSteps}
                                activeStep={heroLoaderStepIndex}
                              />
                            </div>
                          </div>
                        </article>
                      ) : null}
                    </div>

                    <div className="hero-chat-input-shell">
                      <PlaceholdersAndVanishInput
                        placeholders={heroChatPlaceholders}
                        value={heroChatInput}
                        onValueChange={setHeroChatInput}
                        onSubmit={runHeroAssistant}
                        disabled={isHeroThinking}
                        buttonLabel={isHeroThinking ? "Thinking..." : "Ask AI"}
                        buttonContent={<AIEyes disabled={isHeroThinking} />}
                      />
                    </div>
                  </div>
                </section>

                <ul className="home-hero-stats" aria-label="Key platform stats">
                  {heroStats.map((stat) => (
                    <li key={stat.label} className="hero-stat-chip">
                      <p className="type-stat-sm text-[#111111]">{stat.value}</p>
                      <p className="type-caption mt-1 text-[#5f695c]">{stat.label}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          id="compare"
          data-section-id="compare"
          className="section-shell home-section-muted scroll-mt-24"
        >
          <div className="section-frame max-w-7xl">
            <div className="max-w-3xl">
              <p className="section-kicker">Value Showcase</p>
              <h2 className="type-display-page mt-4 text-[#111111]">
                Bento Grid ที่เล่า value ของ MrHaveFood แบบเร็ว ชัด และไม่เหมือนเอกสาร
              </h2>
              <p className="type-body mt-5 text-[#556054]">
                4 cards ด้านล่างนี้คือ hook หลักที่บอกทันทีว่าเว็บนี้มีทั้งแรงส่ง order จริง, receipt verification,
                worth-it index และ reward loop อยู่ในหน้าเดียว
              </p>
            </div>

            <div className="compare-podium-shell soft-card mt-10 rounded-[2.4rem] p-6 sm:p-8">
              <div className="mx-auto max-w-3xl text-center">
                <p className="type-caption uppercase tracking-[0.18em] text-[#6b705f]">
                  Comparison
                </p>
                <h3 className="type-heading-lg mt-3 text-[#111111]">
                  ยอดออเดอร์ที่ถูกส่งต่อจาก MrHaveFood ไปยังแอปเดลิเวอรี่
                </h3>
                <p className="type-body mt-3 text-[#556054]">
                  แสดงอันดับแพลตฟอร์มที่ user กดออกไปสั่งมากที่สุดจากหน้า compare ของเราในตอนนี้
                </p>
              </div>

              <div className="compare-podium-stage mt-8" aria-label="Outbound order ranking">
                {podiumOrderStats.map((item) => (
                  <article
                    key={item.key}
                    className={classes(
                      "compare-podium-card",
                      item.rank === 1
                        ? "is-rank-one"
                        : item.rank === 2
                          ? "is-rank-two"
                          : "is-rank-three",
                    )}
                  >
                    <div className="compare-podium-card-top">
                      <p className="type-caption uppercase tracking-[0.18em] text-[#6b705f]">
                        {item.name}
                      </p>
                      <p className="type-caption mt-2 text-[#6b705f]">
                        {item.growthCopy}
                      </p>
                    </div>

                    <div className="compare-podium-number-wrap">
                      <p className={classes("compare-podium-number", `rank-${item.rank}`)}>
                        {item.orderCount.toLocaleString("en-US")}
                      </p>
                      <Image
                        src={item.badgeSrc}
                        alt={item.badgeAlt}
                        width={144}
                        height={144}
                        className="compare-podium-badge"
                      />
                    </div>

                    <div className="compare-podium-base">
                      <span className="compare-podium-rank">{item.rank}</span>
                    </div>
                  </article>
                ))}
              </div>

              <p className="type-caption mt-6 text-center text-[#64705e]">
                Mock outbound traffic snapshot อัปเดตตาม scenario set ปัจจุบัน
              </p>
            </div>

            <div className="compare-support-row mt-6 flex flex-col gap-4 xl:flex-row">
              <article className="compare-support-card flex-1">
                <div>
                  <p className="type-heading-md text-[#111111]">Verified</p>
                  <p className="type-body mt-2 text-[#556054]">
                    ใบเสร็จจริงพร้อมตรา verified ช่วยให้ราคาและรีวิวดูน่าเชื่อถือมากขึ้น
                  </p>
                </div>

                <div className="pixel-receipt-card mt-5">
                  <div className="pixel-receipt-sheet">
                    <Image
                      src="/assets/pixelBadge.png"
                      alt="Verified badge"
                      width={220}
                      height={104}
                      className="pixel-receipt-badge-art"
                    />
                    <p className="type-caption uppercase tracking-[0.18em] text-[#6b705f]">
                      {latestReceipt ? latestReceipt.fileName : "receipt-proof.png"}
                    </p>
                    <p className="type-heading-sm mt-3 text-[#111111]">
                      {latestReceipt?.itemName ?? selectedScenario.title}
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="pixel-receipt-line">
                        <span>ร้าน</span>
                        <span>{selectedScenario.restaurant}</span>
                      </div>
                      <div className="pixel-receipt-line">
                        <span>สุทธิ</span>
                        <span>{formatBaht(selectedOffer.totalPrice)}</span>
                      </div>
                      <div className="pixel-receipt-line">
                        <span>status</span>
                        <span>
                          {latestReceipt?.status === "verified" ? "Verified" : "Ready to verify"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="compare-support-card flex-1">
                <div>
                  <p className="type-heading-md text-[#111111]">Worth-it Index</p>
                  <p className="type-body mt-2 text-[#556054]">
                    หน้าปัดมาตรวัดสไตล์ pixel ที่รวมราคา, ค่าส่ง, ส่วนลด และ rating ไว้ในคะแนนเดียว
                  </p>
                </div>

                <div className="pixel-gauge-shell mt-5">
                  <div
                    className="pixel-gauge-meter"
                    style={
                      {
                        "--gauge-angle": `${gaugeAngle}deg`,
                        "--gauge-progress": `${worthItIndex}%`,
                      } as CSSProperties
                    }
                  >
                    <div className="pixel-gauge-arc" />
                    <span className="pixel-gauge-needle" />
                    <div className="pixel-gauge-center">
                      <p className="type-stat text-[#111111]">{worthItIndex}</p>
                      <p className="type-caption uppercase tracking-[0.16em] text-[#6b705f]">
                        worth-it score
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="type-caption uppercase tracking-[0.16em] text-[#64705e]">
                      low value
                    </p>
                    <p className="type-caption text-center text-[#64705e]">
                      คะแนนรวมจากราคา, ค่าส่ง, ส่วนลด และ rating
                    </p>
                    <p className="type-caption uppercase tracking-[0.16em] text-[#64705e]">
                      peak value
                    </p>
                  </div>
                </div>
              </article>

              <article className="compare-support-card flex-1">
                <div>
                  <p className="type-heading-md text-[#111111]">Reward</p>
                  <p className="type-body mt-2 text-[#556054]">
                    หีบสมบัติ pixel ที่สื่อว่าการอัปโหลดใบเสร็จจะปลดล็อก coins และแต้มสะสมทันที
                  </p>
                </div>

                <div className="pixel-reward-stage mt-5">
                  <div className="pixel-chest">
                    <span className="pixel-chest-lid" />
                  </div>
                  <span className="pixel-reward-coin coin-one" />
                  <span className="pixel-reward-coin coin-two" />
                  <span className="pixel-reward-coin coin-three" />
                </div>

                <div className="mt-5">
                  <span className="pixel-mini-badge">Wallet now: {rewardPoints} pts</span>
                </div>
              </article>
            </div>

            <div className="mt-10">
              <p className="section-kicker">Live Deals</p>
              <h3 className="type-heading-lg mt-4 text-[#111111]">
                การประหยัดล่าสุดจากผู้ใช้จริง
              </h3>
              <div className="mt-5">
                <InfiniteMovingCards items={liveDealItems} />
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="soft-card rounded-[2.2rem] p-6 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="type-caption uppercase tracking-[0.18em] text-[#6b705f]">
                      Floating result queue
                    </p>
                    <h3 className="type-heading-lg mt-2 text-[#111111]">
                      ผลลัพธ์ที่น่ากดสั่งตอนนี้
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavoriteScenario(selectedScenario.id)}
                    className={classes(
                      "rounded-full px-4 py-2 text-sm transition-all",
                      selectedScenarioIsFavorite
                        ? "bg-[#111111] text-white"
                        : "border border-[#111111]/10 bg-white text-[#111111]",
                    )}
                  >
                    {selectedScenarioIsFavorite ? "saved" : "save favorite"}
                  </button>
                </div>

                <div className="mt-5 rounded-[1.4rem] border border-[#111111]/10 bg-white px-4 py-3">
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="ค้นหาเมนู, ร้าน หรือย่าน"
                    className="w-full bg-transparent text-sm text-[#111111] outline-none placeholder:text-[#7f8879]"
                  />
                </div>

                <div className="mt-5 space-y-3">
                  {visibleScenarios.map((scenario) => {
                    const scenarioBestOffer = getBestOffer(scenario);
                    const isSelected = selectedScenario.id === scenario.id;

                    return (
                      <button
                        key={scenario.id}
                        type="button"
                        onClick={() => setSelectedScenario(scenario.id)}
                        className={classes(
                          "flex w-full items-start justify-between gap-4 rounded-[1.5rem] border px-4 py-4 text-left transition-all",
                          isSelected
                            ? "border-[#111111]/18 bg-[#fff8e8] shadow-[0_16px_40px_rgba(31,28,22,0.08)]"
                            : "border-[#111111]/8 bg-white/72 hover:bg-white",
                        )}
                      >
                        <div>
                          <p className="type-heading-sm text-[#111111]">{scenario.title}</p>
                          <p className="mt-1 text-sm text-[#5d6258]">
                            {scenario.restaurant} • {scenario.district}
                          </p>
                          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#7a836f]">
                            {scenario.tags.slice(0, 3).join(" • ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="type-heading-md type-price text-[#111111]">
                            {formatBaht(scenarioBestOffer.totalPrice)}
                          </p>
                          <p className="mt-1 text-sm text-[#5d6258]">
                            {scenarioBestOffer.note}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="dark-panel rounded-[2.2rem] p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="type-caption uppercase tracking-[0.18em] text-white/60">
                      Selected compare breakdown
                    </p>
                    <h3 className="type-heading-lg mt-2 text-white">
                      {selectedScenario.title}
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#c8ff89] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#1f2813]">
                    {selectedScenario.district}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {scenarioOffers.map((offer) => {
                    const platformMeta =
                      comparisonApps.find((app) => app.key === offer.platform) ??
                      comparisonApps[0];

                    return (
                      <button
                        key={offer.platform}
                        type="button"
                        onClick={() => setSelectedPlatform(offer.platform)}
                        className={classes(
                          "flex w-full items-center justify-between rounded-[1.4rem] border px-4 py-4 text-left transition-all",
                          selectedOffer.platform === offer.platform
                            ? "border-white/18 bg-white/12"
                            : "border-white/10 bg-white/7",
                        )}
                      >
                        <div>
                          <p className="text-sm text-white/62">{platformMeta.name}</p>
                          <p className="type-heading-md type-price mt-1 text-white">
                            {formatBaht(offer.totalPrice)}
                          </p>
                        </div>
                        <div className="text-right text-sm text-white/74">
                          <p>{offer.note}</p>
                          <p className="mt-1">{offer.etaMinutes} min</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/7 p-4">
                  <p className="type-body text-white/78">
                    ตอนนี้ราคาที่เลือกคือ {formatBaht(selectedOffer.totalPrice)} บน{" "}
                    {selectedPlatformMeta.name} โดยมีค่าส่ง {formatBaht(selectedOffer.deliveryFee)} และส่วนลด{" "}
                    {formatBaht(selectedOffer.discount)}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {alertPresets.map((targetPrice) => {
                    const alreadyExists = scenarioAlerts.some(
                      (alert) =>
                        alert.platform === selectedOffer.platform &&
                        alert.targetPrice === targetPrice,
                    );

                    return (
                      <button
                        key={targetPrice}
                        type="button"
                        onClick={() =>
                          createPriceAlert({
                            scenarioId: selectedScenario.id,
                            platform: selectedOffer.platform,
                            targetPrice,
                          })
                        }
                        className={classes(
                          "rounded-full px-3 py-2 text-sm transition-all",
                          alreadyExists
                            ? "bg-[#c8ff89] text-[#1f2813]"
                            : "border border-white/10 bg-white/8 text-white",
                        )}
                      >
                        Alert {formatBaht(targetPrice)}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <TrackedDeepLinkButton
                    platform={selectedOffer.platform}
                    scenarioId={selectedScenario.id}
                    surface="home"
                    className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#111111]"
                  >
                    {selectedPlatformMeta.cta}
                  </TrackedDeepLinkButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="heatmap"
          data-section-id="heatmap"
          className="section-shell bg-white scroll-mt-24"
        >
          <div className="section-frame max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
              <div className="pixel-map-card">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="section-kicker">Interactive Highlight</p>
                    <h2 className="type-display-page mt-4 text-[#111111]">
                      Worth-it Heatmap Preview
                    </h2>
                    <p className="type-body mt-4 max-w-2xl text-[#556054]">
                      เปลี่ยนเป็น Google Maps embed เพื่อให้ user มอง location จริงได้ทันที แต่ยังคงวางอยู่ใน
                      หน้าต่าง preview ที่ดูสะอาดและอ่านง่ายบนพื้นหลังขาว
                    </p>
                  </div>
                  <span className="rounded-full bg-[#fff1d7] px-4 py-2 text-sm text-[#9b5e16]">
                    Google Map Embed
                  </span>
                </div>

                <div className="pixel-map-stage mt-8">
                  <div className="pixel-map-grid" aria-hidden="true" />
                  <div className="relative z-10 mx-auto max-w-[38rem]">
                    <HeatmapCanvas zones={heatZones} />
                  </div>
                </div>
              </div>

              <div>
                <p className="type-caption uppercase tracking-[0.18em] text-[#6b705f]">
                  Showcase / Heatmap
                </p>
                <h3 className="type-heading-lg mt-3 text-[#111111]">
                  พื้นหลังขาวคลีน และด้านในเปลี่ยนเป็นแผนที่ location จริงที่ฝังใช้งานได้ทันที
                </h3>
                <p className="type-body mt-5 text-[#556054]">
                  section นี้ถูกจัดให้ทำหน้าที่เป็น visual hook โดยเฉพาะ ทำให้ user เห็นทันทีว่า MrHaveFood
                  ไม่ได้มีแค่ตัวเลขเปรียบเทียบราคา แต่ยังมี map preview ที่ช่วยมองย่านคุ้มได้แบบ spatial
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.7rem] border border-[#111111]/8 bg-[#f8fafb] px-5 py-5">
                    <p className="type-caption uppercase tracking-[0.18em] text-[#6b705f]">
                      Worth-it zone
                    </p>
                    <p className="type-stat mt-2 text-[#111111]">Lat Phrao</p>
                    <p className="type-body mt-2 text-[#556054]">
                      ลาดพร้าวถูกปักเป็น hotspot หลักของรอบนี้ เพื่อโชว์จุดที่คุ้มที่สุดใน map preview
                    </p>
                  </div>
                  <div className="rounded-[1.7rem] border border-[#111111]/8 bg-[#f8fafb] px-5 py-5">
                    <p className="type-caption uppercase tracking-[0.18em] text-[#6b705f]">
                      Route saving
                    </p>
                    <p className="type-stat mt-2 text-[#111111]">
                      {formatBaht(routePlanTotalSaving)}
                    </p>
                    <p className="type-body mt-2 text-[#556054]">
                      วันนี้ route ที่ระบบจัดให้ลดค่าใช้จ่ายรวมได้ประมาณนี้
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {routePlan.map((stop) => (
                    <article
                      key={stop.id}
                      className="flex flex-col gap-3 rounded-[1.4rem] border border-[#111111]/8 bg-[#f8fafb] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm text-[#667161]">
                          {stop.time} • {stop.district}
                        </p>
                        <p className="type-heading-sm mt-1 text-[#111111]">{stop.item}</p>
                        <p className="type-body mt-1 text-[#556054]">{stop.reason}</p>
                      </div>
                      <span className="rounded-full bg-[#111111] px-4 py-2 text-sm text-white">
                        Save {formatBaht(stop.saving)}
                      </span>
                    </article>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/heatmap"
                    className="rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white"
                  >
                    เปิดแผนที่เต็ม
                  </Link>
                  <Link
                    href="/member"
                    className="rounded-full border border-[#111111]/10 bg-white px-5 py-3 text-sm font-semibold text-[#111111]"
                  >
                    ดู route ของฉัน
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
