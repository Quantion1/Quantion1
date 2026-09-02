# 🌱 Bloom — pregnancy & newborn tracker

A cross-platform (iOS + Android + web) prototype for tracking and analysing everything
around pregnancy and the first year, built with the retention mechanics of Duolingo:
streaks, XP, daily goals, quests, badges, a mascot, and a chunky, tappable design system.

Built with **React Native + Expo (SDK 57) + TypeScript**. One codebase, both stores from
day one.

---

## 1. Product decisions

| Decision | Choice |
| --- | --- |
| Stack | React Native + Expo, TypeScript, Expo Router |
| Scope | Full arc: pregnancy → birth → 12 months, in one app that switches mode at birth |
| Data | Offline-first, on-device only (Zustand + AsyncStorage). No accounts, no server |
| Gamification | Streaks + daily goal + freezes, XP/levels + daily quests, badges & milestone trophies (no leagues) |
| Brand | Mascot-led, bright and playful — "Pip", a sprouting seed |
| Locale | Metric + English, with a working metric/imperial switch |
| Analytics focus | Sleep patterns, feeding volume & rhythm, pregnancy trends |
| Monetisation | Generous free tier; premium = depth, analytics and history |

Growth-percentile curves were not in the priority list, so growth is fully **logged** but the
WHO comparison chart sits behind the paywall as a teaser rather than a headline feature.

---

## 2. Running it

```bash
cd bloom
npm install
npm start          # then scan the QR with Expo Go, or press i / a / w
```

`npm run ios`, `npm run android`, `npm run web` open a platform directly.
`npm run typecheck` runs `tsc --noEmit` (currently clean).

No API keys, no backend, no accounts — it runs offline the moment it installs.

**Fastest way to see it:** in onboarding, tap **Explore with demo data**. That seeds 60 days
of realistic, deterministic history (≈700 entries) so every chart, streak and badge has
something real to show. You can reload or switch the demo mode any time from **Me → Your data**.

---

## 3. The five screens

| Tab | What it does |
| --- | --- |
| **Today** | Mascot + stage hero ("Week 24 · size of a corn cob"), daily-goal ring, 7-day streak strip, level bar, quick-log grid, three daily quests, today's numbers, recent activity |
| **Track** | Every log type as a big card with "last logged" state; the pregnancy→newborn switch lives here too |
| **Insights** | The analysis surface: plain-language read-outs plus charts, with premium gates on the deeper ones |
| **Journey** | Duolingo-style vertical path — weeks 4→40 or months 0→12 — with checkpoint chests and a badge shelf |
| **Me** | Level & stats, subscription, units/goal/clock preferences, dates, mode switch, demo data, reset |

Modal routes: `log/[type]` (one screen per log type), `stage/[index]` (week/month detail),
`paywall`, `streak`, `history`.

---

## 4. What you can track

**Pregnancy** — symptoms & mood check-in, maternal weight, kick counter (tap-to-10 with a
live timer), contraction timer (with a 5-1-1 pattern read-out), appointments.

**Newborn → 12 months** — feeds (left/right breast with a live timer, bottle in ml/oz,
solids), sleep (nap/night, duration, wakings), diapers, growth (weight/length/head),
daily mood & health tags, milestones, appointments.

Every entry can carry a note and be back-dated (Now / 15m / 30m / 1h / 2h ago).

---

## 5. Analysis

Read-outs are generated from the parent's own data in `src/analytics/index.ts` and rendered
with hand-built SVG charts in `src/charts/index.tsx` (no chart library — full control over
the visual language, small bundle).

**Newborn**
- Sleep per day, night stacked with naps
- 24-hour sleep raster — one row per day, showing exactly where sleep landed *(premium)*
- Longest-stretch trend line *(premium)*
- Feeds per day; bottle volume per day *(premium)*
- Left/right balance, day-vs-night split donut, gap-between-feeds histogram *(premium)*
- Weight against a WHO reference band *(premium)*

**Pregnancy**
- Weight gain against the IOM guideline band for a normal starting BMI
- Kick sessions — minutes to reach 10 movements, with slow sessions highlighted
- Symptom heatmap by gestational week *(premium)*
- Mood against symptom severity *(premium)*

Every insight is descriptive — it reports what was logged and how it compares to published
typical ranges. The app states plainly that it is not medical advice.

---

## 6. Gamification

**XP** is earned per entry: diaper 3, feed 5, sleep 6, mood 8, contraction 8, symptom 10,
weight 10, appointment 10, kicks 12, growth 15, milestone 25. Quests pay 15–30 XP plus gems.

**Levels** use a widening curve (`levelForXp`): 100 XP for level 2, then `60 + 40n`. Titles
run Seedling → Sprout → Bud → Bloom → … → Legend Parent.

**Daily goal** — Casual 20 / Regular 30 / Serious 50 / Intense 80 XP. Hitting it keeps the
streak; the Today ring and the 7-day flame strip make the state obvious at a glance.

