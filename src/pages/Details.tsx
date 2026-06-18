import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';
import OnboardingBackButton from '@/components/OnboardingBackButton';

const Details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserData } = useUser();
  const { t } = useTranslation();
  const [ageRange, setAgeRange] = useState('');
  const [skinType, setSkinType] = useState('');

  const isCellularTraining = location.state?.selectedRhythm === 'cellular';

  const handleNext = () => {
    if (ageRange && skinType) {
      updateUserData({ ageRange, skinType });
      navigate('/skin-concerns', { state: { strategy: location.state?.strategy, selectedRhythm: location.state?.selectedRhythm } });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={3} />
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-heading font-semibold text-primary">
            {t('details.title')}
          </h2>
        </div>

        <div className="space-y-6 pt-6">
          <div className="space-y-3">
            <Label className="text-base">{t('details.age_label')}</Label>
            <Select value={ageRange} onValueChange={setAgeRange}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder={t('details.age_placeholder')} />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {isCellularTraining ? (
                  <>
                    <SelectItem value="40s">{t('details.age_40s')}</SelectItem>
                    <SelectItem value="50s">{t('details.age_50s')}</SelectItem>
                    <SelectItem value="60s">{t('details.age_60s')}</SelectItem>
                    <SelectItem value="70+">{t('details.age_70_plus')}</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="under-25">{t('details.age_under_25')}</SelectItem>
                    <SelectItem value="25-34">{t('details.age_25_34')}</SelectItem>
                    <SelectItem value="35-44">{t('details.age_35_44')}</SelectItem>
                    <SelectItem value="45+">{t('details.age_45_plus')}</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-base">{t('details.skin_label')}</Label>
            <Select value={skinType} onValueChange={setSkinType}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder={t('details.skin_placeholder')} />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="dry">{t('details.skin_dry')}</SelectItem>
                <SelectItem value="balanced">{t('details.skin_balanced')}</SelectItem>
                <SelectItem value="oily">{t('details.skin_oily')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button size="lg" onClick={handleNext} disabled={!ageRange || !skinType} className="w-full mt-8 h-12 text-base rounded-lg">
            {t('details.show_plan')}
          </Button>
          <OnboardingBackButton to="/strategy-questions" state={{ strategy: location.state?.strategy, selectedRhythm: location.state?.selectedRhythm }} />
        </div>
      </div>
    </div>
  );
};

export default Details;
