export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  line: 'bloom' | 'harmony' | 'precision';
  detailedDescription: string;
  howToUse: string;
  keyIngredients: string[];
  ritualPurpose?: string;
  lifespanDays?: number;
}

export const products: Product[] = [
  // THE SHIFTS™ (Dynamic Management) — formerly Bloom Cycle
  {
    id: 'serum-trio',
    name: 'The Shifts Serum Trio',
    description: 'F1: Recovery · F2: Peak Glow · F3: Reset — the dynamic trio that adapts to your cycle.',
    detailedDescription: 'Our flagship product and the heart of the meanwhile. philosophy. Three distinct serums — F1: Recovery, F2: Peak Glow, F3: Reset — each scientifically formulated to work in perfect harmony with your biological phases. Dynamic management for dynamic skin.',
    howToUse: 'Each morning and evening, apply 2-3 drops of the serum that corresponds to your current phase. Gently press into clean skin before your moisturizer.',
    keyIngredients: ['Ceramides (F1: Recovery)', 'Vitamin C (F2: Peak Glow)', 'Niacinamide (F3: Reset)'],
    price: '$85.00',
    image: '/images/products/serum-trio.jpg',
    line: 'bloom',
    ritualPurpose: 'Delivers phase-specific active ingredients matched to your biological rhythm.',
    lifespanDays: 30,
  },
  {
    id: 'mask-trio',
    name: 'The Shifts Mask Trio',
    description: 'A weekly intensive treatment with a targeted mask for each phase: Recovery, Peak Glow, Reset.',
    detailedDescription: 'Transform your self-care ritual into a scientifically optimized treatment. Each mask amplifies the benefits of its corresponding phase, giving your skin an intensive boost exactly when it needs it most.',
    howToUse: 'Once per week, apply a generous layer of your phase-matched mask to clean skin. Leave on for 15-20 minutes, then rinse thoroughly.',
    keyIngredients: ['Kaolin Clay (F1: Recovery)', 'Vitamin C + AHAs (F2: Peak Glow)', 'Charcoal + Tea Tree (F3: Reset)'],
    price: '$78.00',
    image: '/images/products/mask-trio.jpg',
    line: 'bloom',
    lifespanDays: 90,
  },

  // THE CONSTANTS™ (Your Index Fund) — formerly Spring Harmony
  {
    id: 'cleanser',
    name: 'The Baseline Cleanser',
    description: 'A pH-balanced daily wash that cleanses effectively without stripping the skin.',
    detailedDescription: 'The perfect first step. This hydrating gel cleanser removes makeup, SPF, and impurities while maintaining your skin\'s natural moisture barrier. Formulated to be gentle enough for even the most sensitive days of your cycle.',
    howToUse: 'Massage a small amount onto damp skin morning and evening. Rinse thoroughly with lukewarm water.',
    keyIngredients: ['Gentle Surfactants', 'Glycerin', 'Panthenol'],
    price: '$32.00',
    image: '/images/products/cleanser.jpg',
    line: 'harmony',
    ritualPurpose: 'Creates a clean, balanced canvas for your treatment products.',
    lifespanDays: 45,
  },
  {
    id: 'moisturizer',
    name: 'The Long-Term Moisturizer',
    description: 'Your daily foundational cream to support a healthy skin barrier.',
    detailedDescription: 'This lightweight yet deeply nourishing cream is your skin\'s constant companion. It provides essential hydration and barrier support every single day, regardless of your phase. Think of it as your skin\'s index fund — steady, reliable, compounding.',
    howToUse: 'Apply to clean skin morning and evening as the final step of your routine. Massage gently until absorbed.',
    keyIngredients: ['Hyaluronic Acid', 'Squalane', 'Ceramide Complex'],
    price: '$48.00',
    image: '/images/products/moisturizer.jpg',
    line: 'harmony',
    ritualPurpose: 'Seals in hydration and protects your skin barrier all day long.',
    lifespanDays: 60,
  },
  {
    id: 'eye-cream',
    name: 'The Long-Term Eye Cream',
    description: 'Specialized gentle care for the delicate eye area.',
    detailedDescription: 'The skin around your eyes is the thinnest and most sensitive on your face. This feather-light yet powerful cream hydrates, smooths, and brightens without any heaviness or irritation.',
    howToUse: 'Using your ring finger, gently pat a rice-grain amount around the orbital bone morning and evening.',
    keyIngredients: ['Caffeine', 'Peptides', 'Hyaluronic Acid'],
    price: '$42.00',
    image: '/images/products/eye-cream.jpg',
    line: 'harmony',
    ritualPurpose: 'Reduces puffiness and fine lines around your eyes.'
  },

  // THE ASSETS™ (Venture Investments) — formerly Precision Care
  {
    id: 'vitamin-c',
    name: 'Vitamin C Concentrate',
    description: 'A potent, single-dose shot of pure Vitamin C for maximum radiance.',
    detailedDescription: 'We solved the biggest problem with Vitamin C: stability. Encapsulated in a single-dose capsule, our 15% L-Ascorbic Acid concentrate is guaranteed to be fresh and powerful, delivering unparalleled glow and antioxidant protection.',
    howToUse: 'Twist open one capsule. Apply the entire contents to clean face and neck in the morning, before moisturizer and SPF.',
    keyIngredients: ['15% L-Ascorbic Acid', 'Ferulic Acid', 'Vitamin E'],
    price: '$52.00',
    image: '/images/products/vitamin-c.jpg',
    line: 'precision',
  },
  {
    id: 'ceramide',
    name: 'Ceramide Concentrate',
    description: 'A "liquid bandage" to instantly rescue and repair a compromised skin barrier.',
    detailedDescription: 'For those days when your skin feels tight, flaky, or sensitized, this intensive treatment delivers a mega-dose of barrier-repairing ceramides. It\'s your SOS solution for distressed skin.',
    howToUse: 'Apply 3-4 drops to clean skin before moisturizer, focusing on areas of dryness or sensitivity. Use daily until skin feels restored.',
    keyIngredients: ['5-Ceramide Complex', 'Cholesterol', 'Fatty Acids'],
    price: '$56.00',
    image: '/images/products/ceramide.jpg',
    line: 'precision',
  },
  {
    id: 'cellular-architect',
    name: 'The Cellular Architect Cream (with PDRN)',
    description: 'Our flagship venture asset — advanced cellular regeneration powered by PDRN technology.',
    detailedDescription: 'The pinnacle of our Assets line. PDRN (Polydeoxyribonucleotide) is a breakthrough ingredient derived from salmon DNA that accelerates cellular repair and regeneration. This luxurious cream delivers deep structural renewal, improving elasticity, firmness, and skin vitality at the cellular level.',
    howToUse: 'Apply a pearl-sized amount to clean skin in the evening, after serums and before moisturizer. Focus on areas where firmness and renewal are most needed.',
    keyIngredients: ['PDRN (Polydeoxyribonucleotide)', 'Peptide Complex', 'Adenosine', 'Niacinamide'],
    price: '$128.00',
    image: '/images/products/ceramide.jpg',
    line: 'precision',
  },
];