**Streaks** advance once per day. Miss a day and an equipped ❄️ freeze is spent
automatically (`bumpStreak` in `src/state/store.ts`) — the day shows as frozen rather than
broken. Freezes cost 60 gems; premium keeps you stocked.

**Quests** — three per day, chosen deterministically from the day key so they are stable
until midnight and never reshuffle mid-session. Pool is mode-aware
(`src/domain/quests.ts`).

**Badges** — 18 definitions, each a predicate over your history with live progress
(`src/domain/badges.ts`). They award automatically via `useBadgeSync`.

Why no leagues: ranking parents against each other on baby data is the one Duolingo
mechanic that reads as hostile in this context. Everything else transfers cleanly.

---

## 7. Freemium model

Core logging is free forever — you should never lose access to your own records. Premium
sells **depth**, not the ability to record.

| | Free | Premium |
| --- | --- | --- |
| All logging, streaks, XP, quests, badges | ✓ | ✓ |
| Journey content | Current stage | All 40 weeks + 12 months |
| History | Last 7 days | Unlimited |
| Analytics range | 7 days | 30 / 90 days |
| Read-outs | First 2 | All |
| Sleep raster, stretch trends | — | ✓ |
| Feeding balance & interval analysis | — | ✓ |
| Growth vs WHO curves | — | ✓ |
| PDF / CSV export | — | ✓ |
| Multi-caregiver sharing | — | ✓ |
| Streak freezes | 1 / month | Unlimited |

Plans: €7.99/mo · €49.99/yr (7-day trial, "SAVE 48%", pre-selected) · €99 lifetime.

Gating is implemented, not mocked: `<PremiumGate>` renders the *real* chart underneath a
dimmed scrim so the value is visible but unreadable, which converts far better than an
empty lock box. Tapping **Unlock** in the prototype flips the flag locally — no payment is
taken. Production wires the same flag to App Store / Play Billing via RevenueCat.

---

## 8. Architecture

```
bloom/
├── app/                      # Expo Router file-based routes
│   ├── _layout.tsx           # providers, store hydration gate, XP toast
│   ├── onboarding.tsx        # 4-step setup, incl. demo-data entry point
│   ├── (tabs)/               # today · track · insights · journey · me
│   ├── log/[type].tsx        # one form per log type + kick & contraction timers
│   ├── stage/[index].tsx     # week / month detail
│   ├── paywall.tsx  streak.tsx  history.tsx
├── src/
│   ├── theme/                # palette, radii, slab shadows, type scale
│   ├── components/           # Button3D, Card, Chip, Stepper, Mascot, rings, gates…
│   ├── charts/               # BarChart, LineChart, SleepRaster, Donut, Heatmap
│   ├── domain/               # types, pregnancy weeks, baby months, quests, badges, levels
│   ├── analytics/            # pure selectors over entries → chart data + read-outs
│   ├── state/                # Zustand store, persistence, hooks, demo generator
│   └── lib/                  # date and unit helpers
```

The store is the only stateful layer; analytics are pure functions of `entries`, which is
what makes the demo generator and the charts trivially testable. Swapping AsyncStorage for
a synced backend later means replacing one `persist` adapter and adding a sync queue —
nothing in the UI needs to know.

### Design system

Duolingo's signature control is a flat slab with a darker bottom edge that collapses on
press — that is `Button3D`, animated with the native driver. Around it: 22–30px radii,
900-weight numerals, saturated accents on soft tinted backgrounds, and one accent colour
per domain (feeds = sky, sleep = grape, diapers = mint, growth = coral, pregnancy =
blossom, premium = grape→blossom gradient). Pip is hand-drawn SVG with six moods
(happy, cheer, sleepy, wave, sad, proud) and a gentle idle bob.

---

## 9. Prototype boundaries

Deliberately not built yet, in rough priority order:

1. **Payments** — RevenueCat + App Store / Play Billing behind the existing `sub` flag.
2. **Backend & sync** — accounts, multi-caregiver sharing, cross-device backup.
3. **Notifications** — `expo-notifications` for the streak-at-risk nudge and feed reminders.
4. **PDF/CSV export** — the buttons are in place; wiring is `expo-print` + `expo-sharing`.
5. **Real WHO/CDC tables** — the current growth band is a simplified ±12% around the WHO
   median. Production needs the full LMS tables for true percentiles.
6. **Date pickers** — dates are typed as `YYYY-MM-DD` or set with a chunky week scale;
   `@react-native-community/datetimepicker` is the drop-in.
7. **i18n** — copy is inline English. Dutch was the obvious second locale.
8. **Widgets & watch** — a lock-screen "last feed / next nap" widget is the highest-value
   retention surface after notifications.

---

## 10. Safety note

Bloom is a tracking and reflection tool. It does not diagnose, and every "typical range"
shown is a published population reference, not a target. The app says so on the profile
screen and next to the insights.
