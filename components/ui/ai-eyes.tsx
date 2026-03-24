"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type AIEyesProps = {
  className?: string;
  disabled?: boolean;
};

export function AIEyes({
  className,
  disabled = false,
}: AIEyesProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;

    if (!left || !right || disabled) {
      return;
    }

    let currentZone = "center";
    const squintTimers: Record<string, ReturnType<typeof setTimeout> | null> = {
      left: null,
      right: null,
    };
    const canSquintInZone: Record<string, boolean> = {
      left: true,
      right: true,
    };

    const triggerSquint = (eyeEl: HTMLDivElement, zoneName: "left" | "right") => {
      canSquintInZone[zoneName] = false;
      eyeEl.classList.add("ai-eye-suspicious");

      if (squintTimers[zoneName]) {
        clearTimeout(squintTimers[zoneName]!);
      }

      squintTimers[zoneName] = setTimeout(() => {
        eyeEl.classList.remove("ai-eye-suspicious");
      }, 1200);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const cx = ww / 2;
      const cy = wh / 2;
      const vertDist = Math.abs(event.clientY - cy);
      const isHorizontalLevel = vertDist < 240;
      const diffRatio = (event.clientX - cx) / (ww / 2);

      let newZone = "center";

      if (isHorizontalLevel) {
        if (diffRatio < -0.45) {
          newZone = "left";
        } else if (diffRatio > 0.45) {
          newZone = "right";
        }
      }

      if (newZone !== currentZone) {
        if (newZone === "center") {
          canSquintInZone.left = true;
          canSquintInZone.right = true;
        }

        currentZone = newZone;
      }

      [left, right].forEach((eye) => {
        const eyeContainer = eye.parentElement;

        if (!eyeContainer) {
          return;
        }

        const rect = eyeContainer.getBoundingClientRect();
        const eyeCX = rect.left + rect.width / 2;
        const eyeCY = rect.top + rect.height / 2;
        const angle = Math.atan2(event.clientY - eyeCY, event.clientX - eyeCX);
        const dist = Math.min(
          8,
          Math.hypot(event.clientX - eyeCX, event.clientY - eyeCY) / 32,
        );

        eye.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
      });

      if (currentZone === "left" && canSquintInZone.left) {
        triggerSquint(right, "left");
      } else if (currentZone === "right" && canSquintInZone.right) {
        triggerSquint(left, "right");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    let blinkTimer: ReturnType<typeof setTimeout>;

    const randomBlink = () => {
      left.classList.add("ai-eye-blink");
      right.classList.add("ai-eye-blink");

      blinkTimer = setTimeout(() => {
        left.classList.remove("ai-eye-blink");
        right.classList.remove("ai-eye-blink");
        blinkTimer = setTimeout(randomBlink, Math.random() * 5000 + 2000);
      }, 110);
    };

    randomBlink();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(blinkTimer);

      if (squintTimers.left) {
        clearTimeout(squintTimers.left);
      }

      if (squintTimers.right) {
        clearTimeout(squintTimers.right);
      }
    };
  }, [disabled]);

  return (
    <span
      className={cn("ai-eyes-wrapper", disabled ? "is-disabled" : "", className)}
      aria-hidden="true"
    >
      <span className="ai-eye-container">
        <span ref={leftRef} className="ai-eye" />
      </span>
      <span className="ai-eye-container">
        <span ref={rightRef} className="ai-eye" />
      </span>
    </span>
  );
}
