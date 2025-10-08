import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useProductTracking } from './useProductTracking';

export type WhisperType = 'welcome' | 'milestone' | 'protip' | 'transition' | 'reorder';

export interface Whisper {
  id: string;
  type: WhisperType;
  message: string;
  phase: 'calm' | 'glow' | 'balance';
  productId?: string;
}

const STORAGE_KEYS = {
  LAST_LOGIN: 'aura_last_login',
  CONSECUTIVE_DAYS: 'aura_consecutive_days',
  SHOWN_WHISPERS: 'aura_shown_whispers',
  LAST_PRODUCT_ADD: 'aura_last_product_add'
};

export const useAuraWhispers = () => {
  const { userData } = useUser();
  const { getProductsNeedingReorder } = useProductTracking();
  const [activeWhisper, setActiveWhisper] = useState<Whisper | null>(null);

  const getCurrentDay = (): number => {
    if (!userData.lastPeriodDate) return 1;
    
    const today = new Date();
    const lastPeriod = new Date(userData.lastPeriodDate);
    const diffTime = Math.abs(today.getTime() - lastPeriod.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return (diffDays % userData.cycleLength) || userData.cycleLength;
  };

  const getCurrentPhase = (): 'calm' | 'glow' | 'balance' => {
    const day = getCurrentDay();
    if (day >= 1 && day <= 7) return 'calm';
    if (day >= 8 && day <= 18) return 'glow';
    return 'balance';
  };

  const getDaysUntilNextPhase = (): number => {
    const day = getCurrentDay();
    if (day <= 7) return 8 - day;
    if (day <= 18) return 19 - day;
    if (day <= 28) return 29 - day;
    return 1;
  };

  const getPhaseDisplayName = (phase: 'calm' | 'glow' | 'balance'): string => {
    const names = {
      calm: 'Calm & Renew',
      glow: 'Glow & Energize',
      balance: 'Balance & Clarify'
    };
    return names[phase];
  };

  const hasShownWhisperToday = (type: WhisperType): boolean => {
    const today = new Date().toDateString();
    const shown = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOWN_WHISPERS) || '{}');
    return shown[type] === today;
  };

  const markWhisperShown = (type: WhisperType) => {
    const today = new Date().toDateString();
    const shown = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOWN_WHISPERS) || '{}');
    shown[type] = today;
    localStorage.setItem(STORAGE_KEYS.SHOWN_WHISPERS, JSON.stringify(shown));
  };

  const checkWelcomeBack = useCallback((): Whisper | null => {
    const lastLogin = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
    const today = new Date().toDateString();
    
    if (lastLogin !== today && !hasShownWhisperToday('welcome')) {
      const phase = getCurrentPhase();
      const userName = userData.name || 'beautiful';
      
      const messages = {
        calm: `Welcome back, ${userName}! Your skin is in renewal mode. Let's nurture it gently today.`,
        glow: `Welcome back, ${userName}! Your skin is at its strongest today. Let's make it shine.`,
        balance: `Welcome back, ${userName}! Your skin needs clarity today. We've got the perfect plan.`
      };

      // Update consecutive days
      const lastDate = lastLogin ? new Date(lastLogin) : null;
      const isConsecutive = lastDate && 
        (new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24) === 1;
      
      const currentStreak = parseInt(localStorage.getItem(STORAGE_KEYS.CONSECUTIVE_DAYS) || '0');
      const newStreak = isConsecutive ? currentStreak + 1 : 1;
      localStorage.setItem(STORAGE_KEYS.CONSECUTIVE_DAYS, newStreak.toString());
      localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, today);

      markWhisperShown('welcome');
      return {
        id: `welcome-${Date.now()}`,
        type: 'welcome',
        message: messages[phase],
        phase
      };
    }
    return null;
  }, [userData.name, userData.lastPeriodDate, userData.cycleLength]);

  const checkMilestone = useCallback((): Whisper | null => {
    const consecutiveDays = parseInt(localStorage.getItem(STORAGE_KEYS.CONSECUTIVE_DAYS) || '0');
    
    if (consecutiveDays === 7 && !hasShownWhisperToday('milestone')) {
      markWhisperShown('milestone');
      return {
        id: `milestone-${Date.now()}`,
        type: 'milestone',
        message: "You've completed your first full week! Consistency is the key to harmony. Your skin is thanking you.",
        phase: getCurrentPhase()
      };
    }
    return null;
  }, [userData.lastPeriodDate, userData.cycleLength]);

  const checkTransition = useCallback((): Whisper | null => {
    const daysUntil = getDaysUntilNextPhase();
    
    if (daysUntil === 2 && !hasShownWhisperToday('transition')) {
      const currentPhase = getCurrentPhase();
      const nextPhase = currentPhase === 'calm' ? 'glow' : currentPhase === 'glow' ? 'balance' : 'calm';
      const nextPhaseName = getPhaseDisplayName(nextPhase);
      
      const messages = {
        glow: `Heads up! Your '${nextPhaseName}' phase starts in 2 days. Don't be surprised if your skin feels a bit oilier. We're ready for it.`,
        balance: `Heads up! Your '${nextPhaseName}' phase starts in 2 days. Time to prepare for renewal and gentle care.`,
        calm: `Heads up! Your '${nextPhaseName}' phase starts in 2 days. Get ready for radiance and energy!`
      };

      markWhisperShown('transition');
      return {
        id: `transition-${Date.now()}`,
        type: 'transition',
        message: messages[nextPhase],
        phase: currentPhase
      };
    }
    return null;
  }, [userData.lastPeriodDate, userData.cycleLength]);

  const triggerProTip = useCallback((productName: string) => {
    const phase = getCurrentPhase();
    
    const tips: Record<string, string> = {
      'Ceramide Concentrate': 'Great choice! Pro-Tip: For an intense recovery mask, mix a few drops of your new Ceramide Concentrate with your Daily Moisturizer.',
      'Vitamin C Concentrate': 'Excellent! Pro-Tip: Use your Vitamin C Concentrate in the morning for maximum brightness. Your skin will glow all day.',
      'Bakuchiol Concentrate': 'Smart pick! Pro-Tip: Bakuchiol works beautifully at night. Layer it under your moisturizer for smooth, renewed skin by morning.',
      'Peptide Concentrate': 'Perfect! Pro-Tip: Peptides love consistency. Use your concentrate daily for the best firming and smoothing results.'
    };

    const message = tips[productName] || `Great addition! Your ${productName} will work beautifully with your existing routine.`;

    setActiveWhisper({
      id: `protip-${Date.now()}`,
      type: 'protip',
      message,
      phase
    });
  }, [userData.lastPeriodDate, userData.cycleLength]);

  const checkReorderReminder = useCallback((): Whisper | null => {
    const needingReorder = getProductsNeedingReorder();
    
    if (needingReorder.length > 0 && !hasShownWhisperToday('reorder')) {
      const product = needingReorder[0]; // Show whisper for the first product needing reorder
      const userName = userData.name || 'beautiful';
      const dayText = product.daysLeft === 1 ? 'about a day' : `about ${product.daysLeft} days`;
      
      markWhisperShown('reorder');
      return {
        id: `reorder-${Date.now()}`,
        type: 'reorder',
        message: `Just a friendly whisper, ${userName}! Your ${product.productName} will likely run out in ${dayText}. Time to order a refill to keep the ritual going. ✨`,
        phase: getCurrentPhase(),
        productId: product.productId,
      };
    }
    return null;
  }, [userData.name, userData.lastPeriodDate, userData.cycleLength, getProductsNeedingReorder]);

  const checkWhispers = useCallback(() => {
    if (activeWhisper) return;

    // Priority order: reorder -> welcome -> milestone -> transition
    const reorder = checkReorderReminder();
    if (reorder) {
      setActiveWhisper(reorder);
      return;
    }

    const welcome = checkWelcomeBack();
    if (welcome) {
      setActiveWhisper(welcome);
      return;
    }

    const milestone = checkMilestone();
    if (milestone) {
      setActiveWhisper(milestone);
      return;
    }

    const transition = checkTransition();
    if (transition) {
      setActiveWhisper(transition);
    }
  }, [activeWhisper, checkReorderReminder, checkWelcomeBack, checkMilestone, checkTransition]);

  const dismissWhisper = useCallback(() => {
    setActiveWhisper(null);
  }, []);

  return {
    activeWhisper,
    checkWhispers,
    dismissWhisper,
    triggerProTip
  };
};
