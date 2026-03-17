import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export const StressWidget = () => {
  const level = 55; // 0-100
  const label = level < 40 ? 'Low' : level < 70 ? 'Moderate' : 'Elevated';
  const barHeight = `${level}%`;

  return (
    <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
      <CardContent className="p-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5 self-start">
          <Activity className="h-3.5 w-3.5 text-[hsl(var(--intel-stress))]" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Stress Index</span>
        </div>

        <div className="flex items-end justify-center gap-2 h-24 w-full">
          {/* Vertical bar */}
          <div className="relative w-8 h-full rounded-full bg-[hsl(var(--intel-stress-light))] overflow-hidden">
            <div
              className="absolute bottom-0 left-0 right-0 rounded-full bg-[hsl(var(--intel-stress))] transition-all duration-1000"
              style={{ height: barHeight }}
            />
          </div>
          <div className="flex flex-col justify-end pb-1">
            <span className="text-lg font-heading font-bold">{label}</span>
            <span className="text-[9px] text-muted-foreground">Cortisol</span>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          Linked to skin sensitivity analysis
        </p>
      </CardContent>
    </Card>
  );
};
