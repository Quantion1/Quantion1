import { cn } from "@/lib/utils";
export function Badge({ children, className, tone = "ink" }: { children: React.ReactNode; className?: string; tone?: "ink" | "clay" | "sage" | "light" }) {
  const tones = {
    ink: "bg-ink text-porcelain",
    clay: "bg-clay text-milk",
    sage: "bg-sage text-milk",
    light: "bg-porcelain/80 text-ink backdrop-blur",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide", tones[tone], className)}>{children}</span>;
}
