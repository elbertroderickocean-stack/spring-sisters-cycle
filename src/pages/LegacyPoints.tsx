import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Star, MessageSquare, Vote, Users, Database, Camera, ClipboardCheck } from 'lucide-react';
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
    { icon: CheckCircle2, title: 'Daily Check-in', points: '5 AC per day' },
    { icon: Camera, title: 'Share your Progress (UGC)', points: '1,000 AC per post' },
    { icon: Database, title: 'Data Calibration (Log Sleep/Glucose)', points: '500 AC per entry' },
    { icon: ClipboardCheck, title: 'Asset Review', points: '250 AC per review' },
    { icon: Vote, title: 'Voting in Governance', points: '25 AC per vote' },
    { icon: Users, title: 'Referring a Member', points: '200 AC per referral' },
  ];

  const statusLevels = [
    {
      name: 'Community Member',
      points: '0 AC',
      reward: 'Welcome to The Syndicate. Credits you earn for investing your time and data.',
    },
    {
      name: 'Strategic Associate',
      points: '3,000 AC',
      reward: 'Unlock a 20% lifetime discount, exclusive content, and early access to new assets.',
    },
    {
      name: 'Network Partner',
      points: '10,000 AC',
      reward: 'Receive our annual Founder\'s Gift Box with limited edition products and unlock Vesting Accelerators.',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
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
          <h1 className="text-2xl font-heading font-semibold">The Growth Path</h1>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Credits you earn for investing your time and data into the <span className="italic">meanwhile.</span> ecosystem.
        </p>

        {/* How to Earn */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg">How to Earn Asset Credits (AC)</CardTitle>
            <CardDescription>Every action you take builds your contribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {earningMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 rounded-[12px] border border-border">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <IconComponent className="h-4 w-4" style={{ color: phaseIconColor }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground">{method.title}</h4>
                  </div>
                  <span className="text-xs font-mono-data font-bold" style={{ color: phaseIconColor }}>
                    {method.points}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Growth Path */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Membership Tiers</CardTitle>
            <CardDescription>Your journey from Member to Network Partner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {statusLevels.map((level, index) => (
              <div key={index} className="relative pl-8">
                {index < statusLevels.length - 1 && (
                  <div
                    className="absolute left-3 top-8 w-0.5 h-full"
                    style={{ background: `linear-gradient(to bottom, ${phaseIconColor}, transparent)` }}
                  />
                )}
                <div
                  className="absolute left-0 top-2 w-6 h-6 rounded-full border-4 border-background"
                  style={{ backgroundColor: phaseIconColor }}
                />
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-bold text-base" style={{ color: phaseIconColor }}>
                      {level.name}
                    </h4>
                    <span className="text-xs font-mono-data text-muted-foreground">({level.points})</span>
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
