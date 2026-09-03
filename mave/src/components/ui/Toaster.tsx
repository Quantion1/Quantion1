"use client";
import { AnimatePresence, motion } from "motion/react";
import { useToast } from "@/store/cart";
import { Check } from "lucide-react";

export function Toaster() {
  const toasts = useToast((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 rounded-full bg-ink px-4 py-2.5 text-sm text-porcelain shadow-lift"
          >
            <span className="grid size-5 place-items-center rounded-full bg-sage/80">
              <Check className="size-3" strokeWidth={2.5} />
            </span>
            <span className="font-medium">{t.title}</span>
            {t.body && <span className="text-porcelain/60">{t.body}</span>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
