import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';

const Encouragement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useUser();
  const name = userData.name || 'Kate';
  const strategy = (location.state as any)?.strategy;
  const selectedRhythm = (location.state as any)?.selectedRhythm;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12 relative">
      <OnboardingProgressBar currentStep={5} />

      <div className="relative max-w-md w-full text-center space-y-8 animate-slide-up">
        {/* Subtle radial glow */}
        <div
          className="absolute -inset-20 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at center, #B2C2B2 0%, transparent 70%)',
          }}
        />

        <div className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-10 space-y-6 shadow-lg">
          <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: '#B2C2B2' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground leading-tight">
            Biological Audit Complete.
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed font-body">
            We have identified your primary skin assets. Just a few more data points on your daily environment to finalize the plan.
          </p>

          <button
            onClick={() => navigate('/personalize', { state: { strategy, selectedRhythm } })}
            className="w-full py-4 rounded-lg text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
          >
            Continue to Lifestyle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Encouragement;
