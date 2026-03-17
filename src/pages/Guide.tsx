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
      { title: 'From Skincare to Skinvestment', description: 'Why we ignore trends and focus on assets.', articleId: 'mission' },
      { title: 'Managing your Biological Capital', description: 'How The Constants & The Shifts work together.', articleId: 'lines' },
      { title: 'The meanwhile. Logic', description: 'How m.i. manages your skin in the background.', articleId: 'aura-intro' },
    ]
  };

  const marketAnalysisSection = userData.wiseBloomMode ? {
    section: 'Market Analysis',
    icon: Activity,
    items: [
      { title: 'The Glucose Factor: Anti-Glycation Strategy', description: 'Why your dinner determines your skin\'s tomorrow.', articleId: 'glucose-factor' },
      { title: 'Circadian ROI: Sleep as a Repair Asset', description: 'Maximizing recovery while you sleep.', articleId: 'circadian-roi' },
      { title: 'Longevity 101: Preventing collagen bankruptcy', description: 'The science of mature skin capital.', articleId: 'menopause-skin' },
    ]
  } : {
    section: 'Market Analysis',
    icon: Activity,
    items: [
      { title: 'The Glucose Factor: Anti-Glycation Strategy', description: 'Why your dinner determines your skin\'s tomorrow.', articleId: 'glucose-factor' },
      { title: 'Circadian ROI: Sleep as a Repair Asset', description: 'Maximizing recovery while you sleep.', articleId: 'circadian-roi' },
      { title: 'Phase 1: Calm & Renew', description: 'Low Estrogen & Progesterone — Days 1-7', articleId: 'phase-calm' },
      { title: 'Phase 2: Glow & Energize', description: 'Estrogen Peak — Days 8-14', articleId: 'phase-glow' },
      { title: 'Phase 3: Balance & Clarify', description: 'Progesterone Dominance — Days 15+', articleId: 'phase-balance' },
    ]
  };

  const compoundScienceSection = {
    section: 'Compound Science',
    icon: FlaskConical,
    items: [
      { title: 'PDRN: DNA-Level Yield', description: 'The high-yield asset for cellular reconstruction.', articleId: 'pdrn' },
      { title: 'Ceramides: The Defensive Wall', description: 'Building blocks of your Index Fund\'s barrier resilience.', articleId: 'ceramides' },
      { title: 'Bakuchiol: The Gentle Powerhouse', description: 'Plant-based retinol alternative for all strategies.', articleId: 'bakuchiol' },
    ]
  };
  
  const dynamicGuideContent = [
    philosophySection,
    marketAnalysisSection,
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
