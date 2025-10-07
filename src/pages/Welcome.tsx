import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 overflow-hidden">
      <div className="max-w-4xl text-center space-y-8">
        {/* Orbital Animation */}
        <div className="relative w-full h-80 mb-12 flex items-center justify-center">
          {/* The Sun - Harmony (center) */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 animate-fade-in shadow-elegant" 
               style={{ animationDelay: '0s' }} />
          
          {/* Orbital Paths */}
          <div className="absolute w-48 h-32 border-2 border-primary/20 rounded-full animate-fade-in" 
               style={{ animationDelay: '0.5s' }} />
          <div className="absolute w-64 h-44 border-2 border-primary/15 rounded-full animate-fade-in" 
               style={{ animationDelay: '0.7s' }} />
          <div className="absolute w-80 h-56 border-2 border-primary/10 rounded-full animate-fade-in" 
               style={{ animationDelay: '0.9s' }} />
          
          {/* Planet 1 - Calm & Renew (blue) */}
          <div className="absolute w-8 h-8 rounded-full bg-phase-calm shadow-lg animate-orbit-1" 
               style={{ animationDelay: '1.2s' }} />
          
          {/* Planet 2 - Glow & Energize (peach) */}
          <div className="absolute w-8 h-8 rounded-full bg-phase-glow shadow-lg animate-orbit-2" 
               style={{ animationDelay: '1.4s' }} />
          
          {/* Planet 3 - Balance & Clarify (green) */}
          <div className="absolute w-8 h-8 rounded-full bg-phase-balance shadow-lg animate-orbit-3" 
               style={{ animationDelay: '1.6s' }} />
          
          {/* Meteorite - Precision Care */}
          <div className="absolute w-3 h-3 rounded-full bg-primary animate-meteorite" 
               style={{ animationDelay: '2s' }} />
        </div>

        {/* Sequential Text */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '2.5s' }}>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary leading-tight">
            Stop fighting your skin.
          </h1>
          <h2 className="text-3xl md:text-4xl font-heading text-foreground/80">
            Start working in harmony with it.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Welcome to Spring Sisters. We are the first skincare system that adapts to your unique biological rhythm. Let's find yours.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/problem')}
            className="mt-8 px-8 py-6 text-lg rounded-full"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
