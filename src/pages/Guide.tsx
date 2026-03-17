import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity, FlaskConical } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';

const Guide = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  
  const philosophySection = {
    section: 'The Philosophy',
    icon: TrendingUp,
    items: [
      { title: 'From Skincare to Skinvestment: Why we ignore trends and focus on assets.', description: 'The meanwhile. investment thesis for your skin.', articleId: 'mission' },
      { title: 'Managing the Portfolio: How the Constants & Shifts work together.', description: 'Understanding the Management Framework.', articleId: 'lines' },
      { title: 'Meet m.i.: How meanwhile.intelligence manages your skin in the background.', description: 'Your strategic partner in skin longevity.', articleId: 'aura-intro' },
    ]
  };

  const biologicalMarketSection = userData.wiseBloomMode ? {
    section: 'The Biological Market',
    icon: Activity,
    items: [
      { title: 'The Glucose Factor: Why your dinner determines your skin\'s tomorrow.', description: 'Anti-glycation intelligence for skin longevity.', articleId: 'glucose-factor' },
      { title: 'Circadian ROI: Maximizing recovery while you sleep.', description: 'Sleep as a compounding investment.', articleId: 'circadian-roi' },
      { title: 'Longevity 101: Preventing collagen bankruptcy in menopause.', description: 'The science of mature skin capital.', articleId: 'menopause-skin' },
    ]
  } : {
    section: 'The Biological Market',
    icon: Activity,
    items: [
      { title: 'The Glucose Factor: Why your dinner determines your skin\'s tomorrow.', description: 'Anti-glycation intelligence for skin longevity.', articleId: 'glucose-factor' },
      { title: 'Circadian ROI: Maximizing recovery while you sleep.', description: 'Sleep as a compounding investment.', articleId: 'circadian-roi' },
      { title: 'Phase 1: Calm & Renew', description: 'Low Estrogen & Progesterone - Days 1-7', articleId: 'phase-calm' },
      { title: 'Phase 2: Glow & Energize', description: 'Estrogen Peak - Days 8-14', articleId: 'phase-glow' },
      { title: 'Phase 3: Balance & Clarify', description: 'Progesterone Dominance - Days 15+', articleId: 'phase-balance' },
    ]
  };

  const compoundScienceSection = {
    section: 'Compound Science',
    icon: FlaskConical,
    items: [
      { title: 'PDRN: The High-Yield Asset for DNA repair.', description: 'The science behind cellular reconstruction.', articleId: 'pdrn' },
      { title: 'Ceramides: The defensive wall of your Index Fund.', description: 'Building blocks of barrier resilience.', articleId: 'ceramides' },
      { title: 'Bakuchiol: The gentle powerhouse.', description: 'Plant-based retinol alternative for all strategies.', articleId: 'bakuchiol' },
    ]
  };
  
  const dynamicGuideContent = [
    philosophySection,
    biologicalMarketSection,
    compoundScienceSection,
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <div className="space-y-1 animate-fade-in">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">meanwhile.</p>
          <h1 className="text-4xl font-heading font-semibold text-primary">
            Strategic Knowledge
          </h1>
        </div>

        {dynamicGuideContent.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <div key={section.section} className="space-y-4 animate-slide-up" style={{ animationDelay: `${sectionIndex * 0.1}s` }}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-heading font-semibold">{section.section}</h2>
              </div>

              <div className="grid gap-4">
                {section.items.map((item, itemIndex) => (
                  <Card 
                    key={itemIndex} 
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                    onClick={() => navigate(`/article/${item.articleId}`)}
                  >
                    <CardHeader>
                      <CardTitle className="font-heading text-xl">{item.title}</CardTitle>
                      <CardDescription className="text-base">{item.description}</CardDescription>
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
