import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ScanLine } from 'lucide-react';
import { ScanAnalysisModal } from '@/components/ScanAnalysisModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  productName: string;
  theGood: string;
  thingsToWatch: string;
  auraSuggestion: string;
}

const Scanner = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Request camera access on mount
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } // Use back camera on mobile
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Camera access error:', error);
        setCameraError('Unable to access camera. Please check permissions.');
        toast({
          title: 'Camera Access Required',
          description: 'Please allow camera access to scan ingredient lists.',
          variant: 'destructive',
        });
      }
    };

    startCamera();

    // Cleanup: stop camera when component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Update video element when stream changes
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
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
      toast({
        title: 'Capture Failed',
        description: 'Unable to capture image. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsScanning(true);

    try {
      const { data, error } = await supabase.functions.invoke('scan-ingredients', {
        body: { imageData }
      });

      if (error) throw error;

      setAnalysisResult(data.analysis);
      setShowResult(true);
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze ingredients. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/products')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="flex-1 text-center text-xl font-heading font-semibold text-primary">
          Ingredient Scanner
        </h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Camera View */}
      <div className="flex-1 relative bg-black">
        {/* Live camera feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Camera error overlay */}
        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 p-6">
            <div className="text-center space-y-4">
              <p className="text-foreground/80">{cameraError}</p>
              <Button onClick={() => navigate('/products')}>
                Go Back
              </Button>
            </div>
          </div>
        )}

        {/* Scanning frame overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
          <div className="relative w-full max-w-md aspect-[3/4] border-4 border-primary/60 rounded-2xl overflow-hidden">
            {/* Guide text */}
            <div className="absolute top-4 left-0 right-0 text-center px-4">
              <p className="text-sm font-medium text-white bg-black/60 backdrop-blur-sm rounded-full py-2 px-4 inline-block">
                Position the ingredient list inside the frame
              </p>
            </div>

            {/* Scanning animation overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
                <div className="text-center space-y-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    <ScanLine className="absolute inset-0 m-auto h-10 w-10 text-white animate-pulse" />
                  </div>
                  <p className="text-lg font-heading font-medium text-white animate-pulse">
                    Analyzing ingredients...
                  </p>
                </div>
              </div>
            )}

            {/* Corner markers for scan frame */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-primary rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-primary rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-primary rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-primary rounded-br-lg" />
          </div>
        </div>
      </div>

      {/* Scan Button */}
      <div className="p-6 pb-8 border-t border-border bg-background">
        <Button
          size="lg"
          onClick={handleScan}
          disabled={isScanning}
          className="w-full h-14 text-base rounded-full"
        >
          {isScanning ? 'Scanning...' : 'Scan Ingredient List'}
        </Button>
      </div>

      {/* Analysis Result Modal */}
      <ScanAnalysisModal
        open={showResult}
        onOpenChange={setShowResult}
        analysisResult={analysisResult}
        onAddToProducts={() => {
          setShowResult(false);
          navigate('/products');
        }}
      />
    </div>
  );
};

export default Scanner;
