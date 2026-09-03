# Mave — premium maternity ecommerce

A storefront for **Mave**, a premium brand of breastfeeding tools: wearable and hospital-strength pumps, waterbath milk warmers, 48-hour coolers, storage, breast care and pumping wear.

Built with Next.js 16 (App Router), Tailwind CSS v4, Motion (Framer) and Zustand. All 42 routes are statically generated.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## What is in the box

| Area | Route(s) | Notes |
|---|---|---|
| Home | `/` | Cinematic hero with parallax, trust marquee, shop-by-moment grid, scroll-driven Aura story, bestseller carousel, the Mave System, counters, kits, testimonials, journal, closing CTA |
| Shop | `/shop`, `/collections/[slug]` | Client-side filters (collection, life stage, price), sort, animated grid, mobile filter sheet, URL-synced stage filter |
| Product | `/products/[slug]` | Colour and flange-size pickers, animated gallery, sticky add-to-bag bar, specs / in-the-box / warranty / reimbursement accordions, reviews, related products |
| Bag & checkout | `/cart`, `/checkout` | Slide-in cart drawer with free-shipping progress and cross-sell, three-step checkout with floating-label fields and order confirmation |
| Brand | `/about`, `/system`, `/journal`, `/journal/[slug]` | Story, design principles and promises; compatibility table; evidence-based guides |

Search overlay, mega menu, wishlist, toasts and cart are persisted client-side (localStorage). No backend is wired yet: checkout is a UI flow.

## Structure

```
src/
  app/            routes (App Router)
  components/
    home/         homepage sections
    layout/       header, mega menu, search, footer
    cart/         cart drawer
    product/      ProductVisual (SVG renders), card, detail, add-to-cart, reviews
    shop/         filterable catalogue
    ui/           buttons, reveal animations, marquee, accordion, counter…
  data/           products, collections, life stages, bundles, journal
  store/          zustand cart / wishlist / toast stores
  lib/            formatting & class helpers
docs/market-research.md   research behind the catalogue
```

## Design system

- Palette: porcelain `#f7f3ee`, ink `#15130f`, clay accent `#b2634b`, sage `#8a9a86`, sand and mist tints.
- Type: Fraunces (display, optical sizing) + Manrope (body), loaded with `next/font`.
- Motion: expo easing, reveal-on-scroll, scroll-linked storytelling, magnetic buttons, layout animations. Respects `prefers-reduced-motion`.
- Product imagery is drawn as SVG "studio renders" (`ProductVisual`) so the catalogue stays consistent until photography exists.
