import { Badge } from "@/components/ui/badge";
import { HomeFilterBar } from "@/components/home/home-filter-bar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { HomeQuickFilterId, HomeZoneId } from "@/lib/home-experience";

const shortcutLabels = ["เมนูยำ", "เมนูย่าง", "ก๋วยเตี๋ยว", "ข้าวจานเดียว", "ของหวาน"];

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
      className="flex min-h-[calc(100dvh-5rem)] sm:snap-start flex-col justify-center bg-(--brand-surface) px-4 py-10 sm:py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-4">
          <Badge variant="outline">Mr. Easy Search</Badge>
          <div className="space-y-3">
            <h2 className="font-display text-[1.6rem] leading-tight text-(--brand-primary) sm:text-[2.1rem] lg:text-[2.4rem]">
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

        <div className="rounded-[28px] border border-[#e3dddd] bg-white p-5 shadow-[0_12px_40px_rgba(0,67,124,0.06)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--brand-primary)]">
                Shortcuts
              </p>
              <p className="mt-1 text-sm leading-6 text-[#5c6e7f]">
                หมวยอดฮิตที่ค้นหาบ่อยที่สุด
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {shortcutLabels.map((label) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-[#f7f9fc] text-[#4d6175] hover:bg-[#edf4fb] hover:text-[var(--brand-primary)]"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-[#f7fafc] p-4">
              <p className="text-sm font-semibold text-[var(--brand-primary)]">หิวจัด... ต้องได้กินไว</p>
              <p className="mt-2 text-sm leading-6 text-[#5c6e7f]">
                คัดเฉพาะร้านที่ส่งไวที่สุดในโซนคุณ พร้อมบอกดีลที่คุ้มที่สุดในนาทีนี้
              </p>
            </div>
            <div className="rounded-3xl bg-[#fff5ef] p-4">
              <p className="text-sm font-semibold text-[var(--brand-accent)]">สมรภูมิคนล่าโปร</p>
              <p className="mt-2 text-sm leading-6 text-[#7d644f]">
                รวมดีลลดกระหน่ำ 50% ขึ้นไป เทียบราคาสุทธิ (Net Price) ให้เห็นจะๆ ว่าใครลดจริงไม่มีหลอก
              </p>
            </div>
            <div className="rounded-3xl bg-[#eef7f2] p-4">
              <p className="text-sm font-semibold text-[#236347]">ส่งฟรี 0.- ถึงหน้าบ้าน</p>
              <p className="mt-2 text-sm leading-6 text-[#577065]">
                ไม่ต้องคำนวณค่าส่งให้ปวดหัว รวมค่าส่งให้แล้ว เห็นราคาไหน จ่ายแค่นั้น
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
