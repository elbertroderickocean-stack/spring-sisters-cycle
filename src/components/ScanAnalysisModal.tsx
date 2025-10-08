import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface AnalysisResult {
  productName: string;
  theGood: string;
  thingsToWatch: string;
  auraSuggestion: string;
}

interface ScanAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysisResult: AnalysisResult | null;
  onAddToProducts: () => void;
}

export const ScanAnalysisModal = ({
  open,
  onOpenChange,
  analysisResult,
  onAddToProducts,
}: ScanAnalysisModalProps) => {
  const { addScannedProduct } = useUser();

  if (!analysisResult) return null;

  const handleAddToProducts = () => {
    addScannedProduct({
      name: analysisResult.productName,
      brand: 'Scanned Product',
      analysis: `Good: ${analysisResult.theGood}`,
    });
    onAddToProducts();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-semibold text-primary flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Aura's Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Name */}
          <div className="text-center pb-4 border-b border-border">
            <h3 className="text-xl font-heading font-medium text-foreground">
              {analysisResult.productName}
            </h3>
          </div>

          {/* The Good */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-1">
                  The Good
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {analysisResult.theGood}
                </p>
              </div>
            </div>
          </div>

          {/* Things to Watch Out For */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-1">
                  Things to Watch Out For
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {analysisResult.thingsToWatch}
                </p>
              </div>
            </div>
          </div>

          {/* Aura's Suggestion */}
          <div className="space-y-3 bg-accent/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-primary mb-1">
                  Aura's Suggestion
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {analysisResult.auraSuggestion}
                </p>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <Button
            size="lg"
            onClick={handleAddToProducts}
            className="w-full h-12 text-base rounded-full mt-4"
          >
            Add to My Products
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
