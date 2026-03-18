import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { PhaseDeepDiveModal } from '@/components/PhaseDeepDiveModal';
import { DailyPlanModal } from '@/components/DailyPlanModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Circle, Star, ChevronRight, Zap, FlaskConical, Plane, AlertCircle, LucideIcon } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { HeaderBar } from '@/components/HeaderBar';
import { AuraWhisper } from '@/components/AuraWhisper';
import { useAuraWhispers } from '@/hooks/useAuraWhispers';
import { SymbioticCheckIn } from '@/components/SymbioticCheckIn';
import { RitualSection } from '@/components/RitualSection';
import { SynergyIndex } from '@/components/SynergyIndex';
import { DashboardMetrics } from '@/components/DashboardMetrics';
import { HeroIngredients } from '@/components/HeroIngredients';
import { Sunrise, Moon, Camera } from 'lucide-react';
import { WeeklyReflectionModal } from '@/components/WeeklyReflectionModal';
import { WeeklyPlanModal } from '@/components/WeeklyPlanModal';


const Today = () => {
  const { userData, getCurrentPhase, getCurrentDay, exitDemoMode, updateCheckIn, needsCheckIn, isProductOwned } = useUser();
  const navigate = useNavigate();
  
  // Get the current day in the 7-day micro-cycle for Wise Bloom users
  const getMicroCycleDay = (): number => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    return dayOfWeek === 0 ? 7 : dayOfWeek; // Convert Sunday to 7, keep others as-is
  };
  
  const phase = userData.wiseBloomMode ? 'calm' : getCurrentPhase(); // Wise Bloom users always get 'calm' phase styling
  const day = userData.wiseBloomMode ? getMicroCycleDay() : getCurrentDay();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInDismissed, setCheckInDismissed] = useState(false);
  const [showWeeklyReflection, setShowWeeklyReflection] = useState(false);
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);
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
  
  const getMicroCycleDayName = (day: number): string => {
    const dayNames = [
      'Monday: Recovery Night',
      'Tuesday: Recovery Night',
      'Wednesday: Exfoliation Night',
      'Thursday: Activation Night',
      'Friday: Recovery Night',
      'Saturday: Recovery Night',
      'Sunday: Flex Night'
    ];
    return dayNames[day - 1] || 'Recovery Night';
  };

  const getDailyWhisper = () => {
    if (userData.wiseBloomMode) {
      const whispers = [
        "You rest. meanwhile., your barrier is being reinforced.",
        "You focus on your day. meanwhile., The Long-Term Moisturizer is compounding.",
        "You sleep. meanwhile., cellular renewal is at peak capacity.",
        "You live your life. meanwhile., your skin portfolio is appreciating.",
        "You enjoy your morning. meanwhile., your assets are being deployed.",
        "You unwind. meanwhile., recovery protocols are active.",
        "You take a breath. meanwhile., your skin's ROI is being maximized."
      ];
      return whispers[(day - 1) % whispers.length];
    }
    const { progressPercentage } = getPhaseProgress();
    const isEarlyPhase = progressPercentage < 33;
    const isMidPhase = progressPercentage >= 33 && progressPercentage < 66;
    const isLatePhase = progressPercentage >= 66;
    
    if (phase === 'calm') {
      if (isEarlyPhase) return "You rest. meanwhile., your barrier is being rebuilt.";
      if (isMidPhase) return "You recover. meanwhile., ceramides are reinforcing your foundation.";
      return "You strengthen. meanwhile., your skin's defensive wall is holding.";
    }
    
    if (phase === 'glow') {
      if (isEarlyPhase) return "You shine. meanwhile., collagen synthesis is at peak output.";
      if (isMidPhase) return "You radiate. meanwhile., your skin's ROI is compounding.";
      return "You glow. meanwhile., we're locking in this phase's gains.";
    }
    
    // balance
    if (isEarlyPhase) return "You balance. meanwhile., sebum management is active.";
    if (isMidPhase) return "You stay steady. meanwhile., clarifying protocols are running.";
    return "You prepare. meanwhile., we're transitioning your portfolio for renewal.";
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
    
     // Check if there are custom rituals from m.i.
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

    // Morning Deployment: Protection & Awakening
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
        name: 'The Baseline Cleanser',
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
        name: 'The Long-Term Eye Cream',
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
        name: 'The Long-Term Moisturizer',
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
    
    // Wise Bloom 7-Day Micro-Cycle
    if (userData.wiseBloomMode) {
      return getWiseBloomEveningSteps();
    }
    
    // Check if there are custom rituals from m.i.
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
        name: 'The Baseline Cleanser (First Cleanse)',
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
        name: 'The Baseline Cleanser (Second Cleanse)',
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
        name: 'The Long-Term Eye Cream',
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
        name: hasCeramide ? 'Ceramide Concentrate' : 'The Long-Term Moisturizer',
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

  const getWiseBloomEveningSteps = () => {
    const hasSerumTrio = isProductOwned('serum-trio');
    const hasCleanser = isProductOwned('cleanser');
    const hasMoisturizer = isProductOwned('moisturizer');
    const hasCeramide = isProductOwned('ceramide');
    const hasMaskTrio = isProductOwned('mask-trio');

    const microCycleDay = getMicroCycleDay();
    let primarySerum = 'Calm & Renew Serum';
    let miVoice = '';

    // Days 1 & 2 (Mon & Tue): Recovery Nights
    if (microCycleDay === 1 || microCycleDay === 2) {
      primarySerum = 'Calm & Renew Serum';
      miVoice = "You rest. meanwhile., the Calm & Renew Serum is rebuilding your barrier foundation.";
    }
    // Day 3 (Wed): Exfoliation Night
    else if (microCycleDay === 3) {
      primarySerum = hasMaskTrio ? 'Gentle Exfoliating Component' : 'Calm & Renew Serum';
      miVoice = "You enjoy your evening. meanwhile., we are gently polishing the skin to prepare it for activation.";
    }
    // Day 4 (Thu): Activation Night
    else if (microCycleDay === 4) {
      primarySerum = 'Glow & Energize Serum';
      miVoice = "Your skin is perfectly prepared. meanwhile., we are deploying the Glow & Energize Serum for maximum activation.";
    }
    // Days 5 & 6 (Fri & Sat): Recovery Nights
    else if (microCycleDay === 5 || microCycleDay === 6) {
      primarySerum = 'Calm & Renew Serum';
      miVoice = "You unwind. meanwhile., the Calm & Renew Serum is executing post-activation recovery.";
    }
    // Day 7 (Sun): Flex Night
    else if (microCycleDay === 7) {
      primarySerum = 'Balance & Clarify Serum or Your Choice';
      miVoice = "Tonight is your flex day. meanwhile., m.i. recommends addressing any specific concerns or continuing recovery.";
    }

    const steps: any[] = [
      {
        number: 1,
        type: 'product',
        name: 'The Baseline Cleanser (First Cleanse)',
        purpose: 'Removes makeup, SPF, and surface impurities.',
        owned: hasCleanser,
        productId: 'cleanser',
      },
      {
        number: 2,
        type: 'product',
        name: 'The Baseline Cleanser (Second Cleanse)',
        purpose: 'Deep cleans pores and prepares skin for treatment.',
        owned: hasCleanser,
        productId: 'cleanser',
      },
      {
        number: 3,
        type: 'product',
        name: primarySerum,
        purpose: miVoice,
        owned: hasSerumTrio,
        productId: 'serum-trio',
        isPhaseProduct: true,
      },
      {
        number: 4,
        type: 'product',
        name: hasCeramide ? 'Ceramide Concentrate' : 'The Long-Term Moisturizer',
        purpose: hasCeramide ? 'Intensive barrier repair and deep nourishment.' : 'Seals in hydration and protects your skin barrier all night long.',
        owned: hasCeramide || hasMoisturizer,
        productId: hasCeramide ? 'ceramide' : 'moisturizer',
      }
    ];

    return steps;
  };

  const getProductInfo = (productId: string) => {
    const productMap: Record<string, { name: string; purpose: string }> = {
      'cleanser': {
        name: 'The Baseline Cleanser',
        purpose: 'Creates a clean, balanced canvas for your treatment products.'
      },
      'serum-trio': {
        name: phase === 'calm' ? 'Calm & Renew Serum' : phase === 'glow' ? 'Glow & Energize Serum' : 'Balance & Clarify Serum',
        purpose: 'Delivers phase-specific active ingredients to match your hormonal needs.'
      },
      'eye-cream': {
        name: 'The Long-Term Eye Cream',
        purpose: 'Reduces puffiness and fine lines around your eyes.'
      },
      'moisturizer': {
        name: 'The Long-Term Moisturizer',
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
    
    // PRIORITY 1: Calendar-based suggestions (placeholder for future integration)
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
      let message = "Ready to unlock the full potential of cycle-synced skincare? Our The Shifts Serum Trio is the intelligent core of our entire system.";
      
      if (hasCleanser && !hasMoisturizer && !hasEyeCream) {
        message = "You've created the perfect canvas. Ready to start painting? Our The Shifts Serum Trio is the set of 'smart paints' that adapts to your skin every day.";
      } else if (hasMoisturizer && !hasCleanser && !hasEyeCream) {
        message = "You have the perfect shield. Now let's put a powerful weapon underneath it. Our The Shifts Serum Trio is the intelligent core of our entire system.";
      } else if (hasEyeCream && !hasCleanser && !hasMoisturizer) {
        message = "You've mastered care for the most delicate area. Now let's apply that same intelligent approach to your entire face with our The Shifts Serum Trio.";
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
          message: "Your serums work best on a perfectly prepared canvas. Our The Baseline Cleanser ensures your skin is ready to absorb 100% of the active ingredients.",
          buttonText: "Complete Your Ritual",
          action: () => navigate('/product/cleanser')
        };
      }
      if (!hasMoisturizer) {
        return {
          title: "Seal the Magic",
          message: "Don't let the magic evaporate! 'Sealing' your serum with our The Long-Term Moisturizer is the final crucial step to lock in benefits and protect your skin.",
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
          message: "You've perfected your facial routine. Ready for the finishing touch? Our The Long-Term Eye Cream works in synergy with your system to target the delicate eye area.",
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
          buttonText: "Explore The Assets",
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

  const getDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  return (
    <div className="min-h-screen mesh-gradient-bg pb-24">
      <HeaderBar>
        <div>
          <p className="text-xs font-medium text-primary tracking-wide">meanwhile</p>
          <p className="text-sm text-muted-foreground mt-0.5">Hello, {userData.name || 'Investor'}</p>
        </div>
      </HeaderBar>

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
      
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">
        {userData.isDemoMode && (
          <Alert className="border-primary/30 bg-primary/5 animate-fade-in backdrop-blur-lg">
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

        {/* Meanwhile Connector Header */}
        <div className="glass-card p-6 animate-fade-in">
          <p className="text-sm text-muted-foreground leading-relaxed">
            While you lived your <span className="text-foreground font-semibold">{getDayOfWeek()}</span> — here is what <span className="text-primary font-semibold">meanwhile.</span> happened to your skin.
          </p>
        </div>

        {/* Dashboard Metric Cards — Horizontal Scroll */}
        <DashboardMetrics />

        {/* Synergy Index Gauge */}
        <SynergyIndex />

        {/* Phase Card */}
        <button
          onClick={() => setShowWeeklyPlan(true)}
          className="relative w-full p-6 rounded-2xl transition-all hover:scale-[1.01] overflow-hidden glass-card animate-fade-in"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-left flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: phaseIconColor }} />
                <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Live Data Linked</span>
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: phaseIconColor }}>
                {userData.wiseBloomMode ? getMicroCycleDayName(day).split(':')[0] : `Day ${day}`}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
                {dailyWhisper}
              </p>
            </div>
            {!userData.wiseBloomMode && (
              <div className="text-right">
                <span className="text-lg font-bold" style={{ color: phaseIconColor }}>
                  {phaseName}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto mt-1" />
              </div>
            )}
            {userData.wiseBloomMode && (
              <div className="text-right">
                <div className="text-base font-bold" style={{ color: phaseIconColor }}>
                  {getMicroCycleDayName(day).split(':')[1]}
                </div>
              </div>
            )}
          </div>
          
          {!userData.wiseBloomMode && (
            <div className="h-[3px] rounded-full bg-[hsl(var(--glass-border))] overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercentage}%`,
                  background: `linear-gradient(to right, ${phaseIconColor}, ${nextPhaseColor})`,
                }}
              />
            </div>
          )}
        </button>

        {/* Ritual Sections */}
        <div className="space-y-4 animate-slide-up">
          <RitualSection
            title="Morning Deployment"
            icon={<Sunrise className="h-4 w-4" style={{ color: phaseIconColor }} />}
            steps={getMorningRitualSteps()}
            phaseIconColor={phaseIconColor}
            defaultOpen={true}
            auraNote={userData.customRituals?.auraNote}
            timeOfDay="morning"
          />
          <RitualSection
            title="Evening Deployment"
            icon={<Moon className="h-4 w-4" style={{ color: phaseIconColor }} />}
            steps={getEveningRitualSteps()}
            phaseIconColor={phaseIconColor}
            defaultOpen={true}
            timeOfDay="evening"
          />
        </div>

        {/* Hero Ingredients */}
        <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <HeroIngredients />
        </div>

        {/* m.i. Vision Widget */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div 
            onClick={() => setShowWeeklyReflection(true)}
            className="glass-card p-5 cursor-pointer hover:border-primary/20 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-[hsl(var(--intel-sleep))]/10 border border-[hsl(var(--intel-sleep))]/15">
                <Camera className="h-5 w-5 text-[hsl(var(--intel-sleep))]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-sm">m.i. Vision</h3>
                  <Badge variant="outline" className="text-[8px] uppercase tracking-wider border-[hsl(var(--intel-sleep))]/20 text-[hsl(var(--intel-sleep))]">
                    Analyze
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You take a photo. meanwhile., m.i. deploys personalized skin intelligence.
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 mt-1" />
            </div>
          </div>
        </div>

        {/* Your Assets Toolkit */}
        {precisionProducts.length > 0 && (
          <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4" style={{ color: phaseIconColor }} />
              <h3 className="font-bold text-sm">Your Assets Toolkit</h3>
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Targeted</span>
            </div>
            <div className="space-y-3">
              {precisionProducts.map((product) => {
                const IconComponent = product.icon;
                return (
                  <div key={product.id} className="flex gap-3 items-start p-3 rounded-xl bg-[hsl(var(--glass-highlight))] border border-[hsl(var(--glass-border))]">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-4 w-4" style={{ color: phaseIconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold">{product.name}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{product.usage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* m.i. Daily Protocol Widget */}
        <button
          onClick={() => setIsPlanModalOpen(true)}
          className="w-full glass-card p-5 transition-all hover:border-primary/20 text-left animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <h3 className="font-bold text-sm">m.i. Daily Protocol</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {phase === 'calm' 
                  ? "You focus on recovery. meanwhile., your protocol is optimized for barrier repair."
                  : phase === 'glow'
                  ? "You seize the day. meanwhile., your portfolio is leveraging peak collagen output."
                  : "You stay balanced. meanwhile., clarifying protocols are managing excess sebum."}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
          </div>
        </button>

        {/* Smart Suggestion Widget */}
        <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center gap-2 mb-3">
            {suggestion.icon ? <suggestion.icon className="h-4 w-4" style={{ color: phaseIconColor }} /> : <Star className="h-4 w-4" style={{ color: phaseIconColor }} />}
            <h3 className="font-bold text-sm">{suggestion.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {suggestion.message}
          </p>
          {suggestion.action && (
            <Button
              onClick={suggestion.action}
              size="sm"
              className="h-9 text-xs"
            >
              {suggestion.buttonText === 'Discover Product' || suggestion.buttonText === 'Discover the Serum Trio' ? 'Integrate' : suggestion.buttonText}
            </Button>
          )}
        </div>

        {/* meanwhile. footer whisper */}
        <div className="text-center py-4">
          <p className="text-[10px] text-muted-foreground/40 tracking-widest uppercase">
            You focus on your day. meanwhile., your long-term assets are growing.
          </p>
        </div>
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

      {/* m.i. Vision Modal */}
      <WeeklyReflectionModal
        open={showWeeklyReflection}
        onOpenChange={setShowWeeklyReflection}
        userName={userData.name || 'beautiful'}
        currentPhase={phase}
        ageRange={userData.ageRange}
        skinType={userData.skinType}
        primaryConcern={userData.skinConcerns?.[0]}
        recentProducts={userData.productInventory?.map(p => p.productId).join(', ')}
      />

      {/* Weekly Plan Modal */}
      <WeeklyPlanModal
        open={showWeeklyPlan}
        onOpenChange={setShowWeeklyPlan}
      />

      <BottomNav />
    </div>
  );
};

export default Today;
