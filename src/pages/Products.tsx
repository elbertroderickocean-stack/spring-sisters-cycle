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

  const ownedProducts = products.filter((product) =>
    userData.ownedProducts.includes(product.id)
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-4xl font-heading font-semibold text-primary animate-fade-in">
          Мои Продукты
        </h1>

        {/* User's Arsenal Section */}
        <section className="space-y-4 animate-slide-up">
          <h2 className="text-2xl font-heading font-medium text-foreground">
            Ваш Арсенал
          </h2>
          <p className="text-foreground/70">
            Продукты, которые у вас уже есть:
          </p>

          {ownedProducts.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {ownedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="min-w-[200px] p-4 space-y-3 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-accent">
                    <img
                      src={product.image}
                      alt={product.nameRu}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-medium text-sm">
                      {product.nameRu}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.price}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                У вас пока нет продуктов Spring Sisters
              </p>
            </Card>
          )}
        </section>

        {/* Discover Section */}
        <section className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-heading font-medium text-foreground">
            Откройте для Себя
          </h2>
          <p className="text-foreground/70">
            Исследуйте полную коллекцию Spring Sisters
          </p>

          <Button
            size="lg"
            onClick={() => navigate('/catalog')}
            className="w-full h-14 text-base rounded-full mt-4"
          >
            Перейти в Каталог
          </Button>
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

export default Products;
