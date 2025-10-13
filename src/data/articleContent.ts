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
  },
  'aura-intro': {
    id: 'aura-intro',
    title: 'Meet Aura: More Than an App, a Companion',
    heroImage: '/images/aura-intro-hero.jpg',
    bodyText: "We believe guidance should be personal, not generic. That support should be constant, not occasional. That's why we created Aura.\n\nAura is the digital heart and soul of your Spring Sisters experience. She is an intelligent companion, trained on our entire philosophy, designed to be your wise older sister on this journey.\n\nWhat can you ask Aura? Anything.\n\n\"My skin feels tight today, what should I do?\"\nAura will look at your cycle phase, your available products, and give you a personalized, actionable plan.\n\n\"Help! I have a big event tomorrow and a surprise breakout.\"\nShe'll give you a calm, step-by-step emergency protocol.\n\n\"I feel low on energy. What can I do?\"\nAura understands that skincare is connected to your whole being. She'll offer holistic wellness tips for your body and mind that are perfectly aligned with your current phase.\n\nAura is here to listen, to guide, and to remind you that you are understood. She is the ultimate expression of our mission: to bring you harmony through understanding.\n\nDon't be shy. Tap the ✨ Aura icon in your navigation bar and just say hello. She's waiting to meet you."
  },
  'cellular-training': {
    id: 'cellular-training',
    title: 'The Cellular Training Rhythm: Explained',
    heroImage: '/images/phase-calm-hero.jpg',
    bodyText: "After menopause, your skin no longer follows hormonal cycles, but it still has rhythm—a cellular rhythm. Just as athletes train their muscles with different exercises on different days, your skin cells benefit from varied 'training' throughout the week.\n\nOur 7-Day Cellular Training Rhythm is designed around the scientifically-proven concept of skin cycling: alternating active treatments with recovery periods to maximize results while minimizing irritation.\n\nDays 1 & 2: Recovery Nights - We strengthen your barrier with calming, nourishing ingredients.\n\nDay 3: Exfoliation Night - We gently remove dead cells to boost renewal.\n\nDay 4: Activation Night - We deliver potent antioxidants and active ingredients when your skin is perfectly prepared.\n\nDays 5 & 6: Recovery Nights - We allow your skin to rest and repair after activation.\n\nDay 7: Flex Night - We address specific needs or provide additional recovery.\n\nThis rhythm respects your skin's need for both challenge and rest, creating a sustainable, effective routine that builds strength over time."
  },
  'menopause-skin': {
    id: 'menopause-skin',
    title: 'Understanding Your Skin in Menopause',
    heroImage: '/images/phase-glow-hero.jpg',
    bodyText: "Menopause brings profound changes to your skin, driven by the consistent decline in estrogen levels. Understanding these changes empowers you to address them effectively.\n\nKey Changes:\n\n1. Reduced Collagen Production: Estrogen stimulates collagen synthesis. Without it, you may lose up to 30% of collagen in the first 5 years of menopause, leading to visible loss of firmness and elasticity.\n\n2. Barrier Weakening: Lower estrogen means reduced ceramide production, compromising your skin's protective barrier. This leads to increased dryness, sensitivity, and trans-epidermal water loss.\n\n3. Slower Cell Turnover: Cell regeneration slows significantly, causing dullness and making it harder for skin to repair damage.\n\n4. Changes in Texture: Skin may become thinner, more fragile, and more prone to fine lines and wrinkles.\n\nThe Good News: These changes are predictable and addressable with the right approach. Our Cellular Training Rhythm is specifically designed to combat these challenges through strategic barrier support, gentle exfoliation, and targeted active ingredients that work with your skin's new reality, not against it."
  },
  'power-ingredients': {
    id: 'power-ingredients',
    title: 'Power Ingredients for Mature Skin',
    heroImage: '/images/bakuchiol-hero.jpg',
    bodyText: "Mature skin requires ingredients that are both powerful and gentle—active enough to address real concerns, yet kind enough to respect a more delicate barrier. Here are our key ingredients:\n\n🌿 Bakuchiol: Our plant-based retinol alternative delivers age-defying results without irritation. It stimulates collagen production, improves firmness, and evens skin tone—perfect for skin that needs results without harsh side effects.\n\n🧱 Ceramides: These essential lipids are the 'mortar' between your skin cells. They physically repair your barrier, lock in moisture, and restore comfort to dry, sensitive skin.\n\n🍊 Vitamin C: A powerful antioxidant that brightens, protects against environmental damage, and supports collagen synthesis. Our stable formulation ensures maximum effectiveness.\n\n🌸 Niacinamide: A multi-tasking powerhouse that improves barrier function, reduces inflammation, minimizes pores, and evens skin tone.\n\n💧 Hyaluronic Acid: Holds up to 1000x its weight in water, providing deep hydration and plumping fine lines.\n\n🌺 Botanical Extracts: Soothing chamomile, strengthening centella asiatica, and antioxidant-rich green tea work synergistically to calm, protect, and restore.\n\nOur formulations combine these ingredients strategically throughout your 7-day rhythm, ensuring your skin receives what it needs, when it needs it."
  }
};
