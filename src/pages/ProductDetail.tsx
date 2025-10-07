import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { products } from '@/data/productData';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading mb-4">Product not found</h1>
          <Button onClick={() => navigate('/catalog')}>Back to Catalog</Button>
        </div>
      </div>
    );
  }

  const handleBuy = () => {
    alert(`Redirecting to the online store to purchase ${product.name}`);
  };

  const getLineLabel = (line: string) => {
    switch (line) {
      case 'bloom':
        return 'The Bloom Cycle™ Line';
      case 'harmony':
        return 'The Spring Harmony™ Line';
      case 'precision':
        return 'The Precision Care™ Line';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/catalog')}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-heading font-semibold text-primary">
            Product Details
          </h1>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Image */}
        <div className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-accent animate-fade-in">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Header */}
        <div className="space-y-3 animate-slide-up">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            From {getLineLabel(product.line)}
          </div>
          <h1 className="text-4xl font-heading font-semibold text-primary">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-foreground">
            {product.price}
          </p>
        </div>

        {/* Description */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">About This Product</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 leading-relaxed">
              {product.detailedDescription}
            </p>
          </CardContent>
        </Card>

        {/* How to Use */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 leading-relaxed">
              {product.howToUse}
            </p>
          </CardContent>
        </Card>

        {/* Key Ingredients */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Key Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {product.keyIngredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-foreground/80">{ingredient}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Buy Button */}
        <div className="sticky bottom-0 pt-6 pb-4 bg-background border-t border-border animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button
            size="lg"
            onClick={handleBuy}
            className="w-full h-14 text-base rounded-full"
          >
            Buy Now - {product.price}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
