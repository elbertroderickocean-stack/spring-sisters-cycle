import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ScanLine } from 'lucide-react';
import { ScanAnalysisModal } from '@/components/ScanAnalysisModal';

const Scanner = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning for 2-3 seconds
    setTimeout(() => {
      setIsScanning(false);
      setShowResult(true);
    }, 2500);
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
      <div className="flex-1 relative bg-gradient-to-br from-accent/20 to-accent/5">
        {/* Simulated camera view background */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {/* Scanning frame overlay */}
          <div className="relative w-full max-w-md aspect-[3/4] border-4 border-primary/40 rounded-2xl overflow-hidden">
            {/* Guide text */}
            <div className="absolute top-4 left-0 right-0 text-center px-4">
              <p className="text-sm font-medium text-primary bg-background/90 backdrop-blur-sm rounded-full py-2 px-4 inline-block">
                Position the ingredient list inside the frame
              </p>
            </div>

            {/* Scanning animation overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <ScanLine className="absolute inset-0 m-auto h-10 w-10 text-primary animate-pulse" />
                  </div>
                  <p className="text-lg font-heading font-medium text-primary animate-pulse">
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
        onAddToProducts={() => {
          setShowResult(false);
          navigate('/products');
        }}
      />
    </div>
  );
};

export default Scanner;
