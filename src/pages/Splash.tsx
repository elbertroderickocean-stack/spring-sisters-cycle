import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeanwhileLogo } from '@/components/MeanwhileLogo';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center mesh-gradient-bg gap-8">
      <div className="animate-fade-in-slow">
        <MeanwhileLogo size="xl" className="text-foreground" />
      </div>
      <div className="w-16 h-px bg-foreground/20 animate-fade-in" style={{ animationDelay: '0.8s' }} />
      <p className="text-xs md:text-sm text-muted-foreground font-body tracking-[0.35em] uppercase animate-fade-in" style={{ animationDelay: '1.2s' }}>
        Skincare is an investment. We manage the interest.
      </p>
    </div>
  );
};

export default Splash;
