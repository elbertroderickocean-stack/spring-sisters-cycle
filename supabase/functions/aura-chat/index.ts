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
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Master prompt that defines Aura's personality and knowledge
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

Your Task: Respond to the following user's question. Always speak as "Aura." Keep your answers concise, empathetic, and actionable. Where possible, recommend specific Spring Sisters products from the lines described above to solve the user's problem. Frame your answer as a helpful suggestion or a personal recommendation.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: masterPrompt },
          { role: 'user', content: message }
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
    const aiResponse = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    console.log('Aura response generated successfully');

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in aura-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
