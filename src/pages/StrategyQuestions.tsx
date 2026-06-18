import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';
import OnboardingBackButton from '@/components/OnboardingBackButton';

const StrategyQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserData } = useUser();
  const { t } = useTranslation();
  const strategy = (location.state as any)?.strategy as 'hormonal' | 'longevity';
  const selectedRhythm = (location.state as any)?.selectedRhythm;

  const isHormonal = strategy === 'hormonal';

  const [cycleDay, setCycleDay] = useState<string | null>(null);
  const [phaseConcern, setPhaseConcern] = useState<string | null>(null);
  const [yearsSinceCycle, setYearsSinceCycle] = useState<string | null>(null);
  const [primaryDeficit, setPrimaryDeficit] = useState<string | null>(null);

  const canProceed = isHormonal ? cycleDay && phaseConcern : yearsSinceCycle && primaryDeficit;

  const handleContinue = () => {
    if (isHormonal) {
      updateUserData({ skinConcerns: phaseConcern ? [phaseConcern] : [] });
    }
    navigate('/details', { state: { strategy, selectedRhythm } });
  };

  const cycleOpts = [
    { value: 'early', label: t('strategy_q.cycle_early'), desc: t('strategy_q.cycle_early_desc') },
    { value: 'mid', label: t('strategy_q.cycle_mid'), desc: t('strategy_q.cycle_mid_desc') },
    { value: 'late', label: t('strategy_q.cycle_late'), desc: t('strategy_q.cycle_late_desc') },
    { value: 'unsure', label: t('strategy_q.cycle_unsure'), desc: t('strategy_q.cycle_unsure_desc') },
  ];
  const concernOpts = [
    { value: 'breakouts', label: t('strategy_q.concern_breakouts'), desc: t('strategy_q.concern_breakouts_desc') },
    { value: 'dullness', label: t('strategy_q.concern_dullness'), desc: t('strategy_q.concern_dullness_desc') },
    { value: 'dryness', label: t('strategy_q.concern_dryness'), desc: t('strategy_q.concern_dryness_desc') },
    { value: 'oiliness', label: t('strategy_q.concern_oiliness'), desc: t('strategy_q.concern_oiliness_desc') },
  ];
  const yearsOpts = [
    { value: 'peri', label: t('strategy_q.years_peri'), desc: t('strategy_q.years_peri_desc') },
    { value: '1-3', label: t('strategy_q.years_1_3'), desc: t('strategy_q.years_1_3_desc') },
    { value: '3-10', label: t('strategy_q.years_3_10'), desc: t('strategy_q.years_3_10_desc') },
    { value: '10+', label: t('strategy_q.years_10_plus'), desc: t('strategy_q.years_10_plus_desc') },
  ];
  const deficitOpts = [
    { value: 'density', label: t('strategy_q.deficit_density'), desc: t('strategy_q.deficit_density_desc') },
    { value: 'dryness', label: t('strategy_q.deficit_dryness'), desc: t('strategy_q.deficit_dryness_desc') },
    { value: 'lines', label: t('strategy_q.deficit_lines'), desc: t('strategy_q.deficit_lines_desc') },
    { value: 'sensitivity', label: t('strategy_q.deficit_sensitivity'), desc: t('strategy_q.deficit_sensitivity_desc') },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={2} />
      <div className="max-w-lg w-full text-center space-y-8 animate-slide-up">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-body">
            {isHormonal ? t('strategy_q.eyebrow_hormonal') : t('strategy_q.eyebrow_longevity')}
          </p>
          <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground leading-tight">
            {isHormonal ? t('strategy_q.title_hormonal') : t('strategy_q.title_longevity')}
          </h1>
          <p className="text-muted-foreground text-base font-body">
            {isHormonal ? t('strategy_q.subtitle_hormonal') : t('strategy_q.subtitle_longevity')}
          </p>
        </div>

        {isHormonal ? (
          <div className="space-y-6 text-left">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">{t('strategy_q.q_cycle_day')}</label>
              <div className="grid grid-cols-1 gap-3">
                {cycleOpts.map((opt) => (
                  <button key={opt.value} onClick={() => setCycleDay(opt.value)}
                    className={cn('p-4 rounded-xl border-2 text-left transition-all',
                      cycleDay === opt.value ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40')}>
                    <p className="font-medium text-sm text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">{t('strategy_q.q_phase_concern')}</label>
              <div className="grid grid-cols-2 gap-3">
                {concernOpts.map((opt) => (
                  <button key={opt.value} onClick={() => setPhaseConcern(opt.value)}
                    className={cn('p-4 rounded-xl border-2 text-left transition-all',
                      phaseConcern === opt.value ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40')}>
                    <p className="font-medium text-sm text-foreground">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-left">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">{t('strategy_q.q_years_since')}</label>
              <div className="grid grid-cols-1 gap-3">
                {yearsOpts.map((opt) => (
                  <button key={opt.value} onClick={() => setYearsSinceCycle(opt.value)}
                    className={cn('p-4 rounded-xl border-2 text-left transition-all',
                      yearsSinceCycle === opt.value ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40')}>
                    <p className="font-medium text-sm text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">{t('strategy_q.q_deficit')}</label>
              <div className="grid grid-cols-2 gap-3">
                {deficitOpts.map((opt) => (
                  <button key={opt.value} onClick={() => setPrimaryDeficit(opt.value)}
                    className={cn('p-4 rounded-xl border-2 text-left transition-all',
                      primaryDeficit === opt.value ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40')}>
                    <p className="font-medium text-sm text-foreground">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button onClick={handleContinue} disabled={!canProceed}
          className={cn('w-full py-4 rounded-lg text-lg font-medium transition-all duration-300',
            canProceed ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer' : 'bg-muted text-muted-foreground cursor-not-allowed')}>
          {t('common.continue')}
        </button>
        <OnboardingBackButton to="/solution" />
      </div>
    </div>
  );
};

export default StrategyQuestions;
