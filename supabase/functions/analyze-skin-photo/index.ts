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
    const { imageData, userName, currentPhase, ageRange, skinType, primaryConcern, recentProducts } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing skin photo for user:', userName);

    // Step 1: Get objective metrics from AI vision analysis
    const analysisResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
                text: 'Analyze this facial skin photo and provide objective metrics. Count and measure the following skin characteristics:'
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
        tools: [
          {
            type: 'function',
            function: {
              name: 'report_skin_metrics',
              description: 'Report objective skin analysis metrics',
              parameters: {
                type: 'object',
                properties: {
                  red_spots_count: {
                    type: 'number',
                    description: 'Number of distinct red/pink spots visible (potential inflammation/acne)'
                  },
                  dark_spots_area: {
                    type: 'number',
                    description: 'Estimated total area percentage of darker spots (hyperpigmentation), scale 0-100'
                  },
                  texture_score: {
                    type: 'number',
                    description: 'Surface uniformity/texture score (0-100, where 100 is perfectly smooth and uniform)'
                  },
                  brightness_score: {
                    type: 'number',
                    description: 'Overall skin brightness/luminance score (0-100, where 100 is very bright/radiant)'
                  },
                  primary_observation: {
                    type: 'string',
                    description: 'Brief neutral observation about the most notable characteristic of the skin'
                  }
                },
                required: ['red_spots_count', 'dark_spots_area', 'texture_score', 'brightness_score', 'primary_observation'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'report_skin_metrics' } }
      })
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('AI analysis error:', analysisResponse.status, errorText);
      
      if (analysisResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'rate_limit' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (analysisResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'payment_required' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      throw new Error('AI analysis failed');
    }

    const analysisData = await analysisResponse.json();
    console.log('AI analysis response:', JSON.stringify(analysisData, null, 2));
    
    // Extract the metrics from tool call
    const toolCall = analysisData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No metrics returned from AI analysis');
    }
    
    const metrics = JSON.parse(toolCall.function.arguments);
    console.log('Extracted metrics:', metrics);

    // Step 2: Generate Aura's contextual interpretation with deep personalization
    const getAgeTone = () => {
      if (!ageRange) return '';
      if (ageRange.includes('18-24')) {
        return `**Age Context (<25):** Focus on education and habit-building. Prioritize interpreting redness data and managing breakouts. Use encouraging, foundational language.`;
      }
      if (ageRange.includes('25-34') || ageRange.includes('35-44')) {
        return `**Age Context (25-39):** Focus on prevention and targeted treatments. Give equal weight to redness, brightness, and early texture changes. Use proactive, empowering language.`;
      }
      return `**Age Context (40+):** Focus on nourishment, regeneration, and vitality. Prioritize texture uniformity and brightness data. Frame insights around health and radiance. Use nurturing, wisdom-focused language.`;
    };

    const getSkinTypeFocus = () => {
      if (!skinType) return '';
      if (skinType === 'Dry') {
        return `**Skin Type (Dry):** Frame texture analysis around barrier function and hydration. Recommend calming/nourishing products (Ceramide Concentrate, Overnight Mask).`;
      }
      if (skinType === 'Oily') {
        return `**Skin Type (Oily):** Link redness to potential pore congestion. Recommend balancing/clarifying products (Pore Refining, Balance & Clarify Serum).`;
      }
      if (skinType === 'Combination') {
        return `**Skin Type (Combination):** Address zone-specific needs. Balance hydration and clarity recommendations.`;
      }
      return `**Skin Type (Normal):** Focus on maintenance and preventive care.`;
    };

    const getConcernPriority = () => {
      if (!primaryConcern) return '';
      const concernMap: { [key: string]: string } = {
        'Breakouts': 'RED SPOTS COUNT and inflammation patterns',
        'Dullness': 'BRIGHTNESS SCORE and texture uniformity',
        'Fine Lines': 'TEXTURE SCORE and overall skin smoothness',
        'Hyperpigmentation': 'DARK SPOTS AREA and brightness consistency',
        'Sensitivity': 'RED SPOTS and overall skin reactivity'
      };
      const priority = concernMap[primaryConcern] || 'overall skin health';
      return `**PRIMARY LENS - User's #1 Concern (${primaryConcern}):** This is the dominant lens for your entire analysis. Center ALL observations, connections, and actions around the ${priority} metric(s). Frame everything in service of this goal.`;
    };

    const interpretationPrompt = `You are Aura, a wise and empathetic skincare guide for Spring Sisters. A user named ${userName || 'beautiful'} has just used Aura Vision to analyze their skin.

**CRITICAL: MULTI-LAYERED PERSONALIZATION**

${getConcernPriority()}

${getAgeTone()}

${getSkinTypeFocus()}

**User's Dynamic Context:**
- Current Cycle Phase: ${currentPhase}
- Recent Products Used: ${recentProducts || 'Spring Sisters core routine'}

**Objective Visual Metrics from AI Analysis:**
- Red spots (inflammation/acne): ${metrics.red_spots_count}
- Dark spots area (hyperpigmentation): ${metrics.dark_spots_area}%
- Texture uniformity score: ${metrics.texture_score}/100
- Brightness/radiance score: ${metrics.brightness_score}/100
- Primary observation: ${metrics.primary_observation}

**Your Analysis Formula: WHO + WHAT + NOW = Personalized Insight**

Create your response using this 3-part structure:

**Part 1: The Observation (Data-Informed & Concern-Focused)**
- Lead with the metric(s) most relevant to their PRIMARY CONCERN
- State clear findings from the visual analysis
- Use language appropriate for their age context
- Be specific with data points

**Part 2: The Connection (Context is Key)**
- Connect the visual data to their age, skin type, cycle phase, and products
- Explain WHY the skin is showing these patterns given WHO they are
- Reference ingredients/products suitable for their skin type
- Make them feel understood at a personal level

**Part 3: The Action (Personalized Goal)**
- ONE clear, achievable goal targeting their primary concern
- Tailor the recommendation to their age and skin type
- Be specific about what metric you're improving
- Suggest a concrete, actionable step

**Tone:** Match their age context. Always warm and intelligent. You're their wise older sister who truly knows them.

Write the complete Aura Vision insight now:`;

    const interpretationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: interpretationPrompt
          }
        ]
      })
    });

    if (!interpretationResponse.ok) {
      throw new Error('Failed to generate interpretation');
    }

    const interpretationData = await interpretationResponse.json();
    const auraInsight = interpretationData.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({
        metrics,
        auraInsight
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in analyze-skin-photo:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
