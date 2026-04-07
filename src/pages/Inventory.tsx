import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser, ProductCategory } from '@/contexts/UserContext';
import { useAuraWhispers } from '@/hooks/useAuraWhispers';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';
import OnboardingBackButton from '@/components/OnboardingBackButton';
import { cn } from '@/lib/utils';
import { ScanLine, X, Sparkles, Shield, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const SAGE = '#B2C2B2';

const meanwhileProducts = [
  { id: 'cleanser', name: 'The Baseline Cleanser', category: 'cleanser' as ProductCategory },
  { id: 'moisturizer', name: 'The Long-Term Moisturizer', category: 'moisturizer' as ProductCategory },
  { id: 'eye-cream', name: 'The Long-Term Eye Cream', category: 'eye-cream' as ProductCategory },
  { id: 'serum-trio', name: 'The Shifts Serum Trio', category: 'serum' as ProductCategory },
  { id: 'mask-trio', name: 'The Shifts Mask Trio', category: 'mask' as ProductCategory },
  { id: 'vitamin-c', name: 'Vitamin C Concentrate', category: 'serum' as ProductCategory },
  { id: 'ceramide', name: 'Ceramide Concentrate', category: 'serum' as ProductCategory },
  { id: 'cellular-architect', name: 'The Cellular Architect Cream', category: 'moisturizer' as ProductCategory },
];

const categoryLabels: Record<ProductCategory, string> = {
  cleanser: 'Cleanser', toner: 'Toner', serum: 'Serum', 'eye-cream': 'Eye Cream',
  moisturizer: 'Moisturizer', sunscreen: 'Sunscreen', mask: 'Mask', oil: 'Face Oil',
  exfoliant: 'Exfoliant', other: 'Other',
};

type ShelfItem =
  | { type: 'meanwhile'; id: string; name: string; category: ProductCategory }
  | { type: 'scanned'; name: string; brand: string; category: ProductCategory; tempId: string; inci_full?: string; key_actives?: any[]; conflicts?: any[]; synergies?: any[]; pregnancy_safe?: boolean; overallScore?: number };

const Inventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserData, addExternalProduct, userData } = useUser();
  const { triggerProTip } = useAuraWhispers();
  const [shelf, setShelf] = useState<ShelfItem[]>([]);
  const [showMeanwhileModal, setShowMeanwhileModal] = useState(false);

  // Receive scanned product from Scanner
  useEffect(() => {
    const state = location.state as any;
    if (state?.scannedProduct) {
      const sp = state.scannedProduct;
      const categoryMap: Record<string, ProductCategory> = {
        cleanser: 'cleanser', toner: 'toner', serum: 'serum', moisturizer: 'moisturizer',
        eye_cream: 'eye-cream', sunscreen: 'sunscreen', mask: 'mask', exfoliant: 'exfoliant',
        oil: 'oil', treatment: 'other', other: 'other',
      };
      setShelf(prev => [...prev, {
        type: 'scanned',
        name: sp.productName,
        brand: sp.brand,
        category: categoryMap[sp.category] || 'other',
        tempId: `scan-${Date.now()}`,
        inci_full: sp.inci_full,
        key_actives: sp.key_actives,
        conflicts: sp.conflicts,
        synergies: sp.synergies,
        pregnancy_safe: sp.pregnancy_safe,
        overallScore: sp.overallScore,
      }]);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const addMeanwhileProduct = (product: typeof meanwhileProducts[0]) => {
    if (shelf.some(s => s.type === 'meanwhile' && s.id === product.id)) return;
    setShelf(prev => [...prev, { type: 'meanwhile', ...product }]);
  };

  const removeFromShelf = (index: number) => {
    setShelf(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    const selectedMeanwhile = shelf.filter(s => s.type === 'meanwhile').map(s => (s as any).id as string);
    const productInventory = selectedMeanwhile.map(productId => ({ productId, quantity: 1 }));

    updateUserData({
      ownedProducts: selectedMeanwhile,
      productInventory
    });

    // Add scanned external products with ingredient data
    shelf.filter(s => s.type === 'scanned').forEach(s => {
      const ext = s as Extract<ShelfItem, { type: 'scanned' }>;
      addExternalProduct({
        name: ext.name,
        brand: ext.brand,
        category: ext.category,
        analysis: ext.inci_full ? `INCI: ${ext.inci_full}` : undefined,
      });
    });

    const precisionProductNames: Record<string, string> = {
      'vitamin-c': 'Vitamin C Concentrate',
      'ceramide': 'Ceramide Concentrate'
    };
    const addedPrecisionProduct = selectedMeanwhile.find(id => precisionProductNames[id]);
    if (addedPrecisionProduct) {
      localStorage.setItem('pending_protip', precisionProductNames[addedPrecisionProduct]);
    }

    navigate('/register');
  };

  const meanwhileOnShelf = shelf.filter(s => s.type === 'meanwhile').map(s => (s as any).id);
  const isPregnancy = userData.pregnancyMode;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={8} />
      <div className="max-w-lg w-full space-y-6 animate-slide-up">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-heading font-semibold text-primary">
            Build your skincare shelf.
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed">
            Scan your products so m.i. can verify ingredients and build a safe, optimized routine. No guesswork.
          </p>
        </div>

        {/* Shelf items */}
        {shelf.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-body pl-1">
              Your Shelf · {shelf.length} product{shelf.length !== 1 ? 's' : ''}
            </p>
            {shelf.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 bg-background">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  item.type === 'meanwhile' ? "bg-primary/10" : "bg-accent"
                )}>
                  {item.type === 'meanwhile' ? (
                    <Sparkles className="h-4 w-4 text-primary" />
                  ) : (
                    <ScanLine className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    {item.type === 'scanned' && (item as any).overallScore && (
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {(item as any).overallScore}/10
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-muted-foreground">
                      {item.type === 'meanwhile' ? (
                        <><span className="italic">meanwhile.</span> · {categoryLabels[item.category]}</>
                      ) : (
                        <>{(item as any).brand} · {categoryLabels[item.category]}</>
                      )}
                    </p>
                    {item.type === 'scanned' && isPregnancy && (
                      (item as any).pregnancy_safe ? (
                        <Shield className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-destructive" />
                      )
                    )}
                  </div>
                </div>
                <button onClick={() => removeFromShelf(idx)} className="p-1 rounded-full hover:bg-muted/50 transition-colors">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons — scan only for external, no manual add */}
        <div className="space-y-2">
          <button
            onClick={() => navigate('/scanner', { state: { returnTo: '/inventory' } })}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/30 hover:bg-accent/20 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <ScanLine className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Scan a product to add</p>
              <p className="text-xs text-muted-foreground">m.i. verifies ingredients before adding to your shelf</p>
            </div>
          </button>

          <button
            onClick={() => setShowMeanwhileModal(true)}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-dashed border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Add <span className="italic">meanwhile.</span> product</p>
              <p className="text-xs text-muted-foreground">Pre-verified, phase-synced with m.i.</p>
            </div>
          </button>
        </div>

        <Button size="lg" onClick={handleNext} className="w-full mt-4 h-12 text-base rounded-lg">
          Continue
        </Button>

        <p className="text-center text-xs text-muted-foreground/50 pt-1">
          Don't have products yet? Skip ahead — m.i. will help you build your shelf.
        </p>
        <OnboardingBackButton to="/personalize" />
      </div>

      {/* meanwhile. Products Modal */}
      <Dialog open={showMeanwhileModal} onOpenChange={setShowMeanwhileModal}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              <span className="italic">meanwhile.</span> Products
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 pt-2">
            {meanwhileProducts.map((product) => {
              const isAdded = meanwhileOnShelf.includes(product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => { if (!isAdded) addMeanwhileProduct(product); }}
                  disabled={isAdded}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left",
                    isAdded ? "border-primary/30 bg-primary/5 opacity-60" : "border-border/60 hover:border-primary/30 hover:bg-accent/20"
                  )}
                >
                  <div
                    className="w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0"
                    style={{
                      borderColor: isAdded ? SAGE : 'hsl(var(--border))',
                      backgroundColor: isAdded ? SAGE : 'transparent',
                    }}
                  >
                    {isAdded && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-body text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{categoryLabels[product.category]}</p>
                  </div>
                  {isAdded && <span className="text-[10px] uppercase tracking-wider text-primary font-medium">Added</span>}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
