import React from 'react';

interface MetricCardProps {
  label: string;
  children: React.ReactNode;
  sublabel?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, children, sublabel }) => (
  <div className="glass-card p-5 min-w-[150px] w-[150px] flex-shrink-0 flex flex-col gap-3">
    <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground leading-tight">{label}</span>
    <div className="flex-1 flex items-center justify-center">
      {children}
    </div>
    {sublabel && (
      <span className="text-[10px] text-muted-foreground text-center">{sublabel}</span>
    )}
  </div>
);

export const DashboardMetrics: React.FC = () => {
  const streak = 9;
  const consistency = 82;
  const toneDrift = 3;

  const circumference = 2 * Math.PI * 32;
  const strokeDashoffset = circumference - (consistency / 100) * circumference;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
      {/* Return Streak */}
      <MetricCard label="Return Streak">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-mono-data font-bold text-primary">{streak}</span>
          <span className="text-[11px] text-muted-foreground mt-1">days</span>
        </div>
      </MetricCard>

      {/* Routine Consistency */}
      <MetricCard label="Routine Consistency This Cycle">
        <div className="relative w-[72px] h-[72px]">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
            <circle
              cx="36" cy="36" r="32"
              stroke="hsl(var(--border))"
              strokeWidth="3"
              fill="none"
              opacity="0.3"
            />
            <circle
              cx="36" cy="36" r="32"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
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

      {/* Skin Baseline Tone Drift */}
      <MetricCard label="Skin Baseline Tone Drift This Cycle">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-mono-data font-bold text-foreground">
            +{toneDrift}%
          </span>
        </div>
      </MetricCard>
    </div>
  );
};
