import { comparisonApps, formatBaht, type PlatformKey } from "@/lib/home-content";

export type HomeZoneId =
  | "all"
  | "lat-phrao"
  | "ari"
  | "thonglor"
  | "onnut"
  | "silom";

export type HomeQuickFilterId =
  | "all"
  | "grab"
  | "line-man"
  | "shopeefood"
  | "foodpanda"
  | "robinhood";

export type HomePromptStarter = {
  id: string;
  label: string;
  prompt: string;
};

export type HomeMenuOffer = {
  discountPercent: number;
  etaMinutes: number;
  freeDelivery: boolean;
  originalPrice: number;
  platform: PlatformKey;
  totalPrice: number;
  verified: boolean;
};

export type HomeMenuItem = {
  categoryId: string;
  coverAccent: string;
  id: string;
  imageUrl: string;
  keywords: string[];
  menuName: string;
  offers: HomeMenuOffer[];
  pixelLabel: string;
  restaurant: string;
  zoneId: HomeZoneId;
};

export type HomeCategorySection = {
  description: string;
  id: string;
  items: HomeMenuItem[];
  pixelLabel: string;
  title: string;
};

export type HomeChatResult = {
  accentLabel: string;
  discountPercent: number;
  etaMinutes: number;
  freeDelivery: boolean;
  menuName: string;
  originalPrice: number;
  platform: PlatformKey;
  restaurant: string;
  totalPrice: number;
  zoneId: HomeZoneId;
};

export type HomeChatReply = {
  hint: string;
  results: HomeChatResult[];
  summary: string;
};

function createOffers(input: {
  grab: Omit<HomeMenuOffer, "platform">;
  lineMan: Omit<HomeMenuOffer, "platform">;
  shopeeFood: Omit<HomeMenuOffer, "platform">;
}) {
  return [
    { platform: "grab", ...input.grab },
    { platform: "line-man", ...input.lineMan },
    { platform: "shopeefood", ...input.shopeeFood },
  ] satisfies HomeMenuOffer[];
}

function createMenuItem(input: Omit<HomeMenuItem, "id"> & { slug: string }) {
  return {
    ...input,
    id: `${input.categoryId}-${input.slug}`,
  } satisfies HomeMenuItem;
}

export const homeZones = [
  { id: "all", label: "ทุกโซน" },
  { id: "lat-phrao", label: "ลาดพร้าว" },
  { id: "ari", label: "อารีย์" },
  { id: "thonglor", label: "ทองหล่อ" },
  { id: "onnut", label: "อ่อนนุช" },
  { id: "silom", label: "สีลม" },
] satisfies Array<{ id: HomeZoneId; label: string }>;

export const homeQuickFilters = [
  { id: "grab", label: "GrabFood" },
  { id: "line-man", label: "LINE MAN" },
  { id: "shopeefood", label: "ShopeeFood" },
  { id: "foodpanda", label: "Foodpanda" },
  { id: "robinhood", label: "Robinhood" },
] satisfies Array<{ id: Exclude<HomeQuickFilterId, "all">; label: string }>;

export const homePromptStarters: HomePromptStarter[] = [
  {
    id: "budget-100",
    label: "หิวจัด งบ 100.-",
    prompt: "หิวจัด งบ 100 แถวลาดพร้าว",
  },
  {
    id: "yum-discount",
    label: "ยำลดแรง 50%",
    prompt: "มียำอะไรลดแรง 50% บ้าง",
  },
  {
    id: "grilled-free-delivery",
    label: "ไก่ย่าง ส่งฟรี",
    prompt: "หาเมนูย่างส่งฟรีให้หน่อย",
  },
  {
    id: "noodle-nearby",
    label: "ก๋วยเตี๋ยวใกล้ฉัน",
    prompt: "ก๋วยเตี๋ยวใกล้ฉันที่คุ้มสุด",
  },
];

