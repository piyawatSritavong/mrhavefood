"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { CloseIcon, SendIcon } from "@/components/ui/icons";
import { useHomeStore } from "@/lib/stores/use-home-store";
import { cn } from "@/lib/utils";

const SIZE = 64;
const SNAP_RADIUS = 100;
const LONG_PRESS_MS = 400;
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_MESSAGE_LENGTH = 500;
const HISTORY_LIMIT = 10;
const HIDDEN_KEY = "mrhf-ai-hidden";

type Message = { role: "ai" | "user"; text: string; failed?: boolean };

const INITIAL_MESSAGES: Message[] = [
  { role: "ai", text: "สวัสดีครับ! 😊 วันนี้กินอะไรดี? บอกงบหรืออยากได้อะไร แล้ว Mr.AI จะช่วยแนะนำเลย" },
];

const QUICK_REPLIES = ["โปรวันนี้มีอะไรบ้าง", "งบ 100 บาท กินอะไรดี", "GrabFood ใช้โค้ดอะไรดี"];

function readHidden(): boolean {
  try {
    return window.sessionStorage.getItem(HIDDEN_KEY) === "1";
  } catch {
    return false;
  }
}

function writeHidden(hidden: boolean) {
  try {
    if (hidden) window.sessionStorage.setItem(HIDDEN_KEY, "1");
    else window.sessionStorage.removeItem(HIDDEN_KEY);
  } catch {
    // Storage may be unavailable (private mode); hiding then lasts for this page view only.
  }
}

/** Height of the on-screen keyboard (0 when closed), from the visual viewport. */
function useKeyboardInset() {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);
  return inset;
}

