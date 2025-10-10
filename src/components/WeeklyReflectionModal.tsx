import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles, ScanLine } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TypingText } from '@/components/TypingText';

interface WeeklyReflectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  currentPhase: string;
  primaryConcern?: string;
  recentProducts?: string;
}

interface SkinMetrics {
  red_spots_count: number;
  dark_spots_area: number;
  texture_score: number;
  brightness_score: number;
  primary_observation: string;
}

export const WeeklyReflectionModal: React.FC<WeeklyReflectionModalProps> = ({
  open,
  onOpenChange,
  userName,
  currentPhase,
  primaryConcern,
  recentProducts
}) => {
  const [step, setStep] = useState<'intro' | 'camera' | 'analyzing' | 'results'>('intro');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [metrics, setMetrics] = useState<SkinMetrics | null>(null);
  const [auraInsight, setAuraInsight] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (step === 'camera') {
      startCamera();
    }
    
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
    };
  }, [step]);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } // Front camera for selfies
      });
      setCameraStream(stream);
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: 'Camera Access Required',
        description: 'Please allow camera access for your Weekly Reflection.',
        variant: 'destructive',
      });
      setStep('intro');
    }
  };

  const captureImage = (): string | null => {
    if (!videoRef.current) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    ctx.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleCapture = async () => {
    const imageData = captureImage();
    
    if (!imageData) {
      toast({
        title: 'Capture Failed',
        description: 'Unable to capture image. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    // Stop camera
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }

    setStep('analyzing');

    try {
      const { data, error } = await supabase.functions.invoke('analyze-skin-photo', {
        body: { 
          imageData,
          userName,
          currentPhase,
          primaryConcern,
          recentProducts
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        if (error.message?.includes('429')) {
          toast({
            title: "Rate limit exceeded",
            description: "Please try again in a moment.",
            variant: "destructive"
          });
        } else if (error.message?.includes('402')) {
          toast({
            title: "Payment required",
            description: "Please add credits to your Lovable AI workspace.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        setStep('intro');
        return;
      }

      setMetrics(data.metrics);
      setAuraInsight(data.auraInsight);
      setStep('results');
    } catch (error) {
      console.error('Weekly Reflection error:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze your photo. Please try again.',
        variant: 'destructive',
      });
      setStep('intro');
    }
  };

  const handleClose = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setStep('intro');
    setMetrics(null);
    setAuraInsight('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 'intro' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-primary" />
                Weekly Reflection
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <p className="text-foreground/80">
                Every Sunday, we pause to truly see your skin's journey. This isn't just a photo—it's a moment of connection between you and your body's wisdom.
              </p>
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-sm">What I'll analyze:</h3>
                <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
                  <li>Red chromatic anomalies (inflammation patterns)</li>
                  <li>Dark chromatic anomalies (hyperpigmentation areas)</li>
                  <li>Skin texture homogeneity</li>
                  <li>Overall luminance and radiance</li>
                </ul>
              </div>
              <p className="text-sm text-foreground/70">
                I'll interpret these metrics within the context of your cycle phase, your products, and your personal journey. Ready?
              </p>
              <Button 
                onClick={() => setStep('camera')}
                className="w-full"
                size="lg"
              >
                <Camera className="h-4 w-4 mr-2" />
                Take My Photo
              </Button>
            </div>
          </>
        )}

        {step === 'camera' && (
          <>
            <DialogHeader>
              <DialogTitle>Position Your Face</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[80%] aspect-square border-2 border-primary/60 rounded-full" />
                </div>
              </div>
              <p className="text-sm text-center text-foreground/70">
                Center your face in the circle. Make sure you're in good, natural lighting.
              </p>
              <Button 
                onClick={handleCapture}
                className="w-full"
                size="lg"
              >
                Capture Photo
              </Button>
            </div>
          </>
        )}

        {step === 'analyzing' && (
          <div className="py-12 space-y-6 text-center">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <ScanLine className="absolute inset-0 m-auto h-10 w-10 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Analyzing your skin...</h3>
              <p className="text-sm text-foreground/70">
                Extracting objective metrics and preparing your personalized insight
              </p>
            </div>
          </div>
        )}

        {step === 'results' && metrics && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-primary" />
                Your Weekly Reflection
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Metrics Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4 space-y-1">
                  <div className="text-2xl font-bold text-primary">{metrics.red_spots_count}</div>
                  <div className="text-xs text-foreground/70">Red Spots</div>
                </div>
                <div className="bg-muted rounded-lg p-4 space-y-1">
                  <div className="text-2xl font-bold text-primary">{metrics.dark_spots_area}%</div>
                  <div className="text-xs text-foreground/70">Dark Spot Area</div>
                </div>
                <div className="bg-muted rounded-lg p-4 space-y-1">
                  <div className="text-2xl font-bold text-primary">{metrics.texture_score}/100</div>
                  <div className="text-xs text-foreground/70">Texture Score</div>
                </div>
                <div className="bg-muted rounded-lg p-4 space-y-1">
                  <div className="text-2xl font-bold text-primary">{metrics.brightness_score}/100</div>
                  <div className="text-xs text-foreground/70">Brightness Score</div>
                </div>
              </div>

              {/* Aura's Insight */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-3">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Sparkles className="h-4 w-4" />
                  Aura's Insight
                </div>
                <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  <TypingText text={auraInsight} speed={225} />
                </div>
              </div>

              <Button 
                onClick={handleClose}
                className="w-full"
                size="lg"
              >
                Complete Reflection
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