export const homeCategorySections: HomeCategorySection[] = [
  {
    id: "spicy-salads",
    title: "เมนูยำ",
    description: "คัดตัวชนะของสายแซ่บจากทั้ง 3 แพลตฟอร์มในแต่ละเมนู",
    pixelLabel: "Mr.YUM",
    items: [
      createMenuItem({
        slug: "yum-woon-sen",
        categoryId: "spicy-salads",
        menuName: "ยำวุ้นเส้น",
        restaurant: "แซ่บซอยลาดพร้าว",
        zoneId: "lat-phrao",
        pixelLabel: "ยำ",
        coverAccent: "from-[#ffd6bf] via-[#fff3ea] to-white",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ยำ", "วุ้นเส้น", "แซ่บ", "ลาดพร้าว"],
        offers: createOffers({
          grab: { totalPrice: 122, originalPrice: 178, etaMinutes: 24, freeDelivery: false, discountPercent: 31, verified: true },
          lineMan: { totalPrice: 116, originalPrice: 168, etaMinutes: 28, freeDelivery: false, discountPercent: 31, verified: true },
          shopeeFood: { totalPrice: 109, originalPrice: 162, etaMinutes: 25, freeDelivery: true, discountPercent: 33, verified: true },
        }),
      }),
      createMenuItem({
        slug: "yum-mama",
        categoryId: "spicy-salads",
        menuName: "ยำมาม่า",
        restaurant: "ยำไวหน้าปากซอย",
        zoneId: "ari",
        pixelLabel: "ม่า",
        coverAccent: "from-[#ffe1c5] via-[#fff8f1] to-white",
        imageUrl: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ยำ", "มาม่า", "ari", "อารีย์"],
        offers: createOffers({
          grab: { totalPrice: 94, originalPrice: 149, etaMinutes: 18, freeDelivery: true, discountPercent: 37, verified: true },
          lineMan: { totalPrice: 101, originalPrice: 149, etaMinutes: 21, freeDelivery: false, discountPercent: 32, verified: true },
          shopeeFood: { totalPrice: 98, originalPrice: 149, etaMinutes: 20, freeDelivery: false, discountPercent: 34, verified: true },
        }),
      }),
      createMenuItem({
        slug: "yum-ruam",
        categoryId: "spicy-salads",
        menuName: "ยำรวมมิตร",
        restaurant: "ตำแซ่บย่านทองหล่อ",
        zoneId: "thonglor",
        pixelLabel: "รวม",
        coverAccent: "from-[#ffd2d2] via-[#fff2ef] to-white",
        imageUrl: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ยำ", "รวม", "ทองหล่อ", "thonglor"],
        offers: createOffers({
          grab: { totalPrice: 148, originalPrice: 220, etaMinutes: 27, freeDelivery: false, discountPercent: 33, verified: true },
          lineMan: { totalPrice: 136, originalPrice: 220, etaMinutes: 30, freeDelivery: true, discountPercent: 38, verified: true },
          shopeeFood: { totalPrice: 142, originalPrice: 220, etaMinutes: 24, freeDelivery: false, discountPercent: 35, verified: false },
        }),
      }),
      createMenuItem({
        slug: "yum-salmon",
        categoryId: "spicy-salads",
        menuName: "ยำแซลมอน",
        restaurant: "Sea Market สีลม",
        zoneId: "silom",
        pixelLabel: "ปลา",
        coverAccent: "from-[#ffd9d6] via-[#fff4ef] to-white",
        imageUrl: "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ยำ", "แซลมอน", "สีลม", "silom"],
        offers: createOffers({
          grab: { totalPrice: 218, originalPrice: 332, etaMinutes: 31, freeDelivery: false, discountPercent: 34, verified: true },
          lineMan: { totalPrice: 205, originalPrice: 332, etaMinutes: 34, freeDelivery: false, discountPercent: 38, verified: true },
          shopeeFood: { totalPrice: 194, originalPrice: 332, etaMinutes: 29, freeDelivery: true, discountPercent: 42, verified: true },
        }),
      }),
    ],
  },
  {
    id: "grilled",
    title: "เมนูย่าง",
    description: "ของย่างที่ถูกสุดในแต่ละเมนู ไม่ล็อกกับแพลตฟอร์มเดียว",
    pixelLabel: "Mr.GRILL",
    items: [
      createMenuItem({
        slug: "grilled-duck",
        categoryId: "grilled",
        menuName: "เป็ดย่าง",
        restaurant: "ราชาเป็ดย่างอ่อนนุช",
        zoneId: "onnut",
        pixelLabel: "เป็ด",
        coverAccent: "from-[#ffe0b9] via-[#fff5ea] to-white",
        imageUrl: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ย่าง", "เป็ด", "อ่อนนุช", "onnut"],
        offers: createOffers({
          grab: { totalPrice: 198, originalPrice: 278, etaMinutes: 26, freeDelivery: false, discountPercent: 29, verified: true },
          lineMan: { totalPrice: 191, originalPrice: 278, etaMinutes: 29, freeDelivery: false, discountPercent: 31, verified: true },
          shopeeFood: { totalPrice: 185, originalPrice: 278, etaMinutes: 27, freeDelivery: true, discountPercent: 33, verified: true },
        }),
      }),
      createMenuItem({
        slug: "grilled-chicken",
        categoryId: "grilled",
        menuName: "ไก่ย่างเขาสวนกวาง",
        restaurant: "ไก่ย่างลาดพร้าว 71",
        zoneId: "lat-phrao",
        pixelLabel: "ไก่",
        coverAccent: "from-[#ffe6ca] via-[#fff6ee] to-white",
        imageUrl: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ย่าง", "ไก่", "ลาดพร้าว"],
        offers: createOffers({
          grab: { totalPrice: 128, originalPrice: 198, etaMinutes: 17, freeDelivery: true, discountPercent: 35, verified: true },
          lineMan: { totalPrice: 134, originalPrice: 198, etaMinutes: 20, freeDelivery: false, discountPercent: 32, verified: true },
          shopeeFood: { totalPrice: 131, originalPrice: 198, etaMinutes: 19, freeDelivery: false, discountPercent: 33, verified: false },
        }),
      }),
      createMenuItem({
        slug: "grilled-pork-neck",
        categoryId: "grilled",
        menuName: "คอหมูย่าง",
        restaurant: "ปิ้งย่างอารีย์คลับ",
        zoneId: "ari",
        pixelLabel: "หมู",
        coverAccent: "from-[#ffd8c6] via-[#fff3ef] to-white",
        imageUrl: "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ย่าง", "คอหมู", "อารีย์"],
        offers: createOffers({
          grab: { totalPrice: 138, originalPrice: 229, etaMinutes: 21, freeDelivery: false, discountPercent: 40, verified: true },
          lineMan: { totalPrice: 129, originalPrice: 229, etaMinutes: 24, freeDelivery: true, discountPercent: 44, verified: true },
          shopeeFood: { totalPrice: 135, originalPrice: 229, etaMinutes: 20, freeDelivery: false, discountPercent: 41, verified: true },
        }),
      }),
      createMenuItem({
        slug: "grilled-ribs",
        categoryId: "grilled",
        menuName: "ซี่โครงย่าง",
        restaurant: "Smoke House สีลม",
        zoneId: "silom",
        pixelLabel: "ซี่",
        coverAccent: "from-[#f4dac8] via-[#fff4ec] to-white",
        imageUrl: "https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ย่าง", "ซี่โครง", "สีลม"],
        offers: createOffers({
          grab: { totalPrice: 209, originalPrice: 318, etaMinutes: 33, freeDelivery: false, discountPercent: 34, verified: true },
          lineMan: { totalPrice: 198, originalPrice: 318, etaMinutes: 36, freeDelivery: false, discountPercent: 38, verified: true },
          shopeeFood: { totalPrice: 188, originalPrice: 318, etaMinutes: 31, freeDelivery: true, discountPercent: 41, verified: true },
        }),
      }),
    ],
  },
  {
    id: "noodles",
    title: "เมนูก๋วยเตี๋ยว",
    description: "ก๋วยเตี๋ยวสายประหยัด เรียงผู้ชนะตาม net price จริง",
    pixelLabel: "Mr.NDL",
    items: [
      createMenuItem({
        slug: "boat-noodle",
        categoryId: "noodles",
        menuName: "ก๋วยเตี๋ยวเรือ",
        restaurant: "เรือเข้มทองหล่อ",
        zoneId: "thonglor",
        pixelLabel: "เรือ",
        coverAccent: "from-[#ffe7d0] via-[#fff7ef] to-white",
        imageUrl: "https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ก๋วยเตี๋ยว", "เรือ", "ทองหล่อ"],
        offers: createOffers({
          grab: { totalPrice: 118, originalPrice: 188, etaMinutes: 22, freeDelivery: false, discountPercent: 37, verified: true },
          lineMan: { totalPrice: 109, originalPrice: 188, etaMinutes: 26, freeDelivery: true, discountPercent: 42, verified: true },
          shopeeFood: { totalPrice: 114, originalPrice: 188, etaMinutes: 21, freeDelivery: false, discountPercent: 39, verified: true },
        }),
      }),
      createMenuItem({
        slug: "tom-yum-noodle",
        categoryId: "noodles",
        menuName: "ก๋วยเตี๋ยวต้มยำ",
        restaurant: "บ้านเส้นลาดพร้าว",
        zoneId: "lat-phrao",
        pixelLabel: "ต้ม",
        coverAccent: "from-[#ffd8c9] via-[#fff2ef] to-white",
        imageUrl: "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ก๋วยเตี๋ยว", "ต้มยำ", "ลาดพร้าว"],
        offers: createOffers({
          grab: { totalPrice: 97, originalPrice: 162, etaMinutes: 16, freeDelivery: true, discountPercent: 40, verified: true },
          lineMan: { totalPrice: 102, originalPrice: 162, etaMinutes: 19, freeDelivery: false, discountPercent: 37, verified: true },
          shopeeFood: { totalPrice: 100, originalPrice: 162, etaMinutes: 18, freeDelivery: false, discountPercent: 38, verified: true },
        }),
      }),
      createMenuItem({
        slug: "wonton-noodle",
        categoryId: "noodles",
        menuName: "บะหมี่เกี๊ยวหมูแดง",
        restaurant: "บะหมี่อารีย์สเตชั่น",
        zoneId: "ari",
        pixelLabel: "บะ",
        coverAccent: "from-[#ffe8d6] via-[#fff8f1] to-white",
        imageUrl: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["บะหมี่", "เกี๊ยว", "อารีย์"],
        offers: createOffers({
          grab: { totalPrice: 115, originalPrice: 184, etaMinutes: 20, freeDelivery: false, discountPercent: 38, verified: true },
          lineMan: { totalPrice: 108, originalPrice: 184, etaMinutes: 23, freeDelivery: true, discountPercent: 41, verified: true },
          shopeeFood: { totalPrice: 111, originalPrice: 184, etaMinutes: 22, freeDelivery: false, discountPercent: 39, verified: true },
        }),
      }),
      createMenuItem({
        slug: "dry-noodle",
        categoryId: "noodles",
        menuName: "บะหมี่แห้งหมูกรอบ",
        restaurant: "Silom Crispy Noodles",
        zoneId: "silom",
        pixelLabel: "กรอบ",
        coverAccent: "from-[#ffe2cc] via-[#fff4ea] to-white",
        imageUrl: "https://images.pexels.com/photos/2347312/pexels-photo-2347312.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["บะหมี่", "หมูกรอบ", "สีลม"],
        offers: createOffers({
          grab: { totalPrice: 146, originalPrice: 256, etaMinutes: 28, freeDelivery: false, discountPercent: 43, verified: true },
          lineMan: { totalPrice: 152, originalPrice: 256, etaMinutes: 30, freeDelivery: false, discountPercent: 40, verified: true },
          shopeeFood: { totalPrice: 141, originalPrice: 256, etaMinutes: 27, freeDelivery: true, discountPercent: 45, verified: true },
        }),
      }),
    ],
  },
  {
    id: "rice-dishes",
    title: "เมนูข้าว",
    description: "อาหารจานเดียวที่ชนะสงครามราคาในแต่ละโซน",
    pixelLabel: "Mr.RICE",
    items: [
      createMenuItem({
        slug: "krapao",
        categoryId: "rice-dishes",
        menuName: "กะเพราหมูกรอบ",
        restaurant: "ครัวดึกลาดพร้าว",
        zoneId: "lat-phrao",
        pixelLabel: "เพรา",
        coverAccent: "from-[#ffdcc6] via-[#fff5ed] to-white",
        imageUrl: "https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["กะเพรา", "หมูกรอบ", "ลาดพร้าว"],
        offers: createOffers({
          grab: { totalPrice: 108, originalPrice: 188, etaMinutes: 17, freeDelivery: true, discountPercent: 43, verified: true },
          lineMan: { totalPrice: 111, originalPrice: 188, etaMinutes: 21, freeDelivery: false, discountPercent: 41, verified: true },
          shopeeFood: { totalPrice: 105, originalPrice: 188, etaMinutes: 19, freeDelivery: false, discountPercent: 44, verified: true },
        }),
      }),
      createMenuItem({
        slug: "chicken-rice",
        categoryId: "rice-dishes",
        menuName: "ข้าวมันไก่",
        restaurant: "เฮียช้าง อารีย์",
        zoneId: "ari",
        pixelLabel: "มัน",
        coverAccent: "from-[#fff0d6] via-[#fff8ee] to-white",
        imageUrl: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ข้าวมันไก่", "อารีย์"],
        offers: createOffers({
          grab: { totalPrice: 92, originalPrice: 146, etaMinutes: 15, freeDelivery: true, discountPercent: 37, verified: true },
          lineMan: { totalPrice: 95, originalPrice: 146, etaMinutes: 18, freeDelivery: false, discountPercent: 35, verified: true },
          shopeeFood: { totalPrice: 98, originalPrice: 146, etaMinutes: 16, freeDelivery: false, discountPercent: 33, verified: true },
        }),
      }),
      createMenuItem({
        slug: "fried-rice",
        categoryId: "rice-dishes",
        menuName: "ข้าวผัดปู",
        restaurant: "ครัวสีลมซีฟู้ด",
        zoneId: "silom",
        pixelLabel: "ปู",
        coverAccent: "from-[#ffe0cf] via-[#fff6ef] to-white",
        imageUrl: "https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ข้าวผัด", "ปู", "สีลม"],
        offers: createOffers({
          grab: { totalPrice: 169, originalPrice: 284, etaMinutes: 29, freeDelivery: false, discountPercent: 40, verified: true },
          lineMan: { totalPrice: 158, originalPrice: 284, etaMinutes: 32, freeDelivery: false, discountPercent: 44, verified: true },
          shopeeFood: { totalPrice: 154, originalPrice: 284, etaMinutes: 30, freeDelivery: true, discountPercent: 46, verified: true },
        }),
      }),
      createMenuItem({
        slug: "garlic-pork-rice",
        categoryId: "rice-dishes",
        menuName: "ข้าวหมูกระเทียม",
        restaurant: "ครัวสะพานอ่อนนุช",
        zoneId: "onnut",
        pixelLabel: "กระ",
        coverAccent: "from-[#ffe7d4] via-[#fff8ef] to-white",
        imageUrl: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ข้าว", "หมูกระเทียม", "อ่อนนุช"],
        offers: createOffers({
          grab: { totalPrice: 89, originalPrice: 154, etaMinutes: 14, freeDelivery: true, discountPercent: 42, verified: true },
          lineMan: { totalPrice: 93, originalPrice: 154, etaMinutes: 16, freeDelivery: false, discountPercent: 40, verified: true },
          shopeeFood: { totalPrice: 91, originalPrice: 154, etaMinutes: 15, freeDelivery: false, discountPercent: 41, verified: false },
        }),
      }),
    ],
  },
  {
    id: "snacks",
    title: "ของกินเล่น",
    description: "ของทานเล่นที่เลือกผู้ชนะจากราคาสุทธิจริง ไม่ใช่แค่ราคาหน้าร้าน",
    pixelLabel: "Mr.SNACK",
    items: [
      createMenuItem({
        slug: "french-fries",
        categoryId: "snacks",
        menuName: "เฟรนช์ฟรายส์ชีส",
        restaurant: "Snack Lab ทองหล่อ",
        zoneId: "thonglor",
        pixelLabel: "ฟราย",
        coverAccent: "from-[#fff0ce] via-[#fff9f0] to-white",
        imageUrl: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ของกินเล่น", "เฟรนช์ฟรายส์", "ทองหล่อ"],
        offers: createOffers({
          grab: { totalPrice: 112, originalPrice: 188, etaMinutes: 18, freeDelivery: false, discountPercent: 40, verified: true },
          lineMan: { totalPrice: 107, originalPrice: 188, etaMinutes: 22, freeDelivery: true, discountPercent: 43, verified: true },
          shopeeFood: { totalPrice: 109, originalPrice: 188, etaMinutes: 19, freeDelivery: false, discountPercent: 42, verified: true },
        }),
      }),
      createMenuItem({
        slug: "fried-chicken-wings",
        categoryId: "snacks",
        menuName: "ไก่ทอดเกาหลี",
        restaurant: "Wing Club ลาดพร้าว",
        zoneId: "lat-phrao",
        pixelLabel: "ทอด",
        coverAccent: "from-[#ffe0c5] via-[#fff6ed] to-white",
        imageUrl: "https://images.pexels.com/photos/1352270/pexels-photo-1352270.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ของกินเล่น", "ไก่ทอด", "ลาดพร้าว"],
        offers: createOffers({
          grab: { totalPrice: 138, originalPrice: 256, etaMinutes: 17, freeDelivery: true, discountPercent: 46, verified: true },
          lineMan: { totalPrice: 141, originalPrice: 256, etaMinutes: 20, freeDelivery: false, discountPercent: 44, verified: true },
          shopeeFood: { totalPrice: 134, originalPrice: 256, etaMinutes: 18, freeDelivery: false, discountPercent: 47, verified: true },
        }),
      }),
      createMenuItem({
        slug: "takoyaki",
        categoryId: "snacks",
        menuName: "ทาโกะยากิ",
        restaurant: "Ari Street Bites",
        zoneId: "ari",
        pixelLabel: "ลูก",
        coverAccent: "from-[#ffe8d4] via-[#fff8f0] to-white",
        imageUrl: "https://images.pexels.com/photos/1860208/pexels-photo-1860208.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ของกินเล่น", "ทาโกะยากิ", "อารีย์"],
        offers: createOffers({
          grab: { totalPrice: 79, originalPrice: 132, etaMinutes: 12, freeDelivery: true, discountPercent: 40, verified: true },
          lineMan: { totalPrice: 83, originalPrice: 132, etaMinutes: 14, freeDelivery: false, discountPercent: 37, verified: true },
          shopeeFood: { totalPrice: 81, originalPrice: 132, etaMinutes: 13, freeDelivery: false, discountPercent: 39, verified: true },
        }),
      }),
      createMenuItem({
        slug: "crispy-pork-belly",
        categoryId: "snacks",
        menuName: "หมูกรอบทอดน้ำปลา",
        restaurant: "Silom Fry House",
        zoneId: "silom",
        pixelLabel: "กรอบ",
        coverAccent: "from-[#ffe2cf] via-[#fff5ee] to-white",
        imageUrl: "https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ของกินเล่น", "หมูกรอบ", "สีลม"],
        offers: createOffers({
          grab: { totalPrice: 164, originalPrice: 304, etaMinutes: 26, freeDelivery: false, discountPercent: 46, verified: true },
          lineMan: { totalPrice: 158, originalPrice: 304, etaMinutes: 28, freeDelivery: true, discountPercent: 48, verified: true },
          shopeeFood: { totalPrice: 151, originalPrice: 304, etaMinutes: 25, freeDelivery: false, discountPercent: 50, verified: true },
        }),
      }),
    ],
  },
  {
    id: "desserts",
    title: "ของหวาน",
    description: "ของหวานสายคอนเทนต์ แต่ render เฉพาะเจ้าที่คุ้มสุดจริง",
    pixelLabel: "Mr.SWEET",
    items: [
      createMenuItem({
        slug: "mango-sticky-rice",
        categoryId: "desserts",
        menuName: "ข้าวเหนียวมะม่วง",
        restaurant: "หวานละมุนอ่อนนุช",
        zoneId: "onnut",
        pixelLabel: "ม่วง",
        coverAccent: "from-[#fff1c8] via-[#fff9ef] to-white",
        imageUrl: "https://images.pexels.com/photos/3184181/pexels-photo-3184181.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ของหวาน", "ข้าวเหนียวมะม่วง", "อ่อนนุช"],
        offers: createOffers({
          grab: { totalPrice: 129, originalPrice: 218, etaMinutes: 18, freeDelivery: false, discountPercent: 41, verified: true },
          lineMan: { totalPrice: 124, originalPrice: 218, etaMinutes: 21, freeDelivery: false, discountPercent: 43, verified: true },
          shopeeFood: { totalPrice: 118, originalPrice: 218, etaMinutes: 20, freeDelivery: true, discountPercent: 46, verified: true },
        }),
      }),
      createMenuItem({
        slug: "milk-tea-bingsu",
        categoryId: "desserts",
        menuName: "บิงซูนมสด",
        restaurant: "Ari Dessert Club",
        zoneId: "ari",
        pixelLabel: "บิง",
        coverAccent: "from-[#e7efff] via-[#f8fbff] to-white",
        imageUrl: "https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ของหวาน", "บิงซู", "อารีย์"],
        offers: createOffers({
          grab: { totalPrice: 149, originalPrice: 282, etaMinutes: 16, freeDelivery: true, discountPercent: 47, verified: true },
          lineMan: { totalPrice: 155, originalPrice: 282, etaMinutes: 18, freeDelivery: false, discountPercent: 45, verified: true },
          shopeeFood: { totalPrice: 151, originalPrice: 282, etaMinutes: 17, freeDelivery: false, discountPercent: 46, verified: true },
        }),
      }),
      createMenuItem({
        slug: "toast-honey",
        categoryId: "desserts",
        menuName: "ฮันนี่โทสต์",
        restaurant: "Toast Room สีลม",
        zoneId: "silom",
        pixelLabel: "โทสต์",
        coverAccent: "from-[#fff0d8] via-[#fff8ef] to-white",
        imageUrl: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ของหวาน", "โทสต์", "สีลม"],
        offers: createOffers({
          grab: { totalPrice: 172, originalPrice: 328, etaMinutes: 23, freeDelivery: false, discountPercent: 47, verified: true },
          lineMan: { totalPrice: 168, originalPrice: 328, etaMinutes: 25, freeDelivery: false, discountPercent: 48, verified: true },
          shopeeFood: { totalPrice: 161, originalPrice: 328, etaMinutes: 24, freeDelivery: true, discountPercent: 50, verified: true },
        }),
      }),
      createMenuItem({
        slug: "thai-tea",
        categoryId: "desserts",
        menuName: "ชาไทยปั่น",
        restaurant: "เครื่องดื่มคิวท์ลาดพร้าว",
        zoneId: "lat-phrao",
        pixelLabel: "ชา",
        coverAccent: "from-[#ffe4c6] via-[#fff5ec] to-white",
        imageUrl: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
        keywords: ["ของหวาน", "ชาไทย", "ลาดพร้าว"],
        offers: createOffers({
          grab: { totalPrice: 72, originalPrice: 124, etaMinutes: 11, freeDelivery: true, discountPercent: 42, verified: true },
          lineMan: { totalPrice: 76, originalPrice: 124, etaMinutes: 13, freeDelivery: false, discountPercent: 39, verified: true },
          shopeeFood: { totalPrice: 74, originalPrice: 124, etaMinutes: 12, freeDelivery: false, discountPercent: 40, verified: false },
        }),
      }),
    ],
  },
];

