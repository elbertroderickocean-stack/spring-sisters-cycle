import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { PhaseDeepDiveModal } from '@/components/PhaseDeepDiveModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Sparkles, Lightbulb, Star, Droplet, Moon, Sparkle, Heart, Dumbbell, Brain, ChevronRight, Activity, Sun, Zap, FlaskConical, Plane, LucideIcon } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

const phaseInsights = {
  calm: [
    { icon: Sparkle, title: "For Your Skin", text: "Your estrogen and progesterone are at their lowest. Your skin barrier is vulnerable. Focus on gentle, nourishing care and avoid harsh exfoliants.", color: "hsl(200 50% 60%)" },
    { icon: Droplet, title: "For Your Body", text: "Hydration is key during this phase. Try adding a slice of lemon or cucumber to your water to make it more appealing.", color: "hsl(200 50% 50%)" },
    { icon: Moon, title: "For Your Mind", text: "Your energy may be low. Prioritize rest and consider a calming activity like reading or a warm bath tonight.", color: "hsl(200 50% 70%)" }
  ],
  glow: [
    { icon: Sun, title: "For Your Skin", text: "Your estrogen levels are rising, putting your skin in its 'golden week.' Collagen production is at its peak. Our job is to enhance this natural radiance.", color: "hsl(30 90% 60%)" },
    { icon: Activity, title: "For Your Body", text: "Your physical energy is at its highest this week. This is the perfect time for high-intensity workouts or trying something new.", color: "hsl(30 90% 50%)" },
    { icon: Sun, title: "For Your Mind", text: "You may feel more social and creative. Plan that brainstorm or coffee date you've been putting off.", color: "hsl(30 90% 70%)" }
  ],
  balance: [
    { icon: Sparkle, title: "For Your Skin", text: "Your skin may be producing more oil as progesterone rises. Focus on balancing and clarifying products to prevent breakouts.", color: "hsl(120 40% 50%)" },
    { icon: Heart, title: "For Your Body", text: "Support hormonal balance with leafy greens, whole grains, and magnesium-rich foods like dark chocolate and nuts.", color: "hsl(120 40% 60%)" },
    { icon: Brain, title: "For Your Mind", text: "You may feel more introspective. Practice mindfulness, journaling, or meditation to maintain balance.", color: "hsl(120 40% 70%)" }
  ]
};

