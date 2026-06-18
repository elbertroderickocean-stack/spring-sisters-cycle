import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';
import OnboardingBackButton from '@/components/OnboardingBackButton';

const SkinConcerns = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserData } = useUser();
  const { t } = useTranslation();
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  const skinConcernsList = [
    { id: 'breakouts', label: t('skin_concerns.breakouts') },
    { id: 'redness', label: t('skin_concerns.redness') },
    { id: 'lines', label: t('skin_concerns.lines') },
    { id: 'darkSpots', label: t('skin_concerns.darkSpots') },
    { id: 'dryness', label: t('skin_concerns.dryness') },
    { id: 'oiliness', label: t('skin_concerns.oiliness') },
  ];

  const toggleConcern = (concernId: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concernId) ? prev.filter((id) => id !== concernId) : [...prev, concernId]
    );
  };

  const handleNext = () => {
    updateUserData({ skinConcerns: selectedConcerns });
    navigate('/encouragement', { state: location.state });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={4} />
      <div className="max-w-lg w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-heading font-semibold text-primary">
            {t('skin_concerns.title')}
          </h1>
          <p className="text-foreground/70 text-lg leading-relaxed">
            {t('skin_concerns.subtitle')}
          </p>
        </div>

        <div className="space-y-4 pt-6">
          <h2 className="text-base font-semibold text-foreground mb-4">{t('skin_concerns.section')}</h2>
          {skinConcernsList.map((concern) => (
            <div
              key={concern.id}
              className="flex items-center space-x-4 p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => toggleConcern(concern.id)}
            >
              <Checkbox id={concern.id} checked={selectedConcerns.includes(concern.id)} onCheckedChange={() => toggleConcern(concern.id)} className="pointer-events-none" />
              <Label htmlFor={concern.id} className="flex-1 text-base cursor-pointer">
                {concern.label}
              </Label>
            </div>
          ))}
        </div>

        <Button size="lg" onClick={handleNext} className="w-full mt-8 h-12 text-base rounded-lg">
          {t('common.next')}
        </Button>
        <OnboardingBackButton to="/details" state={{ strategy: location.state?.strategy, selectedRhythm: location.state?.selectedRhythm }} />
      </div>
    </div>
  );
};

export default SkinConcerns;
