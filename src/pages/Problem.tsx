import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Activity, Droplets, Moon, Cloud, Brain } from 'lucide-react';

const systemInputs = [
  {
    icon: Activity,
    label: 'Hormones',
    description: 'Cycle & menopause logic that adapts your routine to your biology.',
    color: 'hsl(var(--phase-calm))',
  },
  {
    icon: Droplets,
    label: 'Glucose',
    description: 'Anti-glycation engine that protects collagen from sugar damage.',
    color: 'hsl(var(--phase-glow))',
  },
  {
    icon: Moon,
    label: 'Sleep & Recovery',
    description: 'Circadian rhythm sync for optimal repair and regeneration.',
    color: 'hsl(var(--phase-balance))',
  },
  {
    icon: Cloud,
    label: 'Weather',
    description: 'UV index & humidity adjustments to shield your skin daily.',
    color: 'hsl(var(--phase-calm))',
  },
  {
    icon: Brain,
    label: 'Stress',
    description: 'Cortisol control to prevent inflammation and premature aging.',
    color: 'hsl(var(--phase-glow))',
  },
];

const Problem = () => {
  const navigate = useNavigate();
  const [showSystemModal, setShowSystemModal] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="max-w-3xl text-center space-y-10 animate-slide-up">
        {/* The Hook */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-heading font-semibold text-foreground leading-tight">
            Stop treating skincare like a chore.<br />Treat it like an asset.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            You focus on your career, travels, and life. <strong className="text-foreground">meanwhile.</strong>, our intelligent system manages your skin's biological capital in the background.
          </p>
        </div>

        <div className="w-12 h-px bg-foreground/15 mx-auto" />

        {/* The Philosophy */}
        <div className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-heading font-medium text-foreground">
            Your skin is a living, breathing asset.
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            It reacts to glucose spikes, cortisol from stress, sleep quality, and the environment. Managing this manually is a full-time job you don't have time for.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowSystemModal(true)}
            className="px-8 py-5 text-base rounded-lg border-primary/30 hover:bg-primary/5"
          >
            How the System Works
          </Button>
          <Button 
            size="lg" 
            onClick={() => navigate('/solution')}
            className="px-8 py-6 text-lg rounded-lg"
          >
            Choose Your Strategy
          </Button>
        </div>
      </div>

      {/* How the System Works Modal */}
      <Dialog open={showSystemModal} onOpenChange={setShowSystemModal}>
        <DialogContent className="max-w-lg mx-auto bg-background p-0 overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body">The Intelligence Layer</p>
              <h3 className="text-2xl font-heading font-semibold text-foreground">
                5 Inputs. 1 System. Zero Effort.
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {systemInputs.map((input) => (
                <div key={input.label} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: input.color }}
                  >
                    <input.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground text-sm">{input.label}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{input.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground italic">
              We take the cognitive load. You get the results.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Problem;
