"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, Lock, ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cartTotals, useCart } from "@/store/cart";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { cn, toneClasses } from "@/lib/utils";

const steps = ["Contact", "Delivery", "Payment"];
const payments = ["iDEAL", "Apple Pay", "Credit card", "Klarna"];

function Field({ label, type = "text", className, required = true, autoComplete }: { label: string; type?: string; className?: string; required?: boolean; autoComplete?: string }) {
  return (
    <label className={cn("group relative block", className)}>
      <input type={type} required={required} autoComplete={autoComplete} placeholder=" " className="peer h-14 w-full rounded-2xl border border-ink/15 bg-milk px-4 pt-4 text-[15px] outline-none transition focus:border-ink" />
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink/50 transition-all peer-focus:top-3.5 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[11px]">
        {label}
      </span>
    </label>
  );
}

export default function CheckoutPage() {
  const { lines, clear } = useCart();
  const t = cartTotals(lines);
  const [step, setStep] = useState(0);
  const [pay, setPay] = useState(payments[0]);
  const [done, setDone] = useState(false);
  const [order] = useState(() => `MV-${Math.floor(100000 + Math.random() * 900000)}`);

  if (done) {
    return (
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }} className="grid size-20 place-items-center rounded-full bg-sage text-milk">
          <Check className="size-9" strokeWidth={2} />
        </motion.div>
        <h1 className="font-display mt-8 text-5xl">Thank you.</h1>
        <p className="mt-4 max-w-md text-ink/65">Order {order} is confirmed. It ships from Amsterdam tonight, and a lactation consultant will email you a free fit check within 24 hours.</p>
        <Button href="/" className="mt-10" arrow>Back to Mave</Button>
      </Container>
    );
  }

  if (lines.length === 0) {
    return (
      <Container className="py-24 text-center">
        <p className="font-display text-3xl">Your bag is empty</p>
        <Button href="/shop" className="mt-6" arrow>Shop</Button>
      </Container>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Container className="max-w-3xl py-10 lg:pr-16">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-4xl">Checkout</h1>
            <span className="flex items-center gap-1.5 text-xs text-ink/50"><Lock className="size-3" /> Secure checkout</span>
          </div>
          <ol className="mt-8 flex items-center gap-3 text-sm">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <button onClick={() => i < step && setStep(i)} className={cn("flex items-center gap-2", i > step && "text-ink/40")}>
                  <span className={cn("grid size-6 place-items-center rounded-full text-[11px] font-semibold", i < step ? "bg-sage text-milk" : i === step ? "bg-ink text-porcelain" : "bg-ink/10")}>{i < step ? <Check className="size-3" /> : i + 1}</span>
                  {s}
                </button>
                {i < steps.length - 1 && <span className="h-px w-8 bg-ink/15" />}
              </li>
            ))}
          </ol>

          <form
            className="mt-10"
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 2) setStep(step + 1);
              else {
                setDone(true);
                clear();
              }
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                {step === 0 && (
                  <div className="space-y-4">
                    <h2 className="font-display text-3xl">Contact</h2>
                    <Field label="Email" type="email" autoComplete="email" />
                    <Field label="Phone (for delivery updates)" type="tel" required={false} autoComplete="tel" />
                    <label className="flex items-center gap-3 text-sm text-ink/70">
                      <input type="checkbox" className="size-4 accent-clay" defaultChecked /> Email me the Mave letter (one a month)
                    </label>
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="font-display text-3xl">Delivery</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="First name" autoComplete="given-name" />
                      <Field label="Last name" autoComplete="family-name" />
                    </div>
                    <Field label="Street and number" autoComplete="street-address" />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="Postcode" autoComplete="postal-code" />
                      <Field label="City" className="sm:col-span-2" autoComplete="address-level2" />
                    </div>
                    <Field label="Country" autoComplete="country-name" />
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {[
                        { name: "Standard", when: "Tomorrow, before 18:00", price: t.shipping },
                        { name: "Evening", when: "Tomorrow, 18:00–22:00", price: 2.95 },
                      ].map((o, i) => (
                        <label key={o.name} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-ink/15 p-4 has-[:checked]:border-ink">
                          <input type="radio" name="ship" defaultChecked={i === 0} className="accent-clay" />
                          <span className="flex-1">
                            <span className="block text-sm font-medium">{o.name}</span>
                            <span className="block text-xs text-ink/55">{o.when}</span>
                          </span>
                          <span className="text-sm tabular-nums">{o.price === 0 ? "Free" : formatPrice(o.price, { cents: true })}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <h2 className="font-display text-3xl">Payment</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {payments.map((p) => (
                        <button type="button" key={p} onClick={() => setPay(p)} className={cn("flex h-14 items-center justify-between rounded-2xl border px-4 text-sm font-medium transition", pay === p ? "border-ink bg-ink text-porcelain" : "border-ink/15 hover:border-ink")}>
                          {p}
                          {pay === p && <Check className="size-4" />}
                        </button>
                      ))}
                    </div>
                    {pay === "Credit card" && (
                      <div className="space-y-4 pt-2">
                        <Field label="Card number" autoComplete="cc-number" />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Expiry" autoComplete="cc-exp" />
                          <Field label="CVC" autoComplete="cc-csc" />
                        </div>
                      </div>
                    )}
                    <div className="rounded-2xl bg-cream p-4 text-sm text-ink/70">
                      <p className="font-medium text-ink">Insurance reimbursement</p>
                      <p className="mt-1">We will attach a pre-filled reimbursement form to your invoice. Most supplementary insurers pay €75–80 towards a pump.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="mt-10 flex items-center justify-between">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink"><ChevronLeft className="size-4" /> Back</button>
              ) : (
                <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink"><ChevronLeft className="size-4" /> Continue shopping</Link>
              )}
              <Button type="submit" size="lg" arrow>
                {step < 2 ? `Continue to ${steps[step + 1]}` : `Pay ${formatPrice(t.total, { cents: true })}`}
              </Button>
            </div>
          </form>
        </Container>
      </div>
      <aside className="bg-cream lg:col-span-5">
        <div className="sticky top-0 px-5 py-10 sm:px-8 lg:px-12">
          <p className="eyebrow text-ink/45">Order summary</p>
          <ul className="mt-6 space-y-4">
            {lines.map((l) => (
              <li key={l.id} className="flex items-center gap-4">
                <span className={cn("relative size-16 shrink-0 overflow-hidden rounded-xl", toneClasses[l.tone])}>
                  <ProductVisual kind={l.visual} />
                  <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-porcelain">{l.qty}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{l.name}</span>
                  <span className="block truncate text-xs text-ink/50">{[l.color, l.variant].filter(Boolean).join(" · ")}</span>
                </span>
                <span className="text-sm tabular-nums">{formatPrice(l.price * l.qty, { cents: true })}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-8 space-y-2 border-t border-ink/10 pt-6 text-sm">
            <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd className="tabular-nums">{formatPrice(t.subtotal, { cents: true })}</dd></div>
            <div className="flex justify-between"><dt className="text-ink/60">Shipping</dt><dd className="tabular-nums">{t.shipping === 0 ? "Free" : formatPrice(t.shipping, { cents: true })}</dd></div>
            <div className="flex justify-between border-t border-ink/10 pt-3 text-lg font-medium"><dt>Total</dt><dd className="tabular-nums">{formatPrice(t.total, { cents: true })}</dd></div>
          </dl>
          <p className="mt-6 text-xs text-ink/50">Includes 21% VAT. 100-night trial on pumps. 2-year warranty on everything.</p>
        </div>
      </aside>
    </div>
  );
}
