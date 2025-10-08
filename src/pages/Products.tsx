import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BottomNav } from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { products } from '@/data/productData';
import { useProductTracking } from '@/hooks/useProductTracking';
import { ScanLine, Package, Play } from 'lucide-react';

const Products = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const { startTracking, isTracking } = useProductTracking();
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  // Group products by line
  const harmonyProducts = products.filter((p) => p.line === 'harmony');
  const bloomProducts = products.filter((p) => p.line === 'bloom');
  const precisionProducts = products.filter((p) => p.line === 'precision');

  // Get owned products for each line
  const ownedHarmony = harmonyProducts.filter((p) =>
    userData.ownedProducts.includes(p.id)
  );
  const ownedBloom = bloomProducts.filter((p) =>
    userData.ownedProducts.includes(p.id)
  );
  const ownedPrecision = precisionProducts.filter((p) =>
    userData.ownedProducts.includes(p.id)
  );

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

  const renderProductCard = (product: typeof products[0]) => (
    <Card
      key={product.id}
      className="p-4 space-y-3 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-accent">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h3 className="font-heading font-medium text-sm">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {product.price}
        </p>
      </div>
      {product.lifespanDays && (
        <Button
          size="sm"
          variant={isTracking(product.id) ? "outline" : "default"}
          className="w-full rounded-full text-xs"
          onClick={(e) => handleStartUsing(product, e)}
          disabled={isTracking(product.id)}
        >
          {isTracking(product.id) ? (
            <>✓ Tracking</>
          ) : (
            <>
              <Play className="h-3 w-3 mr-1" />
              Start Using
            </>
          )}
        </Button>
      )}
    </Card>
  );

  const renderEmptyState = (
    title: string,
    message: string,
    buttonText: string,
    lineFilter: string
  ) => (
    <Card className="p-8 text-center space-y-4 bg-accent/30">
      <p className="text-foreground/70 leading-relaxed">
        {message}
      </p>
      <Button
        size="lg"
        onClick={() => navigate('/catalog')}
        className="rounded-full"
      >
        {buttonText}
      </Button>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
        <h1 className="text-4xl font-heading font-semibold text-primary animate-fade-in">
          My Products
        </h1>

        {/* The Spring Harmony™ Collection */}
        <section className="space-y-4 animate-slide-up">
          <h2 className="text-2xl font-heading font-medium text-foreground">
            The Spring Harmony™ Collection
          </h2>
          
          {ownedHarmony.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {ownedHarmony.map(renderProductCard)}
            </div>
          ) : (
            renderEmptyState(
              'The Spring Harmony™ Collection',
              'Your Harmony collection is waiting. Discover the foundational products that provide balance and stability every day.',
              'Discover Harmony',
              'harmony'
            )
          )}
        </section>

        {/* The Bloom Cycle™ Collection */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-heading font-medium text-foreground">
            The Bloom Cycle™ Collection
          </h2>
          
          {ownedBloom.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {ownedBloom.map(renderProductCard)}
            </div>
          ) : (
            renderEmptyState(
              'The Bloom Cycle™ Collection',
              'Your Bloom Cycle collection awaits. Explore products designed to sync with your natural rhythm and honor every phase.',
              'Discover Bloom Cycle',
              'bloom'
            )
          )}
        </section>

        {/* The Precision Care™ Collection */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-heading font-medium text-foreground">
            The Precision Care™ Collection
          </h2>
          
          {ownedPrecision.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {ownedPrecision.map(renderProductCard)}
            </div>
          ) : (
            renderEmptyState(
              'The Precision Care™ Collection',
              'Your Precision Care collection is ready. Discover targeted solutions with powerful actives for your specific skin concerns.',
              'Discover Precision Care',
              'precision'
            )
          )}
        </section>

        {/* Your Other Products Section */}
        <section className="space-y-4 animate-slide-up pt-6" style={{ animationDelay: '0.3s' }}>
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-medium text-foreground">
              Your Other Products
            </h2>
            <p className="text-muted-foreground text-sm">
              We know you use other great products. Let's make sure they work in harmony with your Spring Sisters ritual.
            </p>
          </div>

          {userData.scannedProducts.length > 0 ? (
            <div className="space-y-3">
              {userData.scannedProducts.map((product, index) => (
                <Card key={index} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary/60" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-medium text-sm">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {product.brand}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}

          <Button
            size="lg"
            onClick={() => navigate('/scanner')}
            className="w-full h-14 text-base rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <ScanLine className="h-5 w-5 mr-2" />
            Scan a New Product
          </Button>
        </section>

        {/* Discover More Section */}
        <section className="space-y-4 animate-slide-up pt-6" style={{ animationDelay: '0.4s' }}>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-heading font-medium text-foreground">
              Discover More
            </h2>
            <p className="text-muted-foreground">
              Explore the complete Spring Sisters collection
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/catalog')}
              className="rounded-full w-full max-w-md mx-auto"
            >
              Go to Catalog
            </Button>
          </div>
        </section>
      </div>

      {/* Start Using Modal */}
      <Dialog open={showStartModal} onOpenChange={setShowStartModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Activate Aura's Prediction</DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-2">
              Great! Aura will now start tracking this product's usage to predict when it will run out,
              reminding you to reorder in advance so you never interrupt your ritual.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={confirmStartUsing}
            className="w-full rounded-full mt-4"
            size="lg"
          >
            Got It!
          </Button>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Products;

