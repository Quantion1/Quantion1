import { clsx, type ClassValue } from "clsx";
export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const toneClasses: Record<string, string> = {
  cream: "bg-cream",
  sand: "bg-sand",
  mist: "bg-mist",
  clay: "bg-[#e9cfc4]",
  ink: "bg-ink text-porcelain",
};
