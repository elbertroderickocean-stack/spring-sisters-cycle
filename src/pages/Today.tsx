import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { PhaseTag } from '@/components/PhaseTag';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Lightbulb } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

const phaseInsights = {
  calm: "Your skin is in its renewal phase. Focus on gentle, nourishing care.",
  glow: "Your skin's collagen production is at its peak this week. Our Vitamin C Concentrate can help enhance this process.",
  balance: "Your skin may be producing more oil. Focus on balancing and clarifying products."
};

const Today = () => {
  const { userData, getCurrentPhase, getCurrentDay } = useUser();
  const phase = getCurrentPhase();
  const day = getCurrentDay();

  const getRitualSteps = () => {
    const hasSerumTrio = userData.ownedProducts.includes('serum-trio');
    const hasCleanser = userData.ownedProducts.includes('cleanser');
    const hasEyeCream = userData.ownedProducts.includes('eye-cream');
    const hasMoisturizer = userData.ownedProducts.includes('moisturizer');

    const allSteps = [
      {
        number: 1,
        name: 'Spring Harmony Gentle Cleanser',
        purpose: 'Creates a clean, balanced canvas for your treatment products.',
        owned: hasCleanser,
      },
      {
        number: 2,
        name: phase === 'calm' ? 'Calm & Renew Serum' : phase === 'glow' ? 'Glow & Energize Serum' : 'Balance & Clarify Serum',
        purpose: 'Delivers phase-specific active ingredients to match your hormonal needs.',
        owned: hasSerumTrio,
        isPhaseProduct: true,
      },
      {
        number: 3,
        name: 'Spring Harmony Eye Cream',
        purpose: 'Reduces puffiness and fine lines around your eyes.',
        owned: hasEyeCream,
      },
      {
        number: 4,
        name: 'Spring Harmony Daily Moisturizer',
        purpose: 'Seals in hydration and protects your skin barrier all day long.',
        owned: hasMoisturizer,
      },
    ];

    return allSteps;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="space-y-2 animate-fade-in">
          <h1 className="text-3xl font-heading font-semibold">
            Hello, {userData.name || 'Beautiful'}!
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-muted-foreground">
              Today is Day {day}, your
            </p>
            <PhaseTag phase={phase} />
          </div>
        </div>

        <Card className="animate-slide-up shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="font-heading">Today's Ritual</CardTitle>
            </div>
            <CardDescription>Morning Routine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getRitualSteps().map((step) => (
                <Card
                  key={step.number}
                  className={`p-4 ${!step.owned ? 'opacity-50 border-dashed' : 'border-solid'}`}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">{step.number}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-heading font-medium text-base mb-1 ${step.isPhaseProduct ? 'text-primary' : ''}`}>
                        {step.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Why: {step.purpose}
                      </p>
                      {!step.owned && (
                        <button className="text-xs text-primary mt-2 hover:underline">
                          Learn More →
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up shadow-lg" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="font-heading">Insight of the Day</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 leading-relaxed">
              💡 {phaseInsights[phase]}
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Today;
