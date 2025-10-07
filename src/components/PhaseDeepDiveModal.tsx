import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PhaseDeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: 'calm' | 'glow' | 'balance';
}

const phaseContent = {
  calm: {
    title: 'Understanding Your "Calm & Renew" Phase',
    color: 'text-phase-calm',
    bgColor: 'bg-phase-calm/10',
    hormonal: "Both estrogen and progesterone are at their lowest point. Think of this as your body's 'reset' button. This hormonal dip is the primary reason you may feel lower energy.",
    skin: "The drop in hormones can weaken your skin's protective barrier, making it more prone to dryness, sensitivity, and redness. It loses moisture more easily and may feel tight or irritated.",
    nutrition: "Focus on anti-inflammatory foods rich in Omega-3s (like salmon and walnuts) and hydrating fruits and vegetables.",
    fitness: "Listen to your body. Gentle movement like yoga, stretching, or walking is more beneficial than high-intensity workouts right now.",
    wellbeing: "This is a time for rest and introspection. Prioritize sleep and create calming rituals."
  },
  glow: {
    title: 'Understanding Your "Glow & Energize" Phase',
    color: 'text-phase-glow',
    bgColor: 'bg-phase-glow/10',
    hormonal: "Estrogen is surging to its peak. This is your body's 'performance window.' You may feel more confident, energetic, and socially engaged.",
    skin: "High estrogen boosts collagen production and cellular renewal. Your skin is at its strongest, most resilient, and most radiant. This is when it can handle active ingredients and treatments.",
    nutrition: "Take advantage of your higher energy with nutrient-dense meals. Include plenty of colorful vegetables and lean proteins.",
    fitness: "This is your power phase! You can push harder in workouts—try HIIT, strength training, or challenging cardio sessions.",
    wellbeing: "You may feel more social and creative. This is a great time for important meetings, creative projects, or trying something new."
  },
  balance: {
    title: 'Understanding Your "Balance & Clarify" Phase',
    color: 'text-phase-balance',
    bgColor: 'bg-phase-balance/10',
    hormonal: "Progesterone dominates in this phase. This hormone prepares your body for potential pregnancy, which increases sebum production and can affect mood.",
    skin: "Increased progesterone leads to more oil production, which can result in clogged pores, breakouts, and a heavier complexion. Your skin needs clarifying and balancing care.",
    nutrition: "Focus on foods that support hormonal balance, like leafy greens, whole grains, and foods rich in magnesium (dark chocolate, nuts, seeds).",
    fitness: "Moderate-intensity workouts are ideal. Try pilates, cycling, or jogging. Avoid overexertion as your body may be more prone to inflammation.",
    wellbeing: "You may feel more introspective or experience mood fluctuations. Practice mindfulness, journaling, or meditation to maintain balance."
  }
};

export const PhaseDeepDiveModal = ({ isOpen, onClose, phase }: PhaseDeepDiveModalProps) => {
  const content = phaseContent[phase];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`text-3xl font-heading ${content.color}`}>
            {content.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section 1: Hormonal State */}
          <div className={`p-6 rounded-lg ${content.bgColor}`}>
            <h3 className="text-xl font-heading font-semibold mb-3">
              Your Hormonal State
            </h3>
            <p className="text-sm text-muted-foreground mb-2 font-medium">
              What's happening inside:
            </p>
            <p className="text-foreground/80 leading-relaxed">
              {content.hormonal}
            </p>
          </div>

          {/* Section 2: Skin's Behavior */}
          <div className={`p-6 rounded-lg ${content.bgColor}`}>
            <h3 className="text-xl font-heading font-semibold mb-3">
              Your Skin's Behavior
            </h3>
            <p className="text-sm text-muted-foreground mb-2 font-medium">
              How it shows on the outside:
            </p>
            <p className="text-foreground/80 leading-relaxed">
              {content.skin}
            </p>
          </div>

          {/* Section 3: Holistic Focus */}
          <div className={`p-6 rounded-lg ${content.bgColor}`}>
            <h3 className="text-xl font-heading font-semibold mb-4">
              Holistic Focus for This Phase
            </h3>
            <p className="text-sm text-muted-foreground mb-4 font-medium">
              How to support your body:
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">🍎 Nutrition</h4>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {content.nutrition}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">💪 Fitness</h4>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {content.fitness}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">🧘‍♀️ Wellbeing</h4>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {content.wellbeing}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
