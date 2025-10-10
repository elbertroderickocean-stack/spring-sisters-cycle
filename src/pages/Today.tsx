import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { PhaseDeepDiveModal } from '@/components/PhaseDeepDiveModal';
import { DailyPlanModal } from '@/components/DailyPlanModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Star, ChevronRight, Zap, FlaskConical, Plane, AlertCircle, LucideIcon } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { AuraWhisper } from '@/components/AuraWhisper';
import { useAuraWhispers } from '@/hooks/useAuraWhispers';
import { SymbioticCheckIn } from '@/components/SymbioticCheckIn';
import { RitualSection } from '@/components/RitualSection';
import { Sunrise, Moon } from 'lucide-react';


const Today = () => {
  const { userData, getCurrentPhase, getCurrentDay, exitDemoMode, updateCheckIn, needsCheckIn, isProductOwned } = useUser();
  const navigate = useNavigate();
  const phase = getCurrentPhase();
  const day = getCurrentDay();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInDismissed, setCheckInDismissed] = useState(false);
  const { activeWhisper, checkWhispers, dismissWhisper, triggerProTip } = useAuraWhispers();

  useEffect(() => {
    // Check if we need to show the check-in
    if (needsCheckIn() && !checkInDismissed) {
      setShowCheckIn(true);
    } else if (!needsCheckIn()) {
      // Check for pending pro-tip from onboarding
      const pendingProTip = localStorage.getItem('pending_protip');
      if (pendingProTip) {
        localStorage.removeItem('pending_protip');
        setTimeout(() => {
          triggerProTip(pendingProTip);
        }, 1000);
      } else {
        checkWhispers();
      }
    }
  }, [checkWhispers, triggerProTip, needsCheckIn, checkInDismissed]);

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

  const getMorningRitualSteps = () => {
    const { isProductOwned } = useUser();
    
    // Check if there are custom rituals from Aura
    if (userData.customRituals?.morning) {
      return userData.customRituals.morning.map((productId, index) => {
        const product = getProductInfo(productId);
        return {
          number: index + 1,
          name: product.name,
          purpose: product.purpose,
          owned: isProductOwned(productId),
          productId,
          isPhaseProduct: productId === 'serum-trio'
        };
      });
    }

    // Morning ritual: Protection & Awakening
    const hasSerumTrio = isProductOwned('serum-trio');
    const hasCleanser = isProductOwned('cleanser');
    const hasEyeCream = isProductOwned('eye-cream');
    const hasMoisturizer = isProductOwned('moisturizer');
    const hasVitaminC = isProductOwned('vitamin-c');

    const steps: any[] = [
      {
        number: 1,
        type: 'wellness',
        name: 'Awakening Lymphatic Tapping',
        purpose: 'Stimulates circulation and reduces morning puffiness.',
        owned: true,
        howTo: {
          application: 'Using your fingertips, gently tap along your jawline, cheekbones, and temples in upward motions. Start from the center of your face and move outward.',
          proTips: [
            'Do this for 30-60 seconds before cleansing',
            'Focus on areas that tend to hold puffiness',
            'Keep the pressure light and rhythmic'
          ]
        }
      },
      {
        number: 2,
        type: 'product',
        name: 'Spring Harmony Gentle Cleanser',
        purpose: 'Creates a clean, balanced canvas for your treatment products.',
        owned: hasCleanser,
        productId: 'cleanser',
        howTo: {
          quantity: 'A nickel-sized amount',
          preparation: 'Dampen face with lukewarm water',
          application: 'Massage gently in circular motions for 30 seconds, then rinse thoroughly with cool water to close pores.',
          proTips: [
            'Morning cleansing should be gentler than evening',
            'Cool water helps wake up the skin',
            'Pat dry, never rub'
          ]
        }
      },
      {
        number: 3,
        type: 'product',
        name: phase === 'calm' ? 'Calm & Renew Serum' : phase === 'glow' ? 'Glow & Energize Serum' : 'Balance & Clarify Serum',
        purpose: 'Delivers phase-specific active ingredients to match your hormonal needs.',
        owned: hasSerumTrio,
        productId: 'serum-trio',
        isPhaseProduct: true,
        howTo: {
          quantity: '2-3 drops',
          preparation: 'Apply to slightly damp skin for better absorption',
          application: 'Press gently into skin using upward and outward motions. Let absorb for 30 seconds.',
          proTips: [
            'Morning application focuses on protection',
            'Use light tapping motions to boost circulation',
            'Wait before applying moisturizer for full absorption'
          ]
        }
      },
      {
        number: 4,
        type: 'product',
        name: 'Spring Harmony Eye Cream',
        purpose: 'Reduces puffiness and fine lines around your eyes.',
        owned: hasEyeCream,
        productId: 'eye-cream',
        howTo: {
          quantity: 'A rice grain-sized amount per eye',
          preparation: 'Dot around the orbital bone',
          application: 'Gently pat (never rub) from inner to outer corner. Use your ring finger for the lightest touch.',
          proTips: [
            'Morning focus: de-puffing with gentle tapping',
            'Keep product away from lash line',
            'Store in fridge for extra de-puffing power'
          ]
        }
      },
      {
        number: 5,
        type: 'product',
        name: 'Spring Harmony Daily Moisturizer',
        purpose: 'Seals in hydration and protects your skin barrier all day long.',
        owned: hasMoisturizer,
        productId: 'moisturizer',
        howTo: {
          quantity: 'A small pump',
          preparation: 'Warm between palms',
          application: 'Press into skin using upward strokes. Allow to absorb before makeup or SPF.',
          proTips: [
            'Morning moisturizer should be lighter in texture',
            'Creates a smooth base for SPF and makeup',
            'Don\'t forget neck and décolletage'
          ]
        }
      }
    ];

    return steps;
  };

  const getEveningRitualSteps = () => {
    const { isProductOwned } = useUser();
    
    // Check if there are custom rituals from Aura
    if (userData.customRituals?.evening) {
      return userData.customRituals.evening.map((productId, index) => {
        const product = getProductInfo(productId);
        return {
          number: index + 1,
          name: product.name,
          purpose: product.purpose,
          owned: isProductOwned(productId),
          productId,
          isPhaseProduct: productId === 'serum-trio'
        };
      });
    }

    // Evening ritual: Cleansing & Repair
    const hasSerumTrio = isProductOwned('serum-trio');
    const hasCleanser = isProductOwned('cleanser');
    const hasEyeCream = isProductOwned('eye-cream');
    const hasMoisturizer = isProductOwned('moisturizer');
    const hasCeramide = isProductOwned('ceramide');

    const steps: any[] = [
      {
        number: 1,
        type: 'product',
        name: 'Spring Harmony Gentle Cleanser (First Cleanse)',
        purpose: 'Removes makeup, SPF, and surface impurities.',
        owned: hasCleanser,
        productId: 'cleanser',
        howTo: {
          quantity: 'A nickel-sized amount',
          preparation: 'Apply to dry skin first to break down makeup and SPF',
          application: 'Massage in circular motions for 60 seconds, then emulsify with warm water and rinse thoroughly.',
          proTips: [
            'Evening cleansing should be more thorough',
            'Focus on areas with makeup or SPF',
            'This is your "oil cleanse" step'
          ]
        }
      },
      {
        number: 2,
        type: 'product',
        name: 'Spring Harmony Gentle Cleanser (Second Cleanse)',
        purpose: 'Deep cleans pores and prepares skin for treatment.',
        owned: hasCleanser,
        productId: 'cleanser',
        howTo: {
          quantity: 'A dime-sized amount',
          preparation: 'Apply to damp skin',
          application: 'Massage for 30 seconds focusing on T-zone, rinse with lukewarm water.',
          proTips: [
            'Double cleansing is essential at night',
            'Second cleanse ensures complete purity',
            'Your skin should feel clean but not tight'
          ]
        }
      },
      {
        number: 3,
        type: 'product',
        name: phase === 'calm' ? 'Calm & Renew Serum' : phase === 'glow' ? 'Glow & Energize Serum' : 'Balance & Clarify Serum',
        purpose: 'Delivers phase-specific active ingredients to match your hormonal needs.',
        owned: hasSerumTrio,
        productId: 'serum-trio',
        isPhaseProduct: true,
        howTo: {
          quantity: '3-4 drops (more than morning)',
          preparation: 'Apply to damp skin immediately after cleansing',
          application: 'Press and smooth into skin using upward motions. Take your time—nighttime is for deeper penetration.',
          proTips: [
            'Evening application focuses on repair',
            'Use smoothing massage strokes',
            'Your skin is most receptive to actives at night'
          ]
        }
      },
      {
        number: 4,
        type: 'product',
        name: 'Spring Harmony Eye Cream',
        purpose: 'Reduces puffiness and fine lines around your eyes.',
        owned: hasEyeCream,
        productId: 'eye-cream',
        howTo: {
          quantity: 'A rice grain-sized amount per eye',
          preparation: 'Dot around the orbital bone',
          application: 'Gently massage from inner to outer corner, then tap lightly to boost absorption.',
          proTips: [
            'Evening focus: repair with gentle massage',
            'Can use slightly more product at night',
            'Finish with acupressure points for relaxation'
          ]
        }
      },
      {
        number: 5,
        type: 'product',
        name: hasCeramide ? 'Ceramide Concentrate' : 'Spring Harmony Daily Moisturizer',
        purpose: hasCeramide ? 'Intensive barrier repair and deep nourishment.' : 'Seals in hydration and protects your skin barrier all night long.',
        owned: hasCeramide || hasMoisturizer,
        productId: hasCeramide ? 'ceramide' : 'moisturizer',
        howTo: {
          quantity: hasCeramide ? '2-3 drops' : 'A generous pump',
          preparation: 'Warm between palms',
          application: hasCeramide 
            ? 'Press into skin with gentle upward strokes. Follow with moisturizer if needed for extra richness.'
            : 'Apply generously with upward and outward massage strokes. Your skin repairs itself at night—give it fuel.',
          proTips: hasCeramide 
            ? [
                'Evening is ideal for richer, more concentrated formulas',
                'Layer under moisturizer for maximum repair',
                'Perfect for calm phase intensive care'
              ]
            : [
                'Evening moisturizer can be richer than morning',
                'Don\'t skimp—nighttime is repair time',
                'Apply to neck and chest too'
              ]
        }
      },
      {
        number: 6,
        type: 'wellness',
        name: 'Relaxing Facial Massage',
        purpose: 'Releases tension, boosts circulation, and promotes lymphatic drainage.',
        owned: true,
        howTo: {
          application: 'Using gentle pressure, massage from the center of your face outward. Focus on jaw tension, temples, and forehead. End with downward strokes along your neck.',
          proTips: [
            'Do this for 2-3 minutes while your products absorb',
            'Use slow, deliberate movements',
            'This is your meditation moment'
          ]
        }
      }
    ];

    return steps;
  };

  const getProductInfo = (productId: string) => {
    const productMap: Record<string, { name: string; purpose: string }> = {
      'cleanser': {
        name: 'Spring Harmony Gentle Cleanser',
        purpose: 'Creates a clean, balanced canvas for your treatment products.'
      },
      'serum-trio': {
        name: phase === 'calm' ? 'Calm & Renew Serum' : phase === 'glow' ? 'Glow & Energize Serum' : 'Balance & Clarify Serum',
        purpose: 'Delivers phase-specific active ingredients to match your hormonal needs.'
      },
      'eye-cream': {
        name: 'Spring Harmony Eye Cream',
        purpose: 'Reduces puffiness and fine lines around your eyes.'
      },
      'moisturizer': {
        name: 'Spring Harmony Daily Moisturizer',
        purpose: 'Seals in hydration and protects your skin barrier all day long.'
      },
      'vitamin-c': {
        name: 'Vitamin C Concentrate',
        purpose: 'Delivers an extra dose of radiance exactly when your skin is primed to shine.'
      },
      'ceramide': {
        name: 'Ceramide Concentrate',
        purpose: 'Provides emergency relief and barrier repair for stressed skin.'
      },
      'bakuchiol': {
        name: 'Bakuchiol Concentrate',
        purpose: 'Reduces inflammation without causing irritation.'
      },
      'mask-trio': {
        name: phase === 'calm' ? 'Calm & Renew Mask' : phase === 'glow' ? 'Glow & Energize Mask' : 'Balance & Clarify Mask',
        purpose: 'Intensive weekly treatment matched to your current phase.'
      }
    };
    return productMap[productId] || { name: 'Product', purpose: 'Skincare step' };
  };

  const getSmartSuggestion = () => {
    const hasSerumTrio = isProductOwned('serum-trio');
    const hasCleanser = isProductOwned('cleanser');
    const hasMoisturizer = isProductOwned('moisturizer');
    const hasEyeCream = isProductOwned('eye-cream');
    const hasMaskTrio = isProductOwned('mask-trio');
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
      isProductOwned(product.id)
    );
  };

  const precisionProducts = getPrecisionProducts();
  const dailyWhisper = getDailyWhisper();

  const handleExitDemoMode = () => {
    exitDemoMode();
    navigate('/welcome');
  };

  const handleCheckInComplete = (energy: string, skin: string) => {
    updateCheckIn(energy, skin);
    setShowCheckIn(false);
    setCheckInDismissed(true);
    checkWhispers();
  };

  const handleCheckInDismiss = () => {
    setShowCheckIn(false);
    setCheckInDismissed(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {showCheckIn && (
        <SymbioticCheckIn 
          onComplete={handleCheckInComplete}
          onDismiss={handleCheckInDismiss}
          currentDay={day}
        />
      )}

      {activeWhisper && (
        <AuraWhisper
          message={activeWhisper.message}
          phase={activeWhisper.phase}
          onClose={dismissWhisper}
        />
      )}
      
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {userData.isDemoMode && (
          <Alert className="border-primary/50 bg-primary/5 animate-fade-in">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="flex items-center justify-between gap-3">
              <span className="text-sm">You are in Discovery Mode.</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExitDemoMode}
                className="h-7 text-xs underline underline-offset-4 hover:no-underline shrink-0"
              >
                Create an account
              </Button>
            </AlertDescription>
          </Alert>
        )}
        {/* Module 1: The Living Banner */}
        <div className="space-y-3 animate-fade-in">
          <h1 className="text-3xl font-heading font-semibold">
            Hello, {userData.name || 'Beautiful'}!
          </h1>
          
          {/* Large Clickable Phase Banner with Solid Color & Transition Bar */}
          <button
            onClick={() => setIsModalOpen(true)}
            className={`relative w-full p-6 rounded-2xl transition-all hover:scale-[1.02] shadow-lg border-none overflow-hidden phase-${phase}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="text-left flex-1">
                <div className="text-5xl font-heading font-bold mb-1 text-white drop-shadow-sm">
                  Day {day}
                </div>
                <div className="text-sm font-medium text-white/90">
                  {dailyWhisper}
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
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

        {/* Module 2: Today's Ritual - Morning & Evening */}
        <div className="space-y-4 animate-slide-up">
          <RitualSection
            title="☀️ Morning Ritual"
            icon={<Sunrise className="h-5 w-5" style={{ color: phaseIconColor }} />}
            steps={getMorningRitualSteps()}
            phaseIconColor={phaseIconColor}
            defaultOpen={true}
            auraNote={userData.customRituals?.auraNote}
            timeOfDay="morning"
          />
          <RitualSection
            title="🌙 Evening Ritual"
            icon={<Moon className="h-5 w-5" style={{ color: phaseIconColor }} />}
            steps={getEveningRitualSteps()}
            phaseIconColor={phaseIconColor}
            defaultOpen={true}
            timeOfDay="evening"
          />
        </div>

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

        {/* Module 4: Aura's Plan for You */}
        <button
          onClick={() => setIsPlanModalOpen(true)}
          className="w-full animate-slide-up shadow-lg rounded-lg p-6 transition-all hover:scale-[1.02] text-left"
          style={{ animationDelay: '0.2s', backgroundColor: '#EAEAF2' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" style={{ color: phaseIconColor }} />
                <h3 className="text-xl font-heading font-semibold">✨ Aura's Plan for You</h3>
              </div>
              <p className="text-foreground/70 text-sm">
                {phase === 'calm' 
                  ? "Tap to discover today's rituals for rest and recovery."
                  : phase === 'glow'
                  ? "Tap here to harness your peak energy for a truly radiant day."
                  : "Ready for your daily balancing act? Tap to see Aura's plan."}
              </p>
            </div>
            <ChevronRight className="h-6 w-6 text-foreground/40 flex-shrink-0" />
          </div>
        </button>

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

      {/* Daily Plan Modal */}
      <DailyPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        phase={phase}
        day={day}
      />

      <BottomNav />
    </div>
  );
};

export default Today;
