export type SectionId =
  | "vision"
  | "compare"
  | "heatmap";

export type PlatformKey = "grab" | "line-man" | "shopeefood";

export type AudienceKey =
  | "guest"
  | "member"
  | "merchant-admin"
  | "platform-admin";

export type ScenarioPlatformOffer = {
  platform: PlatformKey;
  totalPrice: number;
  foodPrice: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  etaMinutes: number;
  note: string;
};

export type CompareScenario = {
  id: string;
  title: string;
  restaurant: string;
  district: string;
  distanceKm: number;
  rating: number;
  cuisine: string;
  summary: string;
  tags: string[];
  platforms: ScenarioPlatformOffer[];
};

export const navItems = [
  { label: "Vision", href: "#vision", section: "vision" },
  { label: "Compare", href: "#compare", section: "compare" },
  { label: "Heatmap", href: "#heatmap", section: "heatmap" },
] as const;

export const heroStats = [
  { value: "3 apps", label: "Meta compare in one view" },
  { value: "AI + Receipt", label: "Net price verification loop" },
  { value: "3D map", label: "Worth-it heatmap by district" },
  { value: "4 phases", label: "SEO to retention roadmap" },
];

export const comparisonApps = [
  {
    key: "grab",
    name: "Grab",
    price: "฿182",
    delivery: "24 min",
    note: "ETA เร็วสุด",
    tone: "bg-emerald-100/80 text-emerald-900",
    href: "#roadmap",
    cta: "Go to Grab",
    valueCopy: "ส่งไวที่สุด เหมาะกับช่วงรีบ",
  },
  {
    key: "line-man",
    name: "LINE MAN",
    price: "฿169",
    delivery: "31 min",
    note: "คุ้มที่สุดวันนี้",
    tone: "bg-lime-100/80 text-lime-900",
    href: "#roadmap",
    cta: "Go to LINE MAN",
    valueCopy: "รวมค่าส่งและโปรแล้ว net ต่ำสุด",
  },
  {
    key: "shopeefood",
    name: "ShopeeFood",
    price: "฿176",
    delivery: "28 min",
    note: "โค้ดส่งฟรีพร้อมใช้",
    tone: "bg-orange-100/85 text-orange-900",
    href: "#roadmap",
    cta: "Go to ShopeeFood",
    valueCopy: "เหมาะกับคนมีโค้ดและ free-delivery",
  },
] as const;

export const compareScenarios: CompareScenario[] = [
  {
    id: "krapao-thonglor",
    title: "กะเพราเนื้อ + ไข่ดาว",
    restaurant: "กะเพราโคตรดึก",
    district: "Thonglor",
    distanceKm: 1.8,
    rating: 4.8,
    cuisine: "Thai street food",
    summary: "ร้านดึกยอดนิยมสำหรับสายเผ็ดที่อยากได้จานไวและรสแรง",
    tags: ["late-night", "beef", "spicy", "rice"],
    platforms: [
      {
        platform: "grab",
        totalPrice: 182,
        foodPrice: 149,
        deliveryFee: 21,
        serviceFee: 12,
        discount: 0,
        etaMinutes: 24,
        note: "ETA เร็วสุด",
      },
      {
        platform: "line-man",
        totalPrice: 169,
        foodPrice: 149,
        deliveryFee: 17,
        serviceFee: 8,
        discount: 5,
        etaMinutes: 31,
        note: "คุ้มที่สุดวันนี้",
      },
      {
        platform: "shopeefood",
        totalPrice: 176,
        foodPrice: 149,
        deliveryFee: 18,
        serviceFee: 9,
        discount: 0,
        etaMinutes: 28,
        note: "โค้ดส่งฟรีพร้อมใช้",
      },
    ],
  },
  {
    id: "boat-noodle-onnut",
    title: "ก๋วยเตี๋ยวเรือ + เกี๊ยวทอด",
    restaurant: "เรือเข้มท่าอ่อนนุช",
    district: "Onnut",
    distanceKm: 2.4,
    rating: 4.7,
    cuisine: "Boat noodle",
    summary: "เหมาะกับมื้อเย็นคุ้ม ๆ ที่อยากได้ของทอดเพิ่มโดยราคาไม่โดด",
    tags: ["noodle", "thai", "budget", "fried"],
    platforms: [
      {
        platform: "grab",
        totalPrice: 158,
        foodPrice: 124,
        deliveryFee: 22,
        serviceFee: 12,
        discount: 0,
        etaMinutes: 27,
        note: "ระยะใกล้สุด",
      },
      {
        platform: "line-man",
        totalPrice: 152,
        foodPrice: 124,
        deliveryFee: 19,
        serviceFee: 9,
        discount: 0,
        etaMinutes: 30,
        note: "สมดุลสุด",
      },
      {
        platform: "shopeefood",
        totalPrice: 145,
        foodPrice: 124,
        deliveryFee: 16,
        serviceFee: 8,
        discount: 3,
        etaMinutes: 33,
        note: "สุทธิต่ำสุด",
      },
    ],
  },
  {
    id: "chicken-rice-ari",
    title: "ข้าวมันไก่ + ชาเย็น",
    restaurant: "เฮียช้าง ข้าวมันไก่อารีย์",
    district: "Ari",
    distanceKm: 1.1,
    rating: 4.9,
    cuisine: "Chicken rice",
    summary: "ร้านกลางวันยอดนิยมที่ราคาแข่งกันแรง โดยเฉพาะช่วงคูปองส่งฟรี",
    tags: ["lunch", "chicken-rice", "ari", "drink"],
    platforms: [
      {
        platform: "grab",
        totalPrice: 134,
        foodPrice: 109,
        deliveryFee: 13,
        serviceFee: 12,
        discount: 0,
        etaMinutes: 18,
        note: "ไวและนิ่ง",
      },
      {
        platform: "line-man",
        totalPrice: 128,
        foodPrice: 109,
        deliveryFee: 12,
        serviceFee: 8,
        discount: 1,
        etaMinutes: 24,
        note: "คุ้มจากค่าส่ง",
      },
      {
        platform: "shopeefood",
        totalPrice: 139,
        foodPrice: 109,
        deliveryFee: 14,
        serviceFee: 8,
        discount: 0,
        etaMinutes: 22,
        note: "ราคาคงที่",
      },
    ],
  },
  {
    id: "roti-ekkamai",
    title: "โรตี + นมสด",
    restaurant: "โรตีหน้าโค้งเอกมัย",
    district: "Ekkamai",
    distanceKm: 2.9,
    rating: 4.6,
    cuisine: "Dessert",
    summary: "ของหวานปลายวันสำหรับสายคอนเทนต์และสายกินเล่นหลังเลิกงาน",
    tags: ["dessert", "roti", "night", "milk"],
    platforms: [
      {
        platform: "grab",
        totalPrice: 112,
        foodPrice: 84,
        deliveryFee: 16,
        serviceFee: 12,
        discount: 0,
        etaMinutes: 19,
        note: "ไวสุดหลังงาน",
      },
      {
        platform: "line-man",
        totalPrice: 104,
        foodPrice: 84,
        deliveryFee: 14,
        serviceFee: 8,
        discount: 2,
        etaMinutes: 26,
        note: "ถูกสุดชัดเจน",
      },
      {
        platform: "shopeefood",
        totalPrice: 107,
        foodPrice: 84,
        deliveryFee: 13,
        serviceFee: 8,
        discount: 2,
        etaMinutes: 23,
        note: "มีโค้ดหมุนเวียน",
      },
    ],
  },
];

