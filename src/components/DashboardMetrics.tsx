import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface MetricCardProps {
  label: string;
  children: React.ReactNode;
  sublabel?: string;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, children, sublabel, onClick }) => (
  <button
    onClick={onClick}
    className="glass-card p-5 flex-1 min-w-0 flex flex-col gap-3 text-left transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-medium)] active:scale-[0.98] cursor-pointer"
  >
    <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground leading-tight">{label}</span>
    <div className="flex-1 flex items-center justify-center">
      {children}
    </div>
    {sublabel && (
      <span className="text-[10px] text-muted-foreground text-center">{sublabel}</span>
    )}
  </button>
);

interface MetricDetail {
  title: string;
  value: string;
  description: string;
}

export const DashboardMetrics: React.FC = () => {
  const streak = 9;
  const consistency = 82;
  const toneDrift = 3;

  const circumference = 2 * Math.PI * 32;
  const strokeDashoffset = circumference - (consistency / 100) * circumference;

  const [activeMetric, setActiveMetric] = useState<MetricDetail | null>(null);

  const metrics: Record<string, MetricDetail> = {
    streak: {
      title: 'Return Streak',
      value: `${streak} days`,
      description: 'Consistency is the engine of compound beauty. Your 9-day streak has improved cellular uptake by 12%. Every consecutive day amplifies absorption efficiency, compounding your skin\'s long-term ROI.',
    },
    consistency: {
      title: 'Routine Consistency',
      value: `${consistency}%`,
      description: 'Protocol Adherence. You are following 82% of m.i. recommendations. Unlocking the remaining 18% will optimize your anti-glycation shield and accelerate barrier recovery.',
    },
    toneDrift: {
      title: 'Skin Baseline Tone Drift',
      value: `+${toneDrift}%`,
      description: 'Visual ROI. Your skin luminance has drifted +3% towards optimal radiance since your baseline scan. This correlates with improved hydration retention and melanin regulation.',
    },
  };

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
        <MetricCard label="Return Streak" onClick={() => setActiveMetric(metrics.streak)}>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-mono-data font-bold text-foreground">{streak}</span>
            <span className="text-[11px] text-muted-foreground mt-1">days</span>
          </div>
        </MetricCard>

        <MetricCard label="Routine Consistency This Cycle" onClick={() => setActiveMetric(metrics.consistency)}>
          <div className="relative w-[72px] h-[72px]">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
              <circle
                cx="36" cy="36" r="32"
                stroke="hsl(var(--border))"
                strokeWidth="2.5"
                fill="none"
                opacity="0.3"
              />
              <circle
                cx="36" cy="36" r="32"
                stroke="hsl(var(--primary))"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-mono-data font-bold text-foreground">{consistency}%</span>
            </div>
          </div>
        </MetricCard>

        <MetricCard label="Skin Baseline Tone Drift This Cycle" onClick={() => setActiveMetric(metrics.toneDrift)}>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-mono-data font-bold text-foreground">
              +{toneDrift}%
            </span>
          </div>
        </MetricCard>
      </div>

      <Dialog open={!!activeMetric} onOpenChange={(open) => !open && setActiveMetric(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {activeMetric?.title}
            </DialogTitle>
            <div className="flex items-center justify-center py-6">
              <span className="text-5xl font-mono-data font-bold text-[hsl(var(--sage-foreground))]">
                {activeMetric?.value}
              </span>
            </div>
            <DialogDescription className="text-sm leading-relaxed">
              {activeMetric?.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
