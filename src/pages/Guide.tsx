import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Sparkles, Leaf } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';

const guideContent = [
  {
    section: 'Our Philosophy',
    icon: BookOpen,
    items: [
      { title: 'Our Mission: From Chaos to Harmony', description: 'Discover why we created Spring Sisters', articleId: 'mission' },
      { title: 'Our Lines: The Orbital System Explained', description: 'Understanding our product philosophy', articleId: 'lines' },
      { title: 'Meet Aura: Your Personal Companion', description: 'Discover the digital heart of Spring Sisters', articleId: 'aura-intro' },
    ]
  },
  {
    section: 'Know Your Skin',
    icon: Sparkles,
    items: [
      { title: 'Phase 1: Calm & Renew', description: 'Low Estrogen & Progesterone - Days 1-7', articleId: 'phase-calm' },
      { title: 'Phase 2: Glow & Energize', description: 'Estrogen Peak - Days 8-14', articleId: 'phase-glow' },
      { title: 'Phase 3: Balance & Clarify', description: 'Progesterone Dominance - Days 15+', articleId: 'phase-balance' },
    ]
  },
  {
    section: 'Ingredient Glossary',
    icon: Leaf,
    items: [
      { title: 'What are Ceramides?', description: 'The building blocks of healthy skin', articleId: 'ceramides' },
      { title: 'Bakuchiol: Our Answer to Retinol', description: 'Gentle yet powerful age-defying care', articleId: 'bakuchiol' },
    ]
  }
];

const Guide = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  
  // Dynamic content based on user mode - CRITICAL: This must check userData.wiseBloomMode
  const philosophySection = {
    section: 'Our Philosophy',
    icon: BookOpen,
    items: [
      { title: 'Our Mission: From Chaos to Harmony', description: 'Discover why we created Spring Sisters', articleId: 'mission' },
      { title: 'Our Lines: The Orbital System Explained', description: 'Understanding our product philosophy', articleId: 'lines' },
      { title: 'Meet Aura: Your Personal Companion', description: 'Discover the digital heart of Spring Sisters', articleId: 'aura-intro' },
    ]
  };

  const knowYourSkinSection = userData.wiseBloomMode ? {
    section: 'Your New Rhythm',
    icon: Sparkles,
    items: [
      { title: 'The Cellular Training Rhythm: Explained', description: 'Understanding your 7-day skin training cycle', articleId: 'cellular-training' },
      { title: 'Understanding Your Skin in Menopause', description: 'The science of mature skin', articleId: 'menopause-skin' },
      { title: 'Power Ingredients for Mature Skin', description: 'What works and why', articleId: 'power-ingredients' },
    ]
  } : {
    section: 'Know Your Skin',
    icon: Sparkles,
    items: [
      { title: 'Phase 1: Calm & Renew', description: 'Low Estrogen & Progesterone - Days 1-7', articleId: 'phase-calm' },
      { title: 'Phase 2: Glow & Energize', description: 'Estrogen Peak - Days 8-14', articleId: 'phase-glow' },
      { title: 'Phase 3: Balance & Clarify', description: 'Progesterone Dominance - Days 15+', articleId: 'phase-balance' },
    ]
  };

  const ingredientSection = {
    section: 'Ingredient Glossary',
    icon: Leaf,
    items: [
      { title: 'What are Ceramides?', description: 'The building blocks of healthy skin', articleId: 'ceramides' },
      { title: 'Bakuchiol: Our Answer to Retinol', description: 'Gentle yet powerful age-defying care', articleId: 'bakuchiol' },
    ]
  };
  
  const dynamicGuideContent = [
    philosophySection,
    knowYourSkinSection,
    ingredientSection,
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-4xl font-heading font-semibold text-primary animate-fade-in">
          The Spring Sisters Guide
        </h1>

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
