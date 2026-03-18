import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useAuraWhispers } from '@/hooks/useAuraWhispers';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';
import { cn } from '@/lib/utils';

const SAGE = '#B2C2B2';

const productGroups = [
  {
    label: 'The Constants',
    products: [
      { id: 'cleanser', name: 'The Baseline Cleanser' },
      { id: 'moisturizer', name: 'The Long-Term Moisturizer' },
      { id: 'eye-cream', name: 'The Long-Term Eye Cream' },
    ],
  },
  {
    label: 'The Shifts',
    products: [
      { id: 'serum-trio', name: 'The Shifts Serum Trio' },
      { id: 'mask-trio', name: 'The Shifts Mask Trio' },
    ],
  },
  {
    label: 'The Assets',
    products: [
      { id: 'vitamin-c', name: 'Vitamin C Concentrate' },
      { id: 'ceramide', name: 'Ceramide Concentrate' },
      { id: 'cellular-architect', name: 'The Cellular Architect Cream' },
    ],
  },
];

const Inventory = () => {
  const navigate = useNavigate();
  const { updateUserData } = useUser();
  const { triggerProTip } = useAuraWhispers();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleNext = () => {
    const productInventory = selectedProducts.map(productId => ({
      productId,
      quantity: 1
    }));
    
    updateUserData({ 
      ownedProducts: selectedProducts,
      productInventory
    });

    const precisionProductNames: Record<string, string> = {
      'vitamin-c': 'Vitamin C Concentrate',
      'ceramide': 'Ceramide Concentrate'
    };
    
    const addedPrecisionProduct = selectedProducts.find(id => precisionProductNames[id]);
    if (addedPrecisionProduct) {
      const productName = precisionProductNames[addedPrecisionProduct];
      localStorage.setItem('pending_protip', productName);
    }
    
    navigate('/register');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={8} />
      <div className="max-w-lg w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-heading font-semibold text-primary">
            Check your <span className="italic">meanwhile.</span> arsenal.
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed">
            Select the assets you already own so m.i. can construct your daily deployment.
          </p>
        </div>

        <div className="space-y-6 pt-4">
          {productGroups.map((group) => (
            <div key={group.label} className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-body pl-1">
                {group.label}
              </p>
              <div className="space-y-1.5">
                {group.products.map((product) => {
                  const isSelected = selectedProducts.includes(product.id);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleProduct(product.id)}
                      className={cn(
                        "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-300 text-left group",
                        isSelected
                          ? "border-transparent"
                          : "border-border/60 hover:border-border"
                      )}
                      style={isSelected ? {
                        backgroundColor: `${SAGE}12`,
                        borderColor: `${SAGE}40`,
                      } : undefined}
                    >
                      {/* Custom circle checkbox */}
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-300"
                        )}
                        style={{
                          borderColor: isSelected ? SAGE : 'hsl(var(--border))',
                          backgroundColor: isSelected ? SAGE : 'transparent',
                        }}
                      >
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>

                      <span
                        className={cn(
                          "text-[15px] font-body transition-colors duration-300",
                          isSelected ? "text-foreground" : "text-foreground/60"
                        )}
                      >
                        {product.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <Button
          size="lg"
          onClick={handleNext}
          className="w-full mt-8 h-12 text-base rounded-lg"
        >
          Continue
        </Button>

        <p className="text-center text-xs text-muted-foreground/50 pt-1">
          Don't own any yet? Skip ahead — <span className="italic">meanwhile.</span> will show you what's missing.
        </p>
      </div>
    </div>
  );
};

export default Inventory;
