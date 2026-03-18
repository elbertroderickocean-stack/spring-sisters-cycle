import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
    'The Baseline Cleanser',
    'The Long-Term Moisturizer',
    'The Shifts™ F1: Soothing Serum',
    'The Shifts™ F2: Brightening Essence',
    'Spring Balance™ Clarifying Gel',
  ];

  const handleSubmit = () => {
    if (textureRating === 0 || scentRating === 0) {
      toast.error('Please rate both texture and scent');
      return;
    }
    toast.success('Review submitted! +250 AC earned');
    setSelectedProduct(null);
    setTextureRating(0);
    setScentRating(0);
    setFeedback('');
  };

  const StarRating = ({ rating, onRate }: { rating: number; onRate: (r: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onRate(star)} className="transition-transform hover:scale-110">
          <Star className="h-6 w-6" style={{
            fill: star <= rating ? phaseIconColor : 'transparent',
            stroke: star <= rating ? phaseIconColor : 'currentColor',
          }} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/sisterhood')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-heading font-semibold">Asset Review</h1>
        </div>

        <div className="space-y-3">
          {products.map((product, index) => (
            <button key={index} onClick={() => setSelectedProduct(product)} className="w-full">
              <Card className="border border-border hover:border-primary/40 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="font-heading text-base">{product}</CardTitle>
                  <CardDescription className="text-xs">Tap to review and earn 250 AC</CardDescription>
                </CardHeader>
              </Card>
            </button>
          ))}
        </div>

        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg">{selectedProduct}</DialogTitle>
              <DialogDescription className="text-xs">Share your honest feedback</DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider">Rate the texture:</label>
                <StarRating rating={textureRating} onRate={setTextureRating} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider">Rate the scent:</label>
                <StarRating rating={scentRating} onRate={setScentRating} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider">How has it helped your skin?</label>
                <Textarea placeholder="Share your experience..." value={feedback} onChange={(e) => setFeedback(e.target.value)} className="min-h-[100px]" />
              </div>
              <Button onClick={handleSubmit} className="w-full rounded-full" style={{ backgroundColor: phaseIconColor }}>
                Submit & Earn 250 AC
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductRating;
