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
    const { frontImage, backImage, step, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');
    const langDirective = language === 'ru'
      ? '\n\nIMPORTANT: All free-text JSON string values (frontClaims, theGood, thingsToWatch, miRecommendation, conflict reasons, synergy benefits, pregnancy risks, ingredient functions) must be in Russian (русский язык). Keep brand names, product names, INCI ingredient names, "meanwhile.", "m.i.", category enum values (cleanser/toner/serum/etc.), severity values (high/medium/low), confidence values, and pH profile enum values in English.'
      : '';

    if (step === 'identify') {
      // Step 1: Identify product from front photo
      const identifyPrompt = `You are an expert cosmetic product identifier. Analyze this photo of a cosmetic product's front/label side.${langDirective}

YOUR TASK:
1. Identify the BRAND name exactly as written on the packaging
2. Identify the exact PRODUCT NAME
3. Determine the product CATEGORY from this list: cleanser, toner, serum, moisturizer, eye_cream, sunscreen, mask, exfoliant, oil, treatment, other
4. If you can see any claims or key ingredients on the front, note them

KNOWN COSMETIC BRANDS (but not limited to):
La Roche-Posay, CeraVe, The Ordinary, Drunk Elephant, Tatcha, SK-II, Estée Lauder, Clinique, Lancôme, Chanel, Dior, NARS, Charlotte Tilbury, Glossier, Paula's Choice, Sunday Riley, Kiehl's, Origins, Fresh, Laneige, Innisfree, Cosrx, Some By Mi, Bioderma, Avène, Vichy, Eucerin, Neutrogena, Olay, L'Oréal, Garnier, Nivea, Shiseido, Sulwhasoo, Amorepacific, Dr. Jart+, Caudalie, Sisley, La Mer, Augustinus Bader, iS Clinical, SkinCeuticals, Obagi, ZO Skin Health, Murad, Peter Thomas Roth, Ole Henriksen, First Aid Beauty, Supergoop, EltaMD, Dermalogica, Clarins, Biossance, Herbivore, Youth To The People, Fenty Skin, Rare Beauty, Rhode, Summer Fridays, Tower 28, Glow Recipe, Versed, The Inkey List, Good Molecules, Naturium, Byoma, e.l.f., NYX, Maybelline, Revlon, MAC, Bobbi Brown, Tom Ford Beauty, Guerlain, Givenchy, YSL Beauty, Armani Beauty, Prada Beauty, Valentino Beauty, Burberry Beauty, Hermès Beauty

CRITICAL: Respond ONLY in valid JSON:
{
  "brand": "Exact brand name",
  "productName": "Exact product name",
  "category": "one of: cleanser/toner/serum/moisturizer/eye_cream/sunscreen/mask/exfoliant/oil/treatment/other",
  "frontClaims": "Any visible claims or key ingredients from front label",
  "confidence": "high/medium/low",
  "needsBackPhoto": true
}`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: identifyPrompt },
              { type: 'image_url', image_url: { url: frontImage } }
            ]
          }],
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
        const result = JSON.parse(cleaned);
        return new Response(JSON.stringify({ identification: result }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch {
        return new Response(JSON.stringify({ identification: { brand: 'Unknown', productName: 'Unknown Product', category: 'other', confidence: 'low', needsBackPhoto: true } }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (step === 'analyze') {
      // Step 2: Parse INCI from back photo + full analysis
      const analyzePrompt = `You are "m.i." (meanwhile.intelligence), an expert cosmetic chemist and INCI parser.

CONTEXT: The user has identified this product. Now analyze the ingredient list from the back of the packaging.

YOUR TASK:
1. Read and parse the COMPLETE INCI ingredient list from the photo using OCR
2. Identify ALL active ingredients and their functions
3. Flag any ingredient conflicts (ingredients that should NOT be combined with others)
4. Flag any ingredients unsafe during pregnancy: retinol, retinoids, retinyl palmitate, salicylic acid (>2%), hydroquinone, formaldehyde, phthalates, oxybenzone, chemical sunscreens, high-dose vitamin A
5. Identify synergies with other common ingredients
6. Determine the pH profile if possible
7. Recommend the best meanwhile. alternative

KNOWN INGREDIENT CONFLICTS:
- Retinol + AHA/BHA (irritation risk)
- Retinol + Vitamin C (pH conflict, use at different times)
- Retinol + Benzoyl Peroxide (deactivation)
- AHA/BHA + Vitamin C (over-exfoliation at low pH)
- Niacinamide + Vitamin C (debated, separate by 15 min)
- Multiple acids together (barrier damage)

KNOWN SYNERGIES:
- Hyaluronic Acid + Ceramides (hydration + barrier)
- Vitamin C + Vitamin E + Ferulic Acid (Skinceuticals triangle)
- Niacinamide + Zinc (oil control)
- Peptides + Ceramides (repair)
- Centella + Panthenol (calming)

meanwhile. PRODUCT CATALOG for recommendations:
- The Baseline Cleanser: pH-balanced, barrier-safe (cleanser)
- The Long-Term Moisturizer: Ceramide-rich barrier reinforcement (moisturizer)
- The Long-Term Eye Cream: Peptide-enriched eye care (eye_cream)
- Calm & Renew Serum: Centella, ceramides, gentle renewal (serum - days 1-7)
- Glow & Energize Serum: Vitamin C derivatives, brightening (serum - days 8-14)
- Balance & Clarify Serum: Niacinamide, zinc, oil control (serum - days 15+)
- Vitamin C Concentrate: L-ascorbic acid, antioxidant (serum)
- Ceramide Concentrate: Triple ceramide complex, barrier repair (serum)
- The Cellular Architect Cream: PDRN, cellular regeneration (moisturizer)

CRITICAL: Respond ONLY in valid JSON:
{
  "inci_full": "Complete INCI list as parsed from photo",
  "key_actives": [
    {"name": "Ingredient Name", "function": "What it does", "concentration": "if visible", "category": "humectant/emollient/active/preservative/etc"}
  ],
  "conflicts": [
    {"ingredient": "Name", "conflictsWith": "Other ingredient", "reason": "Why", "severity": "high/medium/low"}
  ],
  "synergies": [
    {"ingredients": ["A", "B"], "benefit": "What they do together"}
  ],
  "pregnancy_flags": [
    {"ingredient": "Name", "risk": "Why it's risky", "severity": "high/medium"}
  ],
  "ph_profile": "acidic/neutral/alkaline/unknown",
  "pregnancy_safe": true/false,
  "theGood": "1-2 sentences about positive ingredients",
  "thingsToWatch": "1-2 sentences about concerns",
  "miRecommendation": "meanwhile. alternative recommendation using the connector tone: You used X. meanwhile., [our product] delivers [benefit].",
  "overallScore": 1-10
}`;

      const messages: any[] = [{
        role: 'user',
        content: [
          { type: 'text', text: analyzePrompt },
          { type: 'image_url', image_url: { url: backImage } }
        ]
      }];

      // If front image is also provided, include it for context
      if (frontImage) {
        messages[0].content.splice(1, 0, { type: 'image_url', image_url: { url: frontImage } });
      }

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages,
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
        const analysis = JSON.parse(cleaned);
        return new Response(JSON.stringify({ analysis }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch {
        console.error('Failed to parse analysis:', aiResponse);
        return new Response(JSON.stringify({ 
          analysis: {
            inci_full: '',
            key_actives: [],
            conflicts: [],
            synergies: [],
            pregnancy_flags: [],
            ph_profile: 'unknown',
            pregnancy_safe: true,
            theGood: 'Unable to fully parse ingredients. Please try again with a clearer photo.',
            thingsToWatch: 'Ensure the ingredient list is fully visible and well-lit.',
            miRecommendation: 'You use this product. meanwhile., our Constants collection offers gentle, effective alternatives designed to reinforce your skin portfolio.',
            overallScore: 5
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Invalid step. Use "identify" or "analyze".' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in scan-product-identify:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