export const strategies = [
  {
    title: "Meta-Price Comparison",
    copy: "รวมราคาอาหาร ค่าส่ง และโปรโมชันจากแอปยักษ์ใหญ่ไว้ในหน้าเดียว",
  },
  {
    title: "Receipt-Driven Truth",
    copy: "ใช้ใบเสร็จจริงจากผู้ใช้และ AI OCR เพื่อตัดรีวิวปลอมออกจากสมการ",
  },
  {
    title: "Visual Value Map",
    copy: "แผนที่ interactive สำหรับดูย่านที่ของดีราคาคุ้มแบบเห็นภาพทันที",
  },
];

export const receiptSteps = [
  {
    title: "1. Upload Receipt",
    copy: "สมาชิกอัปโหลดใบเสร็จจริง แลกแต้มสะสมและช่วยยืนยันราคาแบบ crowd-backed",
  },
  {
    title: "2. OCR + AI Parse",
    copy: "ดึงร้าน เมนู ราคา เวลา และแพลตฟอร์มจากใบเสร็จอัตโนมัติ เพื่อลดงาน manual",
  },
  {
    title: "3. Truth Score",
    copy: "ระบบประเมินความน่าเชื่อถือของรีวิว ราคา และความถี่การอัปโหลด เพื่อกัน spam และ fraud",
  },
];

export const heatZones = [
  { name: "Ari", score: "9.4", delta: "+12%", accent: "from-amber-300 to-orange-400" },
  { name: "Silom", score: "8.7", delta: "+6%", accent: "from-lime-300 to-emerald-500" },
  { name: "Sathorn", score: "8.1", delta: "+3%", accent: "from-sky-300 to-cyan-500" },
  { name: "Onnut", score: "9.1", delta: "+10%", accent: "from-orange-300 to-rose-400" },
  { name: "Lat Phrao", score: "8.5", delta: "+5%", accent: "from-green-300 to-teal-500" },
  { name: "Rama 9", score: "7.9", delta: "-1%", accent: "from-slate-300 to-slate-500" },
  { name: "Ekkamai", score: "8.9", delta: "+9%", accent: "from-yellow-300 to-amber-500" },
  { name: "Phrom Phong", score: "7.8", delta: "-2%", accent: "from-zinc-300 to-zinc-500" },
  { name: "Bang Na", score: "8.3", delta: "+4%", accent: "from-emerald-300 to-green-500" },
];

