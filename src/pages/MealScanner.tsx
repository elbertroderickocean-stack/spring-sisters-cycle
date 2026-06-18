import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, Upload, RefreshCw, Loader2, AlertTriangle, CheckCircle, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCameraManager } from '@/hooks/useCameraManager';
import { useMealLog } from '@/hooks/useMealLog';

interface MealAnalysis {
  foodName: string;
  glycemicIndex: string;
  skinImpact: string;
  recommendation: string;
  nutrients?: { calories: number; protein: number; carbs: number; fat: number; fiber: number; sugar: number; };
}

const MealScanner = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { videoRef, stream, error: cameraError, startCamera, captureImage } = useCameraManager({ facingMode: 'environment', autoStart: true });
  const { addEntry } = useMealLog();

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<MealAnalysis | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeImage = async (imageData: string) => {
    setScanning(true);
    setResult(null);
    setSaved(false);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-meal', { body: { imageData } });
      if (error) throw error;
      const analysis = data.analysis;
      setResult(analysis);
      addEntry({
        foodName: analysis.foodName,
        glycemicIndex: analysis.glycemicIndex as 'Low' | 'Medium' | 'High',
        skinImpact: analysis.skinImpact,
        recommendation: analysis.recommendation,
        nutrients: analysis.nutrients || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 },
      });
      setSaved(true);
      toast.success(t('meal_scanner.meal_logged'), { description: t('meal_scanner.meal_logged_desc', { name: analysis.foodName }) });
    } catch (e) {
      console.error('Meal scan error:', e);
      toast.error(t('meal_scanner.analysis_failed'));
    } finally {
      setScanning(false);
    }
  };

  const handleScan = async () => {
    const imageData = captureImage();
    if (!imageData) { toast.error(t('meal_scanner.capture_failed')); return; }
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

  const giColor = result?.glycemicIndex === 'High' ? 'text-[hsl(var(--intel-stress))]' : result?.glycemicIndex === 'Medium' ? 'text-[hsl(var(--intel-stress))]' : 'text-[hsl(var(--intel-sleep))]';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/intelligence/glucose')} className="p-2 hover:bg-accent rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-heading font-semibold">{t('meal_scanner.title')}</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t('meal_scanner.subtitle')}</p>
        </div>
      </header>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {!result ? (
        <>
          <div className="flex-1 relative bg-foreground/5">
            {!cameraError ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                {!scanning && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
                    <div className="relative w-full max-w-sm aspect-square">
                      <div className="absolute inset-0 border-2 border-white/20 rounded-2xl" />
                      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[hsl(var(--intel-glucose))] rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-[hsl(var(--intel-glucose))] rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-[hsl(var(--intel-glucose))] rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[hsl(var(--intel-glucose))] rounded-br-lg" />
                      <p className="absolute -bottom-8 left-0 right-0 text-center text-[10px] text-white/50 tracking-widest uppercase">{t('meal_scanner.position_meal')}</p>
                    </div>
                  </div>
                )}
                {scanning && (
                  <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Loader2 className="h-12 w-12 text-white animate-spin mx-auto" />
                      <p className="text-white font-heading text-sm animate-pulse">{t('meal_scanner.analyzing')}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 p-6 gap-5">
                <div className="w-48 h-48 border border-dashed border-muted-foreground/30 rounded-2xl flex items-center justify-center">
                  <Camera className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <p className="text-muted-foreground text-center text-sm max-w-[260px] leading-relaxed">{t('meal_scanner.point_camera')}</p>
                <div className="flex gap-3">
                  <Button onClick={() => startCamera()} variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" /> {t('meal_scanner.retry_camera')}
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" /> {t('meal_scanner.upload_photo')}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-border bg-background space-y-3">
            {!cameraError ? (
              <>
                <Button onClick={handleScan} disabled={scanning} className="w-full h-14 rounded-full bg-[hsl(var(--intel-glucose))] hover:bg-[hsl(var(--intel-glucose))]/90 text-white text-xs tracking-widest uppercase">
                  <Camera className="h-4 w-4 mr-2" />
                  {scanning ? t('meal_scanner.scanning') : t('meal_scanner.scan_btn')}
                </Button>
                {!scanning && (
                  <button onClick={() => fileInputRef.current?.click()} className="w-full text-center text-[10px] text-muted-foreground hover:text-foreground transition-colors py-1 tracking-wider uppercase">
                    {t('meal_scanner.or_upload')}
                  </button>
                )}
              </>
            ) : (
              <Button onClick={() => fileInputRef.current?.click()} className="w-full h-14 rounded-full bg-[hsl(var(--intel-glucose))] hover:bg-[hsl(var(--intel-glucose))]/90 text-white text-xs tracking-widest uppercase">
                <Upload className="h-4 w-4 mr-2" />
                {t('meal_scanner.upload_btn')}
              </Button>
            )}
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
                  {t('meal_scanner.gi')}: {result.glycemicIndex}
                </span>
              </div>

              {result.nutrients && (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: t('meal_scanner.calories'), value: `${result.nutrients.calories}`, unit: 'kcal' },
                    { label: t('meal_scanner.protein'), value: `${result.nutrients.protein}`, unit: 'g' },
                    { label: t('meal_scanner.carbs'), value: `${result.nutrients.carbs}`, unit: 'g' },
                    { label: t('meal_scanner.fat'), value: `${result.nutrients.fat}`, unit: 'g' },
                    { label: t('meal_scanner.fiber'), value: `${result.nutrients.fiber}`, unit: 'g' },
                    { label: t('meal_scanner.sugar'), value: `${result.nutrients.sugar}`, unit: 'g' },
                  ].map((n) => (
                    <div key={n.label} className="p-2 rounded-lg bg-muted/50 text-center">
                      <p className="text-base font-heading font-bold">{n.value}<span className="text-[10px] text-muted-foreground ml-0.5">{n.unit}</span></p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{n.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{t('meal_scanner.skin_impact')}</h3>
                  <p className="text-sm leading-relaxed">{result.skinImpact}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{t('meal_scanner.protocol_adjustment')}</h3>
                  <p className="text-sm leading-relaxed">{result.recommendation}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border flex items-start gap-2">
                  {saved && <Check className="h-4 w-4 text-[hsl(var(--intel-sleep))] mt-0.5 shrink-0" />}
                  <p className="text-xs text-muted-foreground italic">
                    {saved ? t('meal_scanner.logged_prefix') : ''}{t('meal_scanner.footer_after')}<span className="font-heading">{t('meal_scanner.footer_brand')}</span>{t('meal_scanner.footer_after_brand')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button onClick={() => { setResult(null); setSaved(false); }} variant="outline" className="w-full text-xs tracking-wider uppercase">
            {t('meal_scanner.scan_another')}
          </Button>
          <Button onClick={() => navigate('/intelligence/glucose')} className="w-full text-xs tracking-wider uppercase">
            {t('meal_scanner.view_log')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MealScanner;
