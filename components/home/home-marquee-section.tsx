"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MESSAGES = [
  "กำลังรอร้านลับประเทศไทย",
  "คนไทย ใช้ของไทย ไม่มีค่าแพลตฟอร์ม",
  "ยกระดับร้านอาหารไทย",
  "สั่งตรงผ่านไลน์โดยตรง",
  "เพิ่มช่องทางการขาย",
  "สนับสนุนร้านค้าไทย",
];

// Two identical copies: animating the w-max track to -50% moves exactly one copy, so the loop is seamless.
const items = [...MESSAGES, ...MESSAGES];

export function HomeMarqueeSection() {
  const [duration, setDuration] = useState(30);
  useEffect(() => {
    const update = () => setDuration(window.innerWidth < 768 ? 22 : 30);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section
      aria-label="MrHaveFood สำหรับร้านอาหาร"
      className="w-full overflow-hidden bg-linear-to-r from-brand-accent via-brand-sky to-brand-primary py-3"
    >
      <motion.div
        key={duration}
        className="flex w-max whitespace-nowrap motion-reduce:transform-none!"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {items.map((text, i) => (
          <span key={i} className="flex items-center" aria-hidden={i >= MESSAGES.length}>
            <span className="px-8 text-sm font-bold text-inverse">{text}</span>
            <span className="text-inverse/60" aria-hidden>✦</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
