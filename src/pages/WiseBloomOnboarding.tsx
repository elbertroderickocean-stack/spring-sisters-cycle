import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';

const WiseBloomOnboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserData } = useUser();
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState(1);

  const handleContinue = () => {
    if (currentScreen === 1) {
      setCurrentScreen(2);
    } else {
      updateUserData({ wiseBloomMode: true });
      navigate('/inventory');
    }
  };

  const handleBack = () => {
    if (currentScreen === 1) navigate('/personalize');
    else setCurrentScreen(1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={6} />
      <div className="max-w-2xl w-full space-y-8 animate-slide-up">
        <button onClick={handleBack} className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-6">
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm">{t('common.back')}</span>
        </button>

        {currentScreen === 1 ? (
          <div className="text-center space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body">{t('wise_bloom.eyebrow')}</p>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-foreground leading-tight">
              {t('wise_bloom.title_1')}
            </h1>

            <div className="pt-6 pb-8 space-y-4 text-left max-w-xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed">
                <Trans i18nKey="wise_bloom.body_1" components={{ strong: <strong className="text-foreground" /> }} />
              </p>

              <ul className="space-y-3 text-muted-foreground pt-2">
                <li className="flex gap-3"><span className="text-primary flex-shrink-0">•</span><span>{t('wise_bloom.bullet_1')}</span></li>
                <li className="flex gap-3"><span className="text-primary flex-shrink-0">•</span><span>{t('wise_bloom.bullet_2')}</span></li>
                <li className="flex gap-3"><span className="text-primary flex-shrink-0">•</span><span>{t('wise_bloom.bullet_3')}</span></li>
              </ul>
            </div>

            <Button size="lg" onClick={handleContinue} className="mt-8 px-8 py-6 text-lg rounded-lg">
              {t('common.continue')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body">{t('wise_bloom.eyebrow_2')}</p>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-foreground leading-tight">
              {t('wise_bloom.title_2')}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto pt-4">
              {t('wise_bloom.intro_2')}
            </p>

            <div className="pt-6 pb-8 space-y-4 text-left max-w-xl mx-auto">
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="font-heading font-semibold text-xl mb-2">{t('wise_bloom.constants_title')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('wise_bloom.constants_desc')}</p>
              </div>

              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="font-heading font-semibold text-xl mb-2">{t('wise_bloom.shifts_title')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('wise_bloom.shifts_desc')}</p>
              </div>

              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="font-heading font-semibold text-xl mb-2">{t('wise_bloom.assets_title')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('wise_bloom.assets_desc')}</p>
              </div>

              <p className="text-base text-muted-foreground leading-relaxed pt-6 italic text-center">
                {t('wise_bloom.closing')}
              </p>
            </div>

            <Button size="lg" onClick={handleContinue} className="mt-8 px-8 py-6 text-lg rounded-lg">
              {t('wise_bloom.begin')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WiseBloomOnboarding;
