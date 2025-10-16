import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { products } from '@/data/productData';
import ProductCheckoutModal from '@/components/ProductCheckoutModal';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<'bloom' | 'harmony' | 'precision' | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const userBalance = 1250; // Static demo balance

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
      {/* Product Image */}
      <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-accent">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-foreground/70 mb-3">
            {product.description}
          </p>
          <p className="text-lg font-semibold text-primary">
            {product.price}
          </p>
        </div>

        <div className="flex gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            Details
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleBuy(product)}
          >
            Buy
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/products')}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-heading font-semibold text-primary">
            The Spring Sisters Collection
          </h1>
        </div>
      </div>

      {/* Product Sections */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-12">
        {/* Bloom Cycle Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-heading font-semibold text-primary">
                The Bloom Cycle™
              </h2>
              <button
                onClick={() => setOpenModal('bloom')}
                className="p-1.5 hover:bg-accent rounded-lg transition-colors group"
                aria-label="Learn about The Bloom Cycle"
              >
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </button>
            </div>
            <p className="text-muted-foreground">Our Core Innovation</p>
          </div>
          <div className="space-y-6">
            {bloomProducts.map((product, index) => renderProductCard(product, index))}
          </div>
        </section>

        {/* Spring Harmony Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-heading font-semibold text-primary">
                The Spring Harmony™
              </h2>
              <button
                onClick={() => setOpenModal('harmony')}
                className="p-1.5 hover:bg-accent rounded-lg transition-colors group"
                aria-label="Learn about The Spring Harmony"
              >
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </button>
            </div>
            <p className="text-muted-foreground">Your Daily Foundation</p>
          </div>
          <div className="space-y-6">
            {harmonyProducts.map((product, index) => renderProductCard(product, index))}
          </div>
        </section>

        {/* Precision Care Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-heading font-semibold text-primary">
                The Precision Care™
              </h2>
              <button
                onClick={() => setOpenModal('precision')}
                className="p-1.5 hover:bg-accent rounded-lg transition-colors group"
                aria-label="Learn about The Precision Care"
              >
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </button>
            </div>
            <p className="text-muted-foreground">Your Targeted Toolkit</p>
          </div>
          <div className="space-y-6">
            {precisionProducts.map((product, index) => renderProductCard(product, index))}
          </div>
        </section>
      </div>

      {/* Aura Explains Modals */}
      <Dialog open={openModal === 'bloom'} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-primary flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              Aura explains The Bloom Cycle™
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground/90 leading-relaxed">
              "Hello! This is our intelligent core. Think of these products as the planets in our system, moving in a predictable rhythm. They adapt to your skin's hormonal phases, working ahead of the curve to bring you harmony through change."
            </p>
            <Button onClick={() => setOpenModal(null)} className="w-full">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'harmony'} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-primary flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              Aura explains The Spring Harmony™
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground/90 leading-relaxed">
              "This is the foundation of your ritual, our sun. These are the constants that provide balance and protection every single day, creating the perfect stable environment for your cyclical products to work their magic."
            </p>
            <Button onClick={() => setOpenModal(null)} className="w-full">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'precision'} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-primary flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              Aura explains The Precision Care™
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground/90 leading-relaxed">
              "This is your 'emergency toolkit,' our meteorites. These are not for every day. They are highly potent, surgical tools for solving specific, acute problems when your skin calls for help. Use them when you need a powerful, targeted solution."
            </p>
            <Button onClick={() => setOpenModal(null)} className="w-full">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Checkout Modal */}
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
