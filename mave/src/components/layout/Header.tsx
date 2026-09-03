"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, ShoppingBag, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";
import { collections, stages, products } from "@/data/products";
import { cartTotals, useCart } from "@/store/cart";
import { cn } from "@/lib/utils";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatPrice } from "@/lib/format";
import { SearchOverlay } from "./SearchOverlay";

const nav = [
  { label: "Shop", href: "/shop", mega: true },
  { label: "The System", href: "/system" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const lines = useCart((s) => s.lines);
  const setOpen = useCart((s) => s.setOpen);
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const count = hydrated ? cartTotals(lines).count : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const closeAll = () => {
    setMega(false);
    setMobile(false);
  };
  useEffect(() => {
    document.body.style.overflow = mobile || search ? "hidden" : "";
  }, [mobile, search]);

  const dark = pathname === "/" && !scrolled && !mega;

  return (
    <>
      <div className="relative z-[55] bg-ink text-center text-[12px] tracking-wide text-porcelain">
        <Container className="flex h-9 items-center justify-center gap-6">
          <span className="hidden sm:inline">Free shipping over €75</span>
          <span className="hidden size-1 rounded-full bg-clay sm:inline-block" />
          <span>Free flange sizing kit with every pump</span>
          <span className="hidden size-1 rounded-full bg-clay sm:inline-block" />
          <span className="hidden sm:inline">100-night trial on Aura</span>
        </Container>
      </div>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)]",
          mega ? "bg-porcelain shadow-[0_1px_0_rgba(21,19,15,0.08)]" : scrolled ? "bg-porcelain/85 shadow-[0_1px_0_rgba(21,19,15,0.08)] backdrop-blur-xl" : "bg-transparent",
        )}
        onMouseLeave={() => setMega(false)}
      >
        <Container className="flex h-[var(--header-h)] items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo light={dark} />
            <nav className="hidden items-center gap-8 lg:flex">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onMouseEnter={() => setMega(!!n.mega)}
                  className={cn(
                    "link-underline text-sm font-medium transition-colors",
                    dark ? "text-porcelain/85 hover:text-porcelain" : "text-ink/75 hover:text-ink",
                    pathname.startsWith(n.href) && (dark ? "text-porcelain" : "text-ink"),
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className={cn("flex items-center gap-1", dark ? "text-porcelain" : "text-ink")}>
            <button aria-label="Search" onClick={() => setSearch(true)} className="grid size-10 place-items-center rounded-full transition hover:bg-current/10">
              <Search className="size-[18px]" strokeWidth={1.75} />
            </button>
            <button aria-label="Open bag" onClick={() => setOpen(true)} className="relative grid size-10 place-items-center rounded-full transition hover:bg-current/10">
              <ShoppingBag className="size-[18px]" strokeWidth={1.75} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    className={cn("absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full text-[10px] font-bold", dark ? "bg-porcelain text-ink" : "bg-clay text-milk")}
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button aria-label="Menu" onClick={() => setMobile(true)} className="grid size-10 place-items-center rounded-full transition hover:bg-current/10 lg:hidden">
              <Menu className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </Container>

        {/* Mega menu */}
        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 top-full hidden border-t border-ink/8 bg-porcelain shadow-lift lg:block"
              onMouseEnter={() => setMega(true)}
              onClickCapture={closeAll}
            >
              <Container className="grid grid-cols-12 gap-10 py-10">
                <div className="col-span-3">
                  <p className="eyebrow mb-5 text-ink/50">Collections</p>
                  <ul className="space-y-3">
                    {collections.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/collections/${c.slug}`} className="group flex items-baseline justify-between text-[1.05rem] font-medium">
                          <span className="link-underline">{c.name}</span>
                          <span className="text-xs text-ink/40 opacity-0 transition group-hover:opacity-100">{products.filter((p) => p.collection === c.slug).length}</span>
                        </Link>
                      </li>
                    ))}
                    <li className="pt-2">
                      <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-clay">
                        Shop everything <ArrowUpRight className="size-3.5" />
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="col-span-3">
                  <p className="eyebrow mb-5 text-ink/50">Shop by moment</p>
                  <ul className="space-y-3">
                    {stages.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/shop?stage=${s.slug}`} className="block">
                          <span className="link-underline text-[1.05rem] font-medium">{s.name}</span>
                          <span className="mt-0.5 block text-xs text-ink/50">{s.blurb}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-6 grid grid-cols-2 gap-4">
                  {products
                    .filter((p) => ["aura-wearable-pump", "chill-milk-cooler"].includes(p.slug))
                    .map((p) => (
                      <Link key={p.slug} href={`/products/${p.slug}`} className="group relative overflow-hidden rounded-2xl bg-cream p-5">
                        <div className="absolute -right-6 -top-4 size-44 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-2 group-hover:rotate-2">
                          <ProductVisual kind={p.visual} color={p.colors?.[0]?.hex} />
                        </div>
                        <div className="relative flex h-40 flex-col justify-end">
                          <p className="eyebrow text-clay">{p.badge}</p>
                          <p className="font-display mt-1 text-2xl">{p.name}</p>
                          <p className="text-sm text-ink/60">{formatPrice(p.price)}</p>
                        </div>
                      </Link>
                    ))}
                </div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-porcelain lg:hidden"
            onClickCapture={(e) => {
              if ((e.target as HTMLElement).closest("a")) closeAll();
            }}
          >
            <Container className="flex h-[var(--header-h)] items-center justify-between">
              <Logo />
              <button aria-label="Close" onClick={() => setMobile(false)} className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </Container>
            <Container className="mt-6 flex flex-col gap-8 overflow-y-auto pb-20">
              <ul className="space-y-1">
                {[{ label: "Shop all", href: "/shop" }, ...nav.slice(1)].map((n, i) => (
                  <motion.li key={n.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                    <Link href={n.href} className="font-display block py-2 text-4xl">
                      {n.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div>
                <p className="eyebrow mb-4 text-ink/50">Collections</p>
                <ul className="grid grid-cols-2 gap-3">
                  {collections.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/collections/${c.slug}`} className="block rounded-xl bg-cream px-4 py-3 text-sm font-medium">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}
