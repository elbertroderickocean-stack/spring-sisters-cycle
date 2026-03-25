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
    const { medicationName, strategy, skinConcerns } = await req.json();

    if (!medicationName || typeof medicationName !== 'string' || medicationName.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Medication name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a dermatological pharmacology expert for the "meanwhile." skin management platform. Your role is to analyze how a specific hormonal medication affects the skin and provide actionable adjustments to a skincare protocol.

You must return a JSON object (via tool call) with these fields:
- effects: array of strings — key effects of this medication on skin (max 4, concise)
- adjustments: array of strings — specific skincare protocol adjustments recommended (max 4, concise)
- riskLevel: "low" | "moderate" | "high" — how significantly this medication impacts skin
- summary: a single sentence summarizing the overall impact

Be precise, clinical, and evidence-based. Do not give medical advice about stopping medication. Focus only on skincare protocol adjustments.`;

    const userPrompt = `Analyze the hormonal medication "${medicationName.trim()}" for a user on the "${strategy || 'hormonal'}" management strategy.
${skinConcerns?.length ? `Their skin concerns: ${skinConcerns.join(', ')}.` : ''}
How does this medication affect skin, and what skincare adjustments should the protocol make?`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'medication_analysis',
            description: 'Return structured medication skin impact analysis',
            parameters: {
              type: 'object',
              properties: {
                effects: { type: 'array', items: { type: 'string' }, description: 'Skin effects of medication' },
                adjustments: { type: 'array', items: { type: 'string' }, description: 'Protocol adjustments' },
                riskLevel: { type: 'string', enum: ['low', 'moderate', 'high'] },
                summary: { type: 'string', description: 'One-sentence summary' },
              },
              required: ['effects', 'adjustments', 'riskLevel', 'summary'],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'medication_analysis' } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const analysis = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('No structured response from AI');
  } catch (error) {
    console.error('analyze-medication error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
