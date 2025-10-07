import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-2xl text-center space-y-8 animate-slide-up">
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
  );
};

export default Welcome;
