import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MeanwhileLogo } from '@/components/MeanwhileLogo';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageToggle } from '@/components/LanguageToggle';

const Splash = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (user) {
        navigate('/today');
      } else {
        navigate('/welcome');
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-primary gap-10">
      <div className="absolute top-6 right-6 z-10">
        <LanguageToggle variant="onPrimary" />
      </div>
      <div className="animate-fade-in-slow">
        <MeanwhileLogo size="xl" className="text-primary-foreground" />
      </div>
      <div className="w-16 h-px bg-primary-foreground/20 animate-fade-in" style={{ animationDelay: '0.8s' }} />
      <p className="text-xs md:text-sm text-primary-foreground/60 font-body tracking-[0.35em] uppercase animate-fade-in" style={{ animationDelay: '1.2s' }}>
        {t('splash.tagline')}
      </p>
    </div>
  );
};

export default Splash;
