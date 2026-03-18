import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export const CausalityCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[hsl(var(--intel-glucose))]" />
          <CardTitle className="text-base font-bold">Impact on Skin Portfolio</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed">
          <span className="font-semibold text-[hsl(var(--intel-glucose))]">High Glucose</span>
          {' + '}
          <span className="font-semibold text-[hsl(var(--intel-sleep))]">Low Sleep</span>
          {' = '}
          <span className="font-semibold text-[hsl(var(--intel-stress))]">Inflammation Risk</span>
        </p>
        <div className="p-3 rounded-lg bg-[hsl(var(--glass-highlight))] border border-[hsl(var(--glass-border))]">
          <p className="text-sm text-muted-foreground leading-relaxed">
            System is prioritizing <span className="font-semibold text-foreground">Shift 01 (Recovery)</span> for 
            the next 24 hours. Anti-glycation protocol activated. Evening deployment adjusted.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
