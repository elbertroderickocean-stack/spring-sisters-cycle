import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { PhaseTag } from '@/components/PhaseTag';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Lightbulb, Star } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

const phaseInsights = {
  calm: "Your skin is in its renewal phase. Focus on gentle, nourishing care.",
  glow: "Your skin's collagen production is at its peak this week. Our Vitamin C Concentrate can help enhance this process.",
  balance: "Your skin may be producing more oil. Focus on balancing and clarifying products."
};

const Today = () => {
  const { userData, getCurrentPhase, getCurrentDay } = useUser();
  const navigate = useNavigate();
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

  const getSmartSuggestion = () => {
    const hasSerumTrio = userData.ownedProducts.includes('serum-trio');
    const hasCleanser = userData.ownedProducts.includes('cleanser');
    const hasMoisturizer = userData.ownedProducts.includes('moisturizer');
    const hasEyeCream = userData.ownedProducts.includes('eye-cream');
    const hasMaskTrio = userData.ownedProducts.includes('mask-trio');
    
    // PRIORITY 1: If user doesn't have Serum Trio
    if (!hasSerumTrio) {
      let message = "Ready to unlock the full potential of cycle-synced skincare? Our Bloom Cycle Serum Trio is the intelligent core of our entire system.";
      
      if (hasCleanser && !hasMoisturizer && !hasEyeCream) {
        message = "You've created the perfect canvas. Ready to start painting? Our Bloom Cycle Serum Trio is the set of 'smart paints' that adapts to your skin every day.";
      } else if (hasMoisturizer && !hasCleanser && !hasEyeCream) {
        message = "You have the perfect shield. Now let's put a powerful weapon underneath it. Our Bloom Cycle Serum Trio is the intelligent core of our entire system.";
      } else if (hasEyeCream && !hasCleanser && !hasMoisturizer) {
        message = "You've mastered care for the most delicate area. Now let's apply that same intelligent approach to your entire face with our Bloom Cycle Serum Trio.";
      }
      
      return {
        title: "Complete Your System",
        message,
        buttonText: "Discover the Serum Trio",
        action: () => navigate('/product/serum-trio')
      };
    }
    
    // PRIORITY 2: If user has Serum Trio but missing Cleanser OR Moisturizer
    if (hasSerumTrio && (!hasCleanser || !hasMoisturizer)) {
      if (!hasCleanser) {
        return {
          title: "Perfect Your Ritual",
          message: "Your serums work best on a perfectly prepared canvas. Our Spring Harmony Gentle Cleanser ensures your skin is ready to absorb 100% of the active ingredients.",
          buttonText: "Complete Your Ritual",
          action: () => navigate('/product/cleanser')
        };
      }
      if (!hasMoisturizer) {
        return {
          title: "Seal the Magic",
          message: "Don't let the magic evaporate! 'Sealing' your serum with our Spring Harmony Daily Moisturizer is the final crucial step to lock in benefits and protect your skin.",
          buttonText: "Complete Your Ritual",
          action: () => navigate('/product/moisturizer')
        };
      }
    }
    
    // PRIORITY 3: If user has Core Ritual (Cleanser + Serum Trio + Moisturizer)
    if (hasSerumTrio && hasCleanser && hasMoisturizer) {
      if (!hasEyeCream) {
        return {
          title: "The Finishing Touch",
          message: "You've perfected your facial routine. Ready for the finishing touch? Our Spring Harmony Eye Cream works in synergy with your system to target the delicate eye area.",
          buttonText: "Discover Eye Cream",
          action: () => navigate('/product/eye-cream')
        };
      }
      
      if (hasMaskTrio && day % 7 === 0) {
        const maskName = phase === 'calm' ? 'Calm & Renew Mask' : phase === 'glow' ? 'Glow & Energize Mask' : 'Balance & Clarify Mask';
        return {
          title: "Weekly Spa Treatment",
          message: `It's been about a week. Your skin is ready for its weekly spa treatment. Tonight is the perfect night for your ${maskName}.`,
          buttonText: "View Mask Trio",
          action: () => navigate('/product/mask-trio')
        };
      }
      
      if (phase === 'calm') {
        return {
          title: "Extra Barrier Support",
          message: "Feeling extra dry this phase? A shot of our Ceramide Concentrate before your moisturizer can provide emergency relief and repair.",
          buttonText: "Explore Ceramide Concentrate",
          action: () => navigate('/product/ceramide')
        };
      }
      
      if (phase === 'glow') {
        return {
          title: "Boost Your Radiance",
          message: "Maximize your glow phase! Our Vitamin C Concentrate delivers an extra dose of radiance exactly when your skin is primed to shine.",
          buttonText: "Explore Vitamin C",
          action: () => navigate('/product/vitamin-c')
        };
      }
    }
    
    // PRIORITY 4: If user owns everything or default
    return {
      title: "Pro Tip",
      message: "Try layering your phase-matched serum over a concentrate for enhanced results. For example, combine Calm & Renew Serum with Ceramide Concentrate for ultimate barrier repair.",
      buttonText: "Explore Catalog",
      action: () => navigate('/catalog')
    };
  };

  const suggestion = getSmartSuggestion();

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

        <Card className="animate-slide-up shadow-lg bg-gradient-to-br from-primary/5 to-primary/10" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <CardTitle className="font-heading">{suggestion.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/80 leading-relaxed">
              {suggestion.message}
            </p>
            <Button onClick={suggestion.action} className="w-full">
              {suggestion.buttonText}
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-slide-up shadow-lg" style={{ animationDelay: '0.2s' }}>
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
