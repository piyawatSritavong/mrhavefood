"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SIZE = 64;
const SNAP_RADIUS = 100;
const LONG_PRESS_MS = 400;

type Message = { role: "ai" | "user"; text: string };

const INITIAL_MESSAGES: Message[] = [
  { role: "ai", text: "สวัสดีครับ! 😊 วันนี้กินอะไรดี? บอกงบหรืออยากได้อะไร แล้ว Mr.AI จะช่วยแนะนำเลย" },
];

export function FloatingAIButton() {
  const btnRef = useRef<HTMLDivElement>(null);
  const [jsPos, setJsPos] = useState<{ x: number; y: number } | null>(null);
  const [hidden, setHidden] = useState(false);
  const [dragMode, setDragMode] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const drag = useRef({ active: false, ox: 0, oy: 0, moved: false });
  const cur = useRef({ x: 0, y: 0 });
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressShort = useRef(true);
  const pressStarted = useRef(false); // true only when press began on the FAB

  useEffect(() => {
    const t = setTimeout(() => setShowTooltip(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const move = (cx: number, cy: number) => {
      if (!drag.current.active) return;
      drag.current.moved = true;
      const x = Math.max(0, Math.min(window.innerWidth - SIZE, cx - drag.current.ox));
      const y = Math.max(0, Math.min(window.innerHeight - SIZE, cy - drag.current.oy));
      cur.current = { x, y };
      setJsPos({ x, y });
    };

    const end = (cx: number, cy: number) => {
      if (!pressStarted.current) return;
      pressStarted.current = false;
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      if (drag.current.active) {
        drag.current.active = false;
        setDragMode(false);
        if (drag.current.moved) {
          const indicatorX = window.innerWidth / 2;
          const indicatorY = window.innerHeight - 32 - 56;
          const dist = Math.hypot(cx - indicatorX, cy - indicatorY);
          if (dist < SNAP_RADIUS) { setHidden(true); return; }
        }
      } else if (pressShort.current) {
        setShowTooltip(false);
        setChatOpen((v) => !v);
      }
    };

    const mm = (e: MouseEvent) => move(e.clientX, e.clientY);
    const mu = (e: MouseEvent) => end(e.clientX, e.clientY);
    const tm = (e: TouchEvent) => {
      if (drag.current.active) e.preventDefault();
      move(e.touches[0].clientX, e.touches[0].clientY);
    };
    const te = (e: TouchEvent) => end(e.changedTouches[0].clientX, e.changedTouches[0].clientY);

    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    window.addEventListener("touchmove", tm, { passive: false });
    window.addEventListener("touchend", te);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", te);
    };
  }, []);

  const handlePressStart = (clientX: number, clientY: number) => {
    pressStarted.current = true;
    pressShort.current = true;
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) cur.current = { x: rect.left, y: rect.top };

    longPressTimer.current = setTimeout(() => {
      pressShort.current = false;
      longPressTimer.current = null;
      drag.current = {
        active: true,
        ox: clientX - cur.current.x,
        oy: clientY - cur.current.y,
        moved: false,
      };
      setJsPos({ ...cur.current });
      setDragMode(true);
    }, LONG_PRESS_MS);
  };

  const sendMessage = () => {
    const text = inputVal.trim();
    if (!text || typing) return;
    setInputVal("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "ขอบคุณสำหรับคำถามนะครับ! 🚀 ระบบ AI กำลังพัฒนาอยู่ เร็วๆ นี้จะตอบได้เต็มรูปแบบแน่นอนครับ 😊" },
      ]);
    }, 1500);
  };

  if (hidden) return null;

  return (
    <>
      {/* Drag indicator — bottom center */}
      {dragMode && (
        <div className="pointer-events-none fixed inset-x-0 bottom-8 z-9998 flex justify-center">
          <div className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-white/50 bg-black/25 text-white backdrop-blur-sm">
            <span className="text-2xl leading-none">✕</span>
            <span className="text-[11px] font-bold">ซ่อน</span>
          </div>
        </div>
      )}

      {/* Chat panel */}
      {chatOpen && (
        <div
          className="fixed bottom-24 right-4 z-9998 flex w-80 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          style={{ maxHeight: "min(480px, 70dvh)" }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center gap-3 bg-[#00437c] px-4 py-3">
            <Image src="/assets/aimrhavefood.png" alt="Mr.AI" width={32} height={32} className="rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Mr.HaveFood AI</p>
              <p className="text-[10px] text-white/60">ถามได้เลย!</p>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-lg leading-none text-white/70 hover:text-white">✕</button>
          </div>

          {/* Messages — scrollable */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((msg, i) =>
              msg.role === "ai" ? (
                <div key={i} className="flex items-start gap-2">
                  <Image src="/assets/aimrhavefood.png" alt="" width={28} height={28} className="mt-0.5 shrink-0 rounded-full object-cover" />
                  <div className="rounded-2xl rounded-tl-none bg-[#f0f4f8] px-3.5 py-2.5 text-sm text-[#00437c]">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-none bg-[#00437c] px-3.5 py-2.5 text-sm text-white">
                    {msg.text}
                  </div>
                </div>
              )
            )}
            {typing && (
              <div className="flex items-start gap-2">
                <Image src="/assets/aimrhavefood.png" alt="" width={28} height={28} className="mt-0.5 shrink-0 rounded-full object-cover" />
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-none bg-[#f0f4f8] px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#00437c]/40 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#00437c]/40 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#00437c]/40 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex shrink-0 items-center gap-2 border-t border-gray-100 px-3 py-2.5">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="พิมพ์คำถามที่นี่..."
              className="flex-1 rounded-full border border-gray-200 px-3.5 py-2 text-sm outline-none focus:border-[#00437c]"
            />
            <button
              onClick={sendMessage}
              disabled={!inputVal.trim() || typing}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00437c] text-white disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB — CSS position by default, switches to JS after first drag */}
      <div
        ref={btnRef}
        className={`fixed z-9999 select-none ${jsPos ? "" : "bottom-4 right-5"}`}
        style={jsPos ? { left: jsPos.x, top: jsPos.y, touchAction: "none" } : { touchAction: "none" }}
        onMouseDown={(e) => { e.preventDefault(); handlePressStart(e.clientX, e.clientY); }}
        onTouchStart={(e) => { handlePressStart(e.touches[0].clientX, e.touches[0].clientY); }}
      >
        {/* Tooltip bubble */}
        {showTooltip && (
          <div className="pointer-events-none absolute bottom-full right-0 mb-3 w-max max-w-47.5 rounded-2xl bg-white px-3.5 py-2.5 text-xs font-semibold text-[#00437c] shadow-xl">
            วันนี้กินอะไรดี ถาม Mr.HaveFood สิ
            <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-white" />
          </div>
        )}

        <div className={`h-16 w-16 overflow-hidden rounded-full shadow-2xl ring-2 ring-white/60 transition-transform duration-150 ${
          dragMode ? "scale-110 cursor-grabbing" : "cursor-pointer hover:scale-105"
        }`}>
          <Image src="/assets/aimrhavefood.png" alt="Mr.AI" width={64} height={64} className="h-full w-full object-cover" priority draggable={false} />
        </div>
      </div>
    </>
  );
}