const allMenuItems = homeCategorySections.flatMap((section) => section.items);

export function getZoneLabel(zoneId: HomeZoneId) {
  return homeZones.find((zone) => zone.id === zoneId)?.label ?? homeZones[0].label;
}

export function getPlatformMeta(platform: PlatformKey) {
  return comparisonApps.find((item) => item.key === platform) ?? comparisonApps[0];
}

export function getWinningOffer(item: HomeMenuItem) {
  return [...item.offers].sort(
    (offerA, offerB) => offerA.totalPrice - offerB.totalPrice,
  )[0];
}

function matchesQuickFilter(item: HomeMenuItem, filterId: HomeQuickFilterId) {
  if (filterId === "all") return true;
  const winningOffer = getWinningOffer(item);
  return winningOffer.platform === filterId;
}

function sortItemsByFilter(items: HomeMenuItem[], _filterId: HomeQuickFilterId) {
  return [...items].sort(
    (itemA, itemB) => getWinningOffer(itemA).totalPrice - getWinningOffer(itemB).totalPrice,
  );
}

export function getFilteredCategorySections(
  zoneId: HomeZoneId,
  filterId: HomeQuickFilterId,
) {
  return homeCategorySections
    .map((section) => {
      const zoneFilteredItems = section.items.filter((item) =>
        zoneId === "all" ? true : item.zoneId === zoneId,
      );
      const filteredItems = zoneFilteredItems.filter((item) =>
        matchesQuickFilter(item, filterId),
      );
      const finalItems = filteredItems.length ? filteredItems : zoneFilteredItems;

      return {
        ...section,
        items: sortItemsByFilter(finalItems, filterId).slice(0, 4),
      };
    })
    .filter((section) => section.items.length > 0);
}

