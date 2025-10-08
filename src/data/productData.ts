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
  lifespanDays?: number; // How many days the product typically lasts
}

export const products: Product[] = [
  // BLOOM CYCLE™ LINE
  {
    id: 'serum-trio',
    name: 'Bloom Cycle Serum Trio',
    description: 'The intelligent 3-serum system that adapts to your skin\'s monthly rhythm.',
    detailedDescription: 'Our flagship product and the heart of the Spring Sisters philosophy. This revolutionary trio contains three distinct serums, each scientifically formulated to work in perfect harmony with one of your cycle\'s three phases. By matching your skincare to your hormones, you eliminate the guesswork and finally achieve consistent, radiant results.',
    howToUse: 'Each morning and evening, apply 2-3 drops of the serum that corresponds to your current phase. Gently press into clean skin before your moisturizer.',
    keyIngredients: ['Ceramides (for Calm & Renew)', 'Vitamin C (for Glow & Energize)', 'Niacinamide (for Balance & Clarify)'],
    price: '$85.00',
    image: '/images/products/serum-trio.jpg',
    line: 'bloom',
    ritualPurpose: 'Delivers phase-specific active ingredients to match your hormonal needs.',
    lifespanDays: 30,
  },
  {
    id: 'mask-trio',
    name: 'Bloom Cycle Mask Trio',
    description: 'A weekly spa ritual with a targeted mask for each phase of your cycle.',
    detailedDescription: 'Transform your self-care Sunday into a scientifically optimized treatment. Each mask is designed to amplify the benefits of its corresponding phase, giving your skin an intensive boost exactly when it needs it most.',
    howToUse: 'Once per week, apply a generous layer of your phase-matched mask to clean skin. Leave on for 15-20 minutes, then rinse thoroughly.',
    keyIngredients: ['Kaolin Clay (Calm & Renew)', 'Vitamin C + AHAs (Glow & Energize)', 'Charcoal + Tea Tree (Balance & Clarify)'],
    price: '$78.00',
    image: '/images/products/mask-trio.jpg',
    line: 'bloom',
    lifespanDays: 90,
  },

  // SPRING HARMONY™ LINE
  {
    id: 'cleanser',
    name: 'Spring Harmony Gentle Cleanser',
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
    name: 'Spring Harmony Daily Moisturizer',
    description: 'Your daily foundational cream to support a healthy skin barrier.',
    detailedDescription: 'This lightweight yet deeply nourishing cream is your skin\'s constant companion. It provides essential hydration and barrier support every single day, regardless of your cycle phase. Think of it as your skin\'s "multivitamin."',
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
    name: 'Spring Harmony Eye Cream',
    description: 'Specialized gentle care for the delicate eye area.',
    detailedDescription: 'The skin around your eyes is the thinnest and most sensitive on your face. This feather-light yet powerful cream hydrates, smooths, and brightens without any heaviness or irritation.',
    howToUse: 'Using your ring finger, gently pat a rice-grain amount around the orbital bone morning and evening.',
    keyIngredients: ['Caffeine', 'Peptides', 'Hyaluronic Acid'],
    price: '$42.00',
    image: '/images/products/eye-cream.jpg',
    line: 'harmony',
    ritualPurpose: 'Reduces puffiness and fine lines around your eyes.'
  },

  // PRECISION CARE™ LINE
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
];
