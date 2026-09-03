import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/Toaster";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mave — Premium care for breastfeeding mothers",
    template: "%s — Mave",
  },
  description:
    "Mave designs quiet, beautiful tools for expressing, storing, cooling and warming breastmilk. Hospital-grade performance, made for real life.",
  keywords: ["breast pump", "wearable breast pump", "milk warmer", "milk cooler", "breastmilk storage", "maternity", "Mave"],
  openGraph: {
    title: "Mave — Premium care for breastfeeding mothers",
    description: "Quiet, beautiful tools for the beauty and the burden of breastmilk.",
    type: "website",
    locale: "en_NL",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <ScrollProgress />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}