export const routeStops = [
  { time: "12:15", place: "Ari", item: "ข้าวมันไก่ + ชาเย็น", saving: "ประหยัด ฿41" },
  { time: "18:40", place: "Onnut", item: "ก๋วยเตี๋ยวเรือ + เกี๊ยวทอด", saving: "ประหยัด ฿28" },
  { time: "20:10", place: "Ekkamai", item: "โรตี + นมสด", saving: "ประหยัด ฿17" },
];

export const audienceCards = [
  {
    key: "guest",
    title: "Guest",
    subtitle: "Search without friction",
    summary: "เข้ามาเปรียบเทียบราคาและกดสั่งต่อได้ทันทีโดยไม่ต้องสมัคร",
    action: "เน้นลด friction เพื่อแปลง organic traffic เป็น first-time action",
    items: [
      "ค้นหาร้านและเมนู พร้อมเทียบราคา Grab / LINE MAN / ShopeeFood",
      "เปิดดู Worth-it Heatmap ของแต่ละย่านได้ทันที",
      "กด deep link ไปสั่งต่อในแอปปลายทางได้เลย",
    ],
  },
  {
    key: "member",
    title: "Member",
    subtitle: "Personalized savings loop",
    summary: "สมาชิกจะเริ่มได้ประโยชน์จาก favorites, alerts, points และ receipt uploads",
    action: "ยิ่งใช้งาน ยิ่งสะสม data moat และ retention ได้หนาขึ้น",
    items: [
      "บันทึกร้านโปรด ตั้ง Price Drop Alert และเส้นทางกินที่คุ้มที่สุด",
      "เขียนรีวิวพร้อมอัปโหลดใบเสร็จ เพื่อรับแต้มและตรา Verified",
      "แลก rewards เป็นคูปอง ส่วนลด หรือเครดิต TrueMoney",
    ],
  },
  {
    key: "merchant-admin",
    title: "Merchant Admin",
    subtitle: "Make no-GP offers visible",
    summary: "เจ้าของร้านจะเห็น positioning ของตัวเองและดึงลูกค้ากลับหน้าร้านได้มากขึ้น",
    action: "ช่วยให้ merchant เห็นคุณค่าโดยไม่รู้สึกว่าถูกเพิ่มภาระงาน",
    items: [
      "Claim ร้านเพื่อจัดการข้อมูลหลักและตอบรีวิวที่ Verified ได้",
      "ดู Value Dashboard ว่าลูกค้ามองร้านว่าคุ้มแค่ไหนเมื่อเทียบคู่แข่ง",
      "โพสต์โปรหน้าร้านเพื่อดึงคนกลับมาซื้อ direct โดยไม่เสีย GP",
    ],
  },
  {
    key: "platform-admin",
    title: "Platform Admin",
    subtitle: "Trust, growth, and control",
    summary: "ทีมหลังบ้านต้องควบคุมคุณภาพข้อมูล, fraud, moderation และ affiliate economics ได้พร้อมกัน",
    action: "นี่คือ control layer ที่ทำให้ product โตโดยไม่เสียความน่าเชื่อถือ",
    items: [
      "ดู Dashboard ภาพรวม user, receipts, trending stores และ traffic out",
      "ตรวจ OCR accuracy, moderation queue, affiliate links และ fraud signals",
      "ทำ Human-in-the-loop สำหรับ AI verification และ content governance",
    ],
  },
] as const;

export const roadmap = [
  {
    phase: "Phase 1",
    title: "SEO & Search",
    copy: "หน้า compare ที่ตอบ intent จาก Google ให้ไวและชัด ดัน organic traffic ก่อนทุกอย่าง",
  },
  {
    phase: "Phase 2",
    title: "AI Receipt Engine",
    copy: "เปิดระบบอัปโหลดใบเสร็จเพื่อสร้างฐานข้อมูล net price ที่มีความจริงใจเป็นจุดต่าง",
  },
  {
    phase: "Phase 3",
    title: "Deep Link & Revenue",
    copy: "ส่งผู้ใช้ต่อไปยังแพลตฟอร์มปลายทางผ่าน affiliate / traffic handoff แบบวัดผลได้",
  },
  {
    phase: "Phase 4",
    title: "Retention & Alerts",
    copy: "สมาชิกขั้นสูง, price drop alerts, favorite lists และ proactive savings notifications",
  },
];

export const stack = [
  "Next.js App Router",
  "Tailwind CSS",
  "Zustand Slices",
  "PWA Manifest",
  "Auth.js",
  "OpenAI / Vision OCR",
];

export function formatBaht(value: number) {
  return `฿${value}`;
}

export function getScenarioById(id: string) {
  return compareScenarios.find((scenario) => scenario.id === id);
}

export function getOfferForPlatform(
  scenario: CompareScenario,
  platform: PlatformKey,
) {
  return scenario.platforms.find((offer) => offer.platform === platform);
}

export function getBestOffer(scenario: CompareScenario) {
  return [...scenario.platforms].sort(
    (offerA, offerB) => offerA.totalPrice - offerB.totalPrice,
  )[0];
}
