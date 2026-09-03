# 🥚 Nest — pregnancy and newborn tracker

A cross-platform (iOS + Android + web) prototype for tracking pregnancy and the first year,
built around a companion called **Dot** who starts as an egg and grows only when something
real happens to your baby.

React Native + Expo SDK 57 + TypeScript. One codebase, both stores.

> This replaces the earlier *Bloom* prototype in this same folder. Bloom's analytics engine
> and chart primitives survive; its Duolingo-derived design system, XP economy, streaks and
> mascot do not.

---

## 1. Where it came from

Nest is a deliberate merge of two prototypes.

**From the v3 baby-tracker prototype** — the ideas worth keeping:
- A **customisable tile home screen**: drag, resize, remove, add from a library.
- A library that sorts by relevance — *suggested now / not yet / retired* — so the home
  screen shrinks as well as grows. Teeth appear at three months; vitamin K retires at three
  months. Neither needs a decision from the parent.
- **Levels you claim** by confirming a real event, not by grinding XP.
- A weekly **collectible card**, a **Plan** calendar, a country-specific **care pathway**,
  **Memories + Firsts**, and a **daily review** computed only from real logs.
- A whole **maternal side** — nobody else tracks the parent.
- Dry, adult copy. It is the single thing that separates this from every other baby app.

**From the earlier Bloom build** — the analysis:
- Sleep raster, longest-stretch trend, feeding balance, interval histogram, weight against
  the guideline band, and the hand-built SVG chart primitives that draw them.

**New here** — Dot, the parchment design system, the logging-based badges, and the merge
of claimed levels with a real analytics engine.

---

## 2. Decisions

| | |
| --- | --- |
| Stack | React Native + Expo, TypeScript, Expo Router |
| Data | Offline-first, on-device only (Zustand + AsyncStorage) |
| Mascot | Dot, hand-drawn SVG, nine poses: four egg states then five growth stages |
| Palette | Warm parchment and earth; Dot's marigold is the only saturated colour |
| Type | Fraunces for display, Nunito Sans for body and data |
| Core loop | Claimed milestones — the app asks, you confirm |
| Streaks | None. A seven-day rhythm strip with no loss state |
| Collectibles | Weekly size cards (fruit free, object packs premium) + logging badges |
| Voice | Dry and witty |
| Navigation | Home · Journey · Insights · Plan · Photos |
| Care pathway | Netherlands first, with a working country switcher |

---

## 3. Running it

```bash
cd bloom
npm install
npm start          # scan the QR with Expo Go, or press i / a / w
```

`npm run typecheck` runs `tsc --noEmit` (clean). No keys, no backend, no accounts.

In onboarding, **Fill it with sixty days of demo data** seeds a deterministic history so
every chart and card has something real in it. Reload or switch mode any time from
**Settings → Your data**.

---

## 4. Dot

Dot is the progress bar, and she is the only one.

During pregnancy she is an egg that cracks once per trimester — `egg0` through `egg3`.
Cracking the egg is the one irreversible action in the app, so it asks properly. After she
hatches, her pose follows the claimed baby level: asleep in the blanket → up on her elbows →
sitting up and waving → standing → walking. The three poses you supplied became the first
three; standing and walking extend the ladder.

She is drawn as vector, not bitmap: one shared head and body with pose-specific wings, feet
and props, so a new stage is a few paths rather than a new asset. She idles with a slow bob
and settles more slowly when asleep.

---

## 5. The core loop

**Levels are claimed, never earned.** The app watches for the moment something plausibly
happened — day 90 arrives, or a sleep entry crosses six hours — and asks one plain question:

> **Back to birth weight** · Back to birth weight at the last weigh-in?
> *Not yet* / *Yes — level up*

"Not yet" hides it until tomorrow and costs nothing. Only one question is ever live, and the
ladder is walked in order, so the app never nags on six fronts at once. Nothing you log can
advance a level by itself, which means the progression cannot be gamed and does not reward
logging noise.

Ten pregnancy levels, topping out at week 37 so an early arrival can still max the track.
Fourteen baby levels to first steps.

**Badges are the opposite** — they are about you, not the baby. Opening the app on thirty
different days, logging at 3am, a hundred nappies, five hundred hours of sleep tracked,
covering one whole day across all four quarters. Twenty-seven of them, in four groups, no
rarity and nothing purchasable.

**Rhythm, not streaks.** Seven dots, filled or not. It never breaks, there is no freeze to
buy and nothing to lose. A hospital stay or a rough week should not cost you anything in a
baby app.

---

## 6. Tracking

Twenty-nine trackers across four groups, each declaring its own sheet:

- **Baby** — sleep, breastfeed, bottle, diaper, weight, tummy time, temperature, vitamin D,
  vitamin K, solids, new food, teeth, words, vaccinations, baby's medicine.
