import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

const Personalize = () => {
  const navigate = useNavigate();
  const { updateUserData } = useUser();
  const [selectedRhythm, setSelectedRhythm] = useState<'hormonal' | 'cellular' | null>(null);
  const [lastPeriodDate, setLastPeriodDate] = useState<Date>();
  const [cycleLength, setCycleLength] = useState<string>('28');

  const handleNext = () => {
    if (selectedRhythm === 'hormonal' && lastPeriodDate && cycleLength) {
      updateUserData({
        lastPeriodDate,
        cycleLength: parseInt(cycleLength),
      });
      navigate('/register');
    } else if (selectedRhythm === 'cellular') {
      navigate('/wise-bloom');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-heading font-semibold text-primary">
            Let's create your personal skin map.
          </h2>
          <p className="text-lg text-foreground/80">
            To create your map, let's first identify your primary rhythm.
          </p>
        </div>

        <div className="space-y-6 pt-6">
          {/* Rhythm Selection Cards */}
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setSelectedRhythm('hormonal')}
              className={cn(
                "p-6 rounded-xl border-2 text-left transition-all hover:border-primary/50",
                selectedRhythm === 'hormonal' 
                  ? "border-primary bg-primary/5" 
                  : "border-border bg-background"
              )}
            >
              <h3 className="text-xl font-heading font-semibold mb-2">
                The Hormonal Rhythm
              </h3>
              <p className="text-sm text-muted-foreground">
                For women with a regular or irregular menstrual cycle.
              </p>
            </button>

            <button
              onClick={() => setSelectedRhythm('cellular')}
              className={cn(
                "p-6 rounded-xl border-2 text-left transition-all hover:border-primary/50",
                selectedRhythm === 'cellular' 
                  ? "border-primary bg-primary/5" 
                  : "border-border bg-background"
              )}
            >
              <h3 className="text-xl font-heading font-semibold mb-2">
                The Cellular Training Rhythm
              </h3>
              <p className="text-sm text-muted-foreground">
                For women in menopause or without a regular cycle.
              </p>
            </button>
          </div>

          {/* Cycle Input Fields - Only shown when Hormonal Rhythm is selected */}
          {selectedRhythm === 'hormonal' && (
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

              <p className="text-sm text-muted-foreground pt-2">
                This data remains confidential and is used only to give you accurate daily recommendations.
              </p>
            </div>
          )}

          <Button
            size="lg"
            onClick={handleNext}
            disabled={
              !selectedRhythm || 
              (selectedRhythm === 'hormonal' && (!lastPeriodDate || !cycleLength))
            }
            className="w-full mt-6 h-12 text-base rounded-full"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Personalize;
