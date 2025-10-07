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
            Коллекция Spring Sisters
          </h1>
        </div>
      </div>

      {/* Product List */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {products.map((product, index) => (
          <Card
            key={product.id}
            className="p-6 flex gap-6 animate-slide-up hover:shadow-lg transition-shadow"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Product Image */}
            <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-accent">
              <img
                src={product.image}
                alt={product.nameRu}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  {product.nameRu}
                </h3>
                <p className="text-sm text-foreground/70 mb-3">
                  {product.description}
                </p>
                <p className="text-lg font-semibold text-primary">
                  {product.price}
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  Подробнее
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleBuy(product.nameRu)}
                >
                  Купить
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
