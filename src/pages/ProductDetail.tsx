import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { products } from '@/data/productData';
import ProductCheckoutModal from '@/components/ProductCheckoutModal';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [showCheckout, setShowCheckout] = useState(false);
  
  const product = products.find(p => p.id === id);
  const userBalance = 1250;

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading mb-4">{t('product_detail.not_found')}</h1>
          <Button onClick={() => navigate('/catalog')}>{t('product_detail.back_to_catalog')}</Button>
        </div>
      </div>
    );
  }

  const getLineLabel = (line: string) => {
    switch (line) {
      case 'bloom': return t('product_detail.line_bloom');
      case 'harmony': return t('product_detail.line_harmony');
      case 'precision': return t('product_detail.line_precision');
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/catalog')} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-heading font-semibold text-primary">{t('product_detail.title')}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <div className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-accent animate-fade-in">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-3 animate-slide-up">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {t('product_detail.from')} {getLineLabel(product.line)}
          </div>
          <h1 className="text-4xl font-heading font-semibold text-primary">{product.name}</h1>
          <p className="text-2xl font-semibold text-foreground">{product.price}</p>
        </div>

        <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader><CardTitle className="font-heading text-2xl">{t('product_detail.about')}</CardTitle></CardHeader>
          <CardContent><p className="text-foreground/80 leading-relaxed">{product.detailedDescription}</p></CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader><CardTitle className="font-heading text-2xl">{t('product_detail.how_to_use')}</CardTitle></CardHeader>
          <CardContent><p className="text-foreground/80 leading-relaxed">{product.howToUse}</p></CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader><CardTitle className="font-heading text-2xl">{t('product_detail.key_ingredients')}</CardTitle></CardHeader>
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

        <div className="sticky bottom-0 pt-6 pb-4 bg-background border-t border-border animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button size="lg" onClick={() => setShowCheckout(true)} className="w-full h-14 text-base rounded-full">
            {t('product_detail.buy_now')} - {product.price}
          </Button>
        </div>
      </div>

      {product && (
        <ProductCheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} productName={product.name} productPrice={parseFloat(product.price.replace('$', ''))} userBalance={userBalance} />
      )}
    </div>
  );
};

export default ProductDetail;
