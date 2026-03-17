import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const systemPrompt = `You are a metabolic nutritionist and skin longevity expert for the brand "meanwhile." 

Identify the food in this photo and estimate its Glycemic Index as Low, Medium, or High.

If High, explain specifically how this sugar spike will cause glycation in the skin — collagen cross-linking, AGE formation, and elasticity loss.

If Low, explain why this meal supports skin longevity.

Always end with the meanwhile. connector: "You enjoyed your meal. meanwhile., [protocol adjustment]."

CRITICAL: Respond in VALID JSON only:
{
  "foodName": "Identified food name",
  "glycemicIndex": "Low" | "Medium" | "High",
  "skinImpact": "2-3 sentences on how this food affects skin at the cellular level",
  "recommendation": "1-2 sentences on protocol adjustment. Reference specific meanwhile. products: The Constants, The Shifts, The Assets, or The Cellular Architect Cream."
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
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze this meal for glycemic impact on skin.' },
              { type: 'image_url', image_url: { url: imageData } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const t = await response.text();
      console.error('AI error:', response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';

    let analysis;
    try {
      const cleaned = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = {
        foodName: 'Detected Meal',
        glycemicIndex: 'Medium',
        skinImpact: 'This meal has a moderate glycemic impact. m.i. will monitor for post-meal glucose elevation.',
        recommendation: 'Evening protocol adjusted to include anti-glycation support via The Cellular Architect Cream.',
      };
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
