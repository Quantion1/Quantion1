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

## Inspecting the HTML

Two ways to look at the markup without running the dev server:

```bash
npm run export     # real Next.js static export -> ./out (41 routes, needs a web server)
npm run snapshot   # fully rendered, self-contained pages -> ./snapshots
```

`out/` is the source-of-truth build output: the same HTML the server sends, with
`_next/` CSS and JS chunks alongside it. Serve it with any static server
(`npx serve out`).

`snapshots/` is for reading and sharing. Each page is rendered in a real browser,
scrolled so the reveal animations have settled, then written out with its
stylesheet and fonts inlined and its scripts removed. The files open straight
from disk with no network access, and links between the captured pages work.
Start at `snapshots/index.html`. Because the scripts are stripped, the snapshots
are static: hover styles work, the cart drawer and filters do not.

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
  scripts/        snapshot.mjs - renders the export into standalone HTML
docs/market-research.md   research behind the catalogue
```

## Design system

- Palette: porcelain `#f7f3ee`, ink `#15130f`, clay accent `#b2634b`, sage `#8a9a86`, sand and mist tints.
- Type: Fraunces (display, optical sizing) + Manrope (body), loaded with `next/font`.
- Motion: expo easing, reveal-on-scroll, scroll-linked storytelling, magnetic buttons, layout animations. Respects `prefers-reduced-motion`.
- Product imagery is drawn as SVG "studio renders" (`ProductVisual`) so the catalogue stays consistent until photography exists.
