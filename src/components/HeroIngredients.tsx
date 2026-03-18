import React from 'react';

interface HeroIngredientsProps {
  ingredients?: string[];
}

export const HeroIngredients: React.FC<HeroIngredientsProps> = ({ 
  ingredients = ['Niacinamide', 'Panthenol', 'Peptides'] 
}) => {
  return (
    <div className="glass-card p-5" style={{ background: 'hsla(30, 20%, 50%, 0.08)' }}>
      <span className="text-[10px] uppercase tracking-[0.15em] text-primary mb-4 block font-semibold">
        Your hero ingredients this month
      </span>
      <div className="space-y-0">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="py-3 border-t border-[hsl(var(--glass-border))] first:border-t-0">
            <span className="text-base font-semibold text-foreground">{ingredient}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
