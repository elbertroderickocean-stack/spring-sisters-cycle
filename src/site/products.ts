import serumTrio from "@/assets/site/serum-trio.jpg";
import eyeCream from "@/assets/site/eye-cream-sky.jpg";
import lineup from "@/assets/site/lineup.jpg";
import maskFace from "@/assets/site/mask-face.jpg";

export type Collection = "The Constants" | "The Shifts" | "The Assets";

export interface SiteProduct {
  id: string;
  name: string;
  code: string;
  collection: Collection;
  size: string;
  price: number;
  tagline: string;
  description: string;
  heroes: string[];
  phase: string;
  image: string;
}

export const collections: { name: Collection; subtitle: string }[] = [
  { name: "The Constants", subtitle: "Your daily index fund for barrier resilience." },
  { name: "The Shifts", subtitle: "Dynamic assets that adapt to your internal rhythm." },
  { name: "The Assets", subtitle: "High-yield interventions for immediate results." },
];

export const products: SiteProduct[] = [
  {
    id: "baseline-cleanser",
    name: "The Baseline Cleanser",
    code: "Cleanser-01",
    collection: "The Constants",
    size: "100ml",
    price: 34,
    tagline: "Zero-sum cleansing. Nothing lost, nothing added.",
    description:
      "A low-pH gel-milk that lifts the day without stripping the barrier. The fixed starting point every portfolio is built on.",
    heroes: ["Amino acids", "Panthenol", "Oat lipids"],
    phase: "Every day · AM / PM",
    image: lineup,
  },
  {
    id: "long-term-moisturizer",
    name: "The Long-Term Moisturizer",
    code: "Moisturizer Rich",
    collection: "The Constants",
    size: "50ml",
    price: 48,
    tagline: "Compound hydration. Interest paid nightly.",
    description:
      "A ceramide-dense cream that keeps the barrier liquid through weather, stress and travel. Designed to be boring — and to work for years.",
    heroes: ["Ceramide NP", "Squalane", "Beta-Glucan"],
    phase: "Every day · PM",
    image: lineup,
  },
  {
    id: "serum-01-balance",
    name: "Serum-01 [Balance]",
    code: "Serum-01",
    collection: "The Shifts",
    size: "15ml",
    price: 42,
    tagline: "For the phase when skin runs oily and reactive.",
    description:
      "Niacinamide and zinc calibrate sebum during the luteal phase. m.i. tells you when to deploy it — and when to pause.",
    heroes: ["Niacinamide 5%", "Zinc PCA", "Green tea"],
    phase: "Phase 3 · Luteal",
    image: serumTrio,
  },
  {
    id: "serum-02-glow",
    name: "Serum-02 [Glow]",
    code: "Serum-02",
    collection: "The Shifts",
    size: "15ml",
    price: 42,
    tagline: "Capitalize on peak estrogen.",
    description:
      "Stable vitamin C and peptides amplify radiance in the follicular and ovulatory window, when skin is most receptive.",
    heroes: ["Stable Vitamin C", "Peptides", "Ferulic acid"],
    phase: "Phase 1–2 · Follicular",
    image: serumTrio,
  },
  {
    id: "serum-03-calm",
    name: "Serum-03 [Calm]",
    code: "Serum-03",
    collection: "The Shifts",
    size: "15ml",
    price: 42,
    tagline: "A hedge against sensitivity.",
    description:
      "Centella and beta-glucan lower the noise during menstruation, when the barrier is thinnest and inflammation highest.",
    heroes: ["Centella", "Beta-Glucan", "Allantoin"],
    phase: "Phase 4 · Menstrual",
    image: serumTrio,
  },
  {
    id: "eye-cream-360",
    name: "360° Eye Cream",
    code: "Eye-01",
    collection: "The Assets",
    size: "30ml",
    price: 56,
    tagline: "360 care. Enhanced formula. Clinically minded.",
    description:
      "A capsule applicator that delivers niacinamide, stable vitamin C and caffeine around the full orbit of the eye. Cool metal tip, zero waste.",
    heroes: ["Niacinamide", "Stable Vit C", "Caffeine"],
    phase: "On demand · AM",
    image: eyeCream,
  },
  {
    id: "cellular-architect",
    name: "The Cellular Architect Cream",
    code: "PDRN-01",
    collection: "The Assets",
    size: "50ml",
    price: 89,
    tagline: "The flagship high-yield asset.",
    description:
      "PDRN and peptides support the skin's own repair cycle. Deployed in 7-day micro-cycles so the result compounds instead of plateauing.",
    heroes: ["PDRN", "Peptides", "Ceramides"],
    phase: "7-day micro-cycle · PM",
    image: lineup,
  },
  {
    id: "mask-01-glow",
    name: "Mask-01 [Glow]",
    code: "Mask-01",
    collection: "The Assets",
    size: "Trio · 3 sheets",
    price: 28,
    tagline: "A dividend you can feel in 20 minutes.",
    description:
      "Hydrogel masks in Glow, Detox and Calm. Deploy before an event or after a flight — m.i. reminds you when the data says you need it.",
    heroes: ["Hyaluronic acid", "Niacinamide", "Charcoal (Detox)"],
    phase: "Event-driven",
    image: maskFace,
  },
];

export const getProduct = (id?: string) => products.find((p) => p.id === id);
