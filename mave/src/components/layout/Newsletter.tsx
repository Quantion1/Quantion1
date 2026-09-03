"use client";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function Newsletter({ light = true }: { light?: boolean }) {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <form
      className="mt-8 max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (email) setDone(true);
      }}
    >
      <label className={`eyebrow block ${light ? "text-porcelain/45" : "text-ink/50"}`}>The Mave letter</label>
      <div className={`mt-3 flex items-center border-b pb-2 ${light ? "border-porcelain/25" : "border-ink/25"}`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          disabled={done}
          className={`flex-1 bg-transparent text-sm outline-none ${light ? "placeholder:text-porcelain/35" : "placeholder:text-ink/35"}`}
        />
        <button aria-label="Subscribe" className={`grid size-8 place-items-center rounded-full transition ${light ? "hover:bg-porcelain/10" : "hover:bg-ink/5"}`}>
          {done ? <Check className="size-4 text-sage" /> : <ArrowRight className="size-4" />}
        </button>
      </div>
      <p className={`mt-2 text-xs ${light ? "text-porcelain/40" : "text-ink/45"}`}>
        {done ? "Welcome. Your first letter arrives Sunday." : "One letter a month. Evidence-based, no fluff, 10% off your first order."}
      </p>
    </form>
  );
}
