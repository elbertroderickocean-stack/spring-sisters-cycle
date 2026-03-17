import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Activity, Shield, Heart } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, ReferenceLine } from 'recharts';

const hrvData = Array.from({ length: 24 }, (_, i) => {
  const hour = `${i}:00`;
  let base = 45;
  if (i >= 0 && i <= 6) base = 60 + Math.random() * 15; // sleep
  else if (i >= 9 && i <= 12) base = 35 + Math.random() * 10; // work stress
  else if (i >= 14 && i <= 16) base = 40 + Math.random() * 10;
  else base = 50 + Math.random() * 10;
  return { time: hour, hrv: Math.round(base) };
});

const chartConfig: ChartConfig = {
  hrv: { label: 'HRV (ms)', color: 'hsl(35 50% 60%)' },
};

const StressDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/intelligence')} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-heading font-semibold tracking-tight">Stress Index</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Cortisol Intelligence</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* HRV Trend */}
        <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">Heart Rate Variability</CardTitle>
            <p className="text-xs text-muted-foreground">24h trend · Higher is better</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <LineChart data={hrvData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="hrvGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(35 50% 60%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(35 50% 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={3} />
                <YAxis domain={[20, 80]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <ReferenceLine y={50} stroke="hsl(120 12% 69%)" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Optimal', fontSize: 9, fill: 'hsl(120 12% 69%)' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="hrv" stroke="hsl(35 50% 60%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Avg HRV', value: '48ms', icon: Heart, color: '--intel-stress' },
            { label: 'Cortisol Est.', value: 'Moderate', icon: Activity, color: '--intel-stress' },
            { label: 'Barrier Risk', value: 'Medium', icon: Shield, color: '--intel-glucose' },
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
            <CardTitle className="text-sm font-heading text-[hsl(var(--intel-stress))]">Biological Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed">
              Cortisol is the enemy of the barrier. When stress elevates, skin permeability increases — 
              allowing irritants in and moisture out. Your HRV dipped to <span className="font-medium">35ms</span> during 
              late morning, indicating a stress peak.
            </p>
            <div className="p-3 rounded-lg bg-[hsl(var(--intel-stress-light))] border border-[hsl(var(--intel-stress))]/15">
              <p className="text-xs text-muted-foreground italic">
                High stress detected? Your skin permeability increases by up to 40%, compromising barrier function.
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
                Prioritizing The Constants (Barrier support) to prevent stress-induced redness. 
                Ceramide deployment increased.
                <span className="block mt-2 text-muted-foreground italic">
                  You power through your day. meanwhile., we are reinforcing your barrier against cortisol damage.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StressDetail;
