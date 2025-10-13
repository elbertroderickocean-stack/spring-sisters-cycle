import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const WiseBloomOnboarding = () => {
  const navigate = useNavigate();
  const { updateUserData } = useUser();
  const [currentScreen, setCurrentScreen] = useState(1);

  const handleContinue = () => {
    if (currentScreen === 1) {
      setCurrentScreen(2);
    } else {
      // Enable Wise Bloom mode
      updateUserData({ wiseBloomMode: true });
      navigate('/register');
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
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-primary leading-tight">
              Your skin lives by a new, wise rhythm.
            </h1>
            
            <div className="pt-6 pb-8 space-y-4 text-left max-w-xl mx-auto">
              <p className="text-lg text-foreground/80 leading-relaxed">
                After menopause, the skin is no longer subject to cyclical fluctuations, but it faces new challenges:
              </p>
              
              <ul className="space-y-3 text-foreground/80">
                <li className="flex gap-3">
                  <span className="text-primary flex-shrink-0">•</span>
                  <span>Reduced collagen production</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary flex-shrink-0">•</span>
                  <span>Loss of density and firmness</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary flex-shrink-0">•</span>
                  <span>Increased dryness due to consistently low estrogen levels</span>
                </li>
              </ul>
              
              <p className="text-lg text-foreground/80 leading-relaxed pt-4">
                Our system is perfectly suited to address these specific concerns with a dedicated approach designed just for you.
              </p>
            </div>

            <Button 
              size="lg" 
              onClick={handleContinue}
              className="mt-8 px-8 py-6 text-lg rounded-full"
            >
              Continue
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-primary leading-tight">
              Your focus is restoration and support.
            </h1>
            
            <p className="text-xl text-foreground/80 leading-relaxed max-w-xl mx-auto pt-4">
              To achieve this, we'll use our complete orbital system, re-imagined into a powerful 7-day training rhythm for your skin:
            </p>
            
            <div className="pt-6 pb-8 space-y-4 text-left max-w-xl mx-auto">
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="font-heading font-semibold text-xl mb-2">The Spring Harmony™</h3>
                <p className="text-foreground/70 leading-relaxed">
                  Your daily foundation for barrier support and constant nourishment.
                </p>
              </div>
              
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="font-heading font-semibold text-xl mb-2">The Bloom Cycle™</h3>
                <p className="text-foreground/70 leading-relaxed">
                  The heart of your 7-day training rhythm. We use these serums as targeted 'exercises' for your skin cells on different days.
                </p>
              </div>
              
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="font-heading font-semibold text-xl mb-2">The Precision Care™</h3>
                <p className="text-foreground/70 leading-relaxed">
                  Your specialized tools for targeting specific concerns and boosting your weekly training results.
                </p>
              </div>
              
              <p className="text-lg text-foreground/80 leading-relaxed pt-6 italic text-center">
                Your skin's rhythm is no longer a monthly orbit—it's a weekly pulse, and you are the star at its center.
              </p>
            </div>

            <Button 
              size="lg" 
              onClick={handleContinue}
              className="mt-8 px-8 py-6 text-lg rounded-full"
            >
              Begin My Journey
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WiseBloomOnboarding;
