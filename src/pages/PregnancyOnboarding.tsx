import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';
import OnboardingBackButton from '@/components/OnboardingBackButton';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Heart, ShieldCheck, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const SAGE = '#B2C2B2';

const PregnancyOnboarding = () => {
  const navigate = useNavigate();
  const { updateUserData } = useUser();
  const [trimester, setTrimester] = useState<1 | 2 | 3 | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [step, setStep] = useState<'trimester' | 'info'>('trimester');

  const handleContinue = () => {
    if (step === 'trimester' && trimester) {
      setStep('info');
      return;
    }

    updateUserData({
      pregnancyMode: true,
      lifeStage: 'pregnancy',
      trimester,
      dueDate: dueDate || null,
      wiseBloomMode: false,
    });

    navigate('/details', { state: { strategy: 'pregnancy', selectedRhythm: 'pregnancy' } });
  };

  if (step === 'info') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
        <OnboardingProgressBar currentStep={2} />
        <div className="max-w-lg w-full space-y-8 animate-slide-up">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: SAGE }}>
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-heading font-semibold text-foreground">
              Your safety is our priority.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              During pregnancy, m.i. will automatically:
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: <ShieldCheck className="h-5 w-5" />,
                title: 'Filter unsafe ingredients',
                desc: 'Retinol, salicylic acid, hydroquinone, and other pregnancy-unsafe actives will be flagged in scans and excluded from routines.',
              },
              {
                icon: <Heart className="h-5 w-5" />,
                title: 'Adapt to your trimester',
                desc: 'Your routine evolves as your body changes — from first trimester nausea-friendly protocols to third trimester stretch-mark prevention.',
              },
              {
                icon: <AlertTriangle className="h-5 w-5" />,
                title: 'Alert on risky products',
                desc: 'When scanning any product — yours or from a shelf — m.i. will warn about ingredients contraindicated during pregnancy.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-5 rounded-xl border border-border/60 bg-card"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${SAGE}20` }}>
                  <div style={{ color: SAGE }}>{item.icon}</div>
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Optional due date */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider pl-1">
              Due date (optional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select your due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            size="lg"
            onClick={handleContinue}
            className="w-full h-12 text-base rounded-lg"
          >
            Continue
          </Button>
          <OnboardingBackButton onClick={() => setStep('trimester')} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={2} />
      <div className="max-w-lg w-full text-center space-y-8 animate-slide-up">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-body">
            Pregnancy Intelligence
          </p>
          <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground leading-tight">
            Which trimester are you in?
          </h1>
          <p className="text-muted-foreground text-base font-body">
            This helps m.i. calibrate your protocols and ingredient safety filters.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          {([
            { value: 1 as const, label: 'First Trimester', desc: 'Weeks 1–12 · Gentle, nourishing protocols', detail: 'Focus: hydration, nausea-friendly textures, barrier support' },
            { value: 2 as const, label: 'Second Trimester', desc: 'Weeks 13–26 · The glow phase', detail: 'Focus: radiance, pigmentation prevention, elasticity' },
            { value: 3 as const, label: 'Third Trimester', desc: 'Weeks 27–40 · Preparation & protection', detail: 'Focus: stretch marks, deep hydration, calming protocols' },
          ]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTrimester(opt.value)}
              className={cn(
                'p-6 rounded-xl border-2 text-left transition-all duration-300',
                trimester === opt.value
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-card hover:border-primary/40'
              )}
            >
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: trimester === opt.value ? SAGE : 'hsl(var(--muted))',
                    color: trimester === opt.value ? 'white' : 'hsl(var(--muted-foreground))',
                  }}
                >
                  {opt.value}
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground">{opt.label}</h3>
              </div>
              <p className="text-sm text-muted-foreground font-body ml-11">{opt.desc}</p>
              <p className="text-xs text-muted-foreground/70 font-body ml-11 mt-1">{opt.detail}</p>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!trimester}
          className={cn(
            'w-full py-4 rounded-lg text-lg font-medium transition-all duration-300',
            trimester
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

export default PregnancyOnboarding;
