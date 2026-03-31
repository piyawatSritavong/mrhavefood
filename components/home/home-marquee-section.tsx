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

const items = Array(4).fill(MESSAGES).flat();

export function HomeMarqueeSection() {
  const [duration, setDuration] = useState(18);
  useEffect(() => {
    const update = () => setDuration(window.innerWidth < 768 ? 10 : 18);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section className="w-full overflow-hidden py-3" style={{ background: "linear-gradient(to right, #dd722c, #0369a1, #00437c)" }}>
      <motion.div
        key={duration}
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {items.map((text, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 text-sm font-black tracking-widest text-white">{text}</span>
            <span className="text-white/60">✦</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
