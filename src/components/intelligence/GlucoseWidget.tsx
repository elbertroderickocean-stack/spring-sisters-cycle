import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanLine, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, ReferenceLine } from 'recharts';

const generateGlucoseData = () => {
  const hours = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'];
  return hours.map((h, i) => {
    let base = 85;
    if (i >= 2 && i <= 4) base = 95 + Math.random() * 20; // post breakfast
    if (i >= 6 && i <= 8) base = 100 + Math.random() * 25; // post lunch
    return { time: h, glucose: Math.round(base + Math.random() * 10) };
  });
};

const chartConfig: ChartConfig = {
  glucose: {
    label: 'Glucose mg/dL',
    color: 'hsl(270 40% 45%)',
  },
};

export const GlucoseWidget = () => {
  const [scanning, setScanning] = useState(false);
  const [spikeDetected, setSpikeDetected] = useState(false);
  const data = useMemo(generateGlucoseData, []);

  const handleScan = () => {
    setScanning(true);
    setSpikeDetected(false);
    setTimeout(() => {
      setScanning(false);
      const spike = Math.random() > 0.4;
      setSpikeDetected(spike);
      if (spike) {
        toast.warning('Glycation Risk Detected', {
          description: 'Evening protocol will be adjusted to prioritize anti-glycation assets.',
        });
      } else {
        toast.success('Glucose Stable', {
          description: 'No intervention required. Portfolio remains optimized.',
        });
      }
    }, 2000);
  };

  return (
    <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-heading">Glucose Management</CardTitle>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Live</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(270 40% 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(270 40% 45%)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis domain={[70, 140]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <ReferenceLine y={120} stroke="hsl(35 50% 60%)" strokeDasharray="4 4" strokeOpacity={0.6} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="glucose"
              stroke="hsl(270 40% 45%)"
              strokeWidth={2}
              fill="url(#glucoseGradient)"
            />
          </AreaChart>
        </ChartContainer>

        {spikeDetected && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(var(--intel-stress-light))] border border-[hsl(var(--intel-stress))]/20">
            <AlertTriangle className="h-4 w-4 text-[hsl(var(--intel-stress))]" />
            <p className="text-xs">Glycation Risk Detected. Evening protocol will be adjusted.</p>
          </div>
        )}

        <Button
          onClick={handleScan}
          disabled={scanning}
          className="w-full bg-[hsl(var(--intel-glucose))] hover:bg-[hsl(var(--intel-glucose))]/90 text-white"
        >
          <ScanLine className="h-4 w-4 mr-2" />
          {scanning ? 'Analyzing...' : 'Scan Meal / Insight'}
        </Button>
      </CardContent>
    </Card>
  );
};
