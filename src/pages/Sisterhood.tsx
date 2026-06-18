import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Vote, FlaskConical, Heart, Users, Target, Gauge, ArrowRight, Zap, Camera, Database, ClipboardCheck } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { HeaderBar } from '@/components/HeaderBar';

const Sisterhood = () => {
  const navigate = useNavigate();
  const { getCurrentPhase } = useUser();
  const { t } = useTranslation();
  const phase = getCurrentPhase();

  const getPhaseIconColor = () => {
    if (phase === 'calm') return 'hsl(200 50% 60%)';
    if (phase === 'glow') return 'hsl(30 90% 60%)';
    return 'hsl(120 40% 50%)';
  };
  const phaseIconColor = getPhaseIconColor();

  const userStatus = {
    level: t('sisterhood.level_member'),
    currentCredits: 1250,
    nextLevelCredits: 3000,
    nextLevel: t('sisterhood.level_associate'),
  };

  const userUnit = {
    isInUnit: true,
    name: t('sisterhood.unit_name'),
    members: [
      { name: 'Sarah K.', avatar: '👩' },
      { name: 'Emma L.', avatar: '👩‍🦰' },
      { name: 'Maya P.', avatar: '👩‍🦱' },
      { name: t('sisterhood.you'), avatar: '✨' },
    ],
    currentMission: t('sisterhood.mission_text'),
    daysLeft: 2,
  };

  const ecosystemTasks = [
    { icon: Camera, title: t('sisterhood.task_share'), reward: '1,000 AC' },
    { icon: Database, title: t('sisterhood.task_data'), reward: '500 AC' },
    { icon: ClipboardCheck, title: t('sisterhood.task_review'), reward: '250 AC' },
  ];

  const governanceActions = [
    { icon: FlaskConical, title: t('sisterhood.vote_assets'), description: t('sisterhood.vote_assets_desc'), action: () => navigate('/rd-panel') },
    { icon: Heart, title: t('sisterhood.fund'), description: t('sisterhood.fund_desc'), action: () => navigate('/legacy-fund-vote') },
  ];

  const progressPercentage = (userStatus.currentCredits / userStatus.nextLevelCredits) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      <HeaderBar>
        <h1 className="text-2xl font-heading font-semibold">{t('sisterhood.title')}</h1>
      </HeaderBar>
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('sisterhood.subtext_1')}<span className="font-semibold text-foreground">{t('sisterhood.subtext_brand')}</span>{t('sisterhood.subtext_2')}<span className="italic">{t('sisterhood.subtext_brand')}</span>{t('sisterhood.subtext_3')}
        </p>

        <button onClick={() => navigate('/legacy-points')} className="w-full text-left">
          <Card className="border border-border hover:border-primary/40 transition-colors cursor-pointer">
            <CardContent className="pt-6 pb-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" style={{ color: phaseIconColor }} />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t('sisterhood.your_score')}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-mono-data font-bold" style={{ color: phaseIconColor }}>
                  {userStatus.currentCredits.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">AC</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{userStatus.level}</span>
                  <span>{userStatus.nextLevel} {t('sisterhood.level_at')} {userStatus.nextLevelCredits.toLocaleString()} AC</span>
                </div>
                <Progress value={progressPercentage} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        </button>

        <Button onClick={() => navigate('/legacy-treasury')} className="w-full rounded-full" size="lg" variant="outline">
          <Zap className="h-4 w-4 mr-2" />
          {t('sisterhood.network_benefits')}
        </Button>

        <Card className="border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" style={{ color: phaseIconColor }} />
              <CardTitle className="font-heading text-lg">{t('sisterhood.your_unit')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {userUnit.isInUnit ? (
              <>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{userUnit.name}</h4>
                  <div className="flex gap-2">
                    {userUnit.members.map((member, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                          {member.avatar}
                        </div>
                        <span className="text-xs text-muted-foreground">{member.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-[12px] bg-accent/50 border border-border">
                    <p className="text-sm font-medium text-foreground">
                      {t('sisterhood.mission_label')}: "{userUnit.currentMission}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('sisterhood.mission_desc')}<span className="italic">meanwhile.</span>{t('sisterhood.mission_desc_2')}
                    </p>
                    <p className="text-xs font-semibold mt-2" style={{ color: phaseIconColor }}>
                      {t('sisterhood.days_left', { days: userUnit.daysLeft })}
                    </p>
                  </div>
                </div>
                <Button onClick={() => navigate('/pod-chat')} className="w-full rounded-full" style={{ backgroundColor: phaseIconColor }}>
                  {t('sisterhood.go_to_unit')}
                </Button>
              </>
            ) : (
              <div className="text-center space-y-4 py-4">
                <p className="text-muted-foreground leading-relaxed text-sm">{t('sisterhood.find_unit_text')}</p>
                <Button onClick={() => navigate('/find-pod')} className="rounded-full" style={{ backgroundColor: phaseIconColor }}>
                  {t('sisterhood.find_unit_btn')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" style={{ color: phaseIconColor }} />
              <CardTitle className="font-heading text-lg">{t('sisterhood.ecosystem_tasks')}</CardTitle>
            </div>
            <CardDescription>{t('sisterhood.ecosystem_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ecosystemTasks.map((task, idx) => {
              const IconComponent = task.icon;
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-[12px] border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-4 w-4" style={{ color: phaseIconColor }} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{task.title}</span>
                  </div>
                  <span className="text-xs font-mono-data font-bold" style={{ color: phaseIconColor }}>{task.reward}</span>
                </div>
              );
            })}
            <Button onClick={() => navigate('/bounty-board')} variant="outline" className="w-full rounded-full mt-1">
              {t('sisterhood.view_all_tasks')}
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Vote className="h-5 w-5" style={{ color: phaseIconColor }} />
              <CardTitle className="font-heading text-lg">{t('sisterhood.governance')}</CardTitle>
            </div>
            <CardDescription>{t('sisterhood.governance_desc_1')}<span className="italic">meanwhile.</span></CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {governanceActions.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button key={index} onClick={item.action} className="w-full text-left p-4 rounded-[12px] border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <IconComponent className="h-4 w-4" style={{ color: phaseIconColor }} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
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
