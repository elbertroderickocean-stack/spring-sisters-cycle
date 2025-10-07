import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Sparkles, Leaf } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

const guideContent = [
  {
    section: 'Our Philosophy',
    icon: BookOpen,
    items: [
      { title: 'Our Mission: From Chaos to Harmony', description: 'Discover why we created Spring Sisters' },
      { title: 'Our Lines: Bloom Cycle, Harmony, Precision Care Explained', description: 'Understanding our product philosophy' },
    ]
  },
  {
    section: 'Know Your Skin',
    icon: Sparkles,
    items: [
      { title: 'Phase 1: Calm & Renew', description: 'Low Estrogen & Progesterone - Days 1-7' },
      { title: 'Phase 2: Glow & Energize', description: 'Estrogen Peak - Days 8-14' },
      { title: 'Phase 3: Balance & Clarify', description: 'Progesterone Dominance - Days 15+' },
    ]
  },
  {
    section: 'Ingredient Glossary',
    icon: Leaf,
    items: [
      { title: 'What are Ceramides?', description: 'The building blocks of healthy skin' },
      { title: 'Bakuchiol: Our Answer to Retinol', description: 'Gentle yet powerful age-defying care' },
    ]
  }
];

const Guide = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-4xl font-heading font-semibold text-primary animate-fade-in">
          The Spring Sisters Guide
        </h1>

        {guideContent.map((section, sectionIndex) => {
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
