import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { PhaseTag } from '@/components/PhaseTag';
import { PhaseDeepDiveModal } from '@/components/PhaseDeepDiveModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Lightbulb, Star, Droplet, Moon, Sparkle, Heart, Dumbbell, Brain, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

const phaseInsights = {
  calm: [
    { icon: Sparkle, title: "For Your Skin", text: "Your barrier is vulnerable. Focus on gentle, nourishing care and avoid harsh exfoliants." },
    { icon: Droplet, title: "For Your Body", text: "Hydration is key. Try adding a slice of lemon or cucumber to your water to make it more appealing." },
    { icon: Moon, title: "For Your Mind", text: "Your energy may be low. Prioritize rest and consider a calming activity like reading or a warm bath tonight." }
  ],
  glow: [
    { icon: Sparkle, title: "For Your Skin", text: "Your skin's collagen production is at its peak. Our Vitamin C Concentrate can help enhance this process." },
    { icon: Heart, title: "For Your Body", text: "You have high energy. Focus on nutrient-dense meals with plenty of colorful vegetables and lean proteins." },
    { icon: Dumbbell, title: "For Your Mind", text: "You may feel more social and creative. This is a great time for important meetings or trying something new." }
  ],
  balance: [
    { icon: Sparkle, title: "For Your Skin", text: "Your skin may be producing more oil. Focus on balancing and clarifying products to prevent breakouts." },
    { icon: Heart, title: "For Your Body", text: "Support hormonal balance with leafy greens, whole grains, and magnesium-rich foods like dark chocolate and nuts." },
    { icon: Brain, title: "For Your Mind", text: "You may feel more introspective. Practice mindfulness, journaling, or meditation to maintain balance." }
  ]
};

const Today = () => {
  const { userData, getCurrentPhase, getCurrentDay } = useUser();
  const navigate = useNavigate();
  const phase = getCurrentPhase();
  const day = getCurrentDay();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const phaseName = phase === 'calm' ? 'Calm & Renew' : phase === 'glow' ? 'Glow & Energize' : 'Balance & Clarify';

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
        {/* Module 1: Your Current Phase - REDESIGNED */}
        <div className="space-y-3 animate-fade-in">
          <h1 className="text-3xl font-heading font-semibold">
            Hello, {userData.name || 'Beautiful'}!
          </h1>
          
          {/* Large Clickable Phase Banner */}
          <button
            onClick={() => setIsModalOpen(true)}
            className={`w-full p-6 rounded-2xl transition-all hover:scale-[1.02] shadow-lg phase-${phase} border border-${phase}-foreground/20`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="text-5xl font-heading font-bold mb-2">
                  Day {day}
                </div>
                <div className="text-sm opacity-80">
                  Click to learn what's happening in your body and skin today
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-heading font-semibold">
                  {phaseName}
                </span>
                <ChevronRight className="h-6 w-6" />
              </div>
            </div>
          </button>
        </div>

        {/* Module 2: Today's Ritual */}

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

        {/* Module 3: Insight of the Day - REDESIGNED */}
        <Card className="animate-slide-up shadow-lg" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="font-heading">💡 Today's Focus</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {phaseInsights[phase].map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{insight.title}</h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {insight.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Module 4: Smart Suggestion */}
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
      </div>

      {/* Phase Deep Dive Modal */}
      <PhaseDeepDiveModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        phase={phase} 
      />

      <BottomNav />
    </div>
  );
};

export default Today;
