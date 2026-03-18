import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';

const Solution = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<'hormonal' | 'longevity' | null>(null);
  const [showLocked, setShowLocked] = useState(false);

  const handleContinue = () => {
    if (selected) {
      setShowLocked(true);
      setTimeout(() => {
        // Strategy → Strategy Questions (path-specific)
        if (selected === 'longevity') {
          navigate('/strategy-questions', { state: { strategy: selected, selectedRhythm: 'cellular' } });
        } else {
          navigate('/strategy-questions', { state: { strategy: selected, selectedRhythm: 'hormonal' } });
        }
      }, 2500);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={2} />
      <div className="max-w-lg w-full text-center space-y-10 animate-slide-up">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body">The Strategy Pivot</p>
          <h1 className="text-4xl md:text-5xl font-heading font-semibold text-foreground leading-tight">
            Choose your Management Strategy
          </h1>
          <p className="text-muted-foreground text-lg font-body">
            Your skin's needs depend on your biology. Select the path that fits you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 pt-4">
          <button
            onClick={() => setSelected('hormonal')}
            className={cn(
              "group relative p-8 rounded-xl border-2 text-left transition-all duration-300",
              selected === 'hormonal'
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
            )}
          >
            <div className="flex items-start gap-5">
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                selected === 'hormonal' ? "bg-phase-calm" : "bg-muted"
              )}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3c-2 4-2 8 0 12s2 4 0 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">Hormonal Management</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-body">
                  For those in their regular cycle. Adapts to your 28-day rhythm + lifestyle data.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelected('longevity')}
            className={cn(
              "group relative p-8 rounded-xl border-2 text-left transition-all duration-300",
              selected === 'longevity'
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
            )}
          >
            <div className="flex items-start gap-5">
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                selected === 'longevity' ? "bg-phase-balance" : "bg-muted"
              )}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                  <path d="M12 2v20M2 12h20" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">Longevity Management</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-body">
                  Optimized for menopause or skin-cycling. A 7-day cellular training pulse + lifestyle data.
                </p>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected}
          className={cn(
            "w-full py-4 rounded-lg text-lg font-medium transition-all duration-300",
            selected
              ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>

      {/* Strategy Locked Overlay */}
      {showLocked && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-in">
          <div className="text-center space-y-5 animate-slide-up px-6">
            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: '#B2C2B2' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-3xl font-heading font-semibold text-foreground">Investment Strategy Locked.</h3>
            <p className="text-muted-foreground text-base max-w-sm mx-auto leading-relaxed font-body">
              <strong className="text-foreground">meanwhile.</strong>, we are preparing to analyze your biological baseline.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solution;
