import {
  comparisonApps,
  formatBaht,
  getBestOffer,
  getOfferForPlatform,
  type CompareScenario,
  type PlatformKey,
} from "@/lib/home-content";

export type HeroPromptStarter = {
  id: string;
  label: string;
  prompt: string;
  icon: "budget" | "popular" | "compare" | "district";
};

export type HeroChatOffer = {
  isBest: boolean;
  name: string;
  note: string;
  platform: PlatformKey;
  totalPrice: number;
};

export type HeroChatStat = {
  helper: string;
  kind: "boxes" | "discount" | "eta";
  label: string;
  tone: "amber" | "mint" | "sky";
  value: string;
};

export type HeroChatDeal = {
  cta: string;
  platform: PlatformKey;
  savingsCopy: string;
  scenarioId: string;
};

export type HeroAssistantReply = {
  bestOfferPlatform: PlatformKey;
  deal: HeroChatDeal;
  loaderSteps: string[];
  offers: HeroChatOffer[];
  scenario: CompareScenario;
  searchHint: string;
  stats: HeroChatStat[];
  summary: string;
  insight: string;
};

export type RankedOutboundOrderStat = {
  badgeAlt: string;
  badgeSrc: string;
  growthCopy: string;
  key: PlatformKey;
  name: string;
  orderCount: number;
  rank: number;
};

export type HomeLiveDealItem = {
  badge?: string;
  detail: string;
  id: string;
  title: string;
};

export const heroPromptStarters: HeroPromptStarter[] = [
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

export const heroChatPlaceholders = [
  "วันนี้กินอะไรดี",
  "คะน้าหมูกรอบ งบไม่เกิน 120 รวมส่ง",
  "กะเพราหมูสับโซนลาดพร้าว",
  "ร้านถูกสุดวันนี้",
  "มีโปรอะไรบ้าง",
];

export function getPlatformMeta(platform: PlatformKey) {
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

export function buildHeroAssistantReply(
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
    summary: `ผมหาให้แล้ว ${chosenScenario.title} จาก ${chosenScenario.restaurant} คุ้มสุดบน ${bestPlatformMeta.name} สุทธิ ${formatBaht(bestOffer.totalPrice)}`,
    insight:
      districtLabel === "ลาดพร้าว"
        ? `วันนี้ชาวลาดพร้าวสั่งเมนูนี้ไปแล้ว ${socialProofCount} กล่อง คุณคือรายที่ ${socialProofCount + 1}!`
        : `ตอนนี้ย่าน ${districtLabel} มี signal ราคาดีขึ้น ${Math.max(4, bestOffer.discount + 5)}% และมีคนสั่งเมนูนี้ไปแล้ว ${socialProofCount} กล่อง`,
  };
}

export function buildOutboundOrderStats(
  scenarios: CompareScenario[],
): RankedOutboundOrderStat[] {
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

  return outboundOrderStats
    .sort((itemA, itemB) => itemB.orderCount - itemA.orderCount)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      badgeSrc: `/assets/pixelBadgeTop${index + 1}.png`,
      badgeAlt: `Top ${index + 1} badge`,
    }));
}

export function buildLiveDealItems(
  scenarios: CompareScenario[],
): HomeLiveDealItem[] {
  return scenarios.slice(0, 6).map((scenario, index) => {
    const lowestOffer = getBestOffer(scenario);
    const highestOffer = [...scenario.platforms].sort(
      (offerA, offerB) => offerB.totalPrice - offerA.totalPrice,
    )[0];
    const savings = Math.max(11, highestOffer.totalPrice - lowestOffer.totalPrice);

    return {
      id: scenario.id,
      title: `User_${String(index + 1).padStart(2, "0")} เพิ่งประหยัด ${formatBaht(savings)}`,
      detail: `จาก ${scenario.title} ที่ ${scenario.restaurant} • ${scenario.district}`,
      badge: index % 2 === 0 ? "verified" : "live",
    };
  });
}

export function computeWorthItIndex(
  scenario: CompareScenario,
  platform: PlatformKey,
) {
  const offer = getOfferForPlatform(scenario, platform) ?? getBestOffer(scenario);

  return Math.max(
    68,
    Math.min(
      97,
      Math.round(scenario.rating * 15 + offer.discount * 1.5 - offer.deliveryFee),
    ),
  );
}

export function getFeaturedWorthScenario(scenarios: CompareScenario[]) {
  const rankedScenarios = scenarios
    .map((scenario) => {
      const offer = getBestOffer(scenario);

      return {
        offer,
        scenario,
        worthItIndex: computeWorthItIndex(scenario, offer.platform),
      };
    })
    .sort(
      (itemA, itemB) =>
        itemB.worthItIndex - itemA.worthItIndex ||
        itemB.scenario.rating - itemA.scenario.rating,
    );

  return rankedScenarios[0] ?? null;
}
