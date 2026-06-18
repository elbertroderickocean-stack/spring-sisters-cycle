import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity, FlaskConical } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { HeaderBar } from '@/components/HeaderBar';
import { useUser } from '@/contexts/UserContext';

const Guide = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const { t } = useTranslation();

  const philosophySection = {
    section: t('guide.philosophy'),
    icon: TrendingUp,
    items: [
      { title: t('guide.items.mission_title'), description: t('guide.items.mission_desc'), articleId: 'mission' },
      { title: t('guide.items.lines_title'), description: t('guide.items.lines_desc'), articleId: 'lines' },
      { title: t('guide.items.aura_intro_title'), description: t('guide.items.aura_intro_desc'), articleId: 'aura-intro' },
    ]
  };

  const marketAnalysisSection = userData.wiseBloomMode ? {
    section: t('guide.market_analysis'),
    icon: Activity,
    items: [
      { title: t('guide.items.glucose_factor_title'), description: t('guide.items.glucose_factor_desc'), articleId: 'glucose-factor' },
      { title: t('guide.items.circadian_roi_title'), description: t('guide.items.circadian_roi_desc'), articleId: 'circadian-roi' },
      { title: t('guide.items.menopause_skin_title'), description: t('guide.items.menopause_skin_desc'), articleId: 'menopause-skin' },
    ]
  } : {
    section: t('guide.market_analysis'),
    icon: Activity,
    items: [
      { title: t('guide.items.glucose_factor_title'), description: t('guide.items.glucose_factor_desc'), articleId: 'glucose-factor' },
      { title: t('guide.items.circadian_roi_title'), description: t('guide.items.circadian_roi_desc'), articleId: 'circadian-roi' },
      { title: t('guide.items.phase_calm_title'), description: t('guide.items.phase_calm_desc'), articleId: 'phase-calm' },
      { title: t('guide.items.phase_glow_title'), description: t('guide.items.phase_glow_desc'), articleId: 'phase-glow' },
      { title: t('guide.items.phase_balance_title'), description: t('guide.items.phase_balance_desc'), articleId: 'phase-balance' },
    ]
  };

  const compoundScienceSection = {
    section: t('guide.compound_science'),
    icon: FlaskConical,
    items: [
      { title: t('guide.items.pdrn_title'), description: t('guide.items.pdrn_desc'), articleId: 'pdrn' },
      { title: t('guide.items.ceramides_title'), description: t('guide.items.ceramides_desc'), articleId: 'ceramides' },
      { title: t('guide.items.bakuchiol_title'), description: t('guide.items.bakuchiol_desc'), articleId: 'bakuchiol' },
    ]
  };
  
  const dynamicGuideContent = [philosophySection, marketAnalysisSection, compoundScienceSection];

  return (
    <div className="min-h-screen bg-background pb-24">
      <HeaderBar>
        <div>
          <p className="text-xs font-body font-medium text-sage tracking-wide">meanwhile.</p>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t('guide.title')}</h1>
        </div>
      </HeaderBar>

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-10">
        {dynamicGuideContent.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <div key={section.section} className="space-y-4 animate-slide-up" style={{ animationDelay: `${sectionIndex * 0.1}s` }}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className="h-5 w-5 text-sage" />
                <h2 className="text-xl font-heading font-bold category-title">{section.section}</h2>
              </div>

              <div className="grid gap-3">
                {section.items.map((item, itemIndex) => (
                  <Card 
                    key={itemIndex} 
                    className="cursor-pointer hover:border-sage/30 transition-all hover:scale-[1.01]"
                    onClick={() => navigate(`/article/${item.articleId}`)}
                  >
                    <CardHeader>
                      <CardTitle className="text-base font-heading font-bold">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default Guide;
