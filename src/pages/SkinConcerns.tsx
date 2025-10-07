import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';

const skinConcernsList = [
  { id: 'breakouts', label: 'Breakouts & Blemishes' },
  { id: 'redness', label: 'Redness & Sensitivity' },
  { id: 'lines', label: 'Fine Lines & Wrinkles' },
  { id: 'darkSpots', label: 'Dark Spots & Uneven Tone' },
  { id: 'dryness', label: 'Dryness & Dehydration' },
  { id: 'oiliness', label: 'Oiliness & Large Pores' },
];

const SkinConcerns = () => {
  const navigate = useNavigate();
  const { updateUserData } = useUser();
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  const toggleConcern = (concernId: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concernId)
        ? prev.filter((id) => id !== concernId)
        : [...prev, concernId]
    );
  };

  const handleNext = () => {
    updateUserData({ skinConcerns: selectedConcerns });
    navigate('/inventory');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="max-w-lg w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-heading font-semibold text-primary">
            Let's get personal.
          </h1>
          <p className="text-foreground/70 text-lg leading-relaxed">
            Your cycle influences your skin's daily changes, but we all have our unique challenges. Tell us what you focus on most.
          </p>
        </div>

        <div className="space-y-4 pt-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Primary Skin Concerns</h2>
          {skinConcernsList.map((concern) => (
            <div
              key={concern.id}
              className="flex items-center space-x-4 p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => toggleConcern(concern.id)}
            >
              <Checkbox
                id={concern.id}
                checked={selectedConcerns.includes(concern.id)}
                onCheckedChange={() => toggleConcern(concern.id)}
                className="pointer-events-none"
              />
              <Label
                htmlFor={concern.id}
                className="flex-1 text-base cursor-pointer"
              >
                {concern.label}
              </Label>
            </div>
          ))}
        </div>

        <Button
          size="lg"
          onClick={handleNext}
          className="w-full mt-8 h-12 text-base rounded-full"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SkinConcerns;
