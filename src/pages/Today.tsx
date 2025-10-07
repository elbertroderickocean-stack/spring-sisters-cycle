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

  const getRitual = () => {
    const hasSerumTrio = userData.ownedProducts.includes('serum-trio');
    const hasCleanser = userData.ownedProducts.includes('cleanser');
    const hasEyeCream = userData.ownedProducts.includes('eye-cream');
    const hasMoisturizer = userData.ownedProducts.includes('moisturizer');

    const steps = [];
    if (hasCleanser) steps.push('Gentle Cleanser');
    
    if (hasSerumTrio) {
      const phaseSerum = {
        calm: '💙 Calm & Renew Serum',
        glow: '✨ Glow & Energize Serum',
        balance: '🌿 Balance & Clarify Serum'
      };
      steps.push(phaseSerum[phase]);
    }
    
    if (hasEyeCream) steps.push('Eye Cream');
    if (hasMoisturizer) steps.push('Daily Moisturizer');

    return steps.length > 0 ? steps : ['Start building your collection to see personalized rituals!'];
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
            <ol className="space-y-3">
              {getRitual().map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="font-semibold text-primary min-w-[24px]">
                    {index + 1}.
                  </span>
                  <span className="text-foreground/90">{step}</span>
                </li>
              ))}
            </ol>
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
