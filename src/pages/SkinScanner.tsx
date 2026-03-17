import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, Loader2, Upload, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SkinAnalysis {
  skinCapitalScore: number;
  radiance: string;
  hydration: string;
  texture: string;
  recommendation: string;
}

const SkinScanner = () => {
  const navigate = useNavigate();
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<SkinAnalysis | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setCameraError('denied');
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      cameraStream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const analyzeImage = async (imageData: string) => {
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

  const handleScan = async () => {
    const imageData = captureImage();
    if (!imageData) {
      toast.error('Capture failed.');
      return;
    }
    await analyzeImage(imageData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      analyzeImage(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRetry = () => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    startCamera();
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {!result ? (
        <>
          <div className="flex-1 relative bg-foreground/5">
            {!cameraError ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
                {/* Alignment guide */}
                {!scanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-48 h-60 border-2 border-white/20 rounded-[50%]" />
                    <p className="mt-4 text-white/60 text-xs tracking-wide">Position your face in the light for m.i. analysis</p>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 p-6 gap-5">
                <div className="w-48 h-60 border border-dashed border-muted-foreground/30 rounded-[50%] flex items-center justify-center">
                  <Camera className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <p className="text-muted-foreground text-center text-sm max-w-[260px] leading-relaxed">
                  Position your face in the light for m.i. analysis.
                </p>
                <div className="flex gap-3">
                  <Button onClick={handleRetry} variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Retry Camera
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" /> Upload Photo
                  </Button>
                </div>
              </div>
            )}

            {/* Scanning overlay with horizontal line animation */}
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                  {/* Scanning line */}
                  <div className="absolute inset-x-8 top-[15%] bottom-[15%] overflow-hidden rounded-2xl border border-white/10">
                    <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[hsl(var(--intel-sleep))] to-transparent animate-[scanLine_2.5s_ease-in-out_infinite]" />
                  </div>
                  <div className="space-y-2 mt-auto mb-[18%]">
                    <Loader2 className="h-5 w-5 text-white animate-spin mx-auto" />
                    <p className="text-white font-heading text-sm tracking-wide">Analyzing skin biometrics…</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-border bg-background space-y-3">
            {!cameraError && (
              <Button onClick={handleScan} disabled={scanning} className="w-full h-14 rounded-full bg-[hsl(var(--intel-sleep))] hover:bg-[hsl(var(--intel-sleep))]/90 text-white">
                <Camera className="h-5 w-5 mr-2" />
                {scanning ? 'Scanning…' : 'Scan Skin Health'}
              </Button>
            )}
            {!cameraError && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                or upload a photo for m.i. analysis
              </button>
            )}
            {cameraError && !scanning && (
              <Button onClick={() => fileInputRef.current?.click()} className="w-full h-14 rounded-full bg-[hsl(var(--intel-sleep))] hover:bg-[hsl(var(--intel-sleep))]/90 text-white">
                <Upload className="h-5 w-5 mr-2" />
                Upload Photo for m.i. Analysis
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 px-4 py-6 space-y-4 overflow-auto">
          {/* Score */}
          <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
            <CardContent className="p-6 flex flex-col items-center gap-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Skin Capital Score</p>
              <span className={`text-5xl font-heading font-bold ${getScoreColor(result.skinCapitalScore)}`}>
                {result.skinCapitalScore}
              </span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </CardContent>
          </Card>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Radiance', value: result.radiance, color: '--intel-sleep' },
              { label: 'Hydration', value: result.hydration, color: '--intel-stress' },
              { label: 'Texture', value: result.texture, color: '--intel-glucose' },
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
