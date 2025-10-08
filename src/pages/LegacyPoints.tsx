import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Star, MessageSquare, Vote, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

const LegacyPoints = () => {
  const navigate = useNavigate();
  const { getCurrentPhase } = useUser();
  const phase = getCurrentPhase();

  const getPhaseIconColor = () => {
    if (phase === 'calm') return 'hsl(200 50% 60%)';
    if (phase === 'glow') return 'hsl(30 90% 60%)';
    return 'hsl(120 40% 50%)';
  };

  const phaseIconColor = getPhaseIconColor();

  const earningMethods = [
    {
      icon: CheckCircle2,
      title: 'Daily Check-in',
      points: '5 LP per day',
    },
    {
      icon: MessageSquare,
      title: 'Product Reviews',
      points: '50 LP per detailed review',
    },
    {
      icon: Vote,
      title: 'Voting in R&D Panel',
      points: '25 LP per vote',
    },
    {
      icon: Users,
      title: 'Referring a Sister',
      points: '200 LP per successful referral',
    },
  ];

  const statusLevels = [
    {
      name: 'Initiate',
      points: '0 LP',
      reward: 'Welcome to the Circle!',
    },
    {
      name: 'Guardian',
      points: '1000 LP',
      reward: 'Unlock a 20% lifetime discount and exclusive content.',
    },
    {
      name: 'Matriarch',
      points: '5000 LP',
      reward: 'Receive our annual Founder\'s Gift Box with limited edition products and unlock Vesting Accelerators for your stock options.',
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
          <h1 className="text-3xl font-heading font-semibold">Your Path to Legacy</h1>
        </div>

        {/* Section 1: How to Earn */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading">How to Earn Legacy Points (LP)</CardTitle>
            <CardDescription>Every action you take builds your legacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {earningMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-5 w-5" style={{ color: phaseIconColor }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{method.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold" style={{ color: phaseIconColor }}>
                      {method.points}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Section 2: Rewards & Status Levels */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading">Rewards & Status Levels</CardTitle>
            <CardDescription>Your journey from Initiate to Matriarch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {statusLevels.map((level, index) => (
              <div key={index} className="relative pl-8">
                {/* Timeline line */}
                {index < statusLevels.length - 1 && (
                  <div 
                    className="absolute left-3 top-8 w-0.5 h-full bg-border"
                    style={{ background: `linear-gradient(to bottom, ${phaseIconColor}, transparent)` }}
                  />
                )}
                
                {/* Timeline dot */}
                <div 
                  className="absolute left-0 top-2 w-6 h-6 rounded-full border-4 border-background"
                  style={{ backgroundColor: phaseIconColor }}
                />
                
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-bold text-lg" style={{ color: phaseIconColor }}>
                      {level.name}
                    </h4>
                    <span className="text-sm text-muted-foreground">({level.points})</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{level.reward}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegacyPoints;
