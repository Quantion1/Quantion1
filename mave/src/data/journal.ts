export interface Article {
  slug: string;
  title: string;
  dek: string;
  category: string;
  readTime: string;
  date: string;
  tone: "cream" | "sand" | "mist" | "clay";
  body: string[];
}

export const articles: Article[] = [
  {
    slug: "flange-sizing-guide",
    title: "Why pumping hurts, and the 2 mm fix",
    dek: "Most pumps ship with a 24 mm flange. Most mothers need something else. Here is how to measure.",
    category: "Guide",
    readTime: "5 min",
    date: "2026-08-12",
    tone: "mist",
    body: [
      "If pumping hurts, the first thing to check is not your suction level. It is the diameter of the tunnel your nipple moves through. Too large, and areola tissue is pulled in, causing friction and reducing output. Too small, and the nipple rubs the wall.",
      "Measure the diameter of your nipple at the base, before pumping, in millimetres. Add 2–3 mm. That is your starting flange size. Many mothers land between 17 and 21 mm, well below the 24 mm default.",
      "The right fit looks like this: the nipple moves freely, a little areola may enter the tunnel but does not get pulled in, and there is no blanching or pain. Output often increases within a few sessions.",
      "Sizes can differ between sides and can change in the first weeks. Re-measure at six weeks. Our Fit Kit ships free with every Mave pump for exactly this reason.",
    ],
  },
  {
    slug: "returning-to-work-pumping",
    title: "Returning to work while breastfeeding: a realistic plan",
    dek: "How much milk to store, how to keep it cold, and how to talk to your employer.",
    category: "Back to work",
    readTime: "8 min",
    date: "2026-07-03",
    tone: "sand",
    body: [
      "Start building a stash about two weeks before you return, not two months. One extra pumping session a day, or a let-down collector during morning feeds, yields more than most people expect. You need roughly one day's worth of milk in reserve, not a freezer full.",
      "At work, plan to pump about as often as your baby would feed. A wearable pump means a meeting need not be missed, but you still need a moment to set up and a safe place for milk. A 48-hour cooler removes the awkwardness of the shared fridge.",
      "In the Netherlands you are legally entitled to pump or feed for up to a quarter of your working hours until your baby is nine months old, in a suitable, lockable space. Ask before your first day back; put it in an email.",
      "Finally, drop the guilt. Supply dips in the first weeks back are normal and usually recover. Skin contact in the evening and one night feed do more for supply than any gadget.",
    ],
  },
  {
    slug: "how-to-warm-breastmilk",
    title: "The 40-degree rule: how to warm milk without destroying it",
    dek: "Heat kills antibodies. Here is what a warmer should never do, and how to check yours.",
    category: "Science",
    readTime: "4 min",
    date: "2026-06-18",
    tone: "cream",
    body: [
      "Breastmilk is a living fluid. Immunoglobulins, lactoferrin and lipase begin degrading above about 40°C, and much of the immune activity is lost by 60°C. A microwave or a hot waterbath does exactly this, unevenly.",
      "Body temperature is the target, not warm to the touch. A good warmer circulates water at a controlled 37–40°C and stops. It should take a few minutes from the fridge, longer from frozen, and it should never feel hot.",
      "Swirl, do not shake. Fat separates in stored milk and gentle swirling brings it back. Shaking is not dangerous, but it is unnecessary.",
      "Thawed milk should be used within 24 hours and never refrozen. Label everything with the date and side, and use oldest first.",
    ],
  },
  {
    slug: "engorgement-relief",
    title: "Engorgement, clogged ducts and the cold-then-warm method",
    dek: "What actually helps in days three to five, according to lactation consultants.",
    category: "Care",
    readTime: "6 min",
    date: "2026-05-30",
    tone: "clay",
    body: [
      "Around day three, milk comes in and the breasts can become hard, hot and painful. This is engorgement and it passes, but the days in between are hard.",
      "Cold between feeds reduces swelling and pain. Warmth just before a feed or pump helps let-down. Flexible gel pads that can do both, and that fit inside a bra, are the practical answer.",
      "For a clogged duct, feed or pump often, start on the affected side, and use gentle vibration or warmth beforehand. Deep massage is no longer recommended; it can worsen inflammation.",
      "If you develop a fever, red streaks or flu-like symptoms, contact your midwife or GP. Mastitis is common, treatable and not your fault.",
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
