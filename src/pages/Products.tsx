import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BottomNav } from '@/components/BottomNav';
import { useUser, ProductCategory, ExternalProduct } from '@/contexts/UserContext';
import { products } from '@/data/productData';
import { useProductTracking } from '@/hooks/useProductTracking';
import { ScanLine, Package, Play, Plus, X, ChevronDown, Sparkles } from 'lucide-react';

const categoryLabels: Record<ProductCategory, string> = {
  cleanser: 'Cleanser', toner: 'Toner', serum: 'Serum', 'eye-cream': 'Eye Cream',
  moisturizer: 'Moisturizer', sunscreen: 'Sunscreen', mask: 'Mask', oil: 'Face Oil',
  exfoliant: 'Exfoliant', other: 'Other',
};

const Products = () => {
  const navigate = useNavigate();
  const { userData, addExternalProduct, removeExternalProduct } = useUser();
  const { startTracking, isTracking, getDaysUntilRunOut } = useProductTracking();
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', brand: '', category: 'moisturizer' as ProductCategory });

  const harmonyProducts = products.filter((p) => p.line === 'harmony');
  const bloomProducts = products.filter((p) => p.line === 'bloom');
  const precisionProducts = products.filter((p) => p.line === 'precision');

  const ownedHarmony = harmonyProducts.filter((p) => userData.ownedProducts.includes(p.id));
  const ownedBloom = bloomProducts.filter((p) => userData.ownedProducts.includes(p.id));
  const ownedPrecision = precisionProducts.filter((p) => userData.ownedProducts.includes(p.id));

  const handleStartUsing = (product: typeof products[0], e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isTracking(product.id) && product.lifespanDays) {
      setSelectedProduct(product);
      setShowStartModal(true);
    }
  };

  const confirmStartUsing = () => {
    if (selectedProduct) {
      startTracking(selectedProduct.id);
      setShowStartModal(false);
      setSelectedProduct(null);
    }
  };

  const handleAddExternal = () => {
    if (newProduct.name.trim() && newProduct.brand.trim()) {
      addExternalProduct(newProduct);
      setNewProduct({ name: '', brand: '', category: 'moisturizer' });
      setShowAddModal(false);
    }
  };

  const renderProductCard = (product: typeof products[0]) => {
    const tracking = isTracking(product.id);
    const daysRemaining = getDaysUntilRunOut(product.id);
    return (
      <Card key={product.id} className="p-4 space-y-3 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        <div className="aspect-square rounded-lg overflow-hidden bg-accent">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-heading font-medium text-sm">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{product.price}</p>
        </div>
        {product.lifespanDays && (
          tracking && daysRemaining !== null ? (
            <div className="flex items-center gap-2 text-xs bg-accent/50 rounded-full px-3 py-2">
              <div className="text-primary">⏳</div>
              <span className="font-medium">Est. remaining: {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}</span>
            </div>
          ) : (
            <Button size="sm" variant="default" className="w-full rounded-full text-xs" onClick={(e) => handleStartUsing(product, e)}>
              <Play className="h-3 w-3 mr-1" /> Deploy Asset
            </Button>
          )
        )}
      </Card>
    );
  };

  const renderEmptyState = (message: string, buttonText: string) => (
    <Card className="p-8 text-center space-y-4 bg-accent/30">
      <p className="text-foreground/70 leading-relaxed">{message}</p>
      <Button size="lg" onClick={() => navigate('/catalog')} className="rounded-full">{buttonText}</Button>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
        <h1 className="text-4xl font-heading font-semibold text-primary animate-fade-in">
          My Shelf
        </h1>

        {/* MY SHELF — External Products Section */}
        <section className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-medium text-foreground">
                Your Products
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Products from any brand — all managed by m.i.
              </p>
            </div>
            <Badge variant="outline" className="text-[9px] uppercase tracking-wider gap-1">
              <Sparkles className="h-2.5 w-2.5" /> Open Platform
            </Badge>
          </div>

          {userData.externalProducts.length > 0 && (
            <div className="space-y-2">
              {userData.externalProducts.map((product) => (
                <Card key={product.id} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-medium text-sm">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.brand} · {categoryLabels[product.category]}</p>
                  </div>
                  <button
                    onClick={() => removeExternalProduct(product.id)}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </Card>
              ))}
            </div>
          )}

          {/* Scanned products */}
          {userData.scannedProducts.length > 0 && (
            <div className="space-y-2">
              {userData.scannedProducts.map((product, index) => (
                <Card key={index} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary/60" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-medium text-sm">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              size="lg"
              onClick={() => setShowAddModal(true)}
              variant="outline"
              className="flex-1 h-12 rounded-full"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/scanner')}
              className="flex-1 h-12 rounded-full bg-gradient-to-r from-primary to-primary/80"
            >
              <ScanLine className="h-4 w-4 mr-2" /> Scan Product
            </Button>
          </div>
        </section>

        {/* meanwhile. Products */}
        <section className="space-y-4 animate-slide-up pt-4" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-1">
            <h2 className="text-2xl font-heading font-medium text-foreground">
              <span className="italic">meanwhile.</span> Collection
            </h2>
            <p className="text-sm text-muted-foreground">
              Phase-synced products with live m.i. intelligence
            </p>
          </div>

          {/* The Constants */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-body pl-1">The Constants™</p>
            {ownedHarmony.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">{ownedHarmony.map(renderProductCard)}</div>
            ) : renderEmptyState('Your foundational index fund is waiting.', 'Discover Constants')}
          </div>

          {/* The Shifts */}
          <div className="space-y-2 pt-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-body pl-1">The Shifts™</p>
            {ownedBloom.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">{ownedBloom.map(renderProductCard)}</div>
            ) : renderEmptyState('Dynamic management products that adapt to your cycle.', 'Discover Shifts')}
          </div>

          {/* The Assets */}
          <div className="space-y-2 pt-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-body pl-1">The Assets™</p>
            {ownedPrecision.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">{ownedPrecision.map(renderProductCard)}</div>
            ) : renderEmptyState('High-conviction targeted solutions.', 'Discover Assets')}
          </div>
        </section>

        {/* Discover More */}
        <section className="space-y-4 animate-slide-up pt-6" style={{ animationDelay: '0.3s' }}>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-heading font-medium text-foreground">Explore Catalog</h2>
            <Button size="lg" onClick={() => navigate('/catalog')} className="rounded-full w-full max-w-md mx-auto">
              Go to Catalog
            </Button>
          </div>
        </section>
      </div>

      {/* Start Using Modal */}
      <Dialog open={showStartModal} onOpenChange={setShowStartModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Activate m.i. Tracking</DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-2">
              m.i. will now track this asset's usage and predict depletion.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={confirmStartUsing} className="w-full rounded-full mt-4" size="lg">Got It!</Button>
        </DialogContent>
      </Dialog>

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
                type="text" value={newProduct.name}
                onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Advanced Night Repair"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Brand</label>
              <input
                type="text" value={newProduct.brand}
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
            <Button onClick={handleAddExternal} disabled={!newProduct.name.trim() || !newProduct.brand.trim()} className="w-full rounded-lg">
              Add to My Shelf
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Products;

