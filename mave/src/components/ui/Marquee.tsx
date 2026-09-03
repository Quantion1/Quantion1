import { cn } from "@/lib/utils";
export function Marquee({ items, className, separator = "◦" }: { items: string[]; className?: string; separator?: string }) {
  const row = [...items, ...items];
  return (
    <div className={cn("marquee relative overflow-hidden", className)} aria-hidden>
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 text-sm tracking-wide">
            <span>{t}</span>
            <span className="text-clay">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
