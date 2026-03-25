import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';
import OnboardingBackButton from '@/components/OnboardingBackButton';

const DataAlignmentVisual = () => {
  const [aligned, setAligned] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAligned(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const lines = [
    { width: 65, delay: 0 },
    { width: 90, delay: 0.1 },
    { width: 45, delay: 0.2 },
    { width: 80, delay: 0.3 },
    { width: 55, delay: 0.4 },
    { width: 95, delay: 0.5 },
    { width: 40, delay: 0.6 },
    { width: 75, delay: 0.7 },
    { width: 60, delay: 0.8 },
    { width: 85, delay: 0.9 },
    { width: 50, delay: 1.0 },
    { width: 70, delay: 1.1 },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto h-48 flex flex-col justify-center gap-[6px] overflow-hidden">
      {lines.map((line, i) => (
        <div
          key={i}
          className="relative h-[1.5px] mx-auto transition-all ease-out"
          style={{
            width: aligned ? '75%' : `${line.width}%`,
            transitionDuration: '1.8s',
            transitionDelay: `${line.delay}s`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.15) 20%, hsl(var(--primary) / 0.5) 50%, hsl(var(--primary) / 0.15) 80%, transparent 100%)`,
            }}
          />
          {/* Glow dot at end */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-opacity duration-1000"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              boxShadow: '0 0 6px hsl(var(--primary) / 0.4)',
              opacity: aligned ? 1 : 0,
              transitionDelay: `${line.delay + 1.5}s`,
            }}
          />
        </div>
      ))}

      {/* Pulse wave overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: aligned ? 0.3 : 0, transitionDelay: '2.5s' }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
};

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12 overflow-hidden">
      <OnboardingProgressBar currentStep={1} />
      <div className="max-w-3xl w-full text-center space-y-8">
        {/* Data Alignment Visualization */}
        <DataAlignmentVisual />

        {/* Text */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <h1 className="text-4xl md:text-5xl font-heading font-semibold text-foreground leading-tight tracking-tight">
            Stop treating your skin like a chore.
            <br />
            Treat it like an asset.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-body" style={{ letterSpacing: '0.01em', lineHeight: '1.8' }}>
            Your skin is biological capital that reacts to glucose, hormones, and stress.{' '}
            <strong className="text-foreground font-extrabold">meanwhile</strong>, our system manages the complexity in the background while you focus on your life.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/solution')}
            className="mt-10 px-10 py-6 text-lg rounded-lg tracking-wide"
          >
            Initialize Management Strategy
          </Button>
          <OnboardingBackButton to="/" />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
