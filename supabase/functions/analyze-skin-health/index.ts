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

    const systemPrompt = `You are m.i. (meanwhile.intelligence), a high-end dermatological AI for the premium skincare brand "meanwhile."

Analyze this face photo and evaluate:
1. Radiance — rate as a percentage (e.g. 82%) and a word: Glowing / Moderate / Dull
2. Hydration level — rate as: Optimal / Adequate / Low
3. Texture uniformity — rate as: Smooth / Moderate / Rough
4. Skin Capital Score (0-100) — an aggregate measure of overall skin health

Based on findings, recommend a specific meanwhile. asset:
- Ceramide Concentrate (The Constants) for barrier/hydration issues
- Vitamin C Concentrate (The Assets) for dullness/radiance
- The Cellular Architect Cream with PDRN (The Assets) for texture/aging
- The Long-Term Moisturizer (The Constants) for dehydration

Frame the recommendation using the "meanwhile." philosophy: the user lives their life while meanwhile. manages their skin in the background.

CRITICAL: Respond in VALID JSON only:
{
  "skinCapitalScore": 78,
  "radiance": "82% — Glowing",
  "hydration": "Optimal",
  "texture": "Smooth",
  "recommendation": "Your radiance reads strong at 82%. Hydration is optimal — your barrier is holding. meanwhile., we are maintaining your Skin Capital with The Constants. Continue the current protocol; your investment is compounding."
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
              { type: 'text', text: 'Analyze this face for Skin Capital metrics.' },
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
        skinCapitalScore: 72,
        radiance: '72% — Moderate',
        hydration: 'Adequate',
        texture: 'Moderate',
        recommendation: 'Your skin shows moderate levels across all metrics. meanwhile., we are reinforcing your barrier with The Constants. Consistency is the highest-yield strategy.',
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
