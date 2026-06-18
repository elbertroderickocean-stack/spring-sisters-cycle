import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, Upload, RefreshCw, Check, Loader2, TrendingUp, TrendingDown, Minus, History } from 'lucide-react';
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

interface ScanRecord { id: string; date: string; analysis: SkinAnalysis; }

const STORAGE_KEY = 'meanwhile_skin_scans';

const getScanHistory = (): ScanRecord[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
};

const saveScan = (analysis: SkinAnalysis): ScanRecord => {
  const history = getScanHistory();
  const record: ScanRecord = { id: crypto.randomUUID(), date: new Date().toISOString(), analysis };
  history.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
  return record;
};

const extractNumeric = (value: string): number | null => {
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

const SkinScanner = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-US';
  const { videoRef, stream, error: cameraError, startCamera, captureImage } = useCameraManager({ facingMode: 'user', autoStart: true });

  const CHECKPOINTS = [
    { label: t('skin_scanner.checkpoint_hydration'), status: t('skin_scanner.status_ready') },
    { label: t('skin_scanner.checkpoint_texture'), status: t('skin_scanner.status_active') },
    { label: t('skin_scanner.checkpoint_luminance'), status: t('skin_scanner.status_capturing') },
    { label: t('skin_scanner.checkpoint_mi'), status: t('skin_scanner.status_connected') },
  ];

  const DeltaIndicator = ({ current, previous, suffix = '' }: { current: number | null; previous: number | null; suffix?: string }) => {
    if (current === null || previous === null) return null;
    const delta = current - previous;
    if (delta === 0) return <span className="text-[9px] text-muted-foreground flex items-center gap-0.5"><Minus className="h-3 w-3" /> {t('skin_scanner.no_change')}</span>;
    const isPositive = delta > 0;
    return (
      <span className={`text-[9px] flex items-center gap-0.5 ${isPositive ? 'text-green-500' : 'text-destructive'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {isPositive ? '+' : ''}{delta}{suffix} {t('skin_scanner.vs_last')}
      </span>
    );
  };

  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<SkinAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [faceLocked, setFaceLocked] = useState(false);
  const [activeCheckpoints, setActiveCheckpoints] = useState<number>(-1);
  const [previousScan, setPreviousScan] = useState<ScanRecord | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const history = getScanHistory();
    if (history.length > 0) setPreviousScan(history[0]);
  }, []);

  useEffect(() => {
    if (!stream || cameraError || scanning || result) return;
    setFaceLocked(false);
    setActiveCheckpoints(-1);
    const faceTimer = setTimeout(() => setFaceLocked(true), 2000);
    return () => clearTimeout(faceTimer);
  }, [stream, cameraError, scanning, result]);

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

  const MIN_SCAN_INTERVAL_MS = 24 * 60 * 60 * 1000;

  const analyzeImage = async (imageData: string) => {
    setScanning(true);
    setScanProgress(0);
    setResult(null);
    setShowResults(false);

    const history = getScanHistory();
    const lastScan = history[0];
    if (lastScan) {
      const elapsed = Date.now() - new Date(lastScan.date).getTime();
      if (elapsed < MIN_SCAN_INTERVAL_MS) {
        const hoursLeft = Math.ceil((MIN_SCAN_INTERVAL_MS - elapsed) / (60 * 60 * 1000));
        const cooldownAnalysis: SkinAnalysis = {
          ...lastScan.analysis,
          recommendation: t('skin_scanner.cooldown', { score: lastScan.analysis.skinCapitalScore, hours: hoursLeft }),
        };

        const progressInterval = setInterval(() => {
          setScanProgress((p) => (p >= 95 ? 95 : p + 15));
        }, 60);
        await new Promise((r) => setTimeout(r, 800));
        clearInterval(progressInterval);
        setScanProgress(100);
        await new Promise((r) => setTimeout(r, 300));

        setPreviousScan(lastScan);
        setResult(cooldownAnalysis);
        setScanning(false);
        setTimeout(() => setShowResults(true), 50);
        return;
      }
    }

    const progressInterval = setInterval(() => {
      setScanProgress((p) => (p >= 95 ? 95 : p + Math.random() * 8 + 2));
    }, 80);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-skin-health', { body: { imageData, language: i18n.language } });
      if (error) throw error;
      clearInterval(progressInterval);
      setScanProgress(100);
      await new Promise((r) => setTimeout(r, 400));
      
      const analysis = data.analysis;
      const oldPrevious = previousScan;
      saveScan(analysis);
      setPreviousScan(oldPrevious || null);
      
      setResult(analysis);
      setScanning(false);
      setTimeout(() => setShowResults(true), 50);
    } catch (e) {
      clearInterval(progressInterval);
      console.error('Skin scan error:', e);
      toast.error(t('skin_scanner.analysis_failed_toast'));
      setScanning(false);
      setScanProgress(0);
    }
  };

  const handleScan = async () => {
    const imageData = captureImage();
    if (!imageData) { toast.error(t('skin_scanner.capture_failed_toast')); return; }
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

  const handleRetry = () => { startCamera(); };

  const handleScanAgain = () => {
    const history = getScanHistory();
    if (history.length > 0) setPreviousScan(history[0]);
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

  const scanHistory = getScanHistory();
  const prevAnalysis = previousScan?.analysis;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/intelligence')} className="p-2 hover:bg-accent rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-heading font-semibold">{t('skin_scanner.title')}</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t('skin_scanner.subtitle')}</p>
        </div>
        {scanHistory.length > 0 && (
          <button onClick={() => setShowHistory(!showHistory)} className="p-2 hover:bg-accent rounded-lg transition-colors relative">
            <History className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[8px] flex items-center justify-center font-bold">
              {scanHistory.length}
            </span>
          </button>
        )}
      </header>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {showHistory && (
        <div className="px-4 py-3 border-b border-border bg-muted/30 space-y-2 max-h-60 overflow-y-auto animate-fade-in">
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">{t('skin_scanner.history')}</p>
          {scanHistory.map((scan, i) => {
            const prev = scanHistory[i + 1];
            const delta = prev ? scan.analysis.skinCapitalScore - prev.analysis.skinCapitalScore : null;
            return (
              <div key={scan.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-xs font-medium">{t('skin_scanner.score')}: {scan.analysis.skinCapitalScore}/100</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(scan.date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {delta !== null && (
                  <span className={`text-xs font-medium flex items-center gap-1 ${delta > 0 ? 'text-green-500' : delta < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {delta > 0 ? <TrendingUp className="h-3 w-3" /> : delta < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    {delta > 0 ? '+' : ''}{delta}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {result ? (
        <div className={`flex-1 px-4 py-6 space-y-4 overflow-auto transition-all duration-700 ${showResults ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
            <CardContent className="p-6 flex flex-col items-center gap-2">
              <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{t('skin_scanner.score_label')}</p>
              <span className={`text-6xl font-heading font-bold ${getScoreColor(result.skinCapitalScore)}`}>{result.skinCapitalScore}</span>
              <div className="w-16 h-px bg-border" />
              <span className="text-[10px] text-muted-foreground tracking-widest">{t('skin_scanner.score_of')}</span>
              {prevAnalysis && (
                <DeltaIndicator current={result.skinCapitalScore} previous={prevAnalysis.skinCapitalScore} suffix=" pts" />
              )}
            </CardContent>
          </Card>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t('skin_scanner.radiance'), value: result.radiance, prevValue: prevAnalysis?.radiance },
              { label: t('skin_scanner.hydration'), value: result.hydration, prevValue: prevAnalysis?.hydration },
              { label: t('skin_scanner.texture'), value: result.texture, prevValue: prevAnalysis?.texture },
            ].map((m) => (
              <Card key={m.label} className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
                <CardContent className="p-3 flex flex-col items-center gap-1">
                  <span className="text-[8px] text-muted-foreground uppercase tracking-[0.15em]">{m.label}</span>
                  <span className="text-xs font-heading font-bold text-foreground">{m.value}</span>
                  <DeltaIndicator current={extractNumeric(m.value)} previous={m.prevValue ? extractNumeric(m.prevValue) : null} suffix="%" />
                </CardContent>
              </Card>
            ))}
          </div>

          {prevAnalysis && (
            <Card className="border border-primary/20 bg-primary/5">
              <CardContent className="p-4 space-y-2">
                <p className="text-[9px] uppercase tracking-[0.2em] text-primary font-medium">{t('skin_scanner.compare_title')}</p>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {result.skinCapitalScore > prevAnalysis.skinCapitalScore
                    ? t('skin_scanner.compare_improved', { n: result.skinCapitalScore - prevAnalysis.skinCapitalScore })
                    : result.skinCapitalScore < prevAnalysis.skinCapitalScore
                    ? t('skin_scanner.compare_decreased', { n: prevAnalysis.skinCapitalScore - result.skinCapitalScore })
                    : t('skin_scanner.compare_stable')}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t('skin_scanner.last_scan')}: {new Date(previousScan!.date).toLocaleDateString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
            <CardContent className="p-5 space-y-3">
              <h3 className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{t('skin_scanner.recommendation')}</h3>
              <p className="text-sm leading-relaxed text-foreground/90">{result.recommendation}</p>
            </CardContent>
          </Card>
          <div className="py-3 px-4 rounded-lg bg-muted/40 border border-border">
            <p className="text-[10px] text-muted-foreground italic text-center leading-relaxed">
              {t('skin_scanner.footer_calc')} <span className="font-heading">{t('skin_scanner.footer_meanwhile')}</span>{t('skin_scanner.footer_optimal')}
            </p>
          </div>
          <Button onClick={handleScanAgain} variant="outline" className="w-full text-xs tracking-wider uppercase">{t('skin_scanner.scan_again')}</Button>
          <Button onClick={() => navigate('/today')} className="w-full text-xs tracking-wider uppercase">{t('skin_scanner.view_protocol')}</Button>
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
                      {faceLocked ? t('skin_scanner.face_locked') : t('skin_scanner.position_face')}
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
                <p className="text-muted-foreground text-center text-sm max-w-[260px] leading-relaxed">{t('skin_scanner.position_face_long')}</p>
                <div className="flex gap-3">
                  <Button onClick={handleRetry} variant="outline" size="sm" className="gap-2"><RefreshCw className="h-4 w-4" /> {t('skin_scanner.retry_camera')}</Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="gap-2"><Upload className="h-4 w-4" /> {t('skin_scanner.upload_photo')}</Button>
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
                  <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-medium">{t('skin_scanner.processing')}</p>
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
                {scanning ? t('skin_scanner.analyzing') : t('skin_scanner.scan_btn')}
              </Button>
            )}
            {!cameraError && !scanning && (
              <button onClick={() => fileInputRef.current?.click()} className="w-full text-center text-[10px] text-muted-foreground hover:text-foreground transition-colors py-1 tracking-wider uppercase">
                {t('skin_scanner.or_upload')}
              </button>
            )}
            {cameraError && (
              <Button onClick={() => fileInputRef.current?.click()} className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs tracking-widest uppercase">
                <Upload className="h-4 w-4 mr-2" />
                {t('skin_scanner.upload_btn')}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SkinScanner;
