import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Target, Camera, BookOpen, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

const BountyBoard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getCurrentPhase } = useUser();
  const phase = getCurrentPhase();

  const getPhaseColor = () => {
    if (phase === 'calm') return 'hsl(200 50% 60%)';
    if (phase === 'glow') return 'hsl(30 90% 60%)';
    return 'hsl(120 40% 50%)';
  };
  const phaseColor = getPhaseColor();

  const tasks = [
    { icon: Camera, title: t('bounty.share_progress'), brief: t('bounty.share_progress_brief'), reward: '1,000 AC', status: 'active' },
    { icon: Database, title: t('bounty.data_calibration'), brief: t('bounty.data_calibration_brief'), reward: '500 AC', status: 'active' },
    { icon: BookOpen, title: t('bounty.asset_review'), brief: t('bounty.asset_review_brief'), reward: '250 AC', status: 'active' },
    { icon: Target, title: t('bounty.phase_story'), brief: t('bounty.phase_story_brief'), reward: '200 AC', status: 'coming-soon' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/sisterhood')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-heading font-semibold">{t('bounty.title')}</h1>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{t('bounty.intro')}</p>

        <div className="space-y-4">
          <h2 className="text-lg font-heading font-semibold">{t('bounty.active')}</h2>
          {tasks.filter((t2) => t2.status === 'active').map((task, index) => {
            const IconComponent = task.icon;
            return (
              <Card key={index} className="border border-border">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <IconComponent className="h-5 w-5" style={{ color: phaseColor }} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <CardTitle className="font-heading text-base">{task.title}</CardTitle>
                      <CardDescription className="text-xs">{task.brief}</CardDescription>
                      <p className="text-xs font-mono-data font-bold pt-1" style={{ color: phaseColor }}>
                        {t('bounty.reward')}: {task.reward}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full rounded-full" style={{ backgroundColor: phaseColor }}>
                    {t('bounty.submit')}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-heading font-semibold">{t('bounty.coming_soon')}</h2>
          {tasks.filter((t2) => t2.status === 'coming-soon').map((task, index) => {
            const IconComponent = task.icon;
            return (
              <Card key={index} className="border border-border opacity-60">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <IconComponent className="h-5 w-5" style={{ color: phaseColor }} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <CardTitle className="font-heading text-base">{task.title}</CardTitle>
                      <CardDescription className="text-xs">{task.brief}</CardDescription>
                      <p className="text-xs font-mono-data font-bold pt-1" style={{ color: phaseColor }}>
                        {t('bounty.reward')}: {task.reward}
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
