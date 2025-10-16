import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { Star, Vote, FlaskConical, Heart, Users, Target, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

const Sisterhood = () => {
  const navigate = useNavigate();
  const { getCurrentPhase } = useUser();
  const phase = getCurrentPhase();

  const getPhaseIconColor = () => {
    if (phase === 'calm') return 'hsl(200 50% 60%)';
    if (phase === 'glow') return 'hsl(30 90% 60%)';
    return 'hsl(120 40% 50%)';
  };

  const phaseIconColor = getPhaseIconColor();

  // Mock user status data
  const userStatus = {
    level: 'Initiate',
    currentPoints: 1250,
    nextLevelPoints: 1000,
  };

  // Mock pod data - user is in a pod
  const userPod = {
    isInPod: true,
    name: 'The Glow Getters',
    members: [
      { name: 'Sarah K.', avatar: '👩' },
      { name: 'Emma L.', avatar: '👩‍🦰' },
      { name: 'Maya P.', avatar: '👩‍🦱' },
      { name: 'You', avatar: '✨' },
    ],
    currentChallenge: 'The Hydration Week',
    daysLeft: 2,
  };

  // Mock bounties data
  const activeBounties = [
    { title: 'Texture Tuesday', reward: '1,000 LP' },
    { title: 'Selfie Sunday', reward: '750 LP' },
    { title: 'Ingredient Deep-Dive', reward: '1,500 LP' },
  ];

  const contributionActions = [
    {
      icon: Star,
      title: 'Rate Your Products',
      description: 'Give us your honest feedback on your arsenal.',
      action: () => navigate('/product-rating'),
    },
    {
      icon: FlaskConical,
      title: 'Join the R&D Panel',
      description: 'Vote on our next product. What should we create next?',
      action: () => navigate('/rd-panel'),
    },
    {
      icon: Heart,
      title: 'Vote on the Legacy Fund',
      description: 'Decide where our 1% profit share goes this quarter.',
      action: () => navigate('/legacy-fund-vote'),
    },
  ];

  const progressPercentage = (userStatus.currentPoints / userStatus.nextLevelPoints) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <h1 className="text-3xl font-heading font-semibold">The Sisterhood Circle</h1>

        {/* Legacy Treasury Button */}
        <Button
          onClick={() => navigate('/legacy-treasury')}
          className="w-full rounded-full shadow-lg"
          size="lg"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Open The Legacy Treasury
        </Button>

        {/* Module 1: Your Status - Now Clickable */}
        <button
          onClick={() => navigate('/legacy-points')}
          className="w-full text-left"
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" style={{ color: phaseIconColor }} />
                <CardTitle className="font-heading">Your Status</CardTitle>
              </div>
              <CardDescription className="text-lg font-semibold">{userStatus.level}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Legacy Points</span>
                  <span className="font-semibold">
                    {userStatus.currentPoints} / {userStatus.nextLevelPoints}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {userStatus.nextLevelPoints - userStatus.currentPoints} points to next level
                </p>
              </div>
            </CardContent>
          </Card>
        </button>

        {/* Module 2: Sisterhood Pods */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" style={{ color: phaseIconColor }} />
              <CardTitle className="font-heading">Your Sisterhood Pod</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {userPod.isInPod ? (
              <>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{userPod.name}</h4>
                  <div className="flex gap-2">
                    {userPod.members.map((member, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                          {member.avatar}
                        </div>
                        <span className="text-xs text-muted-foreground">{member.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg bg-accent/50 border border-border">
                    <p className="text-sm font-medium text-foreground">
                      Team Challenge: "{userPod.currentChallenge}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {userPod.daysLeft} days left!
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/pod-chat')}
                  className="w-full rounded-full"
                  style={{ backgroundColor: phaseIconColor }}
                >
                  Go to Pod
                </Button>
              </>
            ) : (
              <div className="text-center space-y-4 py-4">
                <p className="text-muted-foreground leading-relaxed">
                  Find your circle. Join a Sisterhood Pod to participate in team challenges and share your journey.
                </p>
                <Button
                  onClick={() => navigate('/find-pod')}
                  className="rounded-full"
                  style={{ backgroundColor: phaseIconColor }}
                >
                  Find a Pod
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Module 3: Content Bounties */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" style={{ color: phaseIconColor }} />
              <CardTitle className="font-heading">Content Bounties</CardTitle>
            </div>
            <CardDescription>Your creative missions from the brand</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {activeBounties.slice(0, 2).map((bounty, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">{bounty.title}</span>
                  <span className="text-xs font-bold" style={{ color: phaseIconColor }}>
                    {bounty.reward}
                  </span>
                </div>
              ))}
            </div>
            <Button
              onClick={() => navigate('/bounty-board')}
              variant="outline"
              className="w-full rounded-full"
            >
              View All Bounties
            </Button>
          </CardContent>
        </Card>

        {/* Module 4: Contribute & Influence */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Vote className="h-5 w-5" style={{ color: phaseIconColor }} />
              <CardTitle className="font-heading">Contribute & Influence</CardTitle>
            </div>
            <CardDescription>Shape the future of Spring Sisters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contributionActions.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full text-left p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="h-5 w-5" style={{ color: phaseIconColor }} />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Sisterhood;
