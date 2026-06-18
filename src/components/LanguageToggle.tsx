import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  className?: string;
  variant?: 'default' | 'onPrimary';
}

export const LanguageToggle = ({ className, variant = 'default' }: LanguageToggleProps) => {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('ru') ? 'ru' : 'en';

  const setLang = (lng: 'en' | 'ru') => {
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem('meanwhile.lang', lng);
    } catch {}
  };

  const baseTrack =
    variant === 'onPrimary'
      ? 'border-primary-foreground/30 bg-primary-foreground/10'
      : 'border-border bg-card/80 backdrop-blur';
  const activePill =
    variant === 'onPrimary'
      ? 'bg-primary-foreground text-primary'
      : 'bg-primary text-primary-foreground';
  const inactiveText =
    variant === 'onPrimary' ? 'text-primary-foreground/70' : 'text-muted-foreground';

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        'inline-flex items-center rounded-full border p-0.5 text-xs font-medium tracking-wider',
        baseTrack,
        className
      )}
    >
      {(['en', 'ru'] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => setLang(lng)}
          aria-pressed={current === lng}
          className={cn(
            'px-3 py-1 rounded-full transition-colors',
            current === lng ? activePill : cn('hover:opacity-80', inactiveText)
          )}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