- **You** — pumping, my sleep, water, supplements, my medication.
- **Pregnancy** — kick counter, contractions, bump photo, midwife questions.
- **Birth** — labour timeline, birth record.
- **Keepsake** — memories, note.

One `Entry` shape covers all of them; what a sheet shows is declared as data
(`src/domain/trackers.ts`), so a new tracker is a registry entry, not a new form. Sixteen
block types are implemented: timer, time pair, number, pick, chips, faces, text, checks,
counter, confirm, sides, drinks, teeth, events, text list and photo.

Tummy time is one tap that counts. Water logs by vessel. Diapers log instantly from the
pick. Sleep, feeds and contractions offer *time it* or *type it*.

---

## 7. Analysis

Read-outs and charts are pure functions of the entry log (`src/analytics/`), and a fresh
install shows empty states rather than sample data.

**Newborn** — sleep per day (night stacked with naps), the 24-hour raster, longest-stretch
trend, feeds per day, left/right balance, day-versus-night split, gap-between-feeds
histogram, weight against the WHO band.

**Pregnancy** — weight gain against the IOM guideline band, kick-session consistency
(minutes to reach ten), contraction length and interval with the 5-1-1 read-out, and your
own sleep.

**The daily review** adds the part charts cannot: a 24-hour rhythm strip with feed and change
marks, the numbers with typical ranges beside them, patterns it noticed against the previous
seven days, and what it would try tomorrow. A day still in progress withholds its
comparisons and says so — half a day measured against seven whole ones would only mislead.

---

## 8. Free and premium

Logging is free forever. Premium sells depth, never access to your own records.

| | Free | Premium |
| --- | --- | --- |
| Every tracker, unlimited logs | ✓ | ✓ |
| Levels, badges, Dot | All | All |
| Weekly cards | The Veg Aisle | Every pack |
| Insights range | 7 days | 30 · 90 days |
| Read-outs | First two | All |
| Sleep raster, stretch trend | — | ✓ |
| Feeding balance and intervals | — | ✓ |
| Weight against the WHO band | — | ✓ |
| Daily review | ✓ | ✓ |
| Photos | 12 | Unlimited |
| PDF and CSV export | — | ✓ |
| A second carer on the same baby | — | ✓ |

€6.99/mo · €44.99/yr (14 days free) · €89 once. Gating is real: `<PremiumGate>` renders the
actual chart underneath a dimmed scrim, so the value is visible but unreadable.

---

## 9. Architecture

```
bloom/
├── app/                    # Expo Router
│   ├── _layout.tsx         # fonts, hydration gate, toast
│   ├── onboarding.tsx
│   ├── (tabs)/             # home · journey · insights · plan · photos
│   ├── log/[key].tsx       # the data-driven sheet, 16 block types
│   ├── library.tsx         # tile library, sorted by relevance
│   ├── review.tsx  hatch.tsx  paywall.tsx  settings.tsx  history.tsx
├── src/
│   ├── theme/              # parchment tokens, type scale
│   ├── components/         # Dot, Tile, LevelPrompt, CardFace, Rhythm, ui
│   ├── charts/             # BarChart, LineChart, SleepRaster, DayRhythm, Donut
│   ├── domain/             # trackers, levels, badges, cards, care, describe
│   ├── analytics/          # selectors + the daily review
│   ├── state/              # store, hooks, demo generator
│   └── lib/                # dates, units
```

The store is the only stateful layer. Analytics are pure over `entries`, which is what makes
the demo generator and the charts trivially testable, and what would make a synced backend a
persistence swap rather than a rewrite.

---

## 10. Not built yet

1. **Payments** — RevenueCat behind the existing `sub` flag.
2. **Camera and real photos** — memories use emoji stand-ins; storage is scoped but unwired.
3. **Backend and sync** — accounts, the second carer, cross-device backup.
4. **Notifications** — the gentle kind. Never a red badge.
5. **PDF/CSV export** — buttons exist; `expo-print` + `expo-sharing` is the wiring.
6. **Real WHO LMS tables** — the current band is ±12% around the WHO median, not true
   percentiles. This needs the full tables before anyone reads it clinically.
7. **Night mode** — the tokens are centralised for it; a 3am palette is the obvious next win.
8. **Date pickers** — dates are typed as `YYYY-MM-DD` or set on a chunky week scale.
9. **Dutch copy** — everything is inline English right now.
10. **Care pathways beyond NL** — BE, UK, DE and US are carried over and need a local check.

---

## 11. Safety

Nest keeps records and shows you patterns in them. It does not diagnose, and every "typical
range" it shows is a published population figure, not a target. Anything that worries you
goes to your midwife, doctor or consultatiebureau.
