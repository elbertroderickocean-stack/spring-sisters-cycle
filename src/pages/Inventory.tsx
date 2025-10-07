import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { Droplet, Sparkles, Eye, FlaskConical } from 'lucide-react';

const products = [
  { id: 'cleanser', name: 'Gentle Cleanser', icon: Droplet },
  { id: 'moisturizer', name: 'Daily Moisturizer', icon: Sparkles },
  { id: 'eye-cream', name: 'Eye Cream', icon: Eye },
  { id: 'serum-trio', name: 'Bloom Cycle Serum Trio', icon: FlaskConical },
  { id: 'mask-trio', name: 'Bloom Cycle Mask Trio', icon: FlaskConical },
  { id: 'vitamin-c', name: 'Vitamin C Concentrate', icon: FlaskConical },
  { id: 'ceramide', name: 'Ceramide Concentrate', icon: FlaskConical },
];

const Inventory = () => {
  const navigate = useNavigate();
  const { updateUserData } = useUser();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleNext = () => {
    updateUserData({ ownedProducts: selectedProducts });
    navigate('/today');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="max-w-lg w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-heading font-semibold text-primary">
            Let's check your Spring Sisters arsenal.
          </h2>
          <p className="text-foreground/70 text-lg">
            Select the products you already own so we can build your perfect ritual.
          </p>
        </div>

        <div className="space-y-4 pt-6">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className="flex items-center space-x-4 p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => toggleProduct(product.id)}
              >
                <Checkbox
                  id={product.id}
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => toggleProduct(product.id)}
                  className="pointer-events-none"
                />
                <Icon className="h-5 w-5 text-primary/60" />
                <Label
                  htmlFor={product.id}
                  className="flex-1 text-base cursor-pointer"
                >
                  {product.name}
                </Label>
              </div>
            );
          })}
        </div>

        <Button
          size="lg"
          onClick={handleNext}
          className="w-full mt-8 h-12 text-base rounded-full"
        >
          Build My Routine
        </Button>
      </div>
    </div>
  );
};

export default Inventory;
