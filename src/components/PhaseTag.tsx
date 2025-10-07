import React from 'react';
import { PhaseType } from '@/contexts/UserContext';

interface PhaseTagProps {
  phase: PhaseType;
  className?: string;
}

export const PhaseTag: React.FC<PhaseTagProps> = ({ phase, className = '' }) => {
  const phaseConfig = {
    calm: {
      label: 'Calm & Renew',
      className: 'phase-calm',
    },
    glow: {
      label: 'Glow & Energize',
      className: 'phase-glow',
    },
    balance: {
      label: 'Balance & Clarify',
      className: 'phase-balance',
    },
  };

  const config = phaseConfig[phase];

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${config.className} ${className}`}>
      {config.label}
    </span>
  );
};
