import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { shelfProducts, phase, day, cycleLength, isPregnancy, trimester, wiseBloomMode, environmentData, healthData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const routinePrompt = `You are m.i. (meanwhile.intelligence), the strategic AI skincare concierge. Your task is to build the OPTIMAL morning and evening routine from the user's actual product shelf, factoring in all available data signals.

## USER'S PRODUCT SHELF:
${JSON.stringify(shelfProducts, null, 2)}

## BIOLOGICAL CONTEXT:
- Life stage: ${isPregnancy ? `Pregnancy, Trimester ${trimester}` : wiseBloomMode ? 'Post-menopause (Wise Bloom mode)' : `Active cycle, Phase: ${phase}, Day ${day}/${cycleLength}`}
${isPregnancy ? '- CRITICAL: Exclude ALL pregnancy-unsafe ingredients (retinoids, salicylic acid >2%, hydroquinone, chemical sunscreens)' : ''}

## ENVIRONMENTAL DATA:
${environmentData ? JSON.stringify(environmentData, null, 2) : 'Not available — use defaults for temperate climate'}

## HEALTH SIGNALS:
${healthData ? JSON.stringify(healthData, null, 2) : 'Not available — use balanced defaults'}

## RULES:

### Product Order (always follow):
1. Cleanser (water-based first)
2. Toner/Essence
3. Serum/Treatment (thinnest texture first)
4. Eye Cream
5. Moisturizer
6. Sunscreen (AM only)
7. Oil (PM only, if applicable)

### Conflict Rules — NEVER combine in same routine:
- Retinol + AHA/BHA
- Retinol + Vitamin C (use Vit C in AM, Retinol in PM)
- Retinol + Benzoyl Peroxide
- AHA + Vitamin C at same pH
- Multiple strong acids

### Synergy Rules — Pair when possible:
- Hyaluronic Acid + Ceramides
- Vitamin C + Vitamin E + Ferulic Acid
- Niacinamide + Zinc
- Peptides + Ceramides
- Centella + Panthenol

### Environmental Adaptations:
- High humidity (>70%): lighter textures, skip heavy occlusives
- Low humidity (<30%): extra hyaluronic acid, more ceramides
- High UV (>6): mandatory SPF, extra antioxidants AM
- Cold (<5°C): barrier-focused, richer textures
- Hot (>30°C): mattifying, lighter formulas
- Pollution high: extra antioxidants, double cleanse PM

### Stress/Sleep Adaptations:
- High stress: prioritize calming ingredients (centella, allantoin, chamomile)
- Poor sleep (<6h): extra antioxidants AM, heavy repair PM
- High cortisol: anti-inflammatory focus

### Nutrition Adaptations:
- High sugar/glycation risk: anti-glycation actives (carnosine), extra vitamin C
- Dehydration signals: hyaluronic acid priority, internal hydration reminder
- High salt: de-puffing focus AM

### Phase-Specific Focus:
- Calm (Days 1-7): Barrier repair, gentle, calming
- Glow (Days 8-14): Brightening, collagen boost, radiance
- Balance (Days 15+): Oil control, clarifying, anti-inflammation
- Pregnancy T1: Ultra-gentle, nausea-friendly (fragrance-free)
- Pregnancy T2: Pigmentation defense, elasticity
- Pregnancy T3: Deep hydration, stretch prevention
- Wise Bloom: Barrier-first, gentle actives, moisture retention

### MANDATORY — meanwhile. Integration:
Even if the user owns NO meanwhile. products, include ONE "Strategic Upgrade" suggestion per routine — a ghosted meanwhile. product that would fill the biggest gap or enhance the routine most. Use the connector tone: "You [action]. meanwhile., [product] would [benefit]."

meanwhile. Product Catalog:
- The Baseline Cleanser (cleanser): pH-balanced, barrier-safe
- The Long-Term Moisturizer (moisturizer): Ceramide-rich barrier reinforcement
- The Long-Term Eye Cream (eye_cream): Peptide-enriched eye care
- Calm & Renew Serum (serum): Centella, ceramides — Days 1-7
- Glow & Energize Serum (serum): Vitamin C, brightening — Days 8-14
- Balance & Clarify Serum (serum): Niacinamide, zinc — Days 15+
- Vitamin C Concentrate (serum): L-ascorbic acid, antioxidant
- Ceramide Concentrate (serum): Triple ceramide complex
- The Cellular Architect Cream (moisturizer): PDRN cellular regeneration

CRITICAL: Respond ONLY in valid JSON:
{
  "morning": {
    "steps": [
      {
        "order": 1,
        "productId": "product UUID or null for wellness/meanwhile suggestion",
        "productName": "Product name",
        "brand": "Brand name or 'meanwhile.'",
        "category": "cleanser/serum/etc",
        "purpose": "Why this product at this step",
        "waitTime": "seconds to wait before next step (0 if none)",
        "isMeanwhile": true/false,
        "isGhosted": false,
        "applicationTip": "Brief how-to"
      }
    ],
    "strategicUpgrade": {
      "meanwhileProduct": "Product name",
      "reason": "Why this upgrade matters"
    }
  },
  "evening": {
    "steps": [...same format...],
    "strategicUpgrade": {...}
  },
  "dailyInsight": "One-sentence personalized insight connecting data to skin strategy",
  "conflictsDetected": [
    {"products": ["A", "B"], "resolution": "How we resolved it in the routine"}
  ],
  "adaptations": ["List of adaptations made based on environmental/health data"]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: routinePrompt }],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (status === 402) return new Response(JSON.stringify({ error: 'Payment required' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';
    const cleaned = aiResponse.replace(/```json\n?|\n?```/g, '').trim();

    try {
      const routine = JSON.parse(cleaned);
      return new Response(JSON.stringify({ routine }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
      console.error('Failed to parse routine:', aiResponse);
      return new Response(JSON.stringify({ error: 'Failed to build routine. Please try again.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in build-routine:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
