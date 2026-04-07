import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, Circle, Shield, ShieldAlert, Star, Zap } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Badge } from '@/components/ui/badge';

interface AnalysisResult {
  productName: string;
  brand: string;
  category: string;
  theGood: string;
  thingsToWatch: string;
  miRecommendation: string;
  pregnancySafe?: boolean;
  pregnancyFlags?: { ingredient: string; risk: string; severity: string }[];
  overallScore?: number;
  inci_full?: string;
  key_actives?: { name: string; function: string; category?: string }[];
  conflicts?: { ingredient: string; conflictsWith: string; reason: string; severity: string }[];
  synergies?: { ingredients: string[]; benefit: string }[];
}

interface ScanAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysisResult: AnalysisResult | null;
  onAddToShelf: () => void;
}

export const ScanAnalysisModal = ({
  open,
  onOpenChange,
  analysisResult,
  onAddToShelf,
}: ScanAnalysisModalProps) => {
  const { userData } = useUser();

  if (!analysisResult) return null;

  const isPregnancy = userData.pregnancyMode;
  const hasPregnancyFlags = isPregnancy && analysisResult.pregnancyFlags && analysisResult.pregnancyFlags.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-semibold text-primary flex items-center gap-2">
            <Circle className="h-6 w-6" />
            m.i. Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Product Info */}
          <div className="text-center pb-4 border-b border-border">
            <h3 className="text-xl font-heading font-medium text-foreground">
              {analysisResult.productName}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{analysisResult.brand}</p>
            {analysisResult.overallScore && (
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">{analysisResult.overallScore}/10</span>
              </div>
            )}
          </div>

          {/* Pregnancy Warning */}
          {hasPregnancyFlags && (
            <div className="space-y-2 bg-destructive/10 rounded-xl p-4 border border-destructive/20">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading font-semibold text-destructive mb-1">
                    Pregnancy Safety Alert
                  </h4>
                  {analysisResult.pregnancyFlags!.map((flag, i) => (
                    <div key={i} className="text-sm text-foreground/80 mb-1">
                      <span className="font-medium">{flag.ingredient}</span>: {flag.risk}
                      <Badge variant="destructive" className="ml-2 text-[10px]">{flag.severity}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* The Good */}
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-1">The Good</h4>
              <p className="text-sm text-foreground/80 leading-relaxed">{analysisResult.theGood}</p>
            </div>
          </div>

          {/* Key Actives */}
          {analysisResult.key_actives && analysisResult.key_actives.length > 0 && (
            <div className="flex items-start gap-3">
              <Zap className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-1">Key Actives</h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.key_actives.slice(0, 6).map((active, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {active.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Conflicts */}
          {analysisResult.conflicts && analysisResult.conflicts.length > 0 && (
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-1">Ingredient Conflicts</h4>
                {analysisResult.conflicts.map((c, i) => (
                  <p key={i} className="text-sm text-foreground/80 mb-1">
                    <span className="font-medium">{c.ingredient}</span> ↔ {c.conflictsWith}: {c.reason}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Things to Watch */}
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-1">Things to Watch</h4>
              <p className="text-sm text-foreground/80 leading-relaxed">{analysisResult.thingsToWatch}</p>
            </div>
          </div>

          {/* Pregnancy Safe badge */}
          {isPregnancy && !hasPregnancyFlags && (
            <div className="flex items-center gap-2 bg-green-500/10 rounded-xl p-3 border border-green-500/20">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">Pregnancy Safe ✓</span>
            </div>
          )}

          {/* m.i. Recommendation */}
          <div className="bg-accent/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Circle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-primary mb-1">m.i. Recommendation</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{analysisResult.miRecommendation}</p>
              </div>
            </div>
          </div>

          {/* Add to Shelf Button */}
          <Button
            size="lg"
            onClick={onAddToShelf}
            disabled={isPregnancy && !analysisResult.pregnancySafe && hasPregnancyFlags}
            className="w-full h-12 text-base rounded-full mt-4"
          >
            {hasPregnancyFlags ? 'Unsafe for Pregnancy — Cannot Add' : 'Add to My Shelf'}
          </Button>
          {hasPregnancyFlags && (
            <p className="text-center text-xs text-muted-foreground">
              This product contains ingredients not recommended during pregnancy.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
