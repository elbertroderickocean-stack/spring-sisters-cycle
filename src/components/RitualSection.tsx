import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhaseType } from '@/contexts/UserContext';

interface RitualStep {
  number: number;
  name: string;
  purpose: string;
  owned: boolean;
  productId?: string;
  isPhaseProduct?: boolean;
}

interface RitualSectionProps {
  title: string;
  icon: React.ReactNode;
  steps: RitualStep[];
  phaseIconColor: string;
  defaultOpen?: boolean;
  auraNote?: string;
}

export const RitualSection: React.FC<RitualSectionProps> = ({
  title,
  icon,
  steps,
  phaseIconColor,
  defaultOpen = true,
  auraNote
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

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
            {steps.map((step) => (
              <Card
                key={step.number}
                className={`p-4 ${
                  step.owned
                    ? 'bg-background border-solid'
                    : 'bg-muted/30 border-dashed opacity-70'
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.owned
                          ? ''
                          : 'border-2 border-muted-foreground/30'
                      }`}
                      style={step.owned ? { backgroundColor: phaseIconColor } : {}}
                    >
                      <span
                        className={`font-semibold ${
                          step.owned ? 'text-white' : 'text-muted-foreground'
                        }`}
                      >
                        {step.number}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-heading font-medium text-base mb-1 ${
                        step.owned
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step.name}
                    </h4>
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
                          onClick={() => step.productId ? navigate(`/product/${step.productId}`) : navigate('/catalog')}
                        >
                          Discover Product
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
