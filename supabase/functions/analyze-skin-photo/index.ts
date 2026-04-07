import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, userName, currentPhase, ageRange, skinType, primaryConcern, recentProducts, isPregnancy, trimester } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    console.log('Analyzing skin photo for user:', userName);

    // Step 1: Zone-by-zone analysis with detailed metrics
    const analysisResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            {
              type: 'text',
              text: `You are an expert dermatological AI. Analyze this facial skin photo with ZONE-BY-ZONE precision.

Analyze EACH facial zone separately:
1. FOREHEAD (T-zone upper): texture, oiliness, fine lines, acne
2. PERIORBITAL (under-eyes + crow's feet): dark circles, puffiness, fine lines, crepiness
3. NOSE (T-zone center): pores, blackheads, oiliness, redness
4. CHEEKS LEFT & RIGHT: texture uniformity, redness/rosacea, pigmentation, pores
5. CHIN & JAWLINE: hormonal acne, texture, definition
6. NASOLABIAL (smile lines): depth, hydration, elasticity

For EACH zone provide a score 0-100 and identify the PRIMARY concern.

Also provide OVERALL metrics across the entire face.`
            },
            { type: 'image_url', image_url: { url: imageData } }
          ]
        }],
        tools: [{
          type: 'function',
          function: {
            name: 'report_zone_analysis',
            description: 'Report detailed zone-by-zone skin analysis',
            parameters: {
              type: 'object',
              properties: {
                skin_capital_score: { type: 'number', description: 'Overall Skin Capital Score 0-100' },
                zones: {
                  type: 'object',
                  properties: {
                    forehead: {
                      type: 'object',
                      properties: {
                        score: { type: 'number', description: 'Zone health score 0-100' },
                        primary_concern: { type: 'string', description: 'Main issue: oiliness/acne/lines/texture/clear' },
                        hydration: { type: 'number', description: 'Hydration level 0-100' },
                        texture: { type: 'number', description: 'Texture smoothness 0-100' },
                        severity: { type: 'string', enum: ['none', 'mild', 'moderate', 'severe'] }
                      },
                      required: ['score', 'primary_concern', 'hydration', 'texture', 'severity']
                    },
                    periorbital: {
                      type: 'object',
                      properties: {
                        score: { type: 'number' },
                        primary_concern: { type: 'string', description: 'Main issue: dark_circles/puffiness/fine_lines/crepiness/clear' },
                        darkness: { type: 'number', description: 'Dark circle intensity 0-100 (0=none)' },
                        puffiness: { type: 'number', description: 'Puffiness level 0-100' },
                        severity: { type: 'string', enum: ['none', 'mild', 'moderate', 'severe'] }
                      },
                      required: ['score', 'primary_concern', 'darkness', 'puffiness', 'severity']
                    },
                    nose: {
                      type: 'object',
                      properties: {
                        score: { type: 'number' },
                        primary_concern: { type: 'string', description: 'Main issue: pores/blackheads/oiliness/redness/clear' },
                        pore_visibility: { type: 'number', description: 'Pore visibility 0-100' },
                        oiliness: { type: 'number', description: 'Oil level 0-100' },
                        severity: { type: 'string', enum: ['none', 'mild', 'moderate', 'severe'] }
                      },
                      required: ['score', 'primary_concern', 'pore_visibility', 'oiliness', 'severity']
                    },
                    cheeks: {
                      type: 'object',
                      properties: {
                        score: { type: 'number' },
                        primary_concern: { type: 'string', description: 'Main issue: redness/pigmentation/texture/pores/dehydration/clear' },
                        evenness: { type: 'number', description: 'Color evenness 0-100' },
                        redness: { type: 'number', description: 'Redness level 0-100 (0=none)' },
                        asymmetry: { type: 'string', description: 'left_worse/right_worse/symmetrical' },
                        severity: { type: 'string', enum: ['none', 'mild', 'moderate', 'severe'] }
                      },
                      required: ['score', 'primary_concern', 'evenness', 'redness', 'asymmetry', 'severity']
                    },
                    chin_jawline: {
                      type: 'object',
                      properties: {
                        score: { type: 'number' },
                        primary_concern: { type: 'string', description: 'Main issue: hormonal_acne/texture/sagging/clear' },
                        acne_count: { type: 'number', description: 'Number of visible blemishes' },
                        definition: { type: 'number', description: 'Jawline definition 0-100' },
                        severity: { type: 'string', enum: ['none', 'mild', 'moderate', 'severe'] }
                      },
                      required: ['score', 'primary_concern', 'acne_count', 'definition', 'severity']
                    },
                    nasolabial: {
                      type: 'object',
                      properties: {
                        score: { type: 'number' },
                        primary_concern: { type: 'string', description: 'Main issue: depth/dehydration/elasticity_loss/clear' },
                        depth: { type: 'number', description: 'Line depth 0-100 (0=invisible)' },
                        severity: { type: 'string', enum: ['none', 'mild', 'moderate', 'severe'] }
                      },
                      required: ['score', 'primary_concern', 'depth', 'severity']
                    }
                  },
                  required: ['forehead', 'periorbital', 'nose', 'cheeks', 'chin_jawline', 'nasolabial']
                },
                overall_metrics: {
                  type: 'object',
                  properties: {
                    hydration: { type: 'number', description: 'Overall hydration 0-100' },
                    barrier: { type: 'number', description: 'Barrier integrity 0-100' },
                    collagen: { type: 'number', description: 'Estimated collagen density 0-100' },
                    luminance: { type: 'number', description: 'Skin luminance/radiance 0-100' },
                    texture: { type: 'number', description: 'Overall texture uniformity 0-100' }
                  },
                  required: ['hydration', 'barrier', 'collagen', 'luminance', 'texture']
                },
                weak_zones: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of zone names with severity moderate or severe, sorted worst first'
                },
                primary_observation: { type: 'string', description: 'Key observation about the skin' }
              },
              required: ['skin_capital_score', 'zones', 'overall_metrics', 'weak_zones', 'primary_observation'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'report_zone_analysis' } }
      })
    });

    if (!analysisResponse.ok) {
      const status = analysisResponse.status;
      if (status === 429) return new Response(JSON.stringify({ error: 'rate_limit' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (status === 402) return new Response(JSON.stringify({ error: 'payment_required' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const errorText = await analysisResponse.text();
      console.error('AI analysis error:', status, errorText);
      throw new Error('AI analysis failed');
    }

    const analysisData = await analysisResponse.json();
    const toolCall = analysisData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error('No metrics returned from AI analysis');

    const metrics = JSON.parse(toolCall.function.arguments);
    console.log('Zone analysis:', JSON.stringify(metrics, null, 2));

    // Step 2: Generate personalized m.i. interpretation
    const interpretationPrompt = `You are m.i. (meanwhile.intelligence), a professional strategic partner in skin longevity.

**User Profile:** ${userName || 'Investor'}, Age: ${ageRange || 'unknown'}, Skin type: ${skinType || 'unknown'}, Primary concern: ${primaryConcern || 'general'}, Phase: ${currentPhase || 'unknown'}${isPregnancy ? `, Pregnancy Trimester ${trimester}` : ''}, Products: ${recentProducts || 'meanwhile. core'}

**ZONE-BY-ZONE ANALYSIS RESULTS:**
${JSON.stringify(metrics.zones, null, 2)}

**OVERALL METRICS:**
${JSON.stringify(metrics.overall_metrics, null, 2)}

**WEAK ZONES:** ${metrics.weak_zones.join(', ') || 'None detected'}
**SKIN CAPITAL SCORE:** ${metrics.skin_capital_score}/100

**YOUR TASK — Write a detailed dermatological report:**

1. **HEADLINE FINDING**: One powerful sentence about their skin's current state
2. **ZONE MAP**: For each weak zone, explain:
   - What you see (data-driven)
   - WHY it's happening (link to their age, phase, lifestyle)
   - What m.i. recommends for THIS zone specifically
3. **STRONG ZONES**: Acknowledge what's working well (positive reinforcement)
4. **CROSS-ZONE CONNECTIONS**: Connect patterns (e.g., T-zone oiliness + chin acne = hormonal pattern)
5. **PRIORITY ACTION**: ONE clear protocol adjustment targeting the weakest zone
6. **meanwhile. STRATEGIC INSERT**: Which specific meanwhile. product would have the highest impact on their weakest zone

End with the signature: "You focus on your [relevant activity]. meanwhile., m.i. protects your biological assets."

Tone: Professional, warm, data-rich. Like a world-class dermatologist who genuinely cares.`;

    const interpretationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: interpretationPrompt }]
      })
    });

    if (!interpretationResponse.ok) throw new Error('Failed to generate interpretation');

    const interpretationData = await interpretationResponse.json();
    const auraInsight = interpretationData.choices?.[0]?.message?.content;

    // Format backward-compatible response + new zone data
    const om = metrics.overall_metrics;
    return new Response(JSON.stringify({
      metrics: {
        red_spots_count: metrics.zones.chin_jawline.acne_count || 0,
        dark_spots_area: 100 - (metrics.zones.cheeks.evenness || 80),
        texture_score: om.texture,
        brightness_score: om.luminance,
        primary_observation: metrics.primary_observation,
      },
      zoneAnalysis: metrics.zones,
      overallMetrics: metrics.overall_metrics,
      weakZones: metrics.weak_zones,
      skinCapitalScore: metrics.skin_capital_score,
      auraInsight,
      // Backward compatible
      analysis: {
        skinCapitalScore: metrics.skin_capital_score,
        radiance: `${om.luminance}%`,
        hydration: `${om.hydration}%`,
        texture: `${om.texture}%`,
        recommendation: auraInsight,
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in analyze-skin-photo:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
