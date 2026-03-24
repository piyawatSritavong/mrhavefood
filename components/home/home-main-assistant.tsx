"use client";

import { useEffect, useRef, useState } from "react";

import { TrackedDeepLinkButton } from "@/components/affiliate/tracked-deep-link-button";
import { AIEyes } from "@/components/ui/ai-eyes";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  buildHeroAssistantReply,
  heroChatPlaceholders,
  heroPromptStarters,
  type HeroChatDeal,
  type HeroChatOffer,
  type HeroChatStat,
} from "@/lib/home-view-models";
import type { CompareScenario } from "@/lib/home-content";
import { formatBaht } from "@/lib/home-content";
import { cn } from "@/lib/cn";
import { useHomeStore } from "@/lib/stores/use-home-store";

type HeroChatMessage = {
  deal?: HeroChatDeal;
  id: string;
  insight?: string;
  offers?: HeroChatOffer[];
  role: "assistant" | "user";
  showPromptStarters?: boolean;
  stats?: HeroChatStat[];
  text: string;
};

type HomeMainAssistantProps = {
  scenarios: CompareScenario[];
};

function findScenarioById(scenarios: CompareScenario[], scenarioId: string) {
  return scenarios.find((scenario) => scenario.id === scenarioId);
}

export function HomeMainAssistant({
  scenarios,
}: HomeMainAssistantProps) {
  const selectedScenarioId = useHomeStore((state) => state.selectedScenarioId);
  const setSearchQuery = useHomeStore((state) => state.setSearchQuery);
  const setSelectedScenario = useHomeStore((state) => state.setSelectedScenario);
  const setSelectedPlatform = useHomeStore((state) => state.setSelectedPlatform);
  const [heroChatInput, setHeroChatInput] = useState("");
  const [heroMessages, setHeroMessages] = useState<HeroChatMessage[]>([
    {
      id: "hero-assistant-intro",
      insight: "ทางลัด เพื่อให้ฉันหาข้อมูลได้เร็วขึ้น",
      role: "assistant",
      showPromptStarters: true,
      text: "คิดไม่ออกบอก Mr.AI ค้นหาร้านราคาถูก",
    },
  ]);
  const [heroLoaderSteps, setHeroLoaderSteps] = useState<string[]>([]);
  const [heroLoaderStepIndex, setHeroLoaderStepIndex] = useState(0);
  const [isHeroThinking, setIsHeroThinking] = useState(false);
  const heroThreadRef = useRef<HTMLDivElement | null>(null);
  const heroTimerIds = useRef<number[]>([]);
  const defaultScenario = scenarios[0];
  const selectedScenario =
    findScenarioById(scenarios, selectedScenarioId) ?? defaultScenario;

  const clearHeroTimers = () => {
    heroTimerIds.current.forEach((timerId) => window.clearTimeout(timerId));
    heroTimerIds.current = [];
  };

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

  if (!defaultScenario || !selectedScenario) {
    return null;
  }

  const runHeroAssistant = (prompt: string) => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      return;
    }

    clearHeroTimers();

    const reply = buildHeroAssistantReply(
      trimmedPrompt,
      scenarios,
      selectedScenario,
    );

    setHeroChatInput("");
    setSearchQuery(reply.searchHint);
    setSelectedScenario(reply.scenario.id);
    setSelectedPlatform(reply.bestOfferPlatform);
    setHeroMessages((current) => [
      ...current,
      {
        id: `hero-user-${Date.now()}`,
        role: "user" as const,
        text: trimmedPrompt,
      },
    ].slice(-5));
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
        setHeroMessages((current) => [
          ...current,
          {
            deal: reply.deal,
            id: `hero-assistant-${Date.now()}`,
            insight: reply.insight,
            offers: reply.offers,
            role: "assistant" as const,
            stats: reply.stats,
            text: reply.summary,
          },
        ].slice(-5));
      }, 2250),
    );
  };

  return (
    <section
      className="hero-assistant-shell glass-panel"
      aria-label="AI deal assistant"
    >
      <div className="hero-chat-board">
        <div
          ref={heroThreadRef}
          className="hero-chat-thread"
        >
          {heroMessages.map((message) => {
            const highestPrice = message.offers
              ? Math.max(...message.offers.map((offer) => offer.totalPrice))
              : 0;

            return (
              <article
                key={message.id}
                className={cn(
                  "hero-chat-message",
                  message.role === "user" ? "is-user" : "is-assistant",
                )}
              >
                <div className="hero-chat-bubble">
                  <p className="type-body text-current text-center">{message.text}</p>

                  {message.offers ? (
                    <div className="hero-offer-board">
                      {message.offers.map((offer) => (
                        <div
                          key={`${message.id}-${offer.platform}`}
                          className={cn(
                            "hero-offer-card",
                            offer.isBest && "is-best",
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
                              className={cn(
                                "hero-offer-bar-fill",
                                offer.isBest && "is-best",
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
                          className={cn("hero-stat-card", `tone-${stat.tone}`)}
                        >
                          <span
                            className={cn("hero-stat-glyph", `kind-${stat.kind}`)}
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
                        <div
                          className="hero-starter-row is-insight"
                          aria-label="Prompt starters"
                        >
                          {heroPromptStarters.map((starter) => (
                            <HoverBorderGradient
                              key={`${message.id}-${starter.id}`}
                              onClick={() => runHeroAssistant(starter.prompt)}
                              innerClassName="hero-starter-chip"
                            >
                              <span
                                className={cn(
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
  );
}
