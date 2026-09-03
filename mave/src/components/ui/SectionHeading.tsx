import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  className,
  light,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal>
          <p className={cn("eyebrow mb-4", light ? "text-porcelain/60" : "text-clay")}>{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className={cn("font-display text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-[3.5rem]", light ? "text-porcelain" : "text-ink")}>
          {title}
        </h2>
      </Reveal>
      {body && (
        <Reveal delay={0.12}>
          <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", light ? "text-porcelain/70" : "text-ink/65")}>{body}</p>
        </Reveal>
      )}
    </div>
  );
}
