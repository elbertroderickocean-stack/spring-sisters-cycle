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
  LAST_LOGIN: 'mi_last_login',
  CONSECUTIVE_DAYS: 'mi_consecutive_days',
  SHOWN_WHISPERS: 'mi_shown_whispers',
  LAST_PRODUCT_ADD: 'mi_last_product_add'
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
      const userName = userData.name || 'there';
      
      const messages = {
        calm: `Welcome back, ${userName}. You focus on your morning. meanwhile., recovery protocols are active and your barrier is being reinforced.`,
        glow: `Welcome back, ${userName}. You start your day. meanwhile., your skin is at peak performance—collagen output is maximized.`,
        balance: `Welcome back, ${userName}. You stay focused. meanwhile., clarifying protocols are managing your skin portfolio.`
      };

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
        message: "7-day streak achieved. Consistency is the compound interest of skincare. Your biological capital is appreciating.",
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
        glow: `Portfolio transition in 2 days. You continue your routine. meanwhile., we're preparing your ${nextPhaseName} assets for deployment.`,
        balance: `Portfolio transition in 2 days. You enjoy your glow. meanwhile., we're staging recovery and renewal protocols.`,
        calm: `Portfolio transition in 2 days. You stay balanced. meanwhile., we're preparing to maximize your next performance window.`
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
      'Ceramide Concentrate': 'Asset deployed. Pro-strategy: mix a few drops of Ceramide Concentrate with your Long-Term Moisturizer for an intensive barrier recovery protocol.',
      'Vitamin C Concentrate': 'Asset deployed. Pro-strategy: use your Vitamin C Concentrate in the morning for maximum brightness ROI.',
      'Bakuchiol Concentrate': 'Asset deployed. Pro-strategy: Bakuchiol works optimally overnight. Layer under your moisturizer for compounding renewal.',
      'Peptide Concentrate': 'Asset deployed. Pro-strategy: Peptides reward consistency. Daily deployment yields the best firming returns.'
    };

    const message = tips[productName] || `New asset deployed. Your ${productName} has been integrated into your portfolio.`;

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
      const product = needingReorder[0];
      const dayText = product.daysLeft === 1 ? 'about a day' : `about ${product.daysLeft} days`;
      
      markWhisperShown('reorder');
      return {
        id: `reorder-${Date.now()}`,
        type: 'reorder',
        message: `Supply alert: Your ${product.productName} will deplete in ${dayText}. You focus on your day. meanwhile., we recommend reordering to maintain portfolio continuity.`,
        phase: getCurrentPhase(),
        productId: product.productId,
      };
    }
    return null;
  }, [userData.name, userData.lastPeriodDate, userData.cycleLength, getProductsNeedingReorder]);

  const checkWhispers = useCallback(() => {
    if (activeWhisper) return;

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
