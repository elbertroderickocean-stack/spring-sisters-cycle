import { PhaseType } from '@/contexts/UserContext';

export const getAuraToneByAge = (ageRange: string, phase: PhaseType): string => {
  const age = parseInt(ageRange.split('-')[0]);
  
  if (age < 25) {
    // Educational and habit-building focus
    switch (phase) {
      case 'calm':
        return "This is the perfect time to build your foundational skincare habits. Your skin is at its most resilient—embrace gentle, nourishing routines.";
      case 'glow':
        return "Don't forget SPF today—it's your best investment! Your skin is radiant and strong. Use this energy to establish protective habits.";
      case 'balance':
        return "Your skin might feel a bit oilier. This is normal! Keep your routine simple and consistent. Deep cleansing is your friend.";
      default:
        return "Focus on building healthy habits that will serve you for years to come.";
    }
  } else if (age >= 35 && age <= 44) {
    // Prevention and targeted treatment focus
    switch (phase) {
      case 'calm':
        return "This is a great phase to focus on collagen support. Your skin thrives on rich, nurturing ingredients during these days.";
      case 'glow':
        return "Your skin is at peak vitality. This is the ideal window for introducing targeted treatments and active ingredients.";
      case 'balance':
        return "Prevention is key. Even if breakouts appear, maintaining your anti-aging routine ensures long-term resilience.";
      default:
        return "Focus on prevention and targeted treatments for lasting results.";
    }
  } else if (age >= 45) {
    // Nourishment, regeneration, and self-care focus
    switch (phase) {
      case 'calm':
        return "Your skin thrives on rich, restorative ingredients. Tonight is perfect for deep nourishment. Embrace this time of renewal.";
      case 'glow':
        return "Even in your most energetic phase, gentle care yields the best results. Your skin knows what it needs—listen to it.";
      case 'balance':
        return "Self-care isn't selfish, it's essential. Your skin deserves the same patience and compassion you give to others.";
      default:
        return "Embrace nourishment and regeneration. Your skin deserves the richest care.";
    }
  }
  
  return "Your personalized skincare journey begins here.";
};

export const getProductPriorityByConcern = (concern: string): string[] => {
  const priorityMap: Record<string, string[]> = {
    'Dark Spots & Uneven Tone': ['vitamin-c', 'bakuchiol'],
    'Fine Lines & Wrinkles': ['bakuchiol', 'peptide', 'eye-cream'],
    'Breakouts & Blemishes': ['cleanser', 'balance-serum'],
    'Redness & Sensitivity': ['ceramide', 'calm-serum'],
    'Dryness & Dehydration': ['moisturizer', 'ceramide', 'mask-trio'],
    'Dullness & Fatigue': ['vitamin-c', 'glow-serum', 'mask-trio'],
  };
  
  return priorityMap[concern] || [];
};

export const getSkinConcernAdvice = (concern: string, phase: PhaseType): string => {
  if (concern === 'Redness & Sensitivity' && phase === 'glow') {
    return "Your skin is strong today, but since sensitivity is your focus, let's introduce new actives gently. Use your Glow & Energize Serum just once today to see how your skin feels.";
  }
  
  if (concern === 'Breakouts & Blemishes' && phase === 'balance') {
    return "Your phase naturally supports clarification. Focus on deep cleansing and let your Balance & Clarify ritual work its magic.";
  }
  
  if (concern === 'Dark Spots & Uneven Tone' && phase === 'glow') {
    return "This is the optimal phase for brightening treatments. Your Vitamin C Concentrate will work beautifully during these energetic days.";
  }
  
  if (concern === 'Fine Lines & Wrinkles' && phase === 'calm') {
    return "Regeneration happens during rest. Your skin is primed for deeply nourishing, collagen-supporting ingredients right now.";
  }
  
  return '';
};
