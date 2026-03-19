import React from 'react';
import { cn } from '@/lib/utils';

interface OnboardingProgressBarProps {
  currentStep: number;
}

const segments = [
  { number: 1, label: 'Strategy' },
  { number: 2, label: 'Biology' },
  { number: 3, label: 'Lifestyle' },
  { number: 4, label: 'Portfolio' },
];

const getActiveSegment = (step: number): number => {
  if (step <= 2) return 1;
  if (step <= 5) return 2;
  if (step <= 7) return 3;
  return 4;
};

const OnboardingProgressBar = ({ currentStep }: OnboardingProgressBarProps) => {
  const activeSegment = getActiveSegment(currentStep);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-6 pb-4 px-6 bg-[hsl(0_0%_100%/0.5)] backdrop-blur-[40px] border-b border-[hsl(0_0%_0%/0.06)]">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-between relative">
          {segments.map((seg, i) => {
            const isComplete = activeSegment > seg.number;
            const isActive = activeSegment === seg.number;
            const isPending = activeSegment < seg.number;

            return (
              <React.Fragment key={seg.number}>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-700",
                      isActive && "shadow-[0_0_16px_hsl(var(--primary)/0.4)]"
                    )}
                    style={{
                      backgroundColor: isComplete || isActive ? 'hsl(var(--primary))' : 'transparent',
                      color: isComplete || isActive ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                      border: isPending ? '1.5px solid hsl(var(--border))' : '1.5px solid hsl(var(--primary))',
                    }}
                  >
                    {isComplete ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      seg.number
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[9px] uppercase tracking-[0.15em] font-body transition-colors duration-500 whitespace-nowrap",
                      isPending ? "text-muted-foreground/30" : "text-muted-foreground"
                    )}
                  >
                    {seg.label}
                  </span>
                </div>

                {i < segments.length - 1 && (
                  <div className="flex-1 h-[1.5px] mx-1 -mt-5 relative">
                    <div className="absolute inset-0 bg-border rounded-full" />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: isComplete ? '100%' : isActive ? '50%' : '0%',
                        backgroundColor: 'hsl(var(--primary))',
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OnboardingProgressBar;
