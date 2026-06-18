import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const streak = 9;
  const consistency = 82;
  const toneDrift = 3;

  const circumference = 2 * Math.PI * 32;
  const strokeDashoffset = circumference - (consistency / 100) * circumference;

  const [activeMetric, setActiveMetric] = useState<MetricDetail | null>(null);

  const metrics: Record<string, MetricDetail> = {
    streak: {
      title: t('dashboard.streak_title'),
      value: t('dashboard.streak_value', { n: streak }),
      description: t('dashboard.streak_desc', { n: streak }),
    },
    consistency: {
      title: t('dashboard.consistency_title'),
      value: `${consistency}%`,
      description: t('dashboard.consistency_desc', { n: consistency, rest: 100 - consistency }),
    },
    toneDrift: {
      title: t('dashboard.drift_title'),
      value: `+${toneDrift}%`,
      description: t('dashboard.drift_desc', { n: toneDrift }),
    },
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label={t('dashboard.streak_label')} onClick={() => setActiveMetric(metrics.streak)}>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-mono-data font-bold text-foreground">{streak}</span>
            <span className="text-[11px] text-muted-foreground mt-1">{t('dashboard.days')}</span>
          </div>
        </MetricCard>

        <MetricCard label={t('dashboard.consistency_label')} onClick={() => setActiveMetric(metrics.consistency)}>
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

        <MetricCard label={t('dashboard.drift_label')} onClick={() => setActiveMetric(metrics.toneDrift)}>
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
