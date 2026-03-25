import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Pill } from 'lucide-react';
import OnboardingBackButton from '@/components/OnboardingBackButton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';

const Personalize = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserData } = useUser();
  const strategy = (location.state as any)?.strategy as 'hormonal' | 'longevity' | undefined;

  const [lastPeriodDate, setLastPeriodDate] = useState<Date>();
  const [cycleLength, setCycleLength] = useState<string>('28');
  const [cgmChoice, setCgmChoice] = useState<'apple-health' | 'manual' | null>(null);
  const [takesHormones, setTakesHormones] = useState<boolean | null>(null);
  const [hormoneName, setHormoneName] = useState('');

  const isHormonal = strategy === 'hormonal';

  const handleNext = () => {
    const medicationData = {
      takesHormonalMedication: takesHormones === true,
      hormonalMedicationName: takesHormones ? hormoneName.trim() : '',
    };

    if (isHormonal && lastPeriodDate && cycleLength && cgmChoice && takesHormones !== null) {
      updateUserData({
        lastPeriodDate,
        cycleLength: parseInt(cycleLength),
        wiseBloomMode: false,
        ...medicationData,
      });
      navigate('/inventory');
    } else if (!isHormonal && cgmChoice && takesHormones !== null) {
      updateUserData(medicationData);
      navigate('/wise-bloom', { state: { selectedRhythm: 'cellular' } });
    }
  };

  const canProceed = cgmChoice && takesHormones !== null && (takesHormones === false || hormoneName.trim().length > 0) && (isHormonal ? (lastPeriodDate && cycleLength) : true);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={6} />
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground font-body">
            {isHormonal ? 'Hormonal Management' : 'Longevity Management'}
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground">
            Let's personalize your strategy.
          </h2>
        </div>

        <div className="space-y-6 pt-4">
          {/* CGM Question */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-foreground">
              Do you use a CGM (Glucose Monitor)?
            </Label>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setCgmChoice('apple-health')}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  cgmChoice === 'apple-health'
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <p className="font-medium text-foreground">Yes, connect via Apple Health</p>
                <p className="text-xs text-muted-foreground mt-1">We'll sync your glucose data automatically.</p>
              </button>
              <button
                onClick={() => setCgmChoice('manual')}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  cgmChoice === 'manual'
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <p className="font-medium text-foreground">No, I will log manually</p>
                <p className="text-xs text-muted-foreground mt-1">Quick daily check-ins to track your levels.</p>
              </button>
            </div>
          </div>

          {/* Hormonal Medication Question */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-foreground flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary" />
              Are you taking any hormonal medications?
            </Label>
            <p className="text-xs text-muted-foreground -mt-1">
              e.g. birth control, HRT, thyroid medication, corticosteroids
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTakesHormones(true)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  takesHormones === true
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <p className="font-medium text-foreground">Yes</p>
                <p className="text-xs text-muted-foreground mt-0.5">I take hormonal medication</p>
              </button>
              <button
                onClick={() => { setTakesHormones(false); setHormoneName(''); }}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  takesHormones === false
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <p className="font-medium text-foreground">No</p>
                <p className="text-xs text-muted-foreground mt-0.5">Not currently</p>
              </button>
            </div>

            {takesHormones && (
              <div className="animate-fade-in space-y-2 pt-2">
                <Label htmlFor="hormone-name" className="text-sm text-foreground">
                  Medication name
                </Label>
                <Input
                  id="hormone-name"
                  type="text"
                  placeholder="e.g. Levothyroxine, Yaz, Estradiol..."
                  value={hormoneName}
                  onChange={(e) => setHormoneName(e.target.value)}
                  className="h-12 text-base"
                  maxLength={100}
                />
                <p className="text-[10px] text-muted-foreground">
                  m.i. will analyze how this affects your skin and adjust your protocol accordingly.
                </p>
              </div>
            )}
          </div>

          {/* Cycle Input Fields - Only for Hormonal */}
          {isHormonal && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-3">
                <Label htmlFor="period-date" className="text-base">
                  First day of your last period
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal h-12',
                        !lastPeriodDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {lastPeriodDate ? format(lastPeriodDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto bg-popover z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={lastPeriodDate}
                      onSelect={setLastPeriodDate}
                      initialFocus
                      className="pointer-events-auto"
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <Label htmlFor="cycle-length" className="text-base">
                  Average cycle length (in days)
                </Label>
                <Input
                  id="cycle-length"
                  type="number"
                  min="21"
                  max="40"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center pt-2">
            Your data remains confidential and is used only to personalize your strategy.
          </p>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={!canProceed}
            className="w-full mt-4 h-12 text-base rounded-lg"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Personalize;
