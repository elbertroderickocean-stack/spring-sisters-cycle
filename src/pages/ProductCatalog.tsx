import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { products } from '@/data/productData';

const ProductCatalog = () => {
  const navigate = useNavigate();

  const handleBuy = (productName: string) => {
    alert(`Redirecting to the online store to purchase ${productName}`);
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
            onClick={() => handleBuy(product.name)}
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
            <h2 className="text-3xl font-heading font-semibold text-primary">
              The Bloom Cycle™
            </h2>
            <p className="text-muted-foreground">Our Core Innovation</p>
          </div>
          <div className="space-y-6">
            {bloomProducts.map((product, index) => renderProductCard(product, index))}
          </div>
        </section>

        {/* Spring Harmony Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-semibold text-primary">
              The Spring Harmony™
            </h2>
            <p className="text-muted-foreground">Your Daily Foundation</p>
          </div>
          <div className="space-y-6">
            {harmonyProducts.map((product, index) => renderProductCard(product, index))}
          </div>
        </section>

        {/* Precision Care Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-semibold text-primary">
              The Precision Care™
            </h2>
            <p className="text-muted-foreground">Your Targeted Toolkit</p>
          </div>
          <div className="space-y-6">
            {precisionProducts.map((product, index) => renderProductCard(product, index))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductCatalog;
