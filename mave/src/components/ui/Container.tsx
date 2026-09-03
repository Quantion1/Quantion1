import { cn } from "@/lib/utils";
export function Container({ className, children, wide }: { className?: string; children: React.ReactNode; wide?: boolean }) {
  return <div className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", wide ? "max-w-[1600px]" : "max-w-[1320px]", className)}>{children}</div>;
}
