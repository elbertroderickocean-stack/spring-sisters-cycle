import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Problem = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-3xl text-center space-y-10 animate-slide-up">
        <h2 className="text-4xl md:text-5xl font-heading font-semibold text-primary">
          Why does your "perfect" routine sometimes stop working?
        </h2>
        
        <div className="flex justify-center my-12">
          <svg className="w-64 h-64" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            <circle
              cx="100"
              cy="100"
              r="6"
              fill="hsl(var(--primary))"
              className="animate-pulse"
            >
              <animateMotion
                dur="6s"
                repeatCount="indefinite"
                path="M 100,20 A 80,80 0 1,1 99.9,20 Z"
              />
            </circle>
          </svg>
        </div>

        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
          Your skin isn't a static canvas. It changes every day, influenced by <strong>hormones, sleep, and even stress.</strong> This is why a 'one-size-fits-all' approach always fails.
        </p>

        <Button 
          size="lg" 
          onClick={() => navigate('/solution')}
          className="mt-8 px-8 py-6 text-lg rounded-full"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default Problem;
