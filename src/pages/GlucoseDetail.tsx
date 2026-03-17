import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, TrendingDown, Zap, Camera } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, ReferenceLine } from 'recharts';

const generateFullDayGlucose = () => {
  const data = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const t = h + m / 60;
      let base = 82;
      // Breakfast spike
      if (t >= 7.5 && t <= 9) base = 85 + 40 * Math.exp(-0.5 * Math.pow(t - 8, 2));
      // Lunch spike
      else if (t >= 12 && t <= 14) base = 85 + 50 * Math.exp(-0.5 * Math.pow(t - 12.8, 2));
      // Dinner spike
      else if (t >= 18.5 && t <= 21) base = 85 + 35 * Math.exp(-0.5 * Math.pow(t - 19.2, 2));
      data.push({
        time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
        glucose: Math.round(base + (Math.random() - 0.5) * 6),
      });
    }
  }
  return data;
};

const chartConfig: ChartConfig = {
  glucose: { label: 'Glucose mg/dL', color: 'hsl(270 40% 45%)' },
};

const GlucoseDetail = () => {
  const navigate = useNavigate();
  const data = useMemo(generateFullDayGlucose, []);
  const peakValue = Math.max(...data.map((d) => d.glucose));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/intelligence')} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-heading font-semibold tracking-tight">Glucose Management</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Anti-Glycation Intelligence</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Continuous Glucose Curve */}
        <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading">Continuous Glucose Curve</CardTitle>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">24h</span>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="glucoseDetailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(270 40% 45%)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(270 40% 45%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={15} />
                <YAxis domain={[60, 150]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <ReferenceLine y={120} stroke="hsl(35 50% 60%)" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Glycation Zone', fontSize: 9, fill: 'hsl(35 50% 60%)' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="glucose" stroke="hsl(270 40% 45%)" strokeWidth={1.5} fill="url(#glucoseDetailGrad)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Peak', value: `${peakValue} mg/dL`, icon: Zap, color: '--intel-glucose' },
            { label: 'Spikes', value: '3 today', icon: AlertTriangle, color: '--intel-stress' },
            { label: 'Avg', value: '92 mg/dL', icon: TrendingDown, color: '--intel-sleep' },
          ].map((m) => (
            <Card key={m.label} className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
              <CardContent className="p-3 flex flex-col items-center gap-1.5">
                <m.icon className={`h-4 w-4 text-[hsl(var(${m.color}))]`} />
                <span className="text-base font-heading font-bold">{m.value}</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{m.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Biological Impact */}
        <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading text-[hsl(var(--intel-glucose))]">Biological Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed">
              Glycation peaks lead to collagen cross-linking — making skin stiffer and less elastic. 
              Your post-lunch spike reached <span className="font-medium">{peakValue} mg/dL</span>, entering 
              the glycation zone where AGE (Advanced Glycation End-products) formation accelerates.
            </p>
            <div className="p-3 rounded-lg bg-[hsl(var(--intel-glucose-light))] border border-[hsl(var(--intel-glucose))]/15">
              <p className="text-xs text-muted-foreground italic">
                Each spike above 120 mg/dL contributes to cumulative collagen damage. Frequency matters more than magnitude.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Skin Action */}
        <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Skin Action</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs leading-relaxed">
                Triggering Anti-Glycation Asset deployment. Evening protocol prioritizes collagen repair with 
                The Cellular Architect Cream (PDRN).
                <span className="block mt-2 text-muted-foreground italic">
                  You enjoyed that meal. meanwhile., we are managing the glycation consequences.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scan Meal Button */}
        <Button
          onClick={() => navigate('/meal-scanner')}
          className="w-full bg-[hsl(var(--intel-glucose))] hover:bg-[hsl(var(--intel-glucose))]/90 text-white"
        >
          <Camera className="h-4 w-4 mr-2" />
          Scan Meal / Insight
        </Button>
      </main>
    </div>
  );
};

export default GlucoseDetail;
