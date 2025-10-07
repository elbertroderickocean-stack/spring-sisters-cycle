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
    bodyText: "The modern woman's bathroom shelf is often a 'graveyard of bottles'—products bought on impulse that promised miracles but failed to deliver. She often blames herself, not realizing the problem isn't her skin, but an outdated, one-size-fits-all approach. Spring Sisters was born to replace this chaos with clarity. We provide an intuitive, effective system that works in harmony with your body's natural rhythm, giving you back control and confidence."
  },
  'lines': {
    id: 'lines',
    title: 'Our Three Lines: A Complete Ecosystem',
    heroImage: '/images/lines-hero.jpg',
    bodyText: "Our philosophy is built on three pillars. The Bloom Cycle™ Line is our intelligent core, the 'variables' that adapt to your cycle. The Spring Harmony™ Line is our reliable foundation, the 'constants' that support your skin every day. The Precision Care™ Line is our 'emergency toolkit,' the surgical instruments for solving specific, acute problems. Together, they form a complete, synergistic system for your skin's health."
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
