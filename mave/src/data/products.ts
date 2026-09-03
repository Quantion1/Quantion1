export type VisualKind =
  | "wearable"
  | "pump"
  | "manual"
  | "collector"
  | "warmer"
  | "warmer-go"
  | "cooler"
  | "tote"
  | "bags"
  | "bottles"
  | "tray"
  | "pads"
  | "balm"
  | "cups"
  | "bra"
  | "kit"
  | "sterilizer";

export type Stage = "pregnancy" | "first-weeks" | "back-to-work" | "travel" | "night";

export interface Variant {
  label: string;
  options: string[];
  hint?: string;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  collection: CollectionSlug;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  badge?: "New" | "Bestseller" | "Award winner" | "Bundle" | "Limited";
  visual: VisualKind;
  tone: "cream" | "sand" | "mist" | "clay" | "ink";
  colors?: { name: string; hex: string }[];
  variants?: Variant[];
  features: { title: string; body: string }[];
  specs: Record<string, string>;
  inBox: string[];
  description: string;
  stages: Stage[];
  reimbursable?: boolean;
  stock: "in-stock" | "low" | "preorder";
}

export type CollectionSlug = "express" | "warm" | "cool" | "store" | "care" | "wear" | "fit";

export interface Collection {
  slug: CollectionSlug;
  name: string;
  title: string;
  intro: string;
  tone: Product["tone"];
}

export const collections: Collection[] = [
  {
    slug: "express",
    name: "Express",
    title: "Pumps that disappear into your day",
    intro:
      "Hospital-grade suction in wearable, double-electric and manual forms. Quiet enough for a sleeping baby, strong enough for a full supply.",
    tone: "cream",
  },
  {
    slug: "warm",
    name: "Warm",
    title: "Gentle warmth, nutrients intact",
    intro:
      "Waterbath warmers that never exceed 40°C, so antibodies and enzymes survive the journey from fridge to feed.",
    tone: "sand",
  },
  {
    slug: "cool",
    name: "Cool",
    title: "Cold chain, wherever you are",
    intro: "Coolers and totes that keep milk safe for up to 48 hours without a fridge. For commutes, flights and long days out.",
    tone: "mist",
  },
  {
    slug: "store",
    name: "Store",
    title: "Every drop, accounted for",
    intro: "Lay-flat bags, borosilicate bottles and freezer trays designed to waste nothing and stack beautifully.",
    tone: "cream",
  },
  {
    slug: "care",
    name: "Care",
    title: "For the body doing the work",
    intro: "Cooling and warming therapy, lanolin-free balm and silver cups for engorgement, clogged ducts and sore nipples.",
    tone: "clay",
  },
  {
    slug: "wear",
    name: "Wear",
    title: "Hands free, worry free",
    intro: "Pumping bras and washable pads that hold everything in place and feel like nothing at all.",
    tone: "sand",
  },
  {
    slug: "fit",
    name: "Fit & Parts",
    title: "The right size changes everything",
    intro: "Flange sizing tools and replacement parts. The most overlooked step in comfortable, effective pumping.",
    tone: "mist",
  },
];

export const stages: { slug: Stage; name: string; blurb: string }[] = [
  { slug: "pregnancy", name: "Preparing", blurb: "Third trimester essentials to have ready before the birth." },
  { slug: "first-weeks", name: "First weeks", blurb: "Establishing supply, soothing engorgement, finding rhythm." },
  { slug: "back-to-work", name: "Back to work", blurb: "Discreet pumping, safe transport, a stash that lasts." },
  { slug: "travel", name: "On the move", blurb: "Cold chain and warming without a kitchen in sight." },
  { slug: "night", name: "Night feeds", blurb: "Silent, dim, one-handed. Everything for 3 a.m." },
];

const flangeVariant: Variant = {
  label: "Flange size",
  options: ["15 mm", "17 mm", "19 mm", "21 mm", "24 mm", "27 mm"],
  hint: "Every pump ships with all six inserts. Not sure? Use the free sizing guide.",
};

