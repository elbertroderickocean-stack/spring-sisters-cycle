import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BottomNav } from '@/components/BottomNav';
import { useUser, ProductCategory } from '@/contexts/UserContext';
import { products } from '@/data/productData';
import { useProductTracking } from '@/hooks/useProductTracking';
import { ScanLine, Package, Play, Plus, X, ChevronDown, Sparkles } from 'lucide-react';

const Products = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userData, addExternalProduct, removeExternalProduct } = useUser();
  const { startTracking, isTracking, getDaysUntilRunOut } = useProductTracking();
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', brand: '', category: 'moisturizer' as ProductCategory });

  const categoryLabels: Record<ProductCategory, string> = {
    cleanser: t('categories.cleanser'),
    toner: t('categories.toner'),
    serum: t('categories.serum'),
    'eye-cream': t('categories.eye-cream'),
    moisturizer: t('categories.moisturizer'),
    sunscreen: t('categories.sunscreen'),
    mask: t('categories.mask'),
    oil: t('categories.oil'),
    exfoliant: t('categories.exfoliant'),
    other: t('categories.other'),
  };

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
    if (selectedProduct) { startTracking(selectedProduct.id); setShowStartModal(false); setSelectedProduct(null); }
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
              <span className="font-medium">{t('products.est_remaining', { count: daysRemaining })}</span>
            </div>
          ) : (
            <Button size="sm" variant="default" className="w-full rounded-full text-xs" onClick={(e) => handleStartUsing(product, e)}>
              <Play className="h-3 w-3 mr-1" /> {t('products.deploy_asset')}
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
        <h1 className="text-4xl font-heading font-semibold text-primary animate-fade-in">{t('products.title')}</h1>

        <section className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-medium text-foreground">{t('products.your_products')}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{t('products.managed_by_mi')}</p>
            </div>
            <Badge variant="outline" className="text-[9px] uppercase tracking-wider gap-1">
              <Sparkles className="h-2.5 w-2.5" /> {t('products.open_platform')}
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
                  <button onClick={() => removeExternalProduct(product.id)} className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </Card>
              ))}
            </div>
          )}

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
            <Button size="lg" onClick={() => setShowAddModal(true)} variant="outline" className="flex-1 h-12 rounded-full">
              <Plus className="h-4 w-4 mr-2" /> {t('products.add_product')}
            </Button>
            <Button size="lg" onClick={() => navigate('/scanner')} className="flex-1 h-12 rounded-full bg-gradient-to-r from-primary to-primary/80">
              <ScanLine className="h-4 w-4 mr-2" /> {t('products.scan_product')}
            </Button>
          </div>
        </section>

        <section className="space-y-4 animate-slide-up pt-4" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-1">
            <h2 className="text-2xl font-heading font-medium text-foreground">
              <span className="italic">meanwhile.</span>{t('products.collection')}
            </h2>
            <p className="text-sm text-muted-foreground">{t('products.phase_synced')}</p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-body pl-1">{t('products.constants')}</p>
            {ownedHarmony.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">{ownedHarmony.map(renderProductCard)}</div>
            ) : renderEmptyState(t('products.empty_constants'), t('products.discover_constants'))}
          </div>

          <div className="space-y-2 pt-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-body pl-1">{t('products.shifts')}</p>
            {ownedBloom.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">{ownedBloom.map(renderProductCard)}</div>
            ) : renderEmptyState(t('products.empty_shifts'), t('products.discover_shifts'))}
          </div>

          <div className="space-y-2 pt-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-body pl-1">{t('products.assets')}</p>
            {ownedPrecision.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">{ownedPrecision.map(renderProductCard)}</div>
            ) : renderEmptyState(t('products.empty_assets'), t('products.discover_assets'))}
          </div>
        </section>

        <section className="space-y-4 animate-slide-up pt-6" style={{ animationDelay: '0.3s' }}>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-heading font-medium text-foreground">{t('products.explore_catalog')}</h2>
            <Button size="lg" onClick={() => navigate('/catalog')} className="rounded-full w-full max-w-md mx-auto">
              {t('products.go_to_catalog')}
            </Button>
          </div>
        </section>
      </div>

      <Dialog open={showStartModal} onOpenChange={setShowStartModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">{t('products.activate_tracking')}</DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-2">
              {t('products.activate_desc')}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={confirmStartUsing} className="w-full rounded-full mt-4" size="lg">{t('products.got_it')}</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">{t('products.add_dialog')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('products.product_name')}</label>
              <input type="text" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} placeholder={t('products.product_name_ph')} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('products.brand')}</label>
              <input type="text" value={newProduct.brand} onChange={e => setNewProduct(p => ({ ...p, brand: e.target.value }))} placeholder={t('products.brand_ph')} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('products.category')}</label>
              <div className="relative">
                <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value as ProductCategory }))} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 appearance-none">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <Button onClick={handleAddExternal} disabled={!newProduct.name.trim() || !newProduct.brand.trim()} className="w-full rounded-lg">
              {t('products.add_to_shelf')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Products;
