import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';
import OnboardingBackButton from '@/components/OnboardingBackButton';
import { Cloud, Sun, Thermometer, Droplets } from 'lucide-react';

const ConnectEnvironment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const strategy = (location.state as any)?.strategy;
  const selectedRhythm = (location.state as any)?.selectedRhythm;

  const [detecting, setDetecting] = useState(true);
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDetecting(false);
      setDetected(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate('/personalize', { state: { strategy, selectedRhythm } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={7} />
      <div className="max-w-md w-full text-center space-y-8 animate-slide-up">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-body">
            Environmental Intelligence
          </p>
          <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground leading-tight">
            Connecting your environment.
          </h1>
          <p className="text-muted-foreground text-base font-body">
            m.i. factors in your local climate data to optimize your daily protocol.
          </p>
        </div>

        {/* Simulated environment detection */}
        <div className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 space-y-6 shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Thermometer, label: 'Temperature', value: '22°C', delay: 0 },
              { icon: Droplets, label: 'Humidity', value: '58%', delay: 0.3 },
              { icon: Sun, label: 'UV Index', value: 'Moderate (4)', delay: 0.6 },
              { icon: Cloud, label: 'Air Quality', value: 'Good (AQI 42)', delay: 0.9 },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  'p-4 rounded-xl border transition-all duration-700',
                  detected
                    ? 'border-[#B2C2B2]/50 bg-[#B2C2B2]/5'
                    : 'border-border/30 bg-muted/20'
                )}
                style={{ transitionDelay: `${item.delay}s` }}
              >
                <item.icon className={cn(
                  'h-5 w-5 mx-auto mb-2 transition-colors duration-700',
                  detected ? 'text-[#B2C2B2]' : 'text-muted-foreground/40'
                )} style={{ transitionDelay: `${item.delay}s` }} />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
                <p className={cn(
                  'text-sm font-medium transition-all duration-700',
                  detected ? 'text-foreground' : 'text-muted-foreground/30'
                )} style={{ transitionDelay: `${item.delay}s` }}>
                  {detected ? item.value : '—'}
                </p>
              </div>
            ))}
          </div>

          {detecting && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B2C2B2] animate-pulse" />
              <p className="text-xs text-muted-foreground">Detecting local conditions...</p>
            </div>
          )}

          {detected && (
            <div className="animate-fade-in space-y-1">
              <p className="text-xs text-[#B2C2B2] font-medium">✓ Environment linked</p>
              <p className="text-[10px] text-muted-foreground">
                Your protocol will adapt to weather and UV exposure. meanwhile., m.i. is calibrating.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={!detected}
          className={cn(
            'w-full py-4 rounded-lg text-lg font-medium transition-all duration-300',
            detected
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          Continue
        </button>
        <OnboardingBackButton to="/encouragement" state={{ strategy, selectedRhythm }} />
      </div>
    </div>
  );
};

export default ConnectEnvironment;
