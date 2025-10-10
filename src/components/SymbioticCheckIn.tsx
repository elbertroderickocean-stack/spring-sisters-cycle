import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SymbioticCheckInProps {
  onComplete: (energy: string, skin: string) => void;
  onDismiss: () => void;
  currentDay: number;
}

export const SymbioticCheckIn: React.FC<SymbioticCheckInProps> = ({
  onComplete,
  onDismiss,
  currentDay
}) => {
  const [showQuestions, setShowQuestions] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [energy, setEnergy] = useState<string>('');

  const handleEnergySelect = (value: string) => {
    setEnergy(value);
    setStep(2);
  };

  const handleSkinSelect = (skin: string) => {
    onComplete(energy, skin);
    setStep(1);
    setEnergy('');
    setShowQuestions(false);
  };

  if (!showQuestions) {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setShowQuestions(true)}
            className="flex-1 text-left"
          >
            <p className="text-sm font-medium text-foreground">
              Good morning. How are you feeling today?{' '}
              <span className="text-primary underline">Tap here to adapt your ritual</span>
            </p>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-4"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-b border-border px-6 py-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            {step === 1 ? 'Morning Check-in' : 'Your Skin Today'}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setShowQuestions(false);
              setStep(1);
              setEnergy('');
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm text-foreground/80">
              Good morning. The calendar says it's Day {currentDay}, but let's start with you. How is your energy feeling today?
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              {['low', 'medium', 'high'].map((level) => (
                <Button
                  key={level}
                  variant="outline"
                  className="h-auto py-3"
                  onClick={() => handleEnergySelect(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-foreground/80">
              And what about your skin? How does it feel at this moment?
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'balanced', label: 'Balanced' },
                { value: 'dry', label: 'Dry & Tight' },
                { value: 'oily', label: 'Oily' },
                { value: 'sensitive', label: 'Sensitive & Irritated' }
              ].map((condition) => (
                <Button
                  key={condition.value}
                  variant="outline"
                  className="h-auto py-3 text-sm"
                  onClick={() => handleSkinSelect(condition.value)}
                >
                  {condition.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
