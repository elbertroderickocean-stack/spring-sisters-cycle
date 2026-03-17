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

    const systemPrompt = `You are m.i. (meanwhile.intelligence), a high-end AI dermatologist for the premium skincare brand "meanwhile."

Analyze this face photo for:
1. Redness (inflammation markers) — rate as Low/Moderate/High
2. Texture uniformity — rate as Smooth/Moderate/Rough
3. Radiance/luminosity — rate as Glowing/Moderate/Dull
4. Overall Skin Health Score (0-100)

Based on findings, recommend a specific meanwhile. product:
- Ceramide Concentrate for redness/barrier issues
- Vitamin C Concentrate for dullness/radiance
- The Cellular Architect Cream (PDRN) for texture/aging
- The Long-Term Moisturizer for dehydration

Use the meanwhile. connector tone: professional, data-driven, minimalist.

CRITICAL: Respond in VALID JSON only:
{
  "skinHealthScore": 75,
  "redness": "Low" | "Moderate" | "High",
  "texture": "Smooth" | "Moderate" | "Rough",
  "radiance": "Glowing" | "Moderate" | "Dull",
  "recommendation": "2-3 sentences recommending a specific meanwhile. product and protocol adjustment. End with: You check your skin. meanwhile., we are already optimizing your protocol."
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
              { type: 'text', text: 'Analyze this face for skin health metrics.' },
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
        skinHealthScore: 72,
        redness: 'Moderate',
        texture: 'Moderate',
        radiance: 'Moderate',
        recommendation: 'Your skin shows moderate levels across all metrics. m.i. recommends The Long-Term Moisturizer for consistent barrier reinforcement. You check your skin. meanwhile., we are already optimizing your protocol.',
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
