import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { heroStats, type CompareScenario } from "@/lib/home-content";
import { HomeMainAssistant } from "@/components/home/home-main-assistant";

type HomeMainSectionProps = {
  scenarios: CompareScenario[];
};

export function HomeMainSection({
  scenarios,
}: HomeMainSectionProps) {
  return (
    <section
      id="main"
      data-section-id="main"
      className="section-shell home-hero-scene scroll-mt-24"
    >
      <BackgroundGradientAnimation containerClassName="hero-gradient-shell" />

      <div className="section-frame max-w-7xl">
        <div className="hero-wow-shell">
          <div className="home-hero-copy">
            <div className="space-y-4 text-center">
              <h1 className="home-hero-title">Mr. Have Food</h1>
              <p className="home-hero-subcopy type-body">
                วันนี้กินอะไรดี เดี๋ยว MrHaveFood หาเจ้าที่ถูกที่สุดให้แบบไม่ต้องไล่เทียบเองหลายแอป
              </p>
            </div>

            <HomeMainAssistant scenarios={scenarios} />

            <ul
              className="home-hero-stats"
              aria-label="Key platform stats"
            >
              {heroStats.map((stat) => (
                <li
                  key={stat.label}
                  className="hero-stat-chip"
                >
                  <p className="type-stat-sm text-[#111111]">{stat.value}</p>
                  <p className="type-caption mt-1 text-[#5f695c]">{stat.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
