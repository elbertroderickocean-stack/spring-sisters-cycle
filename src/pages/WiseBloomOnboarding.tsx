import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';

const WiseBloomOnboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserData } = useUser();
  const [currentScreen, setCurrentScreen] = useState(1);

  const handleContinue = () => {
    if (currentScreen === 1) {
      setCurrentScreen(2);
    } else {
      updateUserData({ wiseBloomMode: true });
      navigate('/register', { state: { selectedRhythm: location.state?.selectedRhythm || 'cellular' } });
    }
  };

  const handleBack = () => {
    if (currentScreen === 1) {
      navigate('/personalize');
    } else {
      setCurrentScreen(1);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <OnboardingProgressBar currentStep={5} />
      <div className="max-w-2xl w-full space-y-8 animate-slide-up">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </button>

        {currentScreen === 1 ? (
          <div className="text-center space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body">Longevity Strategy</p>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-foreground leading-tight">
              Your focus is resilience and density.
            </h1>
            
            <div className="pt-6 pb-8 space-y-4 text-left max-w-xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Since your skin no longer has a monthly cycle, we implement a <strong className="text-foreground">7-day Cellular Training Rhythm</strong>. We alternate between Restoration (The Constants) and Stimulation (The Shifts) to keep your skin cells in peak performance.
              </p>
              
              <ul className="space-y-3 text-muted-foreground pt-2">
                <li className="flex gap-3">
                  <span className="text-primary flex-shrink-0">•</span>
                  <span>Reduced collagen production → targeted stimulation</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary flex-shrink-0">•</span>
                  <span>Loss of density and firmness → structural rebuilding</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary flex-shrink-0">•</span>
                  <span>Increased dryness → deep barrier restoration</span>
                </li>
              </ul>
            </div>

            <Button 
              size="lg" 
              onClick={handleContinue}
              className="mt-8 px-8 py-6 text-lg rounded-lg"
            >
              Continue
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body">Your Management Framework</p>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-foreground leading-tight">
              The 7-Day Cellular Training Pulse
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto pt-4">
              Your complete management framework, re-imagined into a powerful weekly rhythm:
            </p>
            
            <div className="pt-6 pb-8 space-y-4 text-left max-w-xl mx-auto">
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="font-heading font-semibold text-xl mb-2">The Constants™</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your Index Fund — daily foundation for barrier support and constant nourishment.
                </p>
              </div>
              
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="font-heading font-semibold text-xl mb-2">The Shifts™</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Dynamic Assets — the heart of your 7-day training rhythm. Targeted 'exercises' for your skin cells on different days.
                </p>
              </div>
              
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="font-heading font-semibold text-xl mb-2">The Assets™</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  High-Yield Interventions — specialized tools for targeting specific concerns and boosting your weekly results.
                </p>
              </div>
              
              <p className="text-base text-muted-foreground leading-relaxed pt-6 italic text-center">
                Your rhythm is a weekly pulse—and your skin stays in peak performance.
              </p>
            </div>

            <Button 
              size="lg" 
              onClick={handleContinue}
              className="mt-8 px-8 py-6 text-lg rounded-lg"
            >
              Begin My Strategy
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WiseBloomOnboarding;
