import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';

const Products = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-4xl font-heading font-semibold text-primary animate-fade-in">
          Products
        </h1>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Spring Sisters Collection</CardTitle>
            <CardDescription className="text-base">
              Explore our complete range of cyclical skincare products
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Products;
