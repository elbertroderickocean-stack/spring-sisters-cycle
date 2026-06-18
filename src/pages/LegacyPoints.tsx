import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2, Vote, Users, Database, Camera, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

const LegacyPoints = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getCurrentPhase } = useUser();
  const phase = getCurrentPhase();

  const getPhaseIconColor = () => {
    if (phase === 'calm') return 'hsl(200 50% 60%)';
    if (phase === 'glow') return 'hsl(30 90% 60%)';
    return 'hsl(120 40% 50%)';
  };
  const phaseIconColor = getPhaseIconColor();

  const earningMethods = [
    { icon: CheckCircle2, title: t('legacy_points.earn_checkin'), points: t('legacy_points.earn_checkin_pts') },
    { icon: Camera, title: t('legacy_points.earn_ugc'), points: t('legacy_points.earn_ugc_pts') },
    { icon: Database, title: t('legacy_points.earn_data'), points: t('legacy_points.earn_data_pts') },
    { icon: ClipboardCheck, title: t('legacy_points.earn_review'), points: t('legacy_points.earn_review_pts') },
    { icon: Vote, title: t('legacy_points.earn_vote'), points: t('legacy_points.earn_vote_pts') },
    { icon: Users, title: t('legacy_points.earn_referral'), points: t('legacy_points.earn_referral_pts') },
  ];

  const statusLevels = [
    { name: t('legacy_points.tier_member'), points: '0 AC', reward: t('legacy_points.tier_member_reward') },
    { name: t('legacy_points.tier_associate'), points: '3,000 AC', reward: t('legacy_points.tier_associate_reward') },
    { name: t('legacy_points.tier_partner'), points: '10,000 AC', reward: t('legacy_points.tier_partner_reward') },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/sisterhood')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-heading font-semibold">{t('legacy_points.title')}</h1>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{t('legacy_points.intro')}</p>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg">{t('legacy_points.earn_title')}</CardTitle>
            <CardDescription>{t('legacy_points.earn_sub')}</CardDescription>
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
                  <span className="text-xs font-mono-data font-bold" style={{ color: phaseIconColor }}>{method.points}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg">{t('legacy_points.tiers_title')}</CardTitle>
            <CardDescription>{t('legacy_points.tiers_sub')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {statusLevels.map((level, index) => (
              <div key={index} className="relative pl-8">
                {index < statusLevels.length - 1 && (
                  <div className="absolute left-3 top-8 w-0.5 h-full" style={{ background: `linear-gradient(to bottom, ${phaseIconColor}, transparent)` }} />
                )}
                <div className="absolute left-0 top-2 w-6 h-6 rounded-full border-4 border-background" style={{ backgroundColor: phaseIconColor }} />
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-bold text-base" style={{ color: phaseIconColor }}>{level.name}</h4>
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
