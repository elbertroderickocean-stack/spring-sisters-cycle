import React from 'react';

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const OnboardingProgressBar = ({ currentStep, totalSteps = 8 }: OnboardingProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-[2px] w-full bg-border/30">
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: 'hsl(var(--primary))',
          }}
        />
      </div>
    </div>
  );
};

export default OnboardingProgressBar;
