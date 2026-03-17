import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MealAnalysis {
  foodName: string;
  glycemicIndex: string;
  skinImpact: string;
  recommendation: string;
}

const MealScanner = () => {
  const navigate = useNavigate();
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<MealAnalysis | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        setCameraStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setCameraError('Unable to access camera. Please check permissions.');
      }
    };
    startCamera();
    return () => {
      cameraStream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && cameraStream) videoRef.current.srcObject = cameraStream;
  }, [cameraStream]);

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

  const handleScan = async () => {
    const imageData = captureImage();
    if (!imageData) {
      toast.error('Capture failed. Please try again.');
      return;
    }
    setScanning(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-meal', {
        body: { imageData },
      });
      if (error) throw error;
      setResult(data.analysis);
    } catch (e) {
      console.error('Meal scan error:', e);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const giColor = result?.glycemicIndex === 'High'
    ? 'text-[hsl(var(--intel-stress))]'
    : result?.glycemicIndex === 'Medium'
      ? 'text-[hsl(var(--intel-stress))]'
      : 'text-[hsl(var(--intel-sleep))]';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/intelligence/glucose')} className="p-2 hover:bg-accent rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-heading font-semibold">Meal Scanner</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Glycemic Intelligence</p>
        </div>
      </header>

      {!result ? (
        <>
          <div className="flex-1 relative bg-foreground/5">
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/90 p-6">
                <p className="text-muted-foreground text-center">{cameraError}</p>
              </div>
            )}
            {scanning && (
              <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Loader2 className="h-12 w-12 text-white animate-spin mx-auto" />
                  <p className="text-white font-heading text-sm animate-pulse">Analyzing glycemic impact...</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
              <div className="w-full max-w-sm aspect-square border-2 border-white/30 rounded-2xl">
                <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-white/60 rounded-tl-lg" />
                <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-white/60 rounded-tr-lg" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-white/60 rounded-bl-lg" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-white/60 rounded-br-lg" />
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-border bg-background">
            <Button onClick={handleScan} disabled={scanning || !!cameraError} className="w-full h-14 rounded-full bg-[hsl(var(--intel-glucose))] hover:bg-[hsl(var(--intel-glucose))]/90 text-white">
              <Camera className="h-5 w-5 mr-2" />
              {scanning ? 'Analyzing...' : 'Scan Meal'}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex-1 px-4 py-6 space-y-4 overflow-auto">
          <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-semibold">{result.foodName}</h2>
                <span className={`text-sm font-heading font-bold ${giColor}`}>
                  {result.glycemicIndex === 'High' && <AlertTriangle className="inline h-4 w-4 mr-1" />}
                  {result.glycemicIndex === 'Low' && <CheckCircle className="inline h-4 w-4 mr-1" />}
                  GI: {result.glycemicIndex}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Skin Impact</h3>
                  <p className="text-sm leading-relaxed">{result.skinImpact}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Protocol Adjustment</h3>
                  <p className="text-sm leading-relaxed">{result.recommendation}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground italic">
                    You enjoyed your meal. meanwhile., we are managing the glycation consequences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button onClick={() => setResult(null)} variant="outline" className="w-full">
            Scan Another Meal
          </Button>
          <Button onClick={() => navigate('/today')} className="w-full">
            View Updated Protocol
          </Button>
        </div>
      )}
    </div>
  );
};

export default MealScanner;
