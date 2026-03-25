import { Badge } from "@/components/ui/badge";
import { HomeFilterBar } from "@/components/home/home-filter-bar";
import type { HomeQuickFilterId, HomeZoneId } from "@/lib/home-experience";

const dealCards = [
  { platform: "GrabFood", label: "ฟรีค่าส่ง", copy: "สั่งครบ ฿150 ส่งฟรีทุกออเดอร์", color: "#00B14F", bg: "#f0fdf4", textColor: "#166534" },
  { platform: "LINE MAN", label: "ลด 40%", copy: "ส่วนลดพิเศษสำหรับผู้ใช้ใหม่วันนี้", color: "#00C300", bg: "#f0fdf4", textColor: "#166534" },
  { platform: "ShopeeFood", label: "แต้มคืน 10%", copy: "สะสม ShopeeCoin ทุกออเดอร์", color: "#EE4D2D", bg: "#fff1ee", textColor: "#9a3412" },
  { platform: "Foodpanda", label: "ลด ฿50", copy: "ใช้โค้ด PANDA50 สั่งครั้งแรก", color: "#D70F64", bg: "#fdf2f8", textColor: "#9d174d" },
  { platform: "Robinhood", label: "ไม่มีค่า GP", copy: "ร้านไม่เสียค่า GP ราคาถูกกว่า", color: "#4A148C", bg: "#faf5ff", textColor: "#6b21a8" },
  { platform: "GrabFood", label: "ลด 30%", copy: "เมนูแนะนำวันนี้ลดสูงสุด 30%", color: "#00B14F", bg: "#f0fdf4", textColor: "#166534" },
  { platform: "LINE MAN", label: "ฟรีค่าส่ง", copy: "ร้านแนะนำใหม่ส่งฟรีไม่มีขั้นต่ำ", color: "#00C300", bg: "#f0fdf4", textColor: "#166534" },
  { platform: "ShopeeFood", label: "Flash Sale", copy: "ดีลเด็ดทุกชั่วโมงใน ShopeeFood", color: "#EE4D2D", bg: "#fff1ee", textColor: "#9a3412" },
  { platform: "Foodpanda", label: "Free Item", copy: "สั่งเมนูนี้รับของแถมฟรีทันที", color: "#D70F64", bg: "#fdf2f8", textColor: "#9d174d" },
  { platform: "Robinhood", label: "ราคาชาวบ้าน", copy: "อาหารอร่อยราคาเป็นธรรมทุกวัน", color: "#4A148C", bg: "#faf5ff", textColor: "#6b21a8" },
];

type HomeDiscoverSectionProps = {
  activeQuickFilter: HomeQuickFilterId;
  selectedZoneId: HomeZoneId;
};

export function HomeDiscoverSection({
  activeQuickFilter,
  selectedZoneId,
}: HomeDiscoverSectionProps) {
  return (
    <section
      id="discover"
      data-section-id="discover"
      className="w-full min-w-0 bg-(--brand-surface) px-4 py-10 sm:snap-start sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-4">
          <Badge variant="outline">Mr. Easy Search</Badge>
          <div className="space-y-3">
            <h2 className="font-display text-[1.25rem] leading-tight text-(--brand-primary) sm:text-[2.1rem] lg:text-[2.4rem]">
              ค้นหาพื้นที่ของคุณ... เราจะคัดดีลสุดคุ้มมาเสิร์ฟทันที
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[#5c6e7f] sm:text-base sm:leading-8">
              คุมทุกดีลได้อยู่หมัด ไม่ว่าคุณจะเลื่อนไปไหน ระบบ Smart Filter จะอัปเดตโปรโมชั่นให้แบบ Real-time
            </p>
          </div>
        </div>

        <HomeFilterBar
          activeQuickFilter={activeQuickFilter}
          selectedZoneId={selectedZoneId}
        />

        {/* Infinite Moving Cards */}
        <div className="overflow-hidden rounded-2xl border border-[#e3dddd] bg-white py-3 shadow-[0_12px_40px_rgba(0,67,124,0.06)] mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="infinite-cards-track flex w-max gap-4 px-4">
            {[...dealCards, ...dealCards].map((card, i) => (
              <div
                key={i}
                className="flex w-44 shrink-0 items-center gap-3 rounded-xl px-3 py-2 sm:w-52"
                style={{ backgroundColor: card.bg }}
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: card.color }}
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold" style={{ color: card.color }}>
                    {card.platform}
                  </p>
                  <p className="truncate font-display text-sm font-bold" style={{ color: card.textColor }}>
                    {card.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
