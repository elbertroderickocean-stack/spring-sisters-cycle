import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SkinAnalysis {
  skinHealthScore: number;
  redness: string;
  texture: string;
  radiance: string;
  recommendation: string;
}

const SkinScanner = () => {
  const navigate = useNavigate();
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<SkinAnalysis | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        setCameraStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setCameraError('Unable to access front camera.');
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
      toast.error('Capture failed.');
      return;
    }
    setScanning(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-skin-health', {
        body: { imageData },
      });
      if (error) throw error;
      setResult(data.analysis);
    } catch (e) {
      console.error('Skin scan error:', e);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[hsl(var(--intel-sleep))]';
    if (score >= 60) return 'text-[hsl(var(--intel-stress))]';
    return 'text-[hsl(var(--intel-glucose))]';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/intelligence')} className="p-2 hover:bg-accent rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-heading font-semibold">m.i. Skin Scanner</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Dermatological Intelligence</p>
        </div>
      </header>

      {!result ? (
        <>
          <div className="flex-1 relative bg-foreground/5">
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/90 p-6">
                <p className="text-muted-foreground text-center">{cameraError}</p>
              </div>
            )}
            {/* Face mesh overlay */}
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
                <div className="relative z-10 text-center space-y-4">
                  {/* Animated face mesh */}
                  <div className="relative w-48 h-48 mx-auto">
                    <svg viewBox="0 0 200 200" className="w-full h-full animate-pulse">
                      <ellipse cx="100" cy="95" rx="65" ry="80" fill="none" stroke="hsl(270 40% 60%)" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
                      <ellipse cx="75" cy="80" rx="12" ry="8" fill="none" stroke="hsl(210 45% 55%)" strokeWidth="1" opacity="0.6" />
                      <ellipse cx="125" cy="80" rx="12" ry="8" fill="none" stroke="hsl(210 45% 55%)" strokeWidth="1" opacity="0.6" />
                      <path d="M85 110 Q100 125 115 110" fill="none" stroke="hsl(35 50% 60%)" strokeWidth="1" opacity="0.6" />
                      {/* Grid lines */}
                      {Array.from({ length: 8 }, (_, i) => (
                        <line key={`h${i}`} x1="35" y1={30 + i * 20} x2="165" y2={30 + i * 20} stroke="hsl(270 40% 60%)" strokeWidth="0.3" opacity="0.3" />
                      ))}
                      {Array.from({ length: 7 }, (_, i) => (
                        <line key={`v${i}`} x1={45 + i * 20} y1="15" x2={45 + i * 20} y2="175" stroke="hsl(270 40% 60%)" strokeWidth="0.3" opacity="0.3" />
                      ))}
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <Loader2 className="h-6 w-6 text-white animate-spin mx-auto" />
                    <p className="text-white font-heading text-sm">Analyzing skin biometrics...</p>
                  </div>
                </div>
              </div>
            )}
            {/* Alignment guide when not scanning */}
            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-60 border-2 border-white/20 rounded-[50%]" />
              </div>
            )}
          </div>
          <div className="p-6 border-t border-border bg-background">
            <Button onClick={handleScan} disabled={scanning || !!cameraError} className="w-full h-14 rounded-full bg-[hsl(var(--intel-sleep))] hover:bg-[hsl(var(--intel-sleep))]/90 text-white">
              <Camera className="h-5 w-5 mr-2" />
              {scanning ? 'Scanning...' : 'Scan Skin Health'}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex-1 px-4 py-6 space-y-4 overflow-auto">
          {/* Score */}
          <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
            <CardContent className="p-6 flex flex-col items-center gap-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Skin Health Score</p>
              <span className={`text-5xl font-heading font-bold ${getScoreColor(result.skinHealthScore)}`}>
                {result.skinHealthScore}
              </span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </CardContent>
          </Card>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Redness', value: result.redness, color: '--intel-stress' },
              { label: 'Texture', value: result.texture, color: '--intel-glucose' },
              { label: 'Radiance', value: result.radiance, color: '--intel-sleep' },
            ].map((m) => (
              <Card key={m.label} className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
                <CardContent className="p-3 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{m.label}</span>
                  <span className={`text-sm font-heading font-bold text-[hsl(var(${m.color}))]`}>{m.value}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recommendation */}
          <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
            <CardContent className="p-5 space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground">m.i. Recommendation</h3>
              <p className="text-sm leading-relaxed">{result.recommendation}</p>
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground italic">
                  You check your skin. meanwhile., we are already optimizing your protocol.
                </p>
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => setResult(null)} variant="outline" className="w-full">Scan Again</Button>
          <Button onClick={() => navigate('/today')} className="w-full">View Updated Protocol</Button>
        </div>
      )}
    </div>
  );
};

export default SkinScanner;
