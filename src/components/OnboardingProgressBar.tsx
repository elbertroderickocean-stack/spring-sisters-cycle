import React from 'react';
import { cn } from '@/lib/utils';

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const segments = [
  { label: 'Strategy', steps: [1, 2] },
  { label: 'Biology', steps: [3, 4, 5, 6] },
  { label: 'Lifestyle', steps: [7, 8] },
  { label: 'Portfolio', steps: [9] },
];

const OnboardingProgressBar = ({ currentStep }: OnboardingProgressBarProps) => {
  const getSegmentState = (segment: typeof segments[0]) => {
    const maxStep = Math.max(...segment.steps);
    const minStep = Math.min(...segment.steps);
    if (currentStep > maxStep) return 'complete';
    if (currentStep >= minStep) return 'active';
    return 'pending';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-4 pb-2">
      <div className="max-w-lg mx-auto flex gap-2">
        {segments.map((segment, i) => {
          const state = getSegmentState(segment);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full h-[3px] rounded-full overflow-hidden bg-border/30">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out",
                    state === 'complete' && "w-full",
                    state === 'active' && "w-1/2",
                    state === 'pending' && "w-0"
                  )}
                  style={{
                    backgroundColor: state !== 'pending' ? '#B2C2B2' : 'transparent',
                  }}
                />
              </div>
              <span
                className={cn(
                  "text-[9px] uppercase tracking-[0.2em] font-body transition-colors duration-500",
                  state === 'pending' ? "text-muted-foreground/40" : "text-muted-foreground"
                )}
              >
                {segment.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingProgressBar;
