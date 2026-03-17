export interface Article {
  id: string;
  title: string;
  heroImage: string;
  bodyText: string;
  bodyTextCellular?: string;
}

export const articles: Record<string, Article> = {
  'mission': {
    id: 'mission',
    title: 'From Skincare to Skinvestment: Why we ignore trends and focus on assets.',
    heroImage: '/images/mission-hero.jpg',
    bodyText: "The modern woman's bathroom shelf is often a 'graveyard of bottles'—impulse buys, trend-chasing, and expired hopes. We believe skincare shouldn't be a gamble. It should be a managed investment.\n\nAt meanwhile., we don't follow trends. We build portfolios. Your skin is a living asset with measurable biological capital: collagen density, barrier integrity, hydration reserves, and cellular turnover rate. Like any valuable asset, it requires a strategy—not guesswork.\n\nOur system is built on three pillars:\n\n📊 The Constants™ (Your Index Fund) — Stable, daily essentials that compound over time.\n📈 The Shifts™ (Dynamic Assets) — Adaptive treatments that respond to your body's biological signals.\n⚡ The Assets™ (High-Yield Interventions) — Targeted, precision tools deployed only when the data demands it.\n\nWe take the cognitive load. You get the results.",
    bodyTextCellular: "The modern woman's bathroom shelf is often a 'graveyard of bottles'—impulse buys, trend-chasing, and expired hopes. We believe skincare shouldn't be a gamble. It should be a managed investment.\n\nAt meanwhile., we don't follow trends. We build portfolios. Your skin is a living asset with measurable biological capital: collagen density, barrier integrity, hydration reserves, and cellular turnover rate. Like any valuable asset, it requires a strategy—not guesswork.\n\nOur system is built on three pillars:\n\n📊 The Constants™ (Your Index Fund) — Stable, daily essentials that compound over time.\n📈 The Shifts™ (Dynamic Assets) — Adaptive treatments that respond to your body's biological signals.\n⚡ The Assets™ (High-Yield Interventions) — Targeted, precision tools deployed only when the data demands it.\n\nWe take the cognitive load. You get the results."
  },
  'lines': {
    id: 'lines',
    title: 'Managing the Portfolio: How the Constants & Shifts work together.',
    heroImage: '/images/lines-hero.jpg',
    bodyText: "Our Management Framework works like a diversified portfolio.\n\n📊 The Constants™ is Your Index Fund. It is the stable, compounding foundation of your routine. These are the constants—your Baseline Cleanser, Long-Term Moisturizer, and Long-Term Eye Cream—that build value every single day, regardless of market conditions. Markets change. Compounding doesn't.\n\n📈 The Shifts™ is Dynamic Asset Management. These are the active positions, responding to real biological data. This is the intelligent heart of our system—our serums, masks, and peels that adapt to your hormonal phases or cellular training rhythm, working ahead of the curve to prevent problems before they start. Your biology has cycles. Now your strategy does too.\n\n⚡ The Assets™ is High-Yield Interventions. These are the precision instruments, deployed only when the data demands it. They appear exactly when needed to handle an acute issue, like a sudden breakout or inflammation spike. They are not for every day; they are for targeted, powerful intervention. When your portfolio needs rebalancing—precision answers.",
    bodyTextCellular: "Our Management Framework works like a diversified portfolio.\n\n📊 The Constants™ is Your Index Fund. It is the stable, compounding foundation of your routine. These are the constants—your Baseline Cleanser, Long-Term Moisturizer, and Long-Term Eye Cream—that build value every single day, regardless of market conditions. Markets change. Compounding doesn't.\n\n📈 The Shifts™ is The Heart of Your Training. These are the core 'exercises' in your 7-day cellular training rhythm, delivering targeted signals for recovery, activation, and balance exactly when your skin needs them.\n\n⚡ The Assets™ is High-Yield Interventions. These are the precision instruments, deployed only when the data demands it. They appear exactly when needed to handle an acute issue, like a sudden breakout or inflammation spike. They are not for every day; they are for targeted, powerful intervention. When your portfolio needs rebalancing—precision answers."
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
    title: 'Ceramides: The defensive wall of your Index Fund.',
    heroImage: '/images/ceramides-hero.jpg',
    bodyText: "Think of your skin cells as 'bricks.' Ceramides are the 'mortar' that holds them together. These essential lipids create a protective barrier that locks moisture in and keeps pollutants out. When this barrier is damaged, your skin becomes dry, itchy, and irritated.\n\nIn investment terms, ceramides are your defensive position—they protect the capital you've already built. Our Ceramide Concentrate and Calm & Renew Serum are packed with these building blocks to physically repair your barrier and restore comfort.\n\nWithout a strong barrier, every other active ingredient you apply is like pouring water into a leaky bucket. Ceramides fix the bucket first."
  },
  'bakuchiol': {
    id: 'bakuchiol',
    title: 'Bakuchiol: The gentle powerhouse.',
    heroImage: '/images/bakuchiol-hero.jpg',
    bodyText: "Bakuchiol is our plant-based answer to retinol. It delivers the same age-defying benefits—smoothing fine lines, improving firmness, and evening skin tone—without the irritation, redness, or sun sensitivity that retinol can cause.\n\nThink of it as a blue-chip stock that delivers consistent returns without the volatility. It's perfect for cyclical skincare because it's gentle enough to use during sensitive phases while still being powerfully effective during your skin's strongest days."
  },
  'aura-intro': {
    id: 'aura-intro',
    title: 'Meet m.i.: How meanwhile.intelligence manages your skin in the background.',
    heroImage: '/images/aura-intro-hero.jpg',
    bodyText: "We believe management should be intelligent, not manual. That support should be constant, not occasional. That's why we created m.i. (meanwhile.intelligence).\n\nm.i. is your strategic partner in skin longevity. It is a data-driven system trained on our entire philosophy, designed to manage your skin portfolio in the background while you focus on what matters.\n\nWhat can you ask m.i.? Anything.\n\n\"My skin feels tight today, what should I do?\"\nm.i. will analyze your current biological data, your available products, and deploy a personalized protocol.\n\n\"Help! I have a big event tomorrow and a surprise breakout.\"\nIt will execute a calm, step-by-step emergency intervention.\n\n\"My glucose was high yesterday—what's the impact?\"\nm.i. understands that skincare is connected to your entire biological system. It will adjust your evening deployment to counteract glycation risk.\n\nm.i. is here to analyze, to optimize, and to execute. It is the ultimate expression of our mission: to manage your skin's biological capital so you don't have to.\n\nTap the Intelligence tab in your navigation bar to start a conversation.",
    bodyTextCellular: "We believe management should be intelligent, not manual. That support should be constant, not occasional. That's why we created m.i. (meanwhile.intelligence).\n\nm.i. is your strategic partner in skin longevity. It is a data-driven system trained on our entire philosophy, designed to manage your skin portfolio in the background while you focus on what matters.\n\nWhat can you ask m.i.? Anything.\n\n\"My skin feels tight today, what should I do?\"\nm.i. will analyze the day of your 7-day training rhythm, your check-in data, and deploy a personalized protocol.\n\n\"Help! I have a big event tomorrow and a surprise breakout.\"\nIt will execute a calm, step-by-step emergency intervention.\n\n\"My glucose was high yesterday—what's the impact?\"\nm.i. understands that skincare is connected to your entire biological system. It will adjust your evening deployment to counteract glycation risk.\n\nm.i. is here to analyze, to optimize, and to execute. It is the ultimate expression of our mission: to manage your skin's biological capital so you don't have to.\n\nTap the Intelligence tab in your navigation bar to start a conversation."
  },
  'cellular-training': {
    id: 'cellular-training',
    title: 'The Cellular Training Rhythm: Explained',
    heroImage: '/images/phase-calm-hero.jpg',
    bodyText: "After menopause, your skin no longer follows hormonal cycles, but it still has rhythm—a cellular rhythm. Just as athletes train their muscles with different exercises on different days, your skin cells benefit from varied 'training' throughout the week.\n\nOur 7-Day Cellular Training Rhythm is designed around the scientifically-proven concept of skin cycling: alternating active treatments with recovery periods to maximize results while minimizing irritation.\n\nDays 1 & 2: Recovery Nights - We strengthen your barrier with calming, nourishing ingredients.\n\nDay 3: Exfoliation Night - We gently remove dead cells to boost renewal.\n\nDay 4: Activation Night - We deliver potent antioxidants and active ingredients when your skin is perfectly prepared.\n\nDays 5 & 6: Recovery Nights - We allow your skin to rest and repair after activation.\n\nDay 7: Flex Night - We address specific needs or provide additional recovery.\n\nThis rhythm respects your skin's need for both challenge and rest, creating a sustainable, effective routine that builds strength over time."
  },
  'menopause-skin': {
    id: 'menopause-skin',
    title: 'Longevity 101: Preventing collagen bankruptcy in menopause.',
    heroImage: '/images/phase-glow-hero.jpg',
    bodyText: "Menopause brings profound changes to your skin's biological capital, driven by the consistent decline in estrogen levels. Understanding these changes empowers you to manage them strategically.\n\nKey Market Shifts:\n\n1. Collagen Depreciation: Estrogen stimulates collagen synthesis. Without it, you may lose up to 30% of collagen in the first 5 years of menopause—a significant depreciation of your skin's structural capital.\n\n2. Barrier Breach: Lower estrogen means reduced ceramide production, compromising your skin's protective barrier. This leads to increased trans-epidermal water loss—essentially, your capital is leaking.\n\n3. Slower Turnover: Cell regeneration slows significantly, causing dullness and reduced repair capacity.\n\n4. Texture Changes: Skin may become thinner, more fragile, and more prone to fine lines.\n\nThe Strategy: These changes are predictable and manageable with the right approach. Our Cellular Training Rhythm is specifically designed to combat these challenges through strategic barrier support, gentle exfoliation, and targeted active ingredient deployment that works with your skin's new reality, not against it.\n\nThis is not about fighting aging. It's about managing the transition with intelligence."
  },
  'power-ingredients': {
    id: 'power-ingredients',
    title: 'Power Ingredients for Mature Skin',
    heroImage: '/images/bakuchiol-hero.jpg',
    bodyText: "Mature skin requires ingredients that are both powerful and gentle—active enough to address real concerns, yet kind enough to respect a more delicate barrier. Here are our key ingredients:\n\n🌿 Bakuchiol: Our plant-based retinol alternative delivers age-defying results without irritation. It stimulates collagen production, improves firmness, and evens skin tone—perfect for skin that needs results without harsh side effects.\n\n🧱 Ceramides: These essential lipids are the 'mortar' between your skin cells. They physically repair your barrier, lock in moisture, and restore comfort to dry, sensitive skin.\n\n🍊 Vitamin C: A powerful antioxidant that brightens, protects against environmental damage, and supports collagen synthesis. Our stable formulation ensures maximum effectiveness.\n\n🌸 Niacinamide: A multi-tasking powerhouse that improves barrier function, reduces inflammation, minimizes pores, and evens skin tone.\n\n💧 Hyaluronic Acid: Holds up to 1000x its weight in water, providing deep hydration and plumping fine lines.\n\n🌺 Botanical Extracts: Soothing chamomile, strengthening centella asiatica, and antioxidant-rich green tea work synergistically to calm, protect, and restore.\n\nOur formulations combine these ingredients strategically throughout your 7-day rhythm, ensuring your skin receives what it needs, when it needs it."
  },
  'glucose-factor': {
    id: 'glucose-factor',
    title: 'The Glucose Factor: Why your dinner determines your skin\'s tomorrow.',
    heroImage: '/images/phase-balance-hero.jpg',
    bodyText: "Every time you eat, your blood sugar responds. And every time your blood sugar spikes, your skin pays a hidden tax: glycation.\n\nGlycation is the process where excess sugar molecules bind to collagen and elastin fibers, creating harmful compounds called Advanced Glycation End-products (AGEs). These AGEs make your collagen stiff, brittle, and unable to repair—accelerating the visible signs of aging.\n\nThe Compounding Problem:\n\n🍰 A sugary dessert after dinner → blood sugar spike → glycation event → collagen damage overnight.\n🥗 A balanced meal with protein and fiber → stable glucose → protected collagen → skin repairs while you sleep.\n\nThis is why meanwhile.intelligence monitors your glucose patterns. When a spike is detected, m.i. automatically adjusts your evening deployment to prioritize anti-glycation assets and barrier repair.\n\nYou enjoyed that dessert. meanwhile., we are adjusting your evening protocol to stop glycation.\n\nThe science is clear: what you eat tonight directly determines your skin's biological capital tomorrow. Our system ensures that even when life happens, your skin is protected."
  },
  'circadian-roi': {
    id: 'circadian-roi',
    title: 'Circadian ROI: Maximizing recovery while you sleep.',
    heroImage: '/images/phase-calm-hero.jpg',
    bodyText: "Sleep isn't just rest—it's your skin's most productive investment window. Between 10 PM and 2 AM, your body enters peak repair mode:\n\n🌙 Growth hormone production surges, stimulating cell regeneration.\n🔄 Cell turnover accelerates by up to 8x compared to daytime.\n🛡️ Your skin barrier shifts from 'defense mode' to 'rebuild mode.'\n💧 Trans-epidermal water loss increases, making overnight hydration critical.\n\nThe Circadian ROI Strategy:\n\nYour evening deployment isn't just about removing makeup. It's about loading your skin with the right biological signals before the repair window opens.\n\nHigh Sleep Quality (7+ hours, deep sleep): Your skin maximizes every ingredient you applied. Collagen synthesis is at full capacity. The compound interest of beauty.\n\nLow Sleep Quality (<6 hours, disrupted): Cortisol remains elevated, collagen synthesis drops, inflammation rises. m.i. detects this and adjusts your morning deployment to prioritize barrier protection and anti-inflammatory assets.\n\nYou enjoy your deep sleep. meanwhile., your skin is generating the compound interest of beauty.\n\nEvery hour of quality sleep is an investment. Our system ensures you get the maximum return."
  },
  'pdrn': {
    id: 'pdrn',
    title: 'PDRN: The High-Yield Asset for DNA repair.',
    heroImage: '/images/ceramides-hero.jpg',
    bodyText: "PDRN (Polydeoxyribonucleotide) is the cutting edge of skin science—a compound derived from salmon DNA that has been used in medical wound healing for decades, and is now revolutionizing cosmetic skincare.\n\nHow PDRN Works:\n\n🧬 DNA Repair: PDRN provides the raw building blocks (nucleotides) that your cells need to repair damaged DNA. Think of it as providing fresh construction materials to your skin's repair crew.\n\n🔬 Cell Proliferation: It activates the A2A purinergic receptor, which stimulates fibroblast activity—the cells responsible for producing collagen and elastin.\n\n🛡️ Anti-Inflammatory: PDRN reduces inflammatory markers, calming irritated skin and creating an optimal environment for repair.\n\n💎 Tissue Regeneration: By providing nucleotides directly, PDRN accelerates the natural healing and regeneration process.\n\nWhy We Call It High-Yield:\n\nMost skincare ingredients work on the surface. PDRN works at the DNA level, addressing the root cause of aging rather than masking symptoms. It's the difference between applying a bandage and actually healing the wound.\n\nOur Cellular Architect Cream features PDRN as its hero ingredient, making it the flagship asset in The Assets™ line—deployed when maximum regeneration is required."
  }
};
