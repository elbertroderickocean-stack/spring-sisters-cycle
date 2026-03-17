import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Problem = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-3xl text-center space-y-10 animate-slide-up">
        <h2 className="text-4xl md:text-5xl font-heading font-semibold text-foreground leading-tight">
          Why does your routine stop working?
        </h2>
        
        <div className="flex justify-center my-12">
          <svg className="w-56 h-56" viewBox="0 0 200 200">
            {/* Geometric line-art: intersecting circles representing biological systems */}
            <circle cx="80" cy="100" r="60" fill="none" stroke="hsl(var(--phase-calm))" strokeWidth="1.5" opacity="0.6" />
            <circle cx="120" cy="100" r="60" fill="none" stroke="hsl(var(--phase-glow))" strokeWidth="1.5" opacity="0.6" />
            <circle cx="100" cy="75" r="60" fill="none" stroke="hsl(var(--phase-balance))" strokeWidth="1.5" opacity="0.6" />
            <circle cx="100" cy="95" r="4" fill="hsl(var(--foreground))" className="animate-pulse" />
          </svg>
        </div>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Your skin is not a static canvas. It's a <strong className="text-foreground">biological asset</strong> influenced by glucose, hormones, and stress. Managing it requires a strategy, not a routine.
        </p>

        <Button 
          size="lg" 
          onClick={() => navigate('/solution')}
          className="mt-8 px-8 py-6 text-lg rounded-lg"
        >
          Learn the Strategy
        </Button>
      </div>
    </div>
  );
};

export default Problem;
