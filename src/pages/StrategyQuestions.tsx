import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';
import OnboardingBackButton from '@/components/OnboardingBackButton';

const StrategyQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserData } = useUser();
  const strategy = (location.state as any)?.strategy as 'hormonal' | 'longevity';
  const selectedRhythm = (location.state as any)?.selectedRhythm;

  const isHormonal = strategy === 'hormonal';

  // Hormonal-specific
  const [cycleDay, setCycleDay] = useState<string | null>(null);
  const [phaseConcern, setPhaseConcern] = useState<string | null>(null);

  // Longevity-specific
  const [yearsSinceCycle, setYearsSinceCycle] = useState<string | null>(null);
  const [primaryDeficit, setPrimaryDeficit] = useState<string | null>(null);

  const canProceed = isHormonal
    ? cycleDay && phaseConcern
    : yearsSinceCycle && primaryDeficit;

  const handleContinue = () => {
    if (isHormonal) {
      updateUserData({
        skinConcerns: phaseConcern ? [phaseConcern] : [],
      });
    }
    navigate('/details', { state: { strategy, selectedRhythm } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={2} />
      <div className="max-w-lg w-full text-center space-y-8 animate-slide-up">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-body">
            {isHormonal ? 'Hormonal Intelligence' : 'Longevity Intelligence'}
          </p>
          <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground leading-tight">
            {isHormonal
              ? 'Help us calibrate your cycle data.'
              : 'Help us calibrate your cellular baseline.'}
          </h1>
          <p className="text-muted-foreground text-base font-body">
            {isHormonal
              ? 'These inputs allow m.i. to optimize your protocol from day one.'
              : 'These inputs help m.i. design your longevity management strategy.'}
          </p>
        </div>

        {isHormonal ? (
          <div className="space-y-6 text-left">
            {/* Question 1: Day of cycle */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Where are you in your cycle right now?
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'early', label: 'Days 1–7 (Period / Early)', desc: 'Low energy, skin may feel sensitive' },
                  { value: 'mid', label: 'Days 8–14 (Mid-Cycle)', desc: 'Peak glow window, rising estrogen' },
                  { value: 'late', label: 'Days 15–28 (Luteal)', desc: 'Oil production increases, breakout zone' },
                  { value: 'unsure', label: "I'm not sure", desc: "We'll estimate based on your data" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCycleDay(opt.value)}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      cycleDay === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/40'
                    )}
                  >
                    <p className="font-medium text-sm text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Primary phase concern */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                What bothers you most during your cycle?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'breakouts', label: 'Breakouts', desc: 'Hormonal acne & blemishes' },
                  { value: 'dullness', label: 'Dullness', desc: 'Lack of radiance & glow' },
                  { value: 'dryness', label: 'Dryness', desc: 'Tight, flaky skin' },
                  { value: 'oiliness', label: 'Oiliness', desc: 'Excess shine & large pores' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPhaseConcern(opt.value)}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      phaseConcern === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/40'
                    )}
                  >
                    <p className="font-medium text-sm text-foreground">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-left">
            {/* Question 1: Years since last cycle */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                How long since your last menstrual cycle?
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'peri', label: 'Currently in perimenopause', desc: 'Cycles are irregular or changing' },
                  { value: '1-3', label: '1–3 years', desc: 'Early post-menopause transition' },
                  { value: '3-10', label: '3–10 years', desc: 'Established post-menopause' },
                  { value: '10+', label: '10+ years', desc: 'Long-term post-menopause' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setYearsSinceCycle(opt.value)}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      yearsSinceCycle === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/40'
                    )}
                  >
                    <p className="font-medium text-sm text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Primary deficit */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                What's your primary skin deficit?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'density', label: 'Loss of Density', desc: 'Sagging, thinning skin' },
                  { value: 'dryness', label: 'Chronic Dryness', desc: 'Persistent dehydration' },
                  { value: 'lines', label: 'Deep Lines', desc: 'Wrinkles & creases' },
                  { value: 'sensitivity', label: 'Sensitivity', desc: 'Redness & reactivity' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPrimaryDeficit(opt.value)}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      primaryDeficit === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/40'
                    )}
                  >
                    <p className="font-medium text-sm text-foreground">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={!canProceed}
          className={cn(
            'w-full py-4 rounded-lg text-lg font-medium transition-all duration-300',
            canProceed
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          Continue
        </button>
        <OnboardingBackButton to="/solution" />
      </div>
    </div>
  );
};

export default StrategyQuestions;
