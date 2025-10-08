import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Camera, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

const BountyBoard = () => {
  const navigate = useNavigate();
  const { getCurrentPhase } = useUser();
  const phase = getCurrentPhase();

  const getPhaseColor = () => {
    if (phase === 'calm') return 'hsl(200 50% 60%)';
    if (phase === 'glow') return 'hsl(30 90% 60%)';
    return 'hsl(120 40% 50%)';
  };

  const phaseColor = getPhaseColor();

  const bounties = [
    {
      icon: Camera,
      title: 'Texture Tuesday',
      brief: 'Capture an aesthetic macro shot of your daily serum\'s texture.',
      reward: '100 LP',
      status: 'active',
    },
    {
      icon: Camera,
      title: 'Selfie Sunday',
      brief: 'Share your glow-up selfie after a full week of ritual.',
      reward: '75 LP',
      status: 'active',
    },
    {
      icon: BookOpen,
      title: 'Ingredient Deep-Dive',
      brief: 'Write a mini-review explaining your favorite ingredient and why it works for you.',
      reward: '150 LP',
      status: 'active',
    },
    {
      icon: Target,
      title: 'Phase Transition Story',
      brief: 'Document your skin\'s journey through a full cycle phase.',
      reward: '200 LP',
      status: 'coming-soon',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/sisterhood')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-heading font-semibold">Content Bounties</h1>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Complete creative missions to earn Legacy Points and help us build a more authentic community.
        </p>

        {/* Active Bounties */}
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-semibold">Active Bounties</h2>
          {bounties
            .filter((b) => b.status === 'active')
            .map((bounty, index) => {
              const IconComponent = bounty.icon;
              return (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <IconComponent className="h-6 w-6" style={{ color: phaseColor }} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <CardTitle className="font-heading text-lg">{bounty.title}</CardTitle>
                        <CardDescription>{bounty.brief}</CardDescription>
                        <p className="text-sm font-bold pt-2" style={{ color: phaseColor }}>
                          Reward: {bounty.reward}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full rounded-full"
                      style={{ backgroundColor: phaseColor }}
                    >
                      Submit Your Content
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {/* Coming Soon */}
        <div className="space-y-4 pt-6">
          <h2 className="text-xl font-heading font-semibold">Coming Soon</h2>
          {bounties
            .filter((b) => b.status === 'coming-soon')
            .map((bounty, index) => {
              const IconComponent = bounty.icon;
              return (
                <Card key={index} className="shadow-lg opacity-60">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <IconComponent className="h-6 w-6" style={{ color: phaseColor }} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <CardTitle className="font-heading text-lg">{bounty.title}</CardTitle>
                        <CardDescription>{bounty.brief}</CardDescription>
                        <p className="text-sm font-bold pt-2" style={{ color: phaseColor }}>
                          Reward: {bounty.reward}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default BountyBoard;
