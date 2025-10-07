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
  const [lastPeriodDate, setLastPeriodDate] = useState<Date>();
  const [cycleLength, setCycleLength] = useState<string>('28');

  const handleNext = () => {
    if (lastPeriodDate && cycleLength) {
      updateUserData({
        lastPeriodDate,
        cycleLength: parseInt(cycleLength),
      });
      navigate('/register');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-heading font-semibold text-primary">
            Let's create your personal skin map.
          </h2>
        </div>

        <div className="space-y-6 pt-6">
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

          <Button
            size="lg"
            onClick={handleNext}
            disabled={!lastPeriodDate || !cycleLength}
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
