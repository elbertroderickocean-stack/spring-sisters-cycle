import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ScanLine, Camera, CheckCircle2, RotateCcw } from 'lucide-react';
import { ScanAnalysisModal } from '@/components/ScanAnalysisModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ScanStep = 'front' | 'back' | 'analyzing';

interface Identification {
  brand: string;
  productName: string;
  category: string;
  confidence: string;
  frontClaims?: string;
}

interface AnalysisResult {
  productName: string;
  brand: string;
  category: string;
  inci_full: string;
  key_actives: any[];
  conflicts: any[];
  synergies: any[];
  pregnancy_flags: any[];
  pregnancy_safe: boolean;
  theGood: string;
  thingsToWatch: string;
  miRecommendation: string;
  overallScore: number;
}

const Scanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const returnTo = (location.state as any)?.returnTo || '/products';
  const [scanStep, setScanStep] = useState<ScanStep>('front');
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [identification, setIdentification] = useState<Identification | null>(null);
  const [frontImageData, setFrontImageData] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        setCameraStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Camera access error:', error);
        setCameraError(t('scanner.camera_err'));
        toast({ title: t('scanner.camera_err_title'), description: t('scanner.camera_err_desc'), variant: 'destructive' });
      }
    };
    startCamera();
    return () => { cameraStream?.getTracks().forEach(track => track.stop()); };
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

  const handleScanFront = async () => {
    const imageData = captureImage();
    if (!imageData) {
      toast({ title: t('scanner.capture_failed'), description: t('scanner.capture_failed_desc'), variant: 'destructive' });
      return;
    }
    setIsScanning(true);
    setFrontImageData(imageData);

    try {
      const { data, error } = await supabase.functions.invoke('scan-product-identify', {
        body: { frontImage: imageData, step: 'identify', language: i18n.language }
      });
      if (error) throw error;

      setIdentification(data.identification);
      setScanStep('back');
      toast({
        title: `${data.identification.brand} detected`,
        description: `${data.identification.productName} ${t('scanner.scan_for_ingredients')}`,
      });
    } catch (error) {
      console.error('Front scan error:', error);
      toast({ title: t('scanner.id_failed'), description: t('scanner.id_failed_desc'), variant: 'destructive' });
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanBack = async () => {
    const imageData = captureImage();
    if (!imageData) {
      toast({ title: t('scanner.capture_failed'), description: t('scanner.capture_failed_desc'), variant: 'destructive' });
      return;
    }
    setIsScanning(true);
    setScanStep('analyzing');

    try {
      const { data, error } = await supabase.functions.invoke('scan-product-identify', {
        body: { backImage: imageData, frontImage: frontImageData, step: 'analyze' }
      });
      if (error) throw error;

      const fullResult: AnalysisResult = {
        ...data.analysis,
        productName: identification?.productName || 'Unknown Product',
        brand: identification?.brand || 'Unknown',
        category: identification?.category || 'other',
      };

      setAnalysisResult(fullResult);
      setShowResult(true);
    } catch (error) {
      console.error('Back scan error:', error);
      toast({ title: t('scanner.analysis_failed'), description: t('scanner.analysis_failed_desc'), variant: 'destructive' });
      setScanStep('back');
    } finally {
      setIsScanning(false);
    }
  };

  const handleRetake = () => {
    setScanStep('front');
    setIdentification(null);
    setFrontImageData(null);
  };

  const stepConfig = {
    front: { title: t('scanner.step_front_title'), subtitle: t('scanner.step_front_sub'), buttonText: t('scanner.step_front_btn'), onScan: handleScanFront },
    back: { title: t('scanner.step_back_title'), subtitle: t('scanner.step_back_sub'), buttonText: t('scanner.step_back_btn'), onScan: handleScanBack },
    analyzing: { title: t('scanner.analyzing_title'), subtitle: t('scanner.analyzing_sub'), buttonText: t('scanner.analyzing_btn'), onScan: () => {} },
  };

  const current = stepConfig[scanStep];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 flex items-center border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate(returnTo)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center text-xl font-heading font-semibold text-primary">
          {t('scanner.title')}
        </h1>
        <div className="w-10" />
      </header>

      <div className="px-6 py-3 flex items-center gap-3 border-b border-border bg-accent/20">
        <div className={`flex items-center gap-2 ${scanStep === 'front' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          {scanStep !== 'front' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Camera className="h-4 w-4" />}
          <span className="text-xs">{t('scanner.front')}</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className={`flex items-center gap-2 ${scanStep === 'back' || scanStep === 'analyzing' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          {scanStep === 'analyzing' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <ScanLine className="h-4 w-4" />}
          <span className="text-xs">{t('scanner.ingredients')}</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className={`flex items-center gap-2 ${showResult ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          <span className="text-xs">{t('scanner.analysis')}</span>
        </div>
      </div>

      {identification && scanStep !== 'front' && (
        <div className="px-6 py-2.5 bg-primary/5 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{identification.productName}</p>
            <p className="text-xs text-muted-foreground">{identification.brand} · {identification.confidence} {t('scanner.confidence')}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRetake} className="text-xs gap-1">
            <RotateCcw className="h-3 w-3" /> {t('scanner.retake')}
          </Button>
        </div>
      )}

      <div className="flex-1 relative bg-black">
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />

        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 p-6">
            <div className="text-center space-y-4">
              <p className="text-foreground/80">{cameraError}</p>
              <Button onClick={() => navigate(returnTo)}>{t('scanner.go_back')}</Button>
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
          <div className="relative w-full max-w-md aspect-[3/4] border-4 border-primary/60 rounded-2xl overflow-hidden">
            <div className="absolute top-4 left-0 right-0 text-center px-4">
              <p className="text-sm font-medium text-white bg-black/60 backdrop-blur-sm rounded-full py-2 px-4 inline-block">
                {current.subtitle}
              </p>
            </div>

            {(isScanning || scanStep === 'analyzing') && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
                <div className="text-center space-y-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    <ScanLine className="absolute inset-0 m-auto h-10 w-10 text-white animate-pulse" />
                  </div>
                  <p className="text-lg font-heading font-medium text-white animate-pulse">
                    {scanStep === 'front' ? t('scanner.identifying') : t('scanner.parsing')}
                  </p>
                </div>
              </div>
            )}

            <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-primary rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-primary rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-primary rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-primary rounded-br-lg" />
          </div>
        </div>
      </div>

      <div className="p-6 pb-8 border-t border-border bg-background">
        <Button
          size="lg"
          onClick={current.onScan}
          disabled={isScanning || scanStep === 'analyzing'}
          className="w-full h-14 text-base rounded-full"
        >
          {isScanning ? t('scanner.scanning') : current.buttonText}
        </Button>
      </div>

      <ScanAnalysisModal
        open={showResult}
        onOpenChange={setShowResult}
        analysisResult={analysisResult ? {
          productName: analysisResult.productName,
          brand: analysisResult.brand,
          category: analysisResult.category,
          theGood: analysisResult.theGood,
          thingsToWatch: analysisResult.thingsToWatch,
          miRecommendation: analysisResult.miRecommendation,
          pregnancySafe: analysisResult.pregnancy_safe,
          pregnancyFlags: analysisResult.pregnancy_flags,
          overallScore: analysisResult.overallScore,
          inci_full: analysisResult.inci_full,
          key_actives: analysisResult.key_actives,
          conflicts: analysisResult.conflicts,
          synergies: analysisResult.synergies,
        } : null}
        onAddToShelf={() => {
          setShowResult(false);
          navigate(returnTo, {
            state: {
              scannedProduct: analysisResult ? {
                brand: analysisResult.brand,
                productName: analysisResult.productName,
                category: analysisResult.category,
                inci_full: analysisResult.inci_full,
                key_actives: analysisResult.key_actives,
                conflicts: analysisResult.conflicts,
                synergies: analysisResult.synergies,
                pregnancy_safe: analysisResult.pregnancy_safe,
                overallScore: analysisResult.overallScore,
              } : null,
            }
          });
        }}
      />
    </div>
  );
};

export default Scanner;
