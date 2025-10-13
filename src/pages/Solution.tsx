import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Solution = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-3xl text-center space-y-10 animate-slide-up">
        <h2 className="text-4xl md:text-5xl font-heading font-semibold text-primary">
          We help you build your dynamic ritual.
        </h2>
        
        <div className="flex justify-center my-12">
          <svg className="w-64 h-64" viewBox="0 0 200 200">
            {/* Base circle being drawn */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              strokeDasharray="503"
              strokeDashoffset="503"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="503"
                to="0"
                dur="1.5s"
                fill="freeze"
              />
            </circle>

            {/* Phase 1: Calm & Renew */}
            <path
              d="M 100,20 A 80,80 0 0,1 156.57,43.43"
              fill="none"
              stroke="hsl(var(--phase-calm))"
              strokeWidth="16"
              strokeLinecap="round"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                from="0"
                to="1"
                begin="1.5s"
                dur="0.4s"
                fill="freeze"
              />
            </path>
            
            {/* Phase 2: Glow & Energize */}
            <path
              d="M 156.57,43.43 A 80,80 0 0,1 180,100"
              fill="none"
              stroke="hsl(var(--phase-glow))"
              strokeWidth="16"
              strokeLinecap="round"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                from="0"
                to="1"
                begin="1.9s"
                dur="0.4s"
                fill="freeze"
              />
            </path>
            
            {/* Phase 3: Balance & Clarify */}
            <path
              d="M 180,100 A 80,80 0 1,1 100,20"
              fill="none"
              stroke="hsl(var(--phase-balance))"
              strokeWidth="16"
              strokeLinecap="round"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                from="0"
                to="1"
                begin="2.3s"
                dur="0.4s"
                fill="freeze"
              />
            </path>

            <circle
              cx="100"
              cy="100"
              r="6"
              fill="hsl(var(--primary))"
              className="animate-pulse"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                from="0"
                to="1"
                begin="2.7s"
                dur="0.3s"
                fill="freeze"
              />
              <animateMotion
                begin="2.7s"
                dur="6s"
                repeatCount="indefinite"
                path="M 100,20 A 80,80 0 1,1 99.9,20 Z"
              />
            </circle>
          </svg>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-4 h-4 rounded-full bg-phase-calm"></div>
            <span className="text-foreground/80">Calm & Renew</span>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <div className="w-4 h-4 rounded-full bg-phase-glow"></div>
            <span className="text-foreground/80">Glow & Energize</span>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <div className="w-4 h-4 rounded-full bg-phase-balance"></div>
            <span className="text-foreground/80">Balance & Clarify</span>
          </div>
        </div>

        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
          Our intelligent system identifies your skin's true pattern — whether it's a <strong>28-day hormonal rhythm</strong> or a <strong>7-day cellular training rhythm</strong> — to offer the right tool at the right time.
        </p>

        <Button 
          size="lg" 
          onClick={() => navigate('/personalize')}
          className="mt-8 px-8 py-6 text-lg rounded-full"
        >
          Personalize My Rhythm
        </Button>
      </div>
    </div>
  );
};

export default Solution;
