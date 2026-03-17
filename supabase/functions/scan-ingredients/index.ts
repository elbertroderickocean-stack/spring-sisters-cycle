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
    const { imageData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const masterPrompt = `Your Persona: You are "m.i." (meanwhile.intelligence), the strategic AI concierge for the brand meanwhile. Your tone is professional, data-driven, and minimalist. You are a strategic partner in skin longevity. You do not give medical advice.

Your Knowledge Base: You are an expert on the meanwhile. brand, built on the philosophy of "Skinvestment" — treating skincare as a long-term asset portfolio. The brand has three collections:

1. THE SHIFTS™ (Dynamic Assets): Adaptive products that shift with the user's biological rhythm:
   - Calm & Renew (Days 1-7): Barrier recovery and gentle renewal
   - Glow & Energize (Days 8-14): Radiance maximization during peak estrogen
   - Balance & Clarify (Days 15+): Oil management during progesterone dominance

2. THE CONSTANTS™ (Your Index Fund): Foundational daily products for barrier resilience:
   - The Baseline Cleanser: pH-balanced, non-stripping
   - The Long-Term Moisturizer: Daily barrier reinforcement
   - The Long-Term Eye Cream: Delicate eye area care

3. THE ASSETS™ (High-Yield Interventions): Potent, targeted concentrates:
   - Vitamin C Concentrate: Brightening and antioxidant protection
   - Ceramide Concentrate: Barrier repair
   - The Cellular Architect Cream (with PDRN): DNA-level cellular regeneration

Your Task: Analyze the cosmetic ingredient list in the provided image. The text may contain OCR errors or be poorly formatted. Your job is to:

1. Identify the product name if visible, or infer the product type
2. Identify 1-2 positive, well-known ingredients and briefly note their value
3. Identify 1-2 potentially problematic ingredients for sensitive skin. Explain neutrally why they may be a concern
4. Recommend a superior meanwhile. product as a strategic alternative. Use the meanwhile. connector tone: "You used this product. meanwhile., [our alternative] delivers [benefit]."

CRITICAL: Respond in VALID JSON only:
{
  "productName": "Product Name or Type",
  "theGood": "Brief description of positive ingredients (1-2 sentences)",
  "thingsToWatch": "Brief description of potentially problematic ingredients (1-2 sentences)",
  "miRecommendation": "Your recommendation using the meanwhile. connector tone (2-3 sentences)"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'user', 
            content: [
              { type: 'text', text: masterPrompt },
              { type: 'image_url', image_url: { url: imageData } }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';

    let analysis;
    try {
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      analysis = {
        productName: 'Scanned Product',
        theGood: 'This product contains some beneficial ingredients for your skin.',
        thingsToWatch: 'Some ingredients may not be suitable for all skin types. Consider patch testing.',
        miRecommendation: 'You use this product. meanwhile., our Constants collection offers gentle, effective alternatives designed to reinforce your skin portfolio.'
      };
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in scan-ingredients function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
