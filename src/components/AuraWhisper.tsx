import React, { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AuraWhisperProps {
  message: string;
  phase?: 'calm' | 'glow' | 'balance';
  onClose: () => void;
  duration?: number;
}

export const AuraWhisper: React.FC<AuraWhisperProps> = ({ 
  message, 
  phase = 'calm', 
  onClose,
  duration = 6000 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slide in
    setTimeout(() => setIsVisible(true), 100);

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for slide-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={cn(
        "fixed top-4 left-4 right-4 z-50 transition-all duration-300 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      <div className="max-w-2xl mx-auto">
        <div className={cn(
          "rounded-2xl shadow-lg backdrop-blur-sm border border-white/20 p-4 flex items-center gap-3",
          phase === 'calm' && "bg-phase-calm/90",
          phase === 'glow' && "bg-phase-glow/90",
          phase === 'balance' && "bg-phase-balance/90"
        )}>
          <div className="shrink-0">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <p className="flex-1 text-sm text-white font-medium">
            {message}
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="shrink-0 h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
