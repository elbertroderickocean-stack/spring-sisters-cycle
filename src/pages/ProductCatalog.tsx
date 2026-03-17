import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Hexagon } from 'lucide-react';
import { products } from '@/data/productData';
import ProductCheckoutModal from '@/components/ProductCheckoutModal';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<'bloom' | 'harmony' | 'precision' | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const userBalance = 1250;

  const handleBuy = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setShowCheckout(true);
  };

  const bloomProducts = products.filter(p => p.line === 'bloom');
  const harmonyProducts = products.filter(p => p.line === 'harmony');
  const precisionProducts = products.filter(p => p.line === 'precision');

  const renderProductCard = (product: typeof products[0], index: number) => (
    <Card
      key={product.id}
      className="p-6 flex gap-6 animate-slide-up hover:shadow-lg transition-all cursor-pointer"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-accent">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-heading font-semibold text-foreground mb-2">{product.name}</h3>
          <p className="text-sm text-foreground/70 mb-3">{product.description}</p>
          <p className="text-lg font-semibold text-primary">{product.price}</p>
        </div>
        <div className="flex gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/product/${product.id}`)}>Details</Button>
          <Button size="sm" className="flex-1" onClick={() => handleBuy(product)}>Buy</Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/products')} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-heading font-semibold text-primary">The meanwhile. Collection</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-12">
        {/* The Constants */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-heading font-semibold text-primary">The Constants™</h2>
              <button onClick={() => setOpenModal('harmony')} className="p-1.5 hover:bg-accent rounded-lg transition-colors">
                <Hexagon className="h-5 w-5 text-primary" />
              </button>
            </div>
            <p className="text-muted-foreground">Your Index Fund</p>
          </div>
          <div className="space-y-6">{harmonyProducts.map((p, i) => renderProductCard(p, i))}</div>
        </section>

        {/* The Shifts */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-heading font-semibold text-primary">The Shifts™</h2>
              <button onClick={() => setOpenModal('bloom')} className="p-1.5 hover:bg-accent rounded-lg transition-colors">
                <Hexagon className="h-5 w-5 text-primary" />
              </button>
            </div>
            <p className="text-muted-foreground">Dynamic Management</p>
          </div>
          <div className="space-y-6">{bloomProducts.map((p, i) => renderProductCard(p, i))}</div>
        </section>

        {/* The Assets */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-heading font-semibold text-primary">The Assets™</h2>
              <button onClick={() => setOpenModal('precision')} className="p-1.5 hover:bg-accent rounded-lg transition-colors">
                <Hexagon className="h-5 w-5 text-primary" />
              </button>
            </div>
            <p className="text-muted-foreground">Venture Investments</p>
          </div>
          <div className="space-y-6">{precisionProducts.map((p, i) => renderProductCard(p, i))}</div>
        </section>
      </div>

      {/* m.i. Explains Modals */}
      <Dialog open={openModal === 'harmony'} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-primary flex items-center gap-2">
              <Hexagon className="h-6 w-6" /> m.i. on The Constants™
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground/90 leading-relaxed">
              "Think of The Constants as your index fund — steady, reliable, always compounding. These are the foundational products that provide balance and protection every single day, creating the stable base your dynamic products need to perform."
            </p>
            <Button onClick={() => setOpenModal(null)} className="w-full">Got it!</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'bloom'} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-primary flex items-center gap-2">
              <Hexagon className="h-6 w-6" /> Aura explains The Shifts™
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground/90 leading-relaxed">
              "The Shifts are your dynamic management strategy. F1: Recovery rebuilds. F2: Peak Glow maximizes. F3: Reset rebalances. They adapt to your biological phases, working ahead of the curve so your skin is always optimally managed."
            </p>
            <Button onClick={() => setOpenModal(null)} className="w-full">Got it!</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'precision'} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-primary flex items-center gap-2">
              <Hexagon className="h-6 w-6" /> Aura explains The Assets™
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground/90 leading-relaxed">
              "The Assets are your venture investments — high-conviction, high-reward. These are potent, targeted tools for specific concerns. Deploy them strategically for powerful returns on your skin's long-term health."
            </p>
            <Button onClick={() => setOpenModal(null)} className="w-full">Got it!</Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedProduct && (
        <ProductCheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          productName={selectedProduct.name}
          productPrice={parseFloat(selectedProduct.price.replace('$', ''))}
          userBalance={userBalance}
        />
      )}
    </div>
  );
};

export default ProductCatalog;
