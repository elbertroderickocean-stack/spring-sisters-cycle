import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export const CausalityCard = () => {
  return (
    <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[hsl(var(--intel-glucose))]" />
          <CardTitle className="text-base font-heading">Impact on Skin Portfolio</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed">
          <span className="font-medium text-[hsl(var(--intel-glucose))]">High Glucose</span>
          {' + '}
          <span className="font-medium text-[hsl(var(--intel-sleep))]">Low Sleep</span>
          {' = '}
          <span className="font-medium text-[hsl(var(--intel-stress))]">Inflammation Risk</span>
        </p>
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            System is prioritizing <span className="font-medium text-foreground">Shift 01 (Recovery)</span> for 
            the next 24 hours. Anti-glycation protocol activated. Evening deployment adjusted.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
