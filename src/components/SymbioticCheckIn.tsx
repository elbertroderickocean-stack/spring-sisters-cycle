import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface SymbioticCheckInProps {
  open: boolean;
  onComplete: (energy: string, skin: string) => void;
  currentDay: number;
}

export const SymbioticCheckIn: React.FC<SymbioticCheckInProps> = ({
  open,
  onComplete,
  currentDay
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [energy, setEnergy] = useState<string>('');

  const handleEnergySelect = (value: string) => {
    setEnergy(value);
    setStep(2);
  };

  const handleSkinSelect = (skin: string) => {
    onComplete(energy, skin);
  };

  const energyOptions = [
    { value: 'low', label: 'Low', description: 'Feeling tired or drained' },
    { value: 'medium', label: 'Medium', description: 'Normal energy levels' },
    { value: 'high', label: 'High', description: 'Energized and ready' }
  ];

  const skinOptions = [
    { value: 'balanced', label: 'Balanced', description: 'Comfortable and normal' },
    { value: 'dry', label: 'Dry & Tight', description: 'Needs extra hydration' },
    { value: 'oily', label: 'Oily', description: 'Excess oil production' },
    { value: 'sensitive', label: 'Sensitive & Irritated', description: 'Red or uncomfortable' }
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <DialogTitle className="text-2xl font-heading text-center">
            {step === 1 ? 'Good morning.' : 'And your skin?'}
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            {step === 1 ? (
              <>
                The calendar says it's Day {currentDay}, but let's start with you.
                <br />
                <span className="font-medium">How is your energy feeling today?</span>
              </>
            ) : (
              <span className="font-medium">How does it feel at this moment?</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {step === 1 ? (
            energyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleEnergySelect(option.value)}
                className="w-full p-4 text-left rounded-xl border-2 border-border hover:border-primary transition-all bg-background hover:bg-accent/50 group"
              >
                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {option.label}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {option.description}
                </div>
              </button>
            ))
          ) : (
            skinOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSkinSelect(option.value)}
                className="w-full p-4 text-left rounded-xl border-2 border-border hover:border-primary transition-all bg-background hover:bg-accent/50 group"
              >
                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {option.label}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {option.description}
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
