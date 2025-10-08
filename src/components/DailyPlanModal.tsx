import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PhaseType } from '@/contexts/UserContext';
import { Sparkles, Droplet, Activity, Brain, Apple, Dumbbell, Heart, Sun, Moon, Shield } from 'lucide-react';
import { X } from 'lucide-react';

interface DailyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: PhaseType;
  day: number;
}

const dailyPlanContent = {
  calm: {
    mantra: "Listen to your body's need for rest.",
    skincare: {
      icon: Droplet,
      title: "For Your Radiance",
      text: "Your skin barrier is vulnerable during this phase. Our Calm & Renew Serum and Ceramide Concentrate are your allies today. Focus on gentle, nourishing care and avoid harsh treatments."
    },
    nutrition: {
      icon: Apple,
      title: "Nourish Gently",
      text: "Choose warm, comforting foods. A bowl of oatmeal with berries or a nourishing soup will support your body's natural recovery process."
    },
    fitness: {
      icon: Moon,
      title: "Move with Gentleness",
      text: "This is not the time for intense workouts. Opt for gentle yoga, stretching, or a peaceful walk in nature. Your body needs restoration, not stress."
    },
    wellbeing: {
      icon: Heart,
      title: "Honor Your Need for Rest",
      text: "You may feel more introspective and quieter. This is natural. Give yourself permission to rest, read, or simply be still. Self-compassion is your superpower today."
    }
  },
  glow: {
    mantra: "Capture this energy while it lasts.",
    skincare: {
      icon: Sun,
      title: "For Your Radiance",
      text: "Your skin is strong and receptive. Our Glow & Energize Serum and Vitamin C Concentrate are your best friends today to protect that glow. Your collagen production is at its peak—enhance it!"
    },
    nutrition: {
      icon: Apple,
      title: "Fuel Your Energy",
      text: "Choose vibrant, colorful foods. A crisp apple or a handful of berries in the afternoon will be a perfect source of energy. Your body can handle more right now."
    },
    fitness: {
      icon: Dumbbell,
      title: "Move with Power",
      text: "Your body is ready for a challenge. This is the ideal day for that run, HIIT class, or dance workout you've been planning. You'll feel amazing afterward."
    },
    wellbeing: {
      icon: Brain,
      title: "Harness Your Focus",
      text: "Your mind is sharp and creative. Dedicate time to that big project you've been putting off. Schedule something purely for joy—allow yourself that extra episode or longer coffee break."
    }
  },
  balance: {
    mantra: "Balance is the name of the game today.",
    skincare: {
      icon: Shield,
      title: "For Your Radiance",
      text: "Your skin may be producing more oil as progesterone rises. Our Balance & Clarify Serum is formulated for exactly this moment. Focus on balancing and clarifying to prevent breakouts."
    },
    nutrition: {
      icon: Apple,
      title: "Support Hormonal Balance",
      text: "Reach for leafy greens, whole grains, and magnesium-rich foods like dark chocolate and nuts. These will help stabilize your mood and support your skin from within."
    },
    fitness: {
      icon: Activity,
      title: "Move with Intention",
      text: "Moderate exercise is ideal. Try a steady-paced jog, a swimming session, or a pilates class. Movement will help regulate your hormones and lift your spirits."
    },
    wellbeing: {
      icon: Brain,
      title: "Practice Mindfulness",
      text: "You may feel more introspective or even slightly restless. Practice mindfulness, journaling, or meditation. These tools will help you maintain balance and inner peace."
    }
  }
};

const getPhaseColor = (phase: PhaseType): string => {
  switch (phase) {
    case 'calm':
      return 'hsl(200 50% 60%)';
    case 'glow':
      return 'hsl(30 90% 60%)';
    case 'balance':
      return 'hsl(120 40% 50%)';
  }
};

const getPhaseName = (phase: PhaseType): string => {
  switch (phase) {
    case 'calm':
      return 'Calm & Renew';
    case 'glow':
      return 'Glow & Energize';
    case 'balance':
      return 'Balance & Clarify';
  }
};

export const DailyPlanModal = ({ isOpen, onClose, phase, day }: DailyPlanModalProps) => {
  const content = dailyPlanContent[phase];
  const phaseColor = getPhaseColor(phase);
  const phaseName = getPhaseName(phase);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-50"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-8 space-y-8">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-3xl font-heading font-semibold text-center" style={{ color: phaseColor }}>
              Your Plan for Day {day}: {phaseName}
            </DialogTitle>
          </DialogHeader>

          {/* Today's Mantra */}
          <div className="text-center py-6 px-4 rounded-2xl" style={{ backgroundColor: `${phaseColor}15` }}>
            <Sparkles className="h-8 w-8 mx-auto mb-3" style={{ color: phaseColor }} />
            <p className="text-2xl font-heading italic text-foreground">
              "{content.mantra}"
            </p>
          </div>

          {/* Skincare Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${phaseColor}20` }}>
                <content.skincare.icon className="h-6 w-6" style={{ color: phaseColor }} />
              </div>
              <h3 className="text-xl font-heading font-semibold">{content.skincare.title}</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed pl-15">
              {content.skincare.text}
            </p>
          </div>

          {/* Body Section - Nutrition & Fitness */}
          <div className="space-y-6">
            <h3 className="text-xl font-heading font-semibold">For Your Body</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${phaseColor}20` }}>
                  <content.nutrition.icon className="h-5 w-5" style={{ color: phaseColor }} />
                </div>
                <h4 className="text-lg font-semibold">{content.nutrition.title}</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed pl-13">
                {content.nutrition.text}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${phaseColor}20` }}>
                  <content.fitness.icon className="h-5 w-5" style={{ color: phaseColor }} />
                </div>
                <h4 className="text-lg font-semibold">{content.fitness.title}</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed pl-13">
                {content.fitness.text}
              </p>
            </div>
          </div>

          {/* Mind Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${phaseColor}20` }}>
                <content.wellbeing.icon className="h-6 w-6" style={{ color: phaseColor }} />
              </div>
              <h3 className="text-xl font-heading font-semibold">For Your Mind</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed pl-15">
              {content.wellbeing.text}
            </p>
          </div>

          {/* Future Teaser */}
          <div className="pt-6 border-t border-border">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground/60">Coming Soon</p>
              <p className="leading-relaxed">
                Soon, Aura will be able to connect to your location and calendar to give you hyper-personalized advice, like reminding you to pack your Ceramide Concentrate before a flight or suggesting a hydrating mask on a dry, windy day.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
