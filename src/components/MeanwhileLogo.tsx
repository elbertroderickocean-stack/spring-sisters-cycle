import React from 'react';
import { cn } from '@/lib/utils';

interface MeanwhileLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showIcon?: boolean;
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-5xl md:text-6xl',
  xl: 'text-6xl md:text-8xl',
};

export const MeanwhileLogo = ({ size = 'md', className, showIcon = false }: MeanwhileLogoProps) => {
  if (showIcon) {
    const iconSize = size === 'xl' ? 'text-5xl md:text-7xl' : size === 'lg' ? 'text-4xl md:text-5xl' : size === 'md' ? 'text-xl' : 'text-base';
    return (
      <span className={cn('font-heading font-extrabold inline-flex items-baseline', iconSize, className)}>
        <span className="text-primary">[</span>
        <span>m</span>
        <span className="text-primary">]</span>
      </span>
    );
  }

  return (
    <span className={cn('font-heading font-extrabold lowercase tracking-tight inline-flex items-baseline', sizeClasses[size], className)}>
      meanwhile
    </span>
  );
};

/** Standalone bracket icon mark */
export const MeanwhileIcon = ({ className }: { className?: string }) => (
  <span className={cn('font-heading font-extrabold inline-flex items-baseline', className)}>
    <span className="text-primary">[</span>
    <span>m</span>
    <span className="text-primary">]</span>
  </span>
);