function extractBudget(query: string) {
  const matchedNumber = query.match(/\d{2,4}/);

  return matchedNumber ? Number(matchedNumber[0]) : null;
}

export function buildHomeChatReply(
  query: string,
  selectedZoneId: HomeZoneId,
): HomeChatReply {
  const normalizedQuery = query.trim().toLowerCase();
  const budget = extractBudget(normalizedQuery);
  const candidatePool = allMenuItems.filter((item) =>
    selectedZoneId === "all" ? true : item.zoneId === selectedZoneId,
  );

  const scoredItems = candidatePool
    .map((item) => {
      const haystack = [
        item.menuName,
        item.restaurant,
        getZoneLabel(item.zoneId),
        ...item.keywords,
      ]
        .join(" ")
        .toLowerCase();
      const winningOffer = getWinningOffer(item);
      let score = 0;

      if (normalizedQuery) {
        if (haystack.includes(normalizedQuery)) {
          score += 8;
        }

        item.keywords.forEach((keyword) => {
          if (normalizedQuery.includes(keyword.toLowerCase())) {
            score += 3;
          }
        });

        if (normalizedQuery.includes("ส่งฟรี") && winningOffer.freeDelivery) {
          score += 2;
        }

        if (normalizedQuery.includes("ลด") || normalizedQuery.includes("คุ้ม")) {
          score += Math.round(winningOffer.discountPercent / 10);
        }
      }

      if (budget && winningOffer.totalPrice <= budget) {
        score += 6;
      }

      score += Math.max(0, 30 - winningOffer.etaMinutes);

      return {
        item,
        score,
        winningOffer,
      };
    })
    .sort((itemA, itemB) => {
      if (itemB.score !== itemA.score) {
        return itemB.score - itemA.score;
      }

      return itemA.winningOffer.totalPrice - itemB.winningOffer.totalPrice;
    });

  const chosenItems = scoredItems.slice(0, 3);
  const results = chosenItems.map(({ item, winningOffer }) => ({
    accentLabel: winningOffer.freeDelivery ? "ส่งฟรี" : `${winningOffer.discountPercent}% OFF`,
    discountPercent: winningOffer.discountPercent,
    etaMinutes: winningOffer.etaMinutes,
    freeDelivery: winningOffer.freeDelivery,
    menuName: item.menuName,
    originalPrice: winningOffer.originalPrice,
    platform: winningOffer.platform,
    restaurant: item.restaurant,
    totalPrice: winningOffer.totalPrice,
    zoneId: item.zoneId,
  }));
  const bestResult = results[0];
  const zoneLabel = getZoneLabel(selectedZoneId);

  if (!bestResult) {
    return {
      hint: "ลองเปลี่ยนย่านหรือพิมพ์ชื่อเมนูตรง ๆ เช่น กะเพรา, ยำ, ของหวาน",
      results: [],
      summary: "ตอนนี้ยังไม่เจอดีลที่ตรงเงื่อนไข ลองเปลี่ยนโซนหรือเพิ่มชื่อเมนูอีกนิด",
    };
  }

  return {
    hint: `วันนี้ใน${zoneLabel} ${bestResult.menuName} ถูกสุดบน ${getPlatformMeta(bestResult.platform).name}`,
    results,
    summary: `ผมคัดดีลที่คุ้มที่สุดให้แล้วจาก ${zoneLabel} โดยเรียงตามราคาสุทธิและความไวในการส่ง`,
  };
}

export function formatSavingsCopy(result: HomeChatResult) {
  const saving = Math.max(0, result.originalPrice - result.totalPrice);

  return `ประหยัด ${formatBaht(saving)}`;
}