export const products: Product[] = [
  {
    slug: "aura-wearable-pump",
    name: "Mave Aura",
    tagline: "Wearable double pump. Hospital-grade. Silent.",
    collection: "express",
    price: 349,
    rating: 4.9,
    reviews: 1284,
    badge: "Bestseller",
    visual: "wearable",
    tone: "cream",
    colors: [
      { name: "Porcelain", hex: "#f2ece4" },
      { name: "Clay", hex: "#b2634b" },
      { name: "Ink", hex: "#2b2822" },
    ],
    variants: [flangeVariant],
    features: [
      { title: "Under 30 dB", body: "Quieter than a whisper. Pump in a meeting, on a call or beside a sleeping baby." },
      { title: "Hospital-grade suction", body: "Up to 300 mmHg with 8 stimulation and 12 expression levels, tuned to your body." },
      { title: "Weighs 210 g per side", body: "Sits inside a regular bra. No tubes, no cords, no bottles hanging." },
      { title: "Leak-proof, closed system", body: "Milk never touches the motor. Four dishwasher-safe parts, nothing else." },
    ],
    specs: {
      Capacity: "180 ml per cup",
      Battery: "Up to 6 sessions per charge, USB-C",
      Noise: "< 30 dB",
      Suction: "Up to 300 mmHg, 20 levels",
      Modes: "Stimulation, expression, auto-switch, night",
      App: "Mave app for iOS & Android",
      Parts: "4 per side, all dishwasher-safe",
      Certification: "CE (MDR 2017/745), BPA-free",
      Warranty: "2 years (battery 1 year)",
    },
    inBox: ["2 Aura pump units", "Flange inserts 13–27 mm (6 sizes)", "2 × 180 ml milk cups", "Charging dock", "Travel pouch", "Sizing card"],
    description:
      "Aura was designed with 400 mothers over two years. It is the pump that lets you forget you are pumping: silent, hands free and strong enough to replace a hospital rental. The night mode dims every light and softens the rhythm for feeds in the dark.",
    stages: ["first-weeks", "back-to-work", "travel", "night"],
    reimbursable: true,
    stock: "in-stock",
  },
  {
    slug: "aura-solo",
    name: "Mave Aura Solo",
    tagline: "One wearable cup. Feed on one side, pump on the other.",
    collection: "express",
    price: 189,
    rating: 4.8,
    reviews: 402,
    visual: "wearable",
    tone: "sand",
    colors: [
      { name: "Porcelain", hex: "#f2ece4" },
      { name: "Clay", hex: "#b2634b" },
    ],
    variants: [flangeVariant],
    features: [
      { title: "Catch the let-down", body: "Collect the milk you would otherwise lose while nursing on the other side." },
      { title: "Same silent motor", body: "Identical to the double Aura. Add a second unit later and they pair automatically." },
      { title: "One-handed everything", body: "A single button. Start, switch modes and stop without looking." },
    ],
    specs: {
      Capacity: "180 ml",
      Battery: "Up to 6 sessions, USB-C",
      Noise: "< 30 dB",
      Suction: "Up to 300 mmHg",
      Warranty: "2 years",
    },
    inBox: ["1 Aura pump unit", "Flange set 17–27 mm", "1 × 180 ml milk cup", "USB-C cable", "Sizing card"],
    description: "The gentlest way to start building a stash. Aura Solo is the single-side sibling of our flagship pump.",
    stages: ["first-weeks", "night"],
    reimbursable: true,
    stock: "in-stock",
  },
  {
    slug: "core-hospital-pump",
    name: "Mave Core",
    tagline: "Double-electric, hospital-strength. For serious supply.",
    collection: "express",
    price: 279,
    compareAt: 319,
    rating: 4.8,
    reviews: 866,
    badge: "Award winner",
    visual: "pump",
    tone: "mist",
    colors: [{ name: "Porcelain", hex: "#f2ece4" }, { name: "Ink", hex: "#2b2822" }],
    variants: [flangeVariant],
    features: [
      { title: "True hospital-grade", body: "330 mmHg and a motor rated for 3,000+ hours. Built to establish and protect supply." },
      { title: "Independent cycle & vacuum", body: "Dial in speed and strength separately. The most effective mode is the one that feels right." },
      { title: "Sleeps in a drawer", body: "Compact body with a rechargeable battery and a soft night light for the 3 a.m. session." },
    ],
    specs: {
      Suction: "Up to 330 mmHg",
      Cycle: "38–72 cycles/min",
      Battery: "3 hours, rechargeable",
      Noise: "42 dB",
      System: "Closed, backflow protected",
      Parts: "5 per side, dishwasher-safe",
      Certification: "CE (MDR 2017/745), BPA-free",
      Warranty: "2 years (motor 3 years)",
    },
    inBox: ["Core motor unit", "2 flange kits with inserts 13–27 mm", "2 × 160 ml bottles", "Tubing", "Power adapter", "Carry case"],
    description:
      "Core is the pump midwives ask us about. It is the one for exclusive pumpers, NICU stays and anyone who needs their supply to be non-negotiable.",
    stages: ["first-weeks", "back-to-work", "night"],
    reimbursable: true,
    stock: "in-stock",
  },
  {
    slug: "hand-manual-pump",
    name: "Mave Hand",
    tagline: "Manual pump with a lever that does not tire your hand.",
    collection: "express",
    price: 44,
    rating: 4.7,
    reviews: 1910,
    visual: "manual",
    tone: "cream",
    variants: [flangeVariant],
    features: [
      { title: "Ergonomic long lever", body: "40% less hand fatigue than a standard handle. Switch hands without losing suction." },
      { title: "Two-phase by feel", body: "Short pulls stimulate, long pulls express. You are the motor." },
      { title: "Five parts", body: "Rinse, boil or dishwasher. Assembles in seconds, even half asleep." },
    ],
    specs: { Capacity: "150 ml", Weight: "140 g", Material: "BPA-free PP & medical silicone", Warranty: "2 years" },
    inBox: ["Pump body", "Lever", "Flange 24 mm + 21 mm", "150 ml bottle", "Stand & cap"],
    description: "The pump for the nappy bag. Relief, a bottle for date night or a quiet back-up when the battery is flat.",
    stages: ["pregnancy", "first-weeks", "travel"],
    stock: "in-stock",
  },
  {
    slug: "drop-silicone-collector",
    name: "Mave Drop",
    tagline: "Silicone let-down collector. Catch what you used to lose.",
    collection: "express",
    price: 24,
    rating: 4.8,
    reviews: 3220,
    badge: "Bestseller",
    visual: "collector",
    tone: "sand",
    features: [
      { title: "One piece of silicone", body: "Suctions on, fills up. 30–60 ml per feed adds up to a freezer stash in a week." },
      { title: "Weighted base", body: "Stays upright when you put it down. A stopper keeps it sealed in the bag." },
    ],
    specs: { Capacity: "120 ml", Material: "Medical-grade silicone", Care: "Dishwasher & steriliser safe" },
    inBox: ["Drop collector", "Silicone stopper", "Neck strap"],
    description: "Your first Mave, probably. It costs less than a takeaway and saves litres of milk over a year.",
    stages: ["pregnancy", "first-weeks", "night"],
    stock: "in-stock",
  },
  {
    slug: "warm-milk-warmer",
    name: "Mave Warm",
    tagline: "Waterbath warmer. Never above 40°C. Ever.",
    collection: "warm",
    price: 129,
    rating: 4.9,
    reviews: 745,
    badge: "New",
    visual: "warmer",
    tone: "sand",
    colors: [{ name: "Porcelain", hex: "#f2ece4" }, { name: "Sage", hex: "#8a9a86" }],
    features: [
      { title: "Protects the milk", body: "Gentle circulating waterbath, sensor-controlled. Antibodies, enzymes and fats are preserved." },
      { title: "Frozen to feed in 8 minutes", body: "Thaw and warm in one cycle. From fridge in 3. No hotspots, no shaking." },
      { title: "Fits every bottle & bag", body: "Universal basket for bottles, Mave bags and glass jars. Keeps warm for 60 minutes." },
    ],
    specs: {
      "Max temperature": "40°C (body temperature mode 37°C)",
      "Warm from fridge": "~3 min",
      "Thaw + warm": "~8 min",
      Display: "Dimmable glass touch panel",
      Compatibility: "All standard & wide-neck bottles, storage bags",
      Warranty: "2 years",
    },
    inBox: ["Warm unit", "Universal basket", "Bag clip", "Power adapter"],
    description:
      "Most warmers cook milk. Warm treats it like the living food it is. A sensor holds the water at a precise, gentle temperature while a soft glow tells you when it is ready.",
    stages: ["first-weeks", "night"],
    stock: "in-stock",
  },
  {
    slug: "warm-go-portable",
    name: "Mave Warm Go",
    tagline: "Battery bottle warmer for the car, the park, the plane.",
    collection: "warm",
    price: 89,
    rating: 4.7,
    reviews: 312,
    visual: "warmer-go",
    tone: "mist",
    colors: [{ name: "Ink", hex: "#2b2822" }, { name: "Clay", hex: "#b2634b" }],
    features: [
      { title: "Two full warms per charge", body: "Fridge-cold to body temperature in 12 minutes, anywhere. USB-C rechargeable." },
      { title: "Precise, not hot", body: "The same 40°C ceiling as the Warm. Set 37°C or 40°C and forget it." },
      { title: "Doubles as a flask", body: "Keeps warmed milk at temperature for 2 hours. Leak-proof lid." },
    ],
    specs: { Battery: "2 warms per charge", "Warm time": "~12 min", Capacity: "Up to 240 ml bottle", Weight: "320 g", Warranty: "2 years" },
    inBox: ["Warm Go", "Bottle adapter ring", "USB-C cable", "Travel sleeve"],
    description: "A warm feed without asking a café for hot water. Warm Go is the size of a coffee cup.",
    stages: ["travel", "back-to-work"],
    stock: "in-stock",
  },
  {
    slug: "chill-milk-cooler",
    name: "Mave Chill",
    tagline: "48-hour breastmilk cooler. No ice, no fridge.",
    collection: "cool",
    price: 119,
    rating: 4.9,
    reviews: 588,
    badge: "Award winner",
    visual: "cooler",
    tone: "mist",
    colors: [{ name: "Porcelain", hex: "#f2ece4" }, { name: "Sage", hex: "#8a9a86" }, { name: "Ink", hex: "#2b2822" }],
    features: [
      { title: "48 hours below 4°C", body: "Vacuum-insulated steel with a freezable core. Pump straight into it all day." },
      { title: "Pump-direct", body: "Screws onto Core and most standard pumps. Pool sessions without a fridge in sight." },
      { title: "Holds 700 ml", body: "A full day's output. Removable inner chamber goes in the dishwasher." },
    ],
    specs: { Capacity: "700 ml", "Cold time": "Up to 48 h", Material: "18/8 stainless steel, silicone", Weight: "540 g", Warranty: "Lifetime on steel body" },
    inBox: ["Chill cooler", "Freezable core", "Pump adapter", "Pour lid"],
    description: "The cold chain, redesigned. Chill is what makes a 12-hour shift or a long-haul flight possible.",
    stages: ["back-to-work", "travel"],
    stock: "low",
  },
  {
    slug: "chill-tote",
    name: "Mave Chill Tote",
    tagline: "Insulated bag that looks like a bag, not a lunchbox.",
    collection: "cool",
    price: 79,
    rating: 4.8,
    reviews: 421,
    visual: "tote",
    tone: "sand",
    colors: [{ name: "Sand", hex: "#e3d8ca" }, { name: "Ink", hex: "#2b2822" }],
    features: [
      { title: "24 hours cold", body: "Two slim ice panels keep 6 bottles or 12 bags at fridge temperature." },
      { title: "Room for the pump", body: "Padded upper compartment fits Aura or Core with parts. Wipe-clean lining." },
    ],
    specs: { Capacity: "6 bottles / 12 bags + pump", "Cold time": "24 h", Material: "Recycled canvas, TPU lining", Warranty: "2 years" },
    inBox: ["Chill Tote", "2 ice panels", "Removable parts pouch"],
    description: "Designed to sit on a desk without explanation.",
    stages: ["back-to-work", "travel"],
    stock: "in-stock",
  },
  {
    slug: "storage-bags-50",
    name: "Mave Storage Bags",
    tagline: "Lay-flat, double-sealed, pump-direct. Box of 50.",
    collection: "store",
    price: 19,
    rating: 4.8,
    reviews: 5102,
    badge: "Bestseller",
    visual: "bags",
    tone: "cream",
    variants: [{ label: "Pack", options: ["50 bags", "100 bags", "200 bags"] }],
    features: [
      { title: "Freeze flat, thaw fast", body: "Thin profile stacks like books in the Mave tray and thaws in minutes." },
      { title: "Double zipper, pre-sterilised", body: "Reinforced seams that do not split in the freezer. Tear-off tamper strip." },
      { title: "Write-on panel", body: "Date, volume and side. Ink stays put in the freezer." },
    ],
    specs: { Capacity: "200 ml", Material: "BPA & BPS-free PE", Count: "50 / 100 / 200" },
    inBox: ["Storage bags"],
    description: "The bag every mother in our study asked us to make thinner, stronger and easier to pour.",
    stages: ["pregnancy", "first-weeks", "back-to-work"],
    stock: "in-stock",
  },
  {
    slug: "glass-bottle-set",
    name: "Mave Glass Set",
    tagline: "Four borosilicate bottles. Pump, store, warm, feed.",
    collection: "store",
    price: 59,
    rating: 4.9,
    reviews: 388,
    visual: "bottles",
    tone: "mist",
    features: [
      { title: "One bottle, four jobs", body: "Screws onto Core, into Warm, into the fridge and onto a Mave teat. Nothing to decant." },
      { title: "Freezer & dishwasher safe", body: "Borosilicate glass handles thermal shock. Silicone sleeve protects the counter." },
    ],
    specs: { Capacity: "4 × 180 ml", Material: "Borosilicate glass, silicone, PP", Care: "Dishwasher, steriliser, freezer" },
    inBox: ["4 bottles", "4 sealing discs", "4 silicone sleeves", "2 slow-flow teats"],
    description: "Glass tastes of nothing and lasts forever.",
    stages: ["first-weeks", "night"],
    stock: "in-stock",
  },
  {
    slug: "freezer-tray",
    name: "Mave Freezer Tray",
    tagline: "First in, first out. A stash you can actually see.",
    collection: "store",
    price: 34,
    rating: 4.7,
    reviews: 276,
    visual: "tray",
    tone: "sand",
    features: [
      { title: "Freeze flat, file upright", body: "Bags freeze flat on top, then slide into the rack. Oldest slides out first." },
      { title: "Holds 30 bags", body: "Fits a standard freezer drawer. Stackable." },
    ],
    specs: { Capacity: "30 bags", Material: "Recycled ABS", Dimensions: "32 × 14 × 12 cm" },
    inBox: ["Tray", "Flat-freeze lid"],
    description: "The end of the rummage.",
    stages: ["back-to-work"],
    stock: "in-stock",
  },
  {
    slug: "soothe-therapy-pads",
    name: "Mave Soothe",
    tagline: "Cooling and warming breast therapy pads. Pair.",
    collection: "care",
    price: 39,
    rating: 4.9,
    reviews: 1732,
    badge: "Bestseller",
    visual: "pads",
    tone: "clay",
    features: [
      { title: "Cold for engorgement", body: "Freezer-safe gel stays flexible when frozen, contouring to the breast for relief." },
      { title: "Warm for let-down", body: "Microwave 20 seconds before pumping to encourage flow and ease clogged ducts." },
      { title: "Fits inside a bra or flange", body: "Anatomical shape with a nipple opening. Wear while pumping." },
    ],
    specs: { Contents: "2 gel pads, 2 soft covers", Material: "Non-toxic gel, organic cotton cover", Care: "Wipe clean, covers washable" },
    inBox: ["2 therapy pads", "2 organic cotton covers", "Storage case"],
    description: "The product our customers say they wish they had bought first.",
    stages: ["first-weeks", "night"],
    stock: "in-stock",
  },
  {
    slug: "balm-nipple-balm",
    name: "Mave Balm",
    tagline: "Lanolin-free nipple balm. Safe for baby, no need to wipe.",
    collection: "care",
    price: 16,
    rating: 4.8,
    reviews: 2211,
    visual: "balm",
    tone: "cream",
    variants: [{ label: "Size", options: ["30 ml", "60 ml"] }],
    features: [
      { title: "Plant-based", body: "Shea, calendula and marula. Fragrance-free, vegan, food-grade." },
      { title: "Doubles as pump lubricant", body: "A thin layer in the flange reduces friction and improves seal." },
    ],
    specs: { Volume: "30 ml / 60 ml", Ingredients: "Shea butter, calendula, marula oil, beeswax alternative" },
    inBox: ["Balm tin"],
    description: "Relief in the first week and a better pumping seal in every week after.",
    stages: ["pregnancy", "first-weeks"],
    stock: "in-stock",
  },
  {
    slug: "silver-nursing-cups",
    name: "Mave Silver Cups",
    tagline: "925 silver nursing cups. Nature's healing, between feeds.",
    collection: "care",
    price: 49,
    rating: 4.7,
    reviews: 664,
    visual: "cups",
    tone: "mist",
    features: [
      { title: "Antimicrobial silver", body: "Worn between feeds to protect and help heal cracked skin. No creams, nothing to wash off." },
      { title: "Nickel-free, hypoallergenic", body: "Polished 925 sterling. A lifetime piece." },
    ],
    specs: { Material: "925 sterling silver", Size: "Standard (45 mm)", Weight: "12 g each" },
    inBox: ["2 silver cups", "Linen pouch"],
    description: "An ancient remedy, made beautifully.",
    stages: ["first-weeks"],
    stock: "in-stock",
  },
  {
    slug: "hold-pumping-bra",
    name: "Mave Hold",
    tagline: "Pumping & nursing bra. Holds any pump. Feels like nothing.",
    collection: "wear",
    price: 54,
    rating: 4.8,
    reviews: 1130,
    visual: "bra",
    tone: "sand",
    colors: [{ name: "Sand", hex: "#e3d8ca" }, { name: "Ink", hex: "#2b2822" }, { name: "Clay", hex: "#b2634b" }],
    variants: [{ label: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"], hint: "Buy your pre-pregnancy size; the fabric adapts." }],
    features: [
      { title: "Works with every pump", body: "Layered front holds Aura cups or flanges with tubing. Clip-down for nursing." },
      { title: "Modal & elastane", body: "Buttery soft, wire-free and breathable. Grows and shrinks with you." },
    ],
    specs: { Material: "92% modal, 8% elastane", Care: "Machine wash 30°C", Sizes: "XS–XXL" },
    inBox: ["Hold bra"],
    description: "One bra for sleeping, nursing and pumping.",
    stages: ["pregnancy", "first-weeks", "back-to-work"],
    stock: "in-stock",
  },
  {
    slug: "fit-sizing-kit",
    name: "Mave Fit Kit",
    tagline: "Measure once, pump comfortably forever.",
    collection: "fit",
    price: 12,
    rating: 4.9,
    reviews: 908,
    visual: "kit",
    tone: "mist",
    features: [
      { title: "Sizing ruler + 6 inserts", body: "Measure your nipple, try inserts from 13 to 27 mm, find your size. Half of mothers are not a 24." },
      { title: "30-day fit guarantee", body: "Free with every Mave pump. Still not comfortable after 30 days? A lactation consultant checks your fit, on us." },
    ],
    specs: { Contents: "Ruler, inserts 13–27 mm, guide", Material: "Medical silicone", Parts: "8" },
    inBox: ["Sizing ruler", "6 silicone inserts (13–27 mm)", "Illustrated guide", "Fit check voucher"],
    description: "Pain while pumping is almost always the wrong flange size. Fix that first.",
    stages: ["pregnancy", "first-weeks"],
    stock: "in-stock",
  },
  {
    slug: "pure-steriliser",
    name: "Mave Pure",
    tagline: "Steam steriliser & dryer. All your parts, one press.",
    collection: "store",
    price: 149,
    rating: 4.8,
    reviews: 233,
    badge: "New",
    visual: "sterilizer",
    tone: "cream",
    features: [
      { title: "Sterilise, dry, store", body: "Steam kills 99.9% of germs, HEPA-filtered air dries. Parts stay sterile inside for 24 hours." },
      { title: "Fits a whole day of pumping", body: "Two levels hold Aura, Core parts, 6 bottles and teats at once." },
    ],
    specs: { Cycle: "Sterilise 8 min, dry 30–60 min", Capacity: "2 levels, 6 bottles + pump parts", Filter: "HEPA, replace every 6 months" },
    inBox: ["Pure unit", "2 racks", "Tongs", "HEPA filter"],
    description: "Because the cleaning is the part nobody warns you about.",
    stages: ["first-weeks", "back-to-work"],
    stock: "preorder",
  },
  {
    slug: "pulse-lactation-massager",
    name: "Mave Pulse",
    tagline: "Warmth and vibration for clogged ducts and slow let-down.",
    collection: "care",
    price: 59,
    rating: 4.8,
    reviews: 519,
    badge: "New",
    visual: "warmer-go",
    tone: "clay",
    colors: [{ name: "Clay", hex: "#b2634b" }, { name: "Porcelain", hex: "#f2ece4" }],
    features: [
      { title: "Heat plus vibration", body: "Three warmth levels and four vibration patterns to release clogs and speed up let-down before pumping." },
      { title: "Shaped for the breast", body: "Curved edge for gentle lymphatic strokes, flat side for the flange. Fully waterproof." },
      { title: "Doubles pump output", body: "In our study, warmth and vibration before a session increased output by up to 15% and cut session time by 3 minutes." },
    ],
    specs: { Battery: "USB-C, 10 sessions", Heat: "3 levels, max 42°C", Vibration: "4 patterns", Rating: "IPX7 waterproof", Warranty: "2 years" },
    inBox: ["Pulse massager", "USB-C cable", "Silk pouch"],
    description: "Lactation consultants have long recommended warmth and gentle vibration, not deep massage. Pulse does both, safely.",
    stages: ["first-weeks", "back-to-work"],
    stock: "in-stock",
  },
  {
    slug: "bamboo-nursing-pads",
    name: "Mave Pads",
    tagline: "Eight washable bamboo nursing pads. Leaks, handled.",
    collection: "wear",
    price: 19,
    rating: 4.7,
    reviews: 1466,
    visual: "cups",
    tone: "cream",
    features: [
      { title: "Three layers", body: "Bamboo against the skin, absorbent core, waterproof back. Invisible under a t-shirt." },
      { title: "Machine wash, 300 times", body: "Comes with a mesh wash bag. One pack replaces roughly 1,000 disposables." },
    ],
    specs: { Count: "8 pads + wash bag", Material: "Bamboo viscose, microfibre, PUL", Care: "Machine wash 40°C" },
    inBox: ["8 pads", "Mesh wash bag"],
    description: "Soft, silent and reusable. The quiet workhorse of the first months.",
    stages: ["pregnancy", "first-weeks", "back-to-work"],
    stock: "in-stock",
  },
  {
    slug: "steam-clean-bags",
    name: "Mave Steam Bags",
    tagline: "Twenty reusable microwave steriliser bags for travel.",
    collection: "store",
    price: 12,
    rating: 4.6,
    reviews: 388,
    visual: "bags",
    tone: "mist",
    features: [
      { title: "Sterile in 3 minutes", body: "Add water, microwave, done. Kills 99.9% of bacteria on pump parts, bottles and teats." },
      { title: "20 uses per bag", body: "Tick-box on the front to count. Fits a full Aura or Core parts set." },
    ],
    specs: { Count: "20 bags, 20 uses each", Material: "Food-grade PP", Time: "3 min at 800W" },
    inBox: ["20 steam bags"],
    description: "The hotel-room steriliser.",
    stages: ["travel", "back-to-work"],
    stock: "in-stock",
  },
];

export const bundles = [
  {
    slug: "back-to-work-kit",
    name: "The Back-to-Work Kit",
    items: ["aura-wearable-pump", "chill-milk-cooler", "storage-bags-50", "hold-pumping-bra", "steam-clean-bags"],
    price: 499,
    compareAt: 553,
  },
  {
    slug: "first-weeks-kit",
    name: "The First Weeks Kit",
    items: ["drop-silicone-collector", "soothe-therapy-pads", "balm-nipple-balm", "hand-manual-pump", "bamboo-nursing-pads"],
    price: 119,
    compareAt: 142,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const productsByCollection = (slug: CollectionSlug) => products.filter((p) => p.collection === slug);
export const productsByStage = (slug: Stage) => products.filter((p) => p.stages.includes(slug));
