import React from 'react';

interface HeroIngredientsProps {
  ingredients?: string[];
}

export const HeroIngredients: React.FC<HeroIngredientsProps> = ({ 
  ingredients = ['Niacinamide', 'Panthenol', 'Peptides'] 
}) => {
  return (
    <div className="rounded-2xl p-5 border border-border bg-[hsl(var(--sage-light))] shadow-[var(--shadow-soft)]">
      <span className="text-[10px] uppercase tracking-[0.15em] text-sage-foreground mb-4 block font-body font-semibold">
        Your hero ingredients this month
      </span>
      <div className="space-y-0">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="py-3 border-t border-border first:border-t-0">
            <span className="text-base font-heading font-medium text-foreground">{ingredient}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
