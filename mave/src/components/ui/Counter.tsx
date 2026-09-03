"use client";
import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

export function Counter({ to, suffix = "", prefix = "", decimals = 0, className }: { to: number; suffix?: string; prefix?: string; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, prefix, decimals]);
  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
