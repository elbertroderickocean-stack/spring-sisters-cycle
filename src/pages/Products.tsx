import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { products } from '@/data/productData';

const Products = () => {
  const navigate = useNavigate();
  const { userData } = useUser();

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
      </div>

      <BottomNav />
    </div>
  );
};

export default Products;