const Today = () => {
  const { userData, getCurrentPhase, getCurrentDay } = useUser();
  const navigate = useNavigate();
  const phase = getCurrentPhase();
  const day = getCurrentDay();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const phaseName = phase === 'calm' ? 'Calm & Renew' : phase === 'glow' ? 'Glow & Energize' : 'Balance & Clarify';
  
  const getDailyWhisper = () => {
    const { progressPercentage } = getPhaseProgress();
    const isEarlyPhase = progressPercentage < 33;
    const isMidPhase = progressPercentage >= 33 && progressPercentage < 66;
    const isLatePhase = progressPercentage >= 66;
    
    if (phase === 'calm') {
      if (isEarlyPhase) return "Listen to your body's need for rest today.";
      if (isMidPhase) return "A day for gentle nourishment and care.";
      return "Your barrier is strengthening—keep nurturing it.";
    }
    
    if (phase === 'glow') {
      if (isEarlyPhase) return "Your day to shine—embrace your energy.";
      if (isMidPhase) return "Radiance is peaking—show the world your glow.";
      return "Capture this energy while it lasts.";
    }
    
    // balance
    if (isEarlyPhase) return "A day to focus on clarifying foods and gentle care.";
    if (isMidPhase) return "Balance is the name of the game today.";
    return "Your cycle is completing—prepare for renewal.";
  };
  
  const getNextPhaseInfo = () => {
    const cycleLength = userData.cycleLength;
    const daysUntilNextPhase = phase === 'calm' ? (8 - day) : phase === 'glow' ? (Math.floor(cycleLength / 2) + 1 - day) : (cycleLength - day + 1);
    const nextPhase = phase === 'calm' ? 'Glow & Energize' : phase === 'glow' ? 'Balance & Clarify' : 'Calm & Renew';
    return { daysUntilNextPhase, nextPhase };
  };

  const getPhaseProgress = () => {
    const cycleLength = userData.cycleLength;
    let phaseStartDay, phaseEndDay;
    
    if (phase === 'calm') {
      phaseStartDay = 1;
      phaseEndDay = 7;
    } else if (phase === 'glow') {
      phaseStartDay = 8;
      phaseEndDay = Math.floor(cycleLength / 2);
    } else {
      phaseStartDay = Math.floor(cycleLength / 2) + 1;
      phaseEndDay = cycleLength;
    }
    
    const daysInPhase = phaseEndDay - phaseStartDay + 1;
    const dayInPhase = day - phaseStartDay + 1;
    const progressPercentage = (dayInPhase / daysInPhase) * 100;
    
    return { progressPercentage, daysInPhase, dayInPhase };
  };

  const getNextPhaseColor = () => {
    const nextPhase = phase === 'calm' ? 'glow' : phase === 'glow' ? 'balance' : 'calm';
    if (nextPhase === 'calm') return 'hsl(200 50% 60%)';
    if (nextPhase === 'glow') return 'hsl(30 90% 60%)';
    return 'hsl(120 40% 50%)';
  };

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
    const skinConcerns = userData.skinConcerns || [];
    
    // PRIORITY 0: Calendar-based suggestions (placeholder for future integration)
    const hasUpcomingFlight = false; // Placeholder: would check Google Calendar API
    if (hasUpcomingFlight) {
      return {
        title: "✈️ Travel Alert!",
        message: "We see you have a flight tomorrow. The recycled air in airplanes is incredibly dehydrating. We highly recommend packing your Ceramide Concentrate to apply mid-flight or immediately after landing to protect your skin barrier.",
        buttonText: "Got it, thanks!",
        action: () => {},
        icon: Plane
      };
    }
    
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
      
      // Personalized suggestions based on skin concerns
      if (skinConcerns.includes('breakouts') && phase === 'balance') {
        return {
          title: "Targeted Support",
          message: "Since breakouts are a key concern for you, consider amplifying your routine with our SOS Spot Treatment. It's the perfect 'sniper' to work alongside your daily 'defense system'.",
          buttonText: "Explore Precision Care",
          action: () => navigate('/catalog')
        };
      }
      
      if (skinConcerns.includes('dryness') && phase === 'calm') {
        return {
          title: "Extra Barrier Support",
          message: "Feeling extra dry this phase? A shot of our Ceramide Concentrate before your moisturizer can provide emergency relief and repair.",
          buttonText: "Explore Ceramide Concentrate",
          action: () => navigate('/product/ceramide')
        };
      }
      
      if (skinConcerns.includes('darkSpots') && phase === 'glow') {
        return {
          title: "Boost Your Radiance",
          message: "Maximize your glow phase! Our Vitamin C Concentrate delivers an extra dose of radiance exactly when your skin is primed to shine.",
          buttonText: "Explore Vitamin C",
          action: () => navigate('/product/vitamin-c')
        };
      }
      
      // Default suggestions for phases
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
  const { daysUntilNextPhase, nextPhase } = getNextPhaseInfo();
  const { progressPercentage } = getPhaseProgress();
  const nextPhaseColor = getNextPhaseColor();
  
  const getPhaseIconColor = () => {
    if (phase === 'calm') return 'hsl(200 50% 60%)';
    if (phase === 'glow') return 'hsl(30 90% 60%)';
    return 'hsl(120 40% 50%)';
  };
  
  const phaseIconColor = getPhaseIconColor();

  const getPrecisionProducts = () => {
    const precisionProducts = [
      {
        id: 'vitamin-c',
        name: 'Vitamin C Concentrate',
        usage: 'Use 2-3 mornings per week instead of your cycle serum for an extra boost of radiance.',
        icon: FlaskConical
      },
      {
        id: 'ceramide',
        name: 'Ceramide Concentrate',
        usage: 'Use on evenings when your skin feels stressed or irritated. Can be layered before your moisturizer.',
        icon: FlaskConical
      }
    ];
    
    return precisionProducts.filter(product => 
      userData.ownedProducts.includes(product.id)
    );
  };

  const precisionProducts = getPrecisionProducts();
  const dailyWhisper = getDailyWhisper();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Module 1: The Living Banner */}
        <div className="space-y-3 animate-fade-in">
          <h1 className="text-3xl font-heading font-semibold">
            Hello, {userData.name || 'Beautiful'}!
          </h1>
          
          {/* Large Clickable Phase Banner with Gradient & Transition Bar */}
          <button
            onClick={() => setIsModalOpen(true)}
            className={`relative w-full p-6 rounded-2xl transition-all hover:scale-[1.02] shadow-lg phase-gradient-${phase} border border-white/20 overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="text-left flex-1">
                <div className="text-5xl font-heading font-bold mb-1 text-foreground">
                  Day {day}
                </div>
                <div className="text-sm text-foreground/70 italic">
                  {dailyWhisper}
                </div>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <span className="text-xl font-heading font-semibold">
                  {phaseName}
                </span>
                <ChevronRight className="h-6 w-6" />
              </div>
            </div>
            
            {/* Transition Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20">
              <div 
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercentage}%`,
                  background: `linear-gradient(to right, currentColor ${Math.max(0, progressPercentage - 10)}%, ${nextPhaseColor} 100%)`,
                  color: phase === 'calm' ? 'hsl(200 50% 60%)' : phase === 'glow' ? 'hsl(30 90% 60%)' : 'hsl(120 40% 50%)'
                }}
              />
            </div>
          </button>
        </div>

        {/* Module 2: Today's Ritual */}

        <Card className="animate-slide-up shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" style={{ color: phaseIconColor }} />
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
                        <span className="font-semibold" style={{ color: phaseIconColor }}>{step.number}</span>
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

        {/* Module 3: Your Precision Toolkit */}
        {precisionProducts.length > 0 && (
          <Card className="animate-slide-up shadow-lg" style={{ animationDelay: '0.1s', backgroundColor: '#EAEFF2' }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" style={{ color: phaseIconColor }} />
                <CardTitle className="font-heading">⚡ Your Precision Toolkit</CardTitle>
              </div>
              <CardDescription>Targeted care for specific needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {precisionProducts.map((product) => {
                  const IconComponent = product.icon;
                  return (
                    <div 
                      key={product.id} 
                      className="flex gap-4 items-start"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconComponent className="h-5 w-5" style={{ color: phaseIconColor }} />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold text-foreground">{product.name}</h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {product.usage}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Module 4: Today's Focus */}
        <Card className="animate-slide-up shadow-lg" style={{ animationDelay: '0.2s', backgroundColor: '#F5F1E9' }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" style={{ color: phaseIconColor }} />
              <CardTitle className="font-heading">💡 Today's Focus</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full">
              <CarouselContent>
                {phaseInsights[phase].map((insight, index) => {
                  const IconComponent = insight.icon;
                  return (
                    <CarouselItem key={index}>
                      <div className="flex gap-4 items-start p-2">
                        <div className="flex-shrink-0">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${insight.color}20` }}
                          >
                            <IconComponent 
                              className="h-6 w-6" 
                              style={{ color: insight.color }}
                            />
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-semibold text-foreground">{insight.title}</h4>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {insight.text}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                {phaseInsights[phase].map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-foreground/20"
                  />
                ))}
              </div>
            </Carousel>
          </CardContent>
        </Card>

        {/* Module 5: Smart Suggestion */}
        <Card className="animate-slide-up shadow-lg" style={{ animationDelay: '0.3s', backgroundColor: '#EAEAF2' }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              {suggestion.icon ? <suggestion.icon className="h-5 w-5" style={{ color: phaseIconColor }} /> : <Star className="h-5 w-5" style={{ color: phaseIconColor }} />}
              <CardTitle className="font-heading">{suggestion.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/80 leading-relaxed">
              {suggestion.message}
            </p>
            {suggestion.action && (
              <Button onClick={suggestion.action} className="w-full">
                {suggestion.buttonText}
              </Button>
            )}
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
