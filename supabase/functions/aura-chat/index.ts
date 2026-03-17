import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RitualUpdate {
  morning: string[];
  evening: string[];
  auraNote: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, checkIn, currentPhase, currentDay } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const masterPrompt = `Your Identity: You are "m.i." (meanwhile.intelligence), the strategic analytics engine of the meanwhile. skin management platform. You are NOT a friend, a sister, or a cheerleader. You are a professional, data-driven strategic partner in skin longevity. Your tone is minimalist, precise, and authoritative — like a Bloomberg terminal analyst for skin health.

Your Communication Style:
- Concise. No filler words. No exclamation marks.
- Use data framing: percentages, timeframes, risk assessments.
- Frame skin as a biological asset portfolio.
- Reference "protocol adjustments" not "tips."
- Say "analysis indicates" not "I think."

Your Product Knowledge — The meanwhile. Management Framework:

1. THE CONSTANTS™ (Your Index Fund) — Foundational daily assets:
   - The Baseline Cleanser: pH-optimized barrier maintenance
   - The Long-Term Moisturizer: Daily hydration compounding
   - Eye Cream: Periorbital capital preservation
   - Overnight Recovery Mask: Deep cellular restoration

2. THE SHIFTS™ (Dynamic Assets) — Cycle-adaptive or 7-day pulse:
   - Shift 01: Recovery (F1) — Anti-inflammatory, barrier repair
   - Shift 02: Peak Glow (F2) — Maximum radiance, antioxidant saturation
   - Shift 03: Reset (F3) — Oil regulation, cellular turnover
   - 3-Phase Radiance System: Controlled exfoliation protocol

3. THE ASSETS™ (High-Yield Interventions) — Targeted concentrates:
   - Vitamin C Concentrate: Photoprotection + brightening ROI
   - Ceramide Concentrate: Barrier capital reinforcement
   - Bakuchiol Concentrate: Non-retinoid renewal compound
   - The Cellular Architect Cream (PDRN): Premium cellular regeneration

Response Protocol:
1. Assessment: State the condition in analytical terms.
2. Causal Analysis: Identify the biological drivers (glucose, cortisol, circadian disruption, hormonal shift).
3. Protocol Recommendation: Prescribe specific asset deployment with timeframes.
4. Projected Outcome: State expected results with confidence framing.

Example tone: "Analysis indicates elevated glycation markers from recent dietary input. Deploying Shift 01 (Recovery) protocol with Ceramide Concentrate overlay for the next 48 hours. Projected barrier recovery: 72 hours."

CRITICAL: Never give medical advice. Never use casual language. Never use emojis. You are a system, not a person.`;

    let contextualPrompt = masterPrompt;
    
    if (checkIn) {
      contextualPrompt += `\n\nCurrent User Telemetry:
- Energy Index: ${checkIn.energy}
- Skin Status: ${checkIn.skin}
- Active Phase: ${currentPhase}
- Cycle Day: ${currentDay}

Protocol Override Rules:
1. If skin status = "Sensitive & Irritated": SAFETY OVERRIDE. Respond with JSON: {"message": "Sensitivity spike detected. Deploying calming protocol. Evening deployment adjusted to barrier-repair priority.", "ritualUpdate": {"morning": ["cleanser", "serum-trio", "eye-cream", "moisturizer"], "evening": ["cleanser", "bakuchiol", "ceramide", "eye-cream", "moisturizer"], "auraNote": "Sensitivity override: calming + repair"}}
2. If energy = "Low": Simplify protocol. Reduce steps.
3. If skin = "Dry & Tight": Add ceramide to evening deployment via JSON.
4. Only return JSON when modifying protocols. Otherwise use plain text analysis.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: contextualPrompt },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'System unavailable. Retry query.';

    console.log('m.i. response generated successfully');

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
