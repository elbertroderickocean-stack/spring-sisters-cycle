import React from 'react';
import { useUser } from '@/contexts/UserContext';

const FRAMEWORK_PRODUCTS = ['cleanser', 'serum-trio', 'eye-cream', 'moisturizer', 'ceramide'];

export const SynergyIndex: React.FC = () => {
  const { isProductOwned } = useUser();

  const ownedCount = FRAMEWORK_PRODUCTS.filter(id => isProductOwned(id)).length;
  const percentage = Math.round((ownedCount / FRAMEWORK_PRODUCTS.length) * 100);

  const getColor = () => {
    if (percentage >= 80) return 'hsl(var(--sage))';
    if (percentage >= 40) return 'hsl(var(--intel-glucose))';
    return 'hsl(var(--intel-stress))';
  };

  const color = getColor();
  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40" cy="40" r="38"
              stroke="hsl(var(--border))"
              strokeWidth="2.5"
              fill="none"
              opacity="0.2"
            />
            <circle
              cx="40" cy="40" r="38"
              stroke={color}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-mono-data font-bold" style={{ color }}>
              {percentage}%
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Protocol Intelligence
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {percentage < 40
              ? 'Your routine is active, but disconnected from live bio-data. Complete the framework to unlock autonomous skin management.'
              : percentage < 80
              ? 'Your framework is building momentum. A few more assets will unlock full synergy across all protocols.'
              : 'Your portfolio is operating at near-full intelligence. meanwhile., all systems are optimizing autonomously.'}
          </p>
          {percentage < 100 && (
            <p className="text-[10px] text-muted-foreground/60 mt-1.5 font-mono-data">
              {ownedCount}/{FRAMEWORK_PRODUCTS.length} assets deployed
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
