import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

const ProductRating = () => {
  const navigate = useNavigate();
  const { getCurrentPhase } = useUser();
  const phase = getCurrentPhase();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [textureRating, setTextureRating] = useState(0);
  const [scentRating, setScentRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const getPhaseIconColor = () => {
    if (phase === 'calm') return 'hsl(200 50% 60%)';
    if (phase === 'glow') return 'hsl(30 90% 60%)';
    return 'hsl(120 40% 50%)';
  };

  const phaseIconColor = getPhaseIconColor();

  const products = [
    'Spring Harmony™ Gentle Cleanser',
    'Spring Harmony™ Daily Moisturizer',
    'Spring Calm™ Soothing Serum',
    'Spring Glow™ Brightening Essence',
    'Spring Balance™ Clarifying Gel',
  ];

  const handleSubmit = () => {
    if (textureRating === 0 || scentRating === 0) {
      toast.error('Please rate both texture and scent');
      return;
    }

    toast.success('Review submitted! +50 LP earned');
    setSelectedProduct(null);
    setTextureRating(0);
    setScentRating(0);
    setFeedback('');
  };

  const StarRating = ({ rating, onRate }: { rating: number; onRate: (rating: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className="h-6 w-6"
              style={{
                fill: star <= rating ? phaseIconColor : 'transparent',
                stroke: star <= rating ? phaseIconColor : 'currentColor',
              }}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/sisterhood')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-heading font-semibold">Rate Your Products</h1>
        </div>

        {/* Product List */}
        <div className="space-y-4">
          {products.map((product, index) => (
            <button
              key={index}
              onClick={() => setSelectedProduct(product)}
              className="w-full"
            >
              <Card className="shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">{product}</CardTitle>
                  <CardDescription>Tap to rate and earn 50 LP</CardDescription>
                </CardHeader>
              </Card>
            </button>
          ))}
        </div>

        {/* Rating Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">{selectedProduct}</DialogTitle>
              <DialogDescription>Share your honest feedback</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Texture Rating */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Rate the texture:</label>
                <StarRating rating={textureRating} onRate={setTextureRating} />
              </div>

              {/* Scent Rating */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Rate the scent:</label>
                <StarRating rating={scentRating} onRate={setScentRating} />
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">How has it helped your skin?</label>
                <Textarea
                  placeholder="Share your experience..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full"
                style={{ backgroundColor: phaseIconColor }}
              >
                Submit & Earn 50 LP
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductRating;
