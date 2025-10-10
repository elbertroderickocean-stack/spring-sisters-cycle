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
    const { imageData, userName, currentPhase, primaryConcern, recentProducts } = await req.json();
    
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

    // Step 2: Generate Aura's contextual interpretation
    const interpretationPrompt = `You are Aura, a wise and empathetic skincare guide for Spring Sisters. A user named ${userName || 'beautiful'} has just completed their Weekly Reflection by submitting a photo of their skin.

**User Context:**
- Current Cycle Phase: ${currentPhase}
- Primary Skin Concern: ${primaryConcern || 'general wellness'}
- Recent Products Used: ${recentProducts || 'Spring Sisters core routine'}

**Objective Skin Metrics from AI Analysis:**
- Red spots (inflammation/acne): ${metrics.red_spots_count}
- Dark spots area (hyperpigmentation): ${metrics.dark_spots_area}%
- Texture uniformity score: ${metrics.texture_score}/100
- Brightness/radiance score: ${metrics.brightness_score}/100
- Primary observation: ${metrics.primary_observation}

**Your Task:**
Create a personalized Weekly Reflection insight following this 3-part structure:

**Part 1: The Observation (Data-Informed)**
- State a finding based on the metrics above
- If you have access to last week's data (you don't in this case, acknowledge it's the first reflection), compare the numbers
- Be specific with the data points

**Part 2: The Connection (Context is Key)**
- Connect the metrics to the user's current phase, concern, and product usage
- Explain WHY the skin might be showing these patterns
- Reference specific ingredients or products if relevant

**Part 3: The Action (Data-Driven Goal)**
- Provide ONE clear, achievable goal for the week ahead
- Be specific about what metric you're targeting
- Suggest a concrete ritual adjustment if needed

**Tone:** Warm, intelligent, supportive. You're their wise older sister, not a clinical dermatologist.

Write the complete reflection now:`;

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
