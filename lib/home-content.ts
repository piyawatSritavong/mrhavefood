export type SectionId = "main" | "platforms" | "restaurants" | "footer";

export const navItems = [
  { label: "โปรโมชั่น", href: "#main", section: "main" },
  { label: "แพลตฟอร์ม", href: "#platforms", section: "platforms" },
  { label: "ร้านค้า MrHaveFood", href: "#restaurants", section: "restaurants" },
] as const;