export function FloatingAIButton() {
  const chatOpen = useHomeStore((s) => s.chatOpen);
  const setChatOpen = useHomeStore((s) => s.setChatOpen);
  const panelId = useId();

  const btnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [jsPos, setJsPos] = useState<{ x: number; y: number } | null>(null);
  const [hidden, setHidden] = useState(false);
  const [dragMode, setDragMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(false);
  const keyboardInset = useKeyboardInset();

  const drag = useRef({ active: false, ox: 0, oy: 0, moved: false });
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    setHidden(readHidden());
    const t = setTimeout(() => setShowTooltip(false), 4000);
    return () => {
      clearTimeout(t);
      abortRef.current?.abort();
    };
  }, []);

  // Opening the chat from elsewhere (e.g. the footer CTA) brings a hidden FAB back.
  useEffect(() => {
    if (chatOpen && hidden) {
      setHidden(false);
      writeHidden(false);
    }
  }, [chatOpen, hidden]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const closeChat = useCallback(() => {
    setChatOpen(false);
    btnRef.current?.focus();
  }, [setChatOpen]);

  useEffect(() => {
    if (!chatOpen) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen, closeChat]);

  const clearLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Pointer Events cover mouse, touch and pen with one sequence, so a tap toggles exactly once (via onClick).
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const { clientX, clientY, pointerId } = e;
    const target = e.currentTarget;
    clearLongPress();
    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = null;
      drag.current = { active: true, ox: clientX - rect.left, oy: clientY - rect.top, moved: false };
      try {
        target.setPointerCapture(pointerId);
      } catch {
        // Pointer already released.
      }
      setJsPos({ x: rect.left, y: rect.top });
      setDragMode(true);
      setShowTooltip(false);
    }, LONG_PRESS_MS);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current.active) return;
    drag.current.moved = true;
    const x = Math.max(0, Math.min(window.innerWidth - SIZE, e.clientX - drag.current.ox));
    const y = Math.max(0, Math.min(window.innerHeight - SIZE, e.clientY - drag.current.oy));
    setJsPos({ x, y });
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLButtonElement>) => {
    clearLongPress();
    if (!drag.current.active) return;
    const { moved } = drag.current;
    drag.current.active = false;
    suppressClick.current = true;
    setDragMode(false);
    if (moved) {
      const dist = Math.hypot(e.clientX - window.innerWidth / 2, e.clientY - (window.innerHeight - 32 - 56));
      if (dist < SNAP_RADIUS) {
        setHidden(true);
        writeHidden(true);
        setChatOpen(false);
      }
    }
  };

  const handleClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    setShowTooltip(false);
    setChatOpen(!chatOpen);
  };

  const restore = () => {
    setHidden(false);
    writeHidden(false);
    setJsPos(null);
  };

  const sendMessage = async (raw: string, base: Message[] = messages) => {
    const text = raw.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!text || typing) return;
    setInputVal("");
    const prior = base.filter((m) => !m.failed);
    const history = prior.slice(-HISTORY_LIMIT).map(({ role, text }) => ({ role, text }));
    setMessages([...prior, { role: "user", text }]);
    setTyping(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
        signal: controller.signal,
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string };
      if (!res.ok || !data.reply) {
        const reason =
          res.status === 429
            ? "ถามถี่เกินไปนิดนึงครับ รอสักครู่แล้วลองใหม่ได้เลย 🙏"
            : "ระบบ AI ไม่พร้อมใช้งานชั่วคราว ลองใหม่อีกครั้งนะครับ 🙏";
        setMessages((prev) => [...prev, { role: "ai", text: reason, failed: true }]);
        return;
      }
      setMessages((prev) => [...prev, { role: "ai", text: data.reply as string }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "เชื่อมต่อไม่สำเร็จหรือใช้เวลานานเกินไป ลองใหม่อีกครั้งนะครับ 🙏", failed: true },
      ]);
    } finally {
      clearTimeout(timeout);
      if (abortRef.current === controller) abortRef.current = null;
      setTyping(false);
    }
  };

  const retryLast = () => {
    const idx = messages.findLastIndex((m) => m.role === "user");
    if (idx < 0) return;
    // Drop the failed exchange, then resend the same question.
    void sendMessage(messages[idx].text, messages.slice(0, idx));
  };

  if (hidden) {
    return (
      <button
        type="button"
        onClick={restore}
        aria-label="แสดงปุ่ม Mr.AI อีกครั้ง"
        className="fixed right-0 z-9999 flex min-h-11 items-center gap-1 rounded-l-full bg-brand-primary py-1 pl-2 pr-3 text-xs font-semibold text-inverse shadow-elevated"
        style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
      >
        <Image src="/assets/mr-ai.webp" alt="" width={28} height={28} className="rounded-full" />
        Mr.AI
      </button>
    );
  }

  const panelBottom = keyboardInset > 0 ? `${keyboardInset + 8}px` : "calc(6rem + env(safe-area-inset-bottom))";
  const lastIsFailed = messages[messages.length - 1]?.failed;

  return (
    <>
      {dragMode && (
        <div className="pointer-events-none fixed inset-x-0 bottom-8 z-9998 flex justify-center">
          <div className="flex size-28 flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-inverse/50 bg-ink/40 text-inverse backdrop-blur-sm">
            <CloseIcon className="size-6" />
            <span className="text-xs font-bold">ลากมาเพื่อซ่อน</span>
          </div>
        </div>
      )}

      {chatOpen && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-label="แชทกับ Mr.HaveFood AI"
          className="fixed inset-x-3 z-9998 flex flex-col overflow-hidden rounded-card bg-surface shadow-2xl sm:inset-x-auto sm:right-4 sm:w-96"
          style={{
            bottom: panelBottom,
            maxHeight: keyboardInset > 0 ? `calc(100dvh - ${keyboardInset + 24}px)` : "min(520px, 70dvh)",
          }}
        >
          <div className="flex shrink-0 items-center gap-3 bg-brand-primary py-2 pl-4 pr-2">
            <Image src="/assets/mr-ai.webp" alt="" width={32} height={32} className="rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-sm font-bold text-inverse">Mr.HaveFood AI</p>
              <p className="text-xs text-inverse/70">ถามได้เลย!</p>
            </div>
            <button
              type="button"
              onClick={closeChat}
              aria-label="ปิดแชท"
              className="grid size-11 place-items-center rounded-full text-inverse/80 hover:bg-inverse/10 hover:text-inverse"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div role="log" aria-live="polite" className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((msg, i) =>
              msg.role === "ai" ? (
                <div key={i} className="flex items-start gap-2">
                  <Image src="/assets/mr-ai.webp" alt="" width={28} height={28} className="mt-0.5 shrink-0 rounded-full object-cover" />
                  <div
                    className={cn(
                      "whitespace-pre-wrap rounded-2xl rounded-tl-none px-3.5 py-2.5 text-sm",
                      msg.failed ? "bg-danger-surface text-danger" : "bg-surface-brand text-brand-primary",
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="whitespace-pre-wrap rounded-2xl rounded-tr-none bg-brand-primary px-3.5 py-2.5 text-sm text-inverse">
                    {msg.text}
                  </div>
                </div>
              ),
            )}
            {typing && (
              <div className="flex items-start gap-2" aria-label="Mr.AI กำลังพิมพ์">
                <Image src="/assets/mr-ai.webp" alt="" width={28} height={28} className="mt-0.5 shrink-0 rounded-full object-cover" />
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-none bg-surface-brand px-4 py-3">
                  <span className="size-2 animate-bounce rounded-full bg-brand-primary/40 [animation-delay:0ms]" />
                  <span className="size-2 animate-bounce rounded-full bg-brand-primary/40 [animation-delay:150ms]" />
                  <span className="size-2 animate-bounce rounded-full bg-brand-primary/40 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            {lastIsFailed && !typing && (
              <button
                type="button"
                onClick={retryLast}
                className="ml-9 inline-flex min-h-11 w-fit items-center rounded-full border border-border-strong px-4 text-sm font-semibold text-brand-primary"
              >
                ลองใหม่
              </button>
            )}
            {messages.length === 1 && !typing && (
              <div className="flex flex-wrap gap-2 pl-9">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void sendMessage(q)}
                    className="inline-flex min-h-11 items-center rounded-full border border-border px-3 text-xs font-semibold text-brand-primary hover:bg-surface-brand"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage(inputVal);
            }}
            className="flex shrink-0 items-center gap-2 border-t border-border px-3 py-2"
          >
            <label htmlFor={`${panelId}-input`} className="sr-only">
              พิมพ์คำถามถึง Mr.AI
            </label>
            <input
              id={`${panelId}-input`}
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="พิมพ์คำถามที่นี่..."
              maxLength={MAX_MESSAGE_LENGTH}
              enterKeyHint="send"
              aria-busy={typing}
              className="min-h-11 min-w-0 flex-1 rounded-full border border-border px-3.5 text-base text-ink outline-none focus:border-brand-primary sm:text-sm"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || typing}
              aria-label="ส่งข้อความ"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-primary text-inverse disabled:opacity-40"
            >
              <SendIcon className="size-5" />
            </button>
          </form>
        </div>
      )}

      <button
        ref={btnRef}
        type="button"
        aria-label={chatOpen ? "ปิดแชท Mr.AI" : "เปิดแชท Mr.AI ผู้ช่วยเลือกโปรอาหาร"}
        aria-expanded={chatOpen}
        aria-controls={chatOpen ? panelId : undefined}
        aria-haspopup="dialog"
        className="fixed z-9999 select-none rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/50"
        style={
          jsPos
            ? { left: jsPos.x, top: jsPos.y, touchAction: "none" }
            : {
                right: "calc(1.25rem + env(safe-area-inset-right))",
                bottom: "calc(1rem + env(safe-area-inset-bottom))",
                touchAction: "none",
              }
        }
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
      >
        {showTooltip && !chatOpen && (
          <span className="pointer-events-none absolute bottom-full right-0 mb-3 w-max max-w-48 rounded-2xl bg-surface px-3.5 py-2.5 text-xs font-semibold text-brand-primary shadow-xl">
            วันนี้กินอะไรดี ถาม Mr.HaveFood สิ
            <span className="absolute -bottom-1.5 right-6 size-3 rotate-45 bg-surface" />
          </span>
        )}
        <span
          className={cn(
            "block size-16 overflow-hidden rounded-full shadow-2xl ring-2 ring-inverse/60 transition-transform duration-150",
            dragMode ? "scale-110 cursor-grabbing" : "cursor-pointer hover:scale-105",
          )}
        >
          <Image
            src="/assets/mr-ai.webp"
            alt=""
            width={64}
            height={64}
            className="size-full object-cover"
            priority
            draggable={false}
          />
        </span>
      </button>
    </>
  );
}
