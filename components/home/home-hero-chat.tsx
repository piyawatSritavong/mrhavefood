"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  ArrowRightIcon,
  MessageSquareIcon,
  SearchIcon,
  SparklesIcon,
} from "@/components/ui/icons";
import { AIEyes } from "@/components/ui/ai-eyes";
import {
  buildHomeChatReply,
  formatSavingsCopy,
  getPlatformMeta,
  getZoneLabel,
  homePromptStarters,
  homeZones,
  type HomeZoneId,
  type HomeChatReply,
} from "@/lib/home-experience";
import { formatBaht } from "@/lib/home-content";
import { cn } from "@/lib/utils";

type HeroMessage = {
  id: string;
  reply?: HomeChatReply;
  role: "assistant" | "user";
  text: string;
};

type HomeHeroChatProps = {
  selectedZoneId: HomeZoneId;
};

export function HomeHeroChat({
  selectedZoneId,
}: HomeHeroChatProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateZone = (nextZoneId: HomeZoneId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextZoneId === "all") {
      params.delete("zone");
    } else {
      params.set("zone", nextZoneId);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<HeroMessage[]>([
    {
      id: "intro",
      role: "assistant",
      text: "วันนี้กินอะไรดี? เดี๋ยว MrHaveFood เช็คดีลที่คุ้มที่สุดให้",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const threadRef = useRef<HTMLDivElement | null>(null);
  const replyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!threadRef.current) {
      return;
    }

    threadRef.current.scrollTo({
      behavior: "smooth",
      top: threadRef.current.scrollHeight,
    });
  }, [isThinking, messages]);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) {
        window.clearTimeout(replyTimerRef.current);
      }
    };
  }, []);

  const runAssistant = (query: string) => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery || isThinking) {
      return;
    }

    if (replyTimerRef.current) {
      window.clearTimeout(replyTimerRef.current);
    }

    setInputValue("");
    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: "user" as const,
        text: normalizedQuery,
      },
    ].slice(-4));
    setIsThinking(true);

    replyTimerRef.current = window.setTimeout(() => {
      const reply = buildHomeChatReply(normalizedQuery, selectedZoneId);

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          reply,
          role: "assistant" as const,
          text: reply.summary,
        },
      ].slice(-4));
      setIsThinking(false);
    }, 850);
  };

  return (
    <Card className="border-white/10 bg-white/8 backdrop-blur sm:border-white/15 sm:bg-white sm:backdrop-blur-none sm:shadow-[0_26px_90px_rgba(0,0,0,0.12)]">
      <CardHeader className="gap-4 border-b border-[#edf0f3] pb-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base text-white sm:truncate sm:text-(--brand-primary) sm:text-[1.25rem]">
              วันนี้กินอะไรดี? MrHaveFood จัดการให้
            </CardTitle>
          </div>

          <Select
            value={selectedZoneId}
            onChange={(e) => updateZone(e.target.value as HomeZoneId)}
            className="shrink-0 font-display text-base text-(--brand-primary) sm:w-auto"
          >
            {homeZones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="hidden flex-wrap gap-2 sm:flex">
          {homePromptStarters.map((starter) => (
            <Button
              key={starter.id}
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => runAssistant(starter.prompt)}
            >
              {starter.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div
          ref={threadRef}
          className="grid max-h-64 gap-4 overflow-y-auto pr-1 sm:max-h-96"
        >
          {messages.map((message) => (
            <article
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[90%] rounded-3xl px-4 py-3 sm:max-w-[78%]",
                  message.role === "user"
                    ? "bg-(--brand-primary) text-white"
                    : "bg-[#f7fafc] text-[#13324c]",
                )}
              >
                <div className="flex items-center gap-2 text-xs font-medium opacity-75">
                  {message.role === "assistant" ? (
                    <>
                      <MessageSquareIcon className="size-3.5" />
                      Mr.AI
                    </>
                  ) : (
                    <>
                      <SearchIcon className="size-3.5" />
                      You
                    </>
                  )}
                </div>
                <p className="mt-2 text-sm leading-7 text-inherit">{message.text}</p>

                {message.reply ? (
                  <div className="mt-4 space-y-3">
                    {message.reply.results.map((result) => {
                      const platformMeta = getPlatformMeta(result.platform);

                      return (
                        <div
                          key={`${message.id}-${result.menuName}`}
                          className="rounded-2xl border border-[#e6edf4] bg-white px-4 py-3 text-[#13324c]"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                  variant={`platform-${result.platform}` as const}
                                >
                                  {platformMeta.name}
                                </Badge>
                                <Badge variant="accent">{result.accentLabel}</Badge>
                              </div>
                              <p className="font-display text-lg text-(--brand-primary)">
                                {result.menuName}
                              </p>
                              <p className="text-sm leading-6 text-[#5c6e7f]">
                                {result.restaurant} • {getZoneLabel(result.zoneId)} •{" "}
                                {result.etaMinutes} นาที
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="font-data text-2xl font-semibold text-(--brand-accent)">
                                {formatBaht(result.totalPrice)}
                              </p>
                              <p className="mt-1 text-sm text-[#8a98a7] line-through">
                                {formatBaht(result.originalPrice)}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-[#3d7a5b]">
                                {formatSavingsCopy(result)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#eef5fb] px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-(--brand-primary)">
                          {message.reply.hint}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#617487]">
                          ถ้าต้องการละเอียดขึ้น ลองพิมพ์ชื่อเมนูหรือใส่งบประมาณได้เลย
                        </p>
                      </div>
                      <Button variant="accent" size="sm" className="shrink-0 rounded-full">
                        ดูหมวดหมู่
                        <ArrowRightIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </article>
          ))}

          {isThinking ? (
            <article className="flex justify-start">
              <div className="max-w-[78%] rounded-3xl bg-[#f7fafc] px-4 py-3 text-[#13324c]">
                <div className="flex items-center gap-2 text-xs font-medium opacity-75">
                  <MessageSquareIcon className="size-3.5" />
                  Mr.AI
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-(--brand-primary)/40 animate-pulse" />
                  <span className="size-2 rounded-full bg-(--brand-primary)/60 animate-pulse [animation-delay:120ms]" />
                  <span className="size-2 rounded-full bg-(--brand-primary)/80 animate-pulse [animation-delay:240ms]" />
                </div>
              </div>
            </article>
          ) : null}
        </div>

        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            runAssistant(inputValue);
          }}
        >
          <Input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="อยากกินอะไรดี เช่น ยำวุ้นเส้น งบไม่เกิน 120"
            className="h-12 flex-1 border-[#d9e2ec] bg-[#fbfcfe]"
          />
          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="rounded-2xl sm:w-auto"
            disabled={isThinking}
          >
            <AIEyes disabled={isThinking} />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
