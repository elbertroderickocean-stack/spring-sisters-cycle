import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser, ProductCategory } from '@/contexts/UserContext';
import { useAuraWhispers } from '@/hooks/useAuraWhispers';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';
import OnboardingBackButton from '@/components/OnboardingBackButton';
import { cn } from '@/lib/utils';
import { Plus, ScanLine, Package, X, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

const categoryLabels: Record<ProductCategory, string> = {
  cleanser: 'Cleanser',
  toner: 'Toner',
  serum: 'Serum',
  'eye-cream': 'Eye Cream',
  moisturizer: 'Moisturizer',
  sunscreen: 'Sunscreen',
  mask: 'Mask',
  oil: 'Face Oil',
  exfoliant: 'Exfoliant',
  other: 'Other',
};

const Inventory = () => {
  const navigate = useNavigate();
  const { updateUserData, addExternalProduct } = useUser();
  const { triggerProTip } = useAuraWhispers();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [externalProducts, setExternalProducts] = useState<Array<{ name: string; brand: string; category: ProductCategory }>>([]);
  const [newProduct, setNewProduct] = useState({ name: '', brand: '', category: 'moisturizer' as ProductCategory });
  const [activeTab, setActiveTab] = useState<'meanwhile' | 'shelf'>('shelf');

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddExternal = () => {
    if (newProduct.name.trim() && newProduct.brand.trim()) {
      setExternalProducts(prev => [...prev, { ...newProduct }]);
      setNewProduct({ name: '', brand: '', category: 'moisturizer' });
      setShowAddModal(false);
    }
  };

  const removeExternal = (index: number) => {
    setExternalProducts(prev => prev.filter((_, i) => i !== index));
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

    // Add external products to context
    externalProducts.forEach(p => {
      addExternalProduct(p);
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
      <div className="max-w-lg w-full space-y-6 animate-slide-up">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-heading font-semibold text-primary">
            Build your skincare shelf.
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed">
            Add what you already use — any brand, any product. m.i. will build your personalized routine from your real shelf.
          </p>
        </div>

        {/* Tab Switch */}
        <div className="flex gap-0 rounded-2xl border-2 border-border overflow-hidden">
          <button
            onClick={() => setActiveTab('shelf')}
            className={cn(
              "flex-1 py-4 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2",
              activeTab === 'shelf'
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted/30"
            )}
          >
            <Package className="h-4.5 w-4.5" />
            My Shelf
          </button>
          <div className="w-[2px] bg-border" />
          <button
            onClick={() => setActiveTab('meanwhile')}
            className={cn(
              "flex-1 py-4 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2",
              activeTab === 'meanwhile'
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted/30"
            )}
          >
            <span className="italic">meanwhile.</span> Products
          </button>
        </div>

        {activeTab === 'shelf' && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground/70 text-center">
              Add products from any brand you use daily. m.i. will analyze and integrate them into your routine.
            </p>

            {/* Added external products */}
            {externalProducts.length > 0 && (
              <div className="space-y-2">
                {externalProducts.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 bg-background"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.brand} · {categoryLabels[p.category]}</p>
                    </div>
                    <button onClick={() => removeExternal(idx)} className="p-1 rounded-full hover:bg-muted/50 transition-colors">
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add product buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/30 hover:bg-accent/20 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Add a product</p>
                  <p className="text-xs text-muted-foreground">Any brand, any product type</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/scanner')}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/30 hover:bg-accent/20 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <ScanLine className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Scan your shelf</p>
                  <p className="text-xs text-muted-foreground">Point your camera at products to add them</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'meanwhile' && (
          <div className="space-y-6">
            <p className="text-xs text-muted-foreground/70 text-center">
              Already use <span className="italic">meanwhile.</span> products? Select them to unlock phase-synced intelligence.
            </p>
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
        )}

        <Button
          size="lg"
          onClick={handleNext}
          className="w-full mt-8 h-12 text-base rounded-lg"
        >
          Continue
        </Button>

        <p className="text-center text-xs text-muted-foreground/50 pt-1">
          Don't have products yet? Skip ahead — m.i. will help you build your shelf.
        </p>
        <OnboardingBackButton to="/personalize" />
      </div>

      {/* Add Product Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Add a product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Advanced Night Repair"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Brand</label>
              <input
                type="text"
                value={newProduct.brand}
                onChange={e => setNewProduct(p => ({ ...p, brand: e.target.value }))}
                placeholder="e.g. Estée Lauder"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
              <div className="relative">
                <select
                  value={newProduct.category}
                  onChange={e => setNewProduct(p => ({ ...p, category: e.target.value as ProductCategory }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 appearance-none"
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <Button
              onClick={handleAddExternal}
              disabled={!newProduct.name.trim() || !newProduct.brand.trim()}
              className="w-full rounded-lg"
            >
              Add to My Shelf
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
