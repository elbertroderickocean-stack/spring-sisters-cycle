export interface Article {
  id: string;
  title: string;
  heroImage: string;
  bodyText: string;
}

export const articles: Record<string, Article> = {
  'mission': {
    id: 'mission',
    title: 'Our Mission: From Chaos to Harmony',
    heroImage: '/images/mission-hero.jpg',
    bodyText: "The modern woman's bathroom shelf is often a 'graveyard of bottles.' We believe beauty is not a fight against your cycles, but a dance in harmony with them. When you understand your rhythm, you stop blaming yourself and start understanding yourself. Our mission is to restore that harmony through knowledge, ritual, and a system that finally makes sense."
  },
  'lines': {
    id: 'lines',
    title: 'Our Ecosystem: The Sun, The Planets, and The Meteorites',
    heroImage: '/images/lines-hero.jpg',
    bodyText: "Our system works like an orbit.\n\n☀️ The Spring Harmony™ Line is The Sun. It is the stable, gravitational center of your routine. These are the constants—your cleanser, moisturizer, and eye cream—that provide balance and protection every single day, regardless of your cycle. Cycle changes. Harmony stays.\n\n🌙 The Bloom Cycle™ Line is The Planets. These are the variables, moving in predictable orbits. This is the intelligent heart of our system—our serums, masks, and peels that adapt to your hormonal phases, working ahead of the curve to prevent problems before they start. Your skin has phases. Now your care does too.\n\n⚡ The Precision Care™ Line is The Meteorites. These are the surgical tools, the instant problem-solvers. They appear exactly when needed to handle an acute issue, like a sudden breakout or irritation. They are not for every day; they are for targeted, powerful intervention. When your skin calls for help—precision answers."
  },
  'phase-calm': {
    id: 'phase-calm',
    title: 'Phase 1: The Art of Calm & Renew',
    heroImage: '/images/phase-calm-hero.jpg',
    bodyText: "During your period (Days 1-7), the hormones estrogen and progesterone are at their lowest levels. This can cause your skin's protective barrier to weaken, leading to dryness, sensitivity, and redness. Your skin is vulnerable and needs gentle care. Our goal during this phase is not to 'attack' problems, but to soothe, hydrate, and rebuild. Think of it as a comfort blanket for your skin."
  },
  'phase-glow': {
    id: 'phase-glow',
    title: 'Phase 2: The Art of Glow & Energize',
    heroImage: '/images/phase-glow-hero.jpg',
    bodyText: "During ovulation (Days 8-14), estrogen reaches its peak. Your skin is at its strongest, most resilient, and most radiant. Collagen production is optimized, and your complexion naturally glows. This is the perfect time to leverage your skin's power with active ingredients and treatments that deliver maximum results. Think of this phase as your skin's 'performance window.'"
  },
  'phase-balance': {
    id: 'phase-balance',
    title: 'Phase 3: The Art of Balance & Clarify',
    heroImage: '/images/phase-balance-hero.jpg',
    bodyText: "In the luteal phase (Days 15+), progesterone dominates. This hormone increases sebum production, which can lead to clogged pores, breakouts, and a heavier complexion. Your skin needs clarifying, balancing care to manage excess oil and prevent blemishes. Our goal is to keep your skin clear and balanced without stripping it."
  },
  'ceramides': {
    id: 'ceramides',
    title: 'Ingredient Spotlight: What are Ceramides?',
    heroImage: '/images/ceramides-hero.jpg',
    bodyText: "Think of your skin cells as 'bricks.' Ceramides are the 'mortar' that holds them together. These essential lipids create a protective barrier that locks moisture in and keeps pollutants out. When this barrier is damaged, your skin becomes dry, itchy, and irritated. Our Ceramide Concentrate and Calm & Renew Serum are packed with these building blocks to physically repair your barrier and restore comfort."
  },
  'bakuchiol': {
    id: 'bakuchiol',
    title: 'Ingredient Spotlight: Bakuchiol',
    heroImage: '/images/bakuchiol-hero.jpg',
    bodyText: "Bakuchiol is our gentle, plant-based answer to retinol. It delivers the same age-defying benefits—smoothing fine lines, improving firmness, and evening skin tone—without the irritation, redness, or sun sensitivity that retinol can cause. It's perfect for cyclical skincare because it's gentle enough to use during sensitive phases while still being powerfully effective during your skin's strongest days."
  }
};
