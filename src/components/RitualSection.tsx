import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhaseType } from '@/contexts/UserContext';
import { HowToModal } from './HowToModal';
import { Sparkles, Heart } from 'lucide-react';

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
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-heading font-semibold text-lg">{title}</h3>
          {steps.filter(s => !s.owned).length > 0 && (
            <Badge variant="outline" className="text-xs">
              {steps.filter(s => s.owned).length}/{steps.length}
            </Badge>
          )}
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 space-y-4">
          {auraNote && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-foreground/80 italic">
                <span className="font-semibold text-primary">Aura says:</span> {auraNote}
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            {steps.map((step) => {
              const isWellness = step.type === 'wellness';
              const hasHowTo = step.howTo !== undefined;
              
              return (
                <Card
                  key={step.number}
                  className={`p-4 ${
                    step.owned
                      ? 'bg-background border-solid'
                      : 'bg-muted/30 border-dashed opacity-70'
                  } ${hasHowTo && step.owned ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                  onClick={() => {
                    if (hasHowTo && step.owned) {
                      setSelectedStep(step);
                    }
                  }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.owned
                            ? ''
                            : 'border-2 border-muted-foreground/30'
                        } ${isWellness && step.owned ? 'bg-gradient-to-br from-pink-500 to-purple-600' : ''}`}
                        style={step.owned && !isWellness ? { backgroundColor: phaseIconColor } : {}}
                      >
                        {isWellness ? (
                          <Heart className="h-5 w-5 text-white" />
                        ) : (
                          <span
                            className={`font-semibold ${
                              step.owned ? 'text-white' : 'text-muted-foreground'
                            }`}
                          >
                            {step.number}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className={`font-heading font-medium text-base ${
                            step.owned
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {step.name}
                        </h4>
                        {isWellness && (
                          <Badge variant="outline" className="text-xs bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
                            Wellness
                          </Badge>
                        )}
                        {hasHowTo && step.owned && (
                          <Sparkles className="h-3 w-3 text-primary ml-auto" />
                        )}
                      </div>
                      {step.owned ? (
                        <p className="text-sm text-muted-foreground">
                          Why: {step.purpose}
                        </p>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground mb-3">
                            Complete your ritual to see the full benefits.
                          </p>
                          <Button
                            size="sm"
                            style={{ backgroundColor: phaseIconColor }}
                            className="text-white hover:opacity-90"
                            onClick={(e) => {
                              e.stopPropagation();
                              step.productId ? navigate(`/product/${step.productId}`) : navigate('/catalog');
                            }}
                          >
                            Discover Product
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
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
    </Card>
  );
};
