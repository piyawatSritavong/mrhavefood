import { Badge } from "@/components/ui/badge";
import { HomeHeroChat } from "@/components/home/home-hero-chat";
import { MessageSquareIcon, ShieldCheckIcon, SparklesIcon } from "@/components/ui/icons";
import type { HomeZoneId } from "@/lib/home-experience";

const heroBullets = [
  {
    title: "จบสงครามราคา",
    copy: "รวมราคาสุทธิ (ค่าอาหาร + ค่าส่ง) จาก Delivery Food ทุกแอปเทียบให้เห็นทันที",
    icon: SparklesIcon,
  },
  {
    title: "Mr.AI ช่วยสั่งอาหาร",
    copy: "อยากกินอะไร งบเท่าไหร่ พิมพ์บอก Mr.AI ไม่ต้องงมหาฟิลเตอร์เอง",
    icon: MessageSquareIcon,
  },
  {
    title: "คุ้มจริง ไม่มีแกง",
    copy: "จัดลำดับดีลด้วยข้อมูลจริง และโปรโมชั่นล่าสุด คุณจะได้ราคาที่ดีที่สุด",
    icon: ShieldCheckIcon,
  },
];

type HomeHeroSectionProps = {
  selectedZoneId: HomeZoneId;
};

export function HomeHeroSection({
  selectedZoneId,
}: HomeHeroSectionProps) {
  return (
    <section
      id="main"
      data-section-id="main"
      className="flex w-full min-w-0 flex-col justify-center px-4 py-16 text-white sm:min-h-[calc(100dvh-5rem)] sm:snap-start sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="space-y-4 sm:space-y-6">
          <Badge variant="secondary" className="hidden bg-white/15 text-white sm:inline-flex">
            MrHaveFood.com
          </Badge>

          <div className="space-y-4">
            <h1 className="font-display text-[1.9rem] leading-[1.1] tracking-tight sm:text-[3rem] sm:leading-[1.04] lg:text-[4.2rem]">
              ไม่ต้องสลับแอปให้วุ่นวาย โปรโมชั่นจากทุกแอปอยู่ที่นี่หมดแล้ว
            </h1>
            <p className="max-w-xl text-sm leading-7 text-white/78 sm:text-base sm:leading-8">
              MrHaveFood ยกระดับการสั่งอาหารให้ฉลาดกว่าเดิม ด้วยระบบ AI เปรียบเทียบราคาแบบ Real-time เจ้าแรกในไทย ที่ช่วยคุณประหยัดทั้งเงินและเวลา
            </p>
          </div>

          <div className="hidden gap-3 sm:grid sm:grid-cols-3">
            {heroBullets.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur"
                >
                  <Icon className="size-5 text-white" />
                  <p className="mt-4 font-display text-lg leading-6 text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/72">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden sm:block lg:pl-6">
          <HomeHeroChat selectedZoneId={selectedZoneId} />
        </div>
      </div>
    </section>
  );
}
