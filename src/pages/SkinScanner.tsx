import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, Upload, RefreshCw, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCameraManager } from '@/hooks/useCameraManager';

interface SkinAnalysis {
  skinCapitalScore: number;
  radiance: string;
  hydration: string;
  texture: string;
  recommendation: string;
}

const CHECKPOINTS = [
  { label: 'Hydration Mapping', status: 'READY' },
  { label: 'Dermal Texture Analysis', status: 'ACTIVE' },
  { label: 'Luminance Index', status: 'CAPTURING' },
  { label: 'm.i. Intelligence', status: 'CONNECTED' },
];

const SkinScanner = () => {
  const navigate = useNavigate();
  const { videoRef, stream, error: cameraError, startCamera, captureImage } = useCameraManager({
    facingMode: 'user',
    autoStart: true,
  });

  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<SkinAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [faceLocked, setFaceLocked] = useState(false);
  const [activeCheckpoints, setActiveCheckpoints] = useState<number>(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate face detection after 2s of camera active
  useEffect(() => {
    if (!stream || cameraError || scanning || result) return;
    setFaceLocked(false);
    setActiveCheckpoints(-1);
    const faceTimer = setTimeout(() => setFaceLocked(true), 2000);
    return () => clearTimeout(faceTimer);
  }, [stream, cameraError, scanning, result]);

  // Cascade checkpoints once face is locked
  useEffect(() => {
    if (!faceLocked || scanning) return;
    let i = 0;
    const interval = setInterval(() => {
      setActiveCheckpoints(i);
      i++;
      if (i >= CHECKPOINTS.length) clearInterval(interval);
    }, 600);
    return () => clearInterval(interval);
  }, [faceLocked, scanning]);

  const analyzeImage = async (imageData: string) => {
    setScanning(true);
    setScanProgress(0);
    setResult(null);
    setShowResults(false);

    const progressInterval = setInterval(() => {
      setScanProgress((p) => (p >= 95 ? 95 : p + Math.random() * 8 + 2));
    }, 80);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-skin-health', {
        body: { imageData },
      });
      if (error) throw error;
      clearInterval(progressInterval);
      setScanProgress(100);
      await new Promise((r) => setTimeout(r, 400));
      setResult(data.analysis);
      setScanning(false);
      setTimeout(() => setShowResults(true), 50);
    } catch (e) {
      clearInterval(progressInterval);
      console.error('Skin scan error:', e);
      toast.error('Analysis failed. Please try again.');
      setScanning(false);
      setScanProgress(0);
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
    reader.onload = () => analyzeImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRetry = () => {
    startCamera();
  };

  const handleScanAgain = () => {
    setResult(null);
    setShowResults(false);
    setFaceLocked(false);
    setActiveCheckpoints(-1);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-[hsl(var(--intel-stress))]';
    return 'text-destructive';
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

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {result ? (
        <div className={`flex-1 px-4 py-6 space-y-4 overflow-auto transition-all duration-700 ${showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
            <CardContent className="p-6 flex flex-col items-center gap-2">
              <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Skin Capital Score</p>
              <span className={`text-6xl font-heading font-bold ${getScoreColor(result.skinCapitalScore)}`}>{result.skinCapitalScore}</span>
              <div className="w-16 h-px bg-border" />
              <span className="text-[10px] text-muted-foreground tracking-widest">/ 100</span>
            </CardContent>
          </Card>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Radiance', value: result.radiance },
              { label: 'Hydration', value: result.hydration },
              { label: 'Texture', value: result.texture },
            ].map((m) => (
              <Card key={m.label} className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
                <CardContent className="p-3 flex flex-col items-center gap-1">
                  <span className="text-[8px] text-muted-foreground uppercase tracking-[0.15em]">{m.label}</span>
                  <span className="text-xs font-heading font-bold text-foreground">{m.value}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
            <CardContent className="p-5 space-y-3">
              <h3 className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">m.i. Recommendation</h3>
              <p className="text-sm leading-relaxed text-foreground/90">{result.recommendation}</p>
            </CardContent>
          </Card>
          <div className="py-3 px-4 rounded-lg bg-muted/40 border border-border">
            <p className="text-[10px] text-muted-foreground italic text-center leading-relaxed">
              m.i. is calculating your investment. <span className="font-heading">meanwhile.</span>, your current protocol remains optimal.
            </p>
          </div>
          <Button onClick={handleScanAgain} variant="outline" className="w-full text-xs tracking-wider uppercase">Scan Again</Button>
          <Button onClick={() => navigate('/today')} className="w-full text-xs tracking-wider uppercase">View Updated Protocol</Button>
        </div>
      ) : (
        <>
          <div className="flex-1 relative bg-foreground/5">
            {!cameraError ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
                {!scanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className={`w-52 h-64 rounded-[50%] border-[3px] transition-all duration-700 ${faceLocked ? 'border-primary shadow-[0_0_20px_hsl(var(--primary)/0.4),0_0_40px_hsl(var(--primary)/0.15)]' : 'border-white/25'}`} />
                    <p className={`mt-4 text-[10px] tracking-widest uppercase transition-colors duration-500 ${faceLocked ? 'text-primary' : 'text-white/50'}`}>
                      {faceLocked ? 'Face locked — ready for analysis' : 'Position your face in the light'}
                    </p>
                  </div>
                )}
                {!scanning && (
                  <div className="absolute left-4 top-1/3 space-y-3 pointer-events-none">
                    {CHECKPOINTS.map((cp, i) => {
                      const isActive = i <= activeCheckpoints;
                      return (
                        <div key={cp.label} className={`flex items-center gap-2 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                          {isActive ? (
                            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-2.5 w-2.5 text-primary-foreground" />
                            </div>
                          ) : (
                            <Loader2 className="h-4 w-4 text-white/40 animate-spin" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-[9px] font-medium text-white tracking-wide">{cp.label}</span>
                            <span className={`text-[8px] tracking-widest uppercase ${isActive ? 'text-primary' : 'text-white/30'}`}>{cp.status}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 p-6 gap-5">
                <div className="w-52 h-64 border border-dashed border-muted-foreground/30 rounded-[50%] flex items-center justify-center">
                  <Camera className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <p className="text-muted-foreground text-center text-sm max-w-[260px] leading-relaxed">Position your face in the light for m.i. analysis.</p>
                <div className="flex gap-3">
                  <Button onClick={handleRetry} variant="outline" size="sm" className="gap-2"><RefreshCw className="h-4 w-4" /> Retry Camera</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="gap-2"><Upload className="h-4 w-4" /> Upload Photo</Button>
                </div>
              </div>
            )}

            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
                <div className="absolute inset-x-6 top-[10%] bottom-[10%] overflow-hidden rounded-2xl border border-primary/20">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
                  <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_hsl(var(--primary)/0.6)] animate-[scanLine_1.8s_ease-in-out_infinite]" />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-3 mt-auto mb-[16%]">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">Processing Skin Data</p>
                  <span className="text-3xl font-heading font-bold text-white tabular-nums">{Math.min(Math.round(scanProgress), 100)}%</span>
                  <div className="w-40 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-100" style={{ width: `${Math.min(scanProgress, 100)}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-border bg-background space-y-3">
            {!cameraError && (
              <Button onClick={handleScan} disabled={scanning} className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs tracking-widest uppercase">
                <Camera className="h-4 w-4 mr-2" />
                {scanning ? 'Analyzing…' : 'Scan Skin Health'}
              </Button>
            )}
            {!cameraError && !scanning && (
              <button onClick={() => fileInputRef.current?.click()} className="w-full text-center text-[10px] text-muted-foreground hover:text-foreground transition-colors py-1 tracking-wider uppercase">
                or upload a photo for m.i. analysis
              </button>
            )}
            {cameraError && (
              <Button onClick={() => fileInputRef.current?.click()} className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs tracking-widest uppercase">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo for m.i. Analysis
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SkinScanner;
