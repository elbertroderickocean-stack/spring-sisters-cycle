import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface HowToContent {
  quantity?: string;
  preparation?: string;
  application: string;
  videoUrl?: string;
  proTips?: string[];
}

interface HowToModalProps {
  isOpen: boolean;
  onClose: () => void;
  stepName: string;
  stepType: 'product' | 'wellness';
  timeOfDay: 'morning' | 'evening';
  content: HowToContent;
}

export const HowToModal: React.FC<HowToModalProps> = ({
  isOpen,
  onClose,
  stepName,
  stepType,
  timeOfDay,
  content
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <Badge variant="outline" className="text-xs">
              {timeOfDay === 'morning' ? '☀️ Morning' : '🌙 Evening'} • {stepType === 'product' ? 'Product' : 'Wellness'}
            </Badge>
          </div>
          <DialogTitle className="font-heading text-2xl">{stepName}</DialogTitle>
          <DialogDescription className="text-base">
            Pro-tips from Aura for optimal results
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {stepType === 'wellness' && content.videoUrl && (
            <div className="rounded-lg overflow-hidden bg-muted aspect-video">
              <video 
                src={content.videoUrl} 
                loop 
                muted 
                autoPlay 
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {content.quantity && (
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-primary">Quantity</h4>
              <p className="text-sm text-muted-foreground">{content.quantity}</p>
            </div>
          )}

          {content.preparation && (
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-primary">Preparation</h4>
              <p className="text-sm text-muted-foreground">{content.preparation}</p>
            </div>
          )}

          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-primary">Application Technique</h4>
            <p className="text-sm text-muted-foreground">{content.application}</p>
          </div>

          {content.proTips && content.proTips.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <h4 className="font-semibold text-sm text-primary flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Key Pointers
              </h4>
              <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                {content.proTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
