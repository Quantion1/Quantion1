import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
export function Rating({ value, count, className, size = "sm" }: { value: number; count?: number; className?: string; size?: "sm" | "md" }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-label={`${value} out of 5 stars`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(size === "sm" ? "size-3" : "size-3.5", i < Math.round(value) ? "fill-ink text-ink" : "fill-ink/15 text-ink/15")}
            strokeWidth={0}
          />
        ))}
      </div>
      <span className={cn("tabular-nums text-ink/70", size === "sm" ? "text-xs" : "text-sm")}>
        {value.toFixed(1)}
        {count !== undefined && <span className="text-ink/45"> ({count.toLocaleString("en")})</span>}
      </span>
    </div>
  );
}
