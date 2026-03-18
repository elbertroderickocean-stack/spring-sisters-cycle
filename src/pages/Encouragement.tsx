import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';

const Encouragement = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const name = userData.name || 'Kate';

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 relative">
      <OnboardingProgressBar currentStep={8} />

      {/* Glassmorphism card */}
      <div className="relative max-w-md w-full text-center space-y-8 animate-slide-up">
        {/* Subtle radial glow behind card */}
        <div
          className="absolute -inset-20 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(circle at center, #B2C2B2 0%, transparent 70%)',
          }}
        />

        <div className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-10 space-y-6 shadow-lg">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body">Biological Baseline</p>

          <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground leading-tight">
            Excellent Progress, {name}.
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed">
            We've gathered <strong className="text-foreground">60%</strong> of your biological data. Just a few more insights about your lifestyle to finalize your skin investment strategy.
          </p>

          <button
            onClick={() => navigate('/inventory')}
            className="w-full py-4 rounded-lg text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
          >
            Finalize Strategy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Encouragement;
