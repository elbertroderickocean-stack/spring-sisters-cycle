import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PhaseType } from '@/contexts/UserContext';
import { HowToModal } from './HowToModal';
import { Heart, Zap, ChevronRight } from 'lucide-react';

interface RitualStep {
  number: number;
  name: string;
  purpose: string;
  owned: boolean;
  productId?: string;
  isPhaseProduct?: boolean;
  type?: 'product' | 'wellness';
  howTo?: {
    quantity?: string;
    preparation?: string;
    application: string;
    videoUrl?: string;
    proTips?: string[];
  };
}

interface RitualSectionProps {
  title: string;
  icon: React.ReactNode;
  steps: RitualStep[];
  phaseIconColor: string;
  defaultOpen?: boolean;
  auraNote?: string;
  timeOfDay: 'morning' | 'evening';
}

export const RitualSection: React.FC<RitualSectionProps> = ({
  title,
  icon,
  steps,
  phaseIconColor,
  defaultOpen = true,
  auraNote,
  timeOfDay
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [selectedStep, setSelectedStep] = React.useState<RitualStep | null>(null);

  return (
    <div className="rounded-2xl border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-heading font-semibold text-base tracking-wide">{title}</h3>
          <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-border/50 text-muted-foreground">
            {steps.filter(s => s.owned).length}/{steps.length} active
          </Badge>
        </div>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-1">
          {auraNote && (
            <div className="mb-4 p-3 rounded-lg bg-[hsl(var(--intel-sleep))]/8 border border-[hsl(var(--intel-sleep))]/15">
              <p className="text-xs text-muted-foreground italic">
                <span className="font-semibold text-[hsl(var(--intel-sleep))]">m.i.:</span> {auraNote}
              </p>
            </div>
          )}

          {/* Vertical timeline */}
          <div className="relative">
            {/* The vertical line */}
            <div className="absolute left-[15px] top-3 bottom-3 w-px bg-border" />

            <div className="space-y-0">
              {steps.map((step, idx) => {
                const isWellness = step.type === 'wellness';
                const hasHowTo = step.howTo !== undefined;
                const isLast = idx === steps.length - 1;

                return (
                  <div
                    key={step.number}
                    className={`relative flex gap-4 ${hasHowTo && step.owned ? 'cursor-pointer group' : ''} ${!isLast ? 'pb-4' : ''}`}
                    onClick={() => {
                      if (hasHowTo && step.owned) setSelectedStep(step);
                    }}
                  >
                    {/* Node on the timeline */}
                    <div className="relative z-10 flex-shrink-0 w-[31px] flex justify-center">
                      {isWellness ? (
                        <div className="w-[10px] h-[10px] mt-[6px] rounded-full bg-gradient-to-br from-[hsl(var(--intel-sleep))] to-[hsl(var(--intel-glucose))]" />
                      ) : step.owned ? (
                        <div
                          className="w-[10px] h-[10px] mt-[6px] rounded-full"
                          style={{ backgroundColor: phaseIconColor }}
                        />
                      ) : (
                        <div className="w-[10px] h-[10px] mt-[6px] rounded-full border-2 border-muted-foreground/30 bg-background" />
                      )}
                    </div>

                    {/* Content card */}
                    <div
                      className={`flex-1 min-w-0 rounded-xl px-4 py-3 border transition-all ${
                        step.owned
                          ? 'bg-background/60 border-border/40 group-hover:border-border group-hover:bg-background/80'
                          : 'bg-muted/20 border-dashed border-border/30 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className={`font-heading text-sm font-medium ${step.owned ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.name}
                        </h4>
                        {isWellness && (
                          <Badge variant="outline" className="text-[8px] uppercase tracking-wider border-[hsl(var(--intel-sleep))]/30 text-[hsl(var(--intel-sleep))]">
                            Wellness
                          </Badge>
                        )}
                        {step.isPhaseProduct && step.owned && (
                          <Badge variant="outline" className="text-[8px] uppercase tracking-wider border-[hsl(var(--intel-glucose))]/30 text-[hsl(var(--intel-glucose))] gap-1">
                            <Zap className="h-2.5 w-2.5" /> m.i. Insight
                          </Badge>
                        )}
                        {hasHowTo && step.owned && (
                          <ChevronRight className="h-3 w-3 text-muted-foreground/40 ml-auto" />
                        )}
                      </div>
                      {step.owned ? (
                        <p className="text-xs text-muted-foreground leading-relaxed">{step.purpose}</p>
                      ) : (
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">Not yet in portfolio.</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-[10px] uppercase tracking-wider px-3 border-primary/30 text-primary hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              step.productId ? navigate(`/product/${step.productId}`) : navigate('/catalog');
                            }}
                          >
                            Deploy
                          </Button>
                        </div>
                      )}
                      {/* m.i. Insight for phase products */}
                      {step.isPhaseProduct && step.owned && (
                        <div className="mt-2 pt-2 border-t border-border/30">
                          <p className="text-[10px] text-[hsl(var(--intel-glucose))] font-medium">
                            ↑ Phase-matched formula active — adapting to your cycle data
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selectedStep && selectedStep.howTo && (
        <HowToModal
          isOpen={!!selectedStep}
          onClose={() => setSelectedStep(null)}
          stepName={selectedStep.name}
          stepType={selectedStep.type || 'product'}
          timeOfDay={timeOfDay}
          content={selectedStep.howTo}
        />
      )}
    </div>
  );
};
