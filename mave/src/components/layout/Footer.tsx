import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { collections } from "@/data/products";
import { Newsletter } from "./Newsletter";

const cols = [
  { title: "Shop", links: [...collections.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })), { label: "Bundles", href: "/shop?bundles=1" }] },
  { title: "Support", links: [{ label: "Flange sizing guide", href: "/journal/flange-sizing-guide" }, { label: "Shipping & returns", href: "/about#returns" }, { label: "Warranty", href: "/about#warranty" }, { label: "Insurance reimbursement", href: "/about#reimbursement" }, { label: "Contact", href: "/about#contact" }] },
  { title: "Mave", links: [{ label: "Our story", href: "/about" }, { label: "The System", href: "/system" }, { label: "Journal", href: "/journal" }, { label: "Sustainability", href: "/about#sustainability" }] },
];

export function Footer() {
  return (
    <footer className="relative mt-24 bg-ink text-porcelain">
      <Container className="grid gap-14 py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Logo light className="text-4xl" />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-porcelain/60">
            Quiet, beautiful tools for the beauty and the burden of breastmilk. Designed in Amsterdam with 400 mothers, two midwives and one very patient acoustics engineer.
          </p>
          <Newsletter />
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="eyebrow mb-5 text-porcelain/45">{c.title}</p>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="link-underline text-sm text-porcelain/80 hover:text-porcelain">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <div className="border-t border-porcelain/10">
        <Container className="flex flex-col gap-4 py-6 text-xs text-porcelain/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Mave B.V. · Amsterdam · KvK 00000000</p>
          <div className="flex flex-wrap gap-5">
            <span>iDEAL · Visa · Mastercard · Apple Pay · Klarna</span>
            <Link href="#" className="hover:text-porcelain">Privacy</Link>
            <Link href="#" className="hover:text-porcelain">Terms</Link>
          </div>
        </Container>
      </div>
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="font-display -mb-[0.22em] text-center text-[22vw] leading-none text-porcelain/[0.04]">mave</p>
      </div>
    </footer>
  );
}
