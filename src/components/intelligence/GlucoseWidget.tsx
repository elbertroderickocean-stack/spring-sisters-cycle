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
    if (i >= 2 && i <= 4) base = 95 + Math.random() * 20;
    if (i >= 6 && i <= 8) base = 100 + Math.random() * 25;
    return { time: h, glucose: Math.round(base + Math.random() * 10) };
  });
};

const chartConfig: ChartConfig = {
  glucose: {
    label: 'Glucose mg/dL',
    color: 'hsl(var(--intel-glucose))',
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
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold">Glucose Management</CardTitle>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Live</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--intel-glucose))" stopOpacity={0.12} />
                <stop offset="100%" stopColor="hsl(var(--intel-glucose))" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis domain={[70, 140]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <ReferenceLine y={120} stroke="hsl(var(--intel-stress))" strokeDasharray="4 4" strokeOpacity={0.3} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="glucose"
              stroke="hsl(var(--intel-glucose))"
              strokeWidth={2}
              fill="url(#glucoseGradient)"
            />
          </AreaChart>
        </ChartContainer>

        {spikeDetected && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[hsl(var(--intel-stress-light))] border-[0.5px] border-[hsl(var(--intel-stress))]/20">
            <AlertTriangle className="h-4 w-4 text-[hsl(var(--intel-stress))]" />
            <p className="text-xs">Glycation Risk Detected. Evening protocol will be adjusted.</p>
          </div>
        )}

        <Button
          onClick={handleScan}
          disabled={scanning}
          className="w-full"
        >
          <ScanLine className="h-4 w-4 mr-2" />
          {scanning ? 'Analyzing...' : 'Scan Meal / Insight'}
        </Button>
      </CardContent>
    </Card>
  );
};
