import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Moon } from 'lucide-react';

export const SleepWidget = () => {
  const quality = 85;
  const restHours = 6.5;
  const circumference = 2 * Math.PI * 40;
  const filled = (quality / 100) * circumference;

  return (
    <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
      <CardContent className="p-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5 self-start">
          <Moon className="h-3.5 w-3.5 text-[hsl(var(--intel-sleep))]" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Recovery & Sleep</span>
        </div>
        
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--intel-sleep-light))" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="hsl(var(--intel-sleep))"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - filled}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-mono-data font-bold">{quality}%</span>
            <span className="text-[9px] text-muted-foreground">Quality</span>
          </div>
        </div>

        <div className="text-center space-y-0.5">
          <p className="text-xs font-medium">{restHours}h restorative</p>
          <p className="text-[10px] text-muted-foreground">Circadian rhythm synchronized</p>
        </div>
      </CardContent>
    </Card>
  );
};
