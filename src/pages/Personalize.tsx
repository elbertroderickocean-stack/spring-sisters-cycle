import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
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

  const isHormonal = strategy === 'hormonal';

  const handleNext = () => {
    if (isHormonal && lastPeriodDate && cycleLength && cgmChoice) {
      updateUserData({
        lastPeriodDate,
        cycleLength: parseInt(cycleLength),
        wiseBloomMode: false,
      });
      navigate('/register', { state: { selectedRhythm: 'hormonal' } });
    } else if (!isHormonal && cgmChoice) {
      navigate('/wise-bloom', { state: { selectedRhythm: 'cellular' } });
    }
  };

  const canProceed = cgmChoice && (isHormonal ? (lastPeriodDate && cycleLength) : true);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
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
