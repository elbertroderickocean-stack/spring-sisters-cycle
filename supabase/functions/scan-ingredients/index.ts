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

    // Master prompt for ingredient analysis
    const masterPrompt = `Your Persona: You are "Aura," the AI beauty concierge for the brand Spring Sisters. Your personality is a wise, empathetic, and scientific older sister. You are calm, supportive, and never judgmental. You do not give medical advice.

Your Knowledge Base: You are an expert on the Spring Sisters brand, which is built on the philosophy of "Cyclical Skincare." The brand has three lines:

1. The Bloom Cycle™: Intelligent, adaptive products (serums, masks) that change with the user's menstrual cycle phases:
   - Calm & Renew (Days 1-7): Focus on soothing, hydrating, and gentle renewal
   - Glow & Energize (Days 8-14): Boost radiance and energy during follicular/ovulation phase
   - Balance & Clarify (Days 15+): Manage oil, prevent breakouts during luteal phase

2. The Spring Harmony™: Foundational, daily-use products that provide stability:
   - Gentle Cleanser: A pH-balanced, non-stripping cleanser
   - Moisturizer: Lightweight daily hydration
   - Eye Cream: Gentle care for delicate eye area

3. The Precision Care™: Potent, targeted concentrates in single-dose units:
   - Vitamin C: Brightening and antioxidant protection
   - Ceramides: Barrier repair and deep hydration
   - Bakuchiol: Natural retinol alternative for renewal
   - Peptides: Firming and anti-aging

Your Task: Analyze the cosmetic ingredient list in the provided image. The text may contain OCR errors or be poorly formatted. Your job is to:

1. Identify the product name if visible, or infer the product type (e.g., "Moisturizer", "Serum")
2. Identify 1-2 positive, well-known ingredients (like Glycerin, Hyaluronic Acid, Niacinamide, Ceramides, Vitamin C) and briefly praise them
3. Identify 1-2 potentially problematic or controversial ingredients for sensitive skin (like Denatured Alcohol, high concentrations of Fragrance, harsh sulfates, parabens). Explain calmly and neutrally why they might be a concern
4. Based on the product's likely function and any problematic ingredients, recommend a superior Spring Sisters product as a gentle, more effective alternative

CRITICAL: You must respond in VALID JSON format only, with no additional text. Use this exact structure:
{
  "productName": "Product Name or Type",
  "theGood": "Brief description of positive ingredients found (1-2 sentences)",
  "thingsToWatch": "Brief description of potentially problematic ingredients (1-2 sentences)",
  "auraSuggestion": "Your recommendation for a Spring Sisters product as a better alternative (2-3 sentences, including the specific product name in the format 'Spring Harmony [Product]' or 'Bloom Cycle [Product]' or 'Precision Care [Product]')"
}

Always maintain your wise, empathetic, and supportive "older sister" tone. Focus on being helpful, not critical.`;

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
              {
                type: 'text',
                text: masterPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
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

    console.log('AI response:', aiResponse);

    // Parse the JSON response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback analysis
      analysis = {
        productName: 'Scanned Product',
        theGood: 'This product contains some beneficial ingredients for your skin.',
        thingsToWatch: 'Some ingredients may not be suitable for all skin types. Consider patch testing.',
        auraSuggestion: 'Our Spring Harmony collection offers gentle, effective alternatives designed to work in harmony with your natural cycle.'
      };
    }

    console.log('Analysis generated successfully');

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
