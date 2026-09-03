"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "clay";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] disabled:opacity-40 disabled:pointer-events-none select-none whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary: "bg-ink text-porcelain hover:bg-ink-soft hover:shadow-lift active:scale-[0.98]",
  secondary: "bg-transparent text-ink ring-1 ring-ink/20 hover:ring-ink hover:bg-ink hover:text-porcelain active:scale-[0.98]",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
  inverse: "bg-porcelain text-ink hover:bg-milk hover:shadow-lift active:scale-[0.98]",
  clay: "bg-clay text-milk hover:bg-clay-deep hover:shadow-lift active:scale-[0.98]",
};
const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-[13px]",
  md: "h-12 px-7 text-sm",
  lg: "h-14 px-9 text-[15px]",
};

type Props = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentProps<"button">, "children">;

export function Button({ variant = "primary", size = "md", arrow, href, className, children, ...rest }: Props) {
  const cls = cn(base, variants[variant], sizes[size], className);
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          className="size-4 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-1"
          strokeWidth={1.75}
        />
      )}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}
