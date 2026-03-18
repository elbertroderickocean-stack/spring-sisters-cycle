import React from 'react';

interface HeroIngredientsProps {
  ingredients?: string[];
}

export const HeroIngredients: React.FC<HeroIngredientsProps> = ({ 
  ingredients = ['Niacinamide', 'Panthenol', 'Peptides'] 
}) => {
  return (
    <div className="rounded-2xl p-5 border border-[hsl(var(--glass-border))] bg-[hsl(30_20%_20%_/_0.4)] backdrop-blur-xl">
      <span className="text-[10px] uppercase tracking-[0.15em] text-primary mb-4 block">
        Your hero ingredients this month
      </span>
      <div className="space-y-0">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="py-3 border-t border-[hsl(0_0%_100%_/_0.08)] first:border-t-0">
            <span className="text-base font-medium text-foreground">{ingredient}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
