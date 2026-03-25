import React from 'react';
import { cn } from '@/lib/utils';

interface MeanwhileLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-5xl md:text-6xl',
  xl: 'text-6xl md:text-8xl',
};

export const MeanwhileLogo = ({ size = 'md', className }: MeanwhileLogoProps) => {
  const dotSize = size === 'xl' ? 'w-3 h-3' : size === 'lg' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-1.5 h-1.5' : 'w-1 h-1';

  return (
    <span className={cn('font-heading font-extrabold lowercase tracking-tight inline-flex items-baseline', sizeClasses[size], className)}>
      meanwhile
      <span className={cn('inline-block bg-primary rounded-[1px] ml-[0.05em] self-end mb-[0.15em]', dotSize)} />
    </span>
  );
};
