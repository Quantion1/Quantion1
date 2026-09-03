import Link from "next/link";
import { cn } from "@/lib/utils";
export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" aria-label="Mave home" className={cn("font-display text-[1.65rem] font-medium leading-none tracking-[-0.03em]", light ? "text-porcelain" : "text-ink", className)}>
      mave<span className="text-clay">.</span>
    </Link>
  );
}
