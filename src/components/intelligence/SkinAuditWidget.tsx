import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface SkinMetric {
  label: string;
  sublabel: string;
  value: number;
}

interface MetricInsight {
  headline: string;
  factors: string[];
  logic: string;
}

const METRIC_INSIGHTS: Record<string, MetricInsight> = {
  Hydration: {
    headline: 'Asset: Hydration (Moisture Level)',
    factors: ['Humidity levels', 'Air conditioning exposure', 'Water intake', 'Caffeine consumption'],
    logic: 'Low hydration leads to micro-cracks in the stratum corneum. meanwhile., we are optimizing your deployment with Hyaluronic acid to lock in moisture and prevent transepidermal water loss.',
  },
  Barrier: {
    headline: 'Asset: Barrier Resilience',
    factors: ['High cortisol (stress)', 'Sudden temperature changes', 'Environmental pollution', 'Over-exfoliation'],
    logic: 'A compromised barrier increases sensitivity and accelerates aging. meanwhile., we are reinforcing it with The Constants (Ceramides) to restore lipid matrix integrity.',
  },
  Collagen: {
    headline: 'Asset: Elasticity Index (Collagen)',
    factors: ['Glucose spikes (glycation)', 'UV radiation', 'Biological age', 'Inflammation markers'],
    logic: 'Sugar spikes stiffen collagen fibers through AGE cross-linking. meanwhile., we are deploying The Shifts F2 to trigger DNA-level repair and restore structural elasticity.',
  },
  Luminance: {
    headline: 'Asset: Radiance Tone',
    factors: ['Sleep quality', 'Microcirculation', 'Oxidative stress', 'Melanin distribution'],
    logic: 'Poor sleep suppresses cellular turnover, causing dullness. meanwhile., your m.i. protocol adds a Vitamin C boost for immediate luminance recovery and long-term photoprotection.',
  },
  Texture: {
    headline: 'Asset: Texture Purity',
    factors: ['Hormonal shifts', 'Dietary triggers', 'Pore congestion from urban environment', 'Microbiome imbalance'],
    logic: 'Texture irregularities signal a microbiome imbalance at the dermal layer. meanwhile., we are balancing your skin with BHA & Zinc assets to restore clarity.',
  },
};

const DEFAULT_METRICS: SkinMetric[] = [
  { label: 'Hydration', sublabel: 'Moisture Level', value: 0 },
  { label: 'Barrier', sublabel: 'Barrier Resilience', value: 0 },
  { label: 'Collagen', sublabel: 'Elasticity Index', value: 0 },
  { label: 'Luminance', sublabel: 'Radiance Tone', value: 0 },
  { label: 'Texture', sublabel: 'Texture Purity', value: 0 },
];

const DEMO_METRICS: SkinMetric[] = [
  { label: 'Hydration', sublabel: 'Moisture Level', value: 82 },
  { label: 'Barrier', sublabel: 'Barrier Resilience', value: 68 },
  { label: 'Collagen', sublabel: 'Elasticity Index', value: 75 },
  { label: 'Luminance', sublabel: 'Radiance Tone', value: 88 },
  { label: 'Texture', sublabel: 'Texture Purity', value: 79 },
];

const hasScan = true;

const getBarColor = (value: number) =>
  value >= 70 ? 'bg-primary' : 'bg-[hsl(var(--phase-glow-solid))]';

const getBarTextColor = (value: number) =>
  value >= 70 ? 'text-primary' : 'text-[hsl(var(--intel-stress))]';

const RadarChart = ({ metrics, onLabelClick }: { metrics: SkinMetric[]; onLabelClick: (label: string) => void }) => {
  const cx = 120;
  const cy = 120;
  const size = 240;
  const levels = 4;
  const maxR = 90;
  const n = metrics.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const point = (i: number, r: number) => {
    const angle = startAngle + i * angleStep;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridPolygons = Array.from({ length: levels }, (_, l) => {
    const r = (maxR / levels) * (l + 1);
    const pts = Array.from({ length: n }, (_, i) => point(i, r));
    return pts.map((p) => `${p.x},${p.y}`).join(' ');
  });

  const dataPoints = metrics.map((m, i) => point(i, (m.value / 100) * maxR));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const labelPoints = metrics.map((_, i) => point(i, maxR + 22));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] mx-auto">
      {gridPolygons.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity={0.5} />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const p = point(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="hsl(var(--border))" strokeWidth="0.5" opacity={0.3} />;
      })}
      <polygon points={dataPolygon} fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      {dataPoints.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="hsl(var(--primary) / 0.2)" />
          <circle cx={p.x} cy={p.y} r="2.5" fill="hsl(var(--primary))" />
        </g>
      ))}
      {/* Clickable label areas */}
      {labelPoints.map((p, i) => (
        <g key={i} className="cursor-pointer" onClick={() => onLabelClick(metrics[i].label)}>
          <rect x={p.x - 28} y={p.y - 8} width="56" height="16" fill="transparent" rx="4" />
          <text
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground hover:fill-primary transition-colors"
            style={{ fontSize: '7px', letterSpacing: '0.05em' }}
          >
            {metrics[i].label}
          </text>
        </g>
      ))}
    </svg>
  );
};

const MetricInsightModal = ({ open, onOpenChange, metricLabel, metricValue }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricLabel: string | null;
  metricValue: number;
}) => {
  if (!metricLabel) return null;
  const insight = METRIC_INSIGHTS[metricLabel];
  if (!insight) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border border-[hsl(var(--intel-glass-border))] bg-background/80 backdrop-blur-xl p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogTitle className="sr-only">{insight.headline}</DialogTitle>

        {/* Header */}
        <div className="p-5 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-2xl font-heading font-bold tabular-nums ${getBarTextColor(metricValue)}`}>
              {metricValue}%
            </span>
            <button onClick={() => onOpenChange(false)} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <h2 className="text-sm font-heading font-semibold text-foreground leading-snug">{insight.headline}</h2>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Factors */}
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Influencing Factors</h4>
            <div className="flex flex-wrap gap-1.5">
              {insight.factors.map((f) => (
                <span key={f} className="text-[10px] text-foreground/70 bg-muted/60 border border-border/50 rounded-full px-2.5 py-1">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* m.i. Logic */}
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">m.i. Strategic Logic</h4>
            <p className="text-[11px] leading-relaxed text-foreground/80">{insight.logic}</p>
          </div>

          {/* Gauge */}
          <div className="space-y-1.5">
            <h4 className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Current Level</h4>
            <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getBarColor(metricValue)}`}
                style={{ width: `${metricValue}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] text-muted-foreground/50">
              <span>0</span>
              <span>{metricValue >= 70 ? 'Strong' : 'Requires Management'}</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <p className="text-[9px] text-muted-foreground/60 italic text-center leading-relaxed">
            You focus on your performance. <span className="font-heading not-italic">meanwhile.</span>, m.i. protects your biological assets.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const SkinAuditWidget = () => {
  const navigate = useNavigate();
  const metrics = hasScan ? DEMO_METRICS : DEFAULT_METRICS;
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openInsight = (label: string) => {
    setSelectedMetric(label);
    setModalOpen(true);
  };

  const selectedValue = metrics.find((m) => m.label === selectedMetric)?.value ?? 0;

  return (
    <>
      <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg overflow-hidden">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">m.i. Skin Audit</h3>
              <p className="text-xs font-heading font-semibold text-foreground mt-0.5">Asset Performance Report</p>
            </div>
            {hasScan && (
              <span className="text-[8px] uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">Live</span>
            )}
          </div>

          {hasScan ? (
            <RadarChart metrics={metrics} onLabelClick={openInsight} />
          ) : (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="w-full max-w-[200px] aspect-square rounded-full border border-dashed border-muted-foreground/20 flex items-center justify-center">
                <p className="text-[10px] text-muted-foreground/50 text-center px-6 leading-relaxed">Deployment pending</p>
              </div>
              <button onClick={() => navigate('/skin-scanner')} className="text-[10px] text-primary hover:text-primary/80 tracking-wider uppercase transition-colors">
                Scan for a real-time audit →
              </button>
            </div>
          )}

          {hasScan && (
            <div className="space-y-2.5">
              {metrics.map((m) => (
                <button key={m.label} onClick={() => openInsight(m.label)} className="w-full text-left space-y-1 group">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-muted-foreground tracking-wide group-hover:text-foreground transition-colors">
                      {m.label} <span className="opacity-50">· {m.sublabel}</span>
                    </span>
                    <span className={`text-[9px] font-heading font-bold tabular-nums ${getBarTextColor(m.value)}`}>{m.value}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-muted/60 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${getBarColor(m.value)}`} style={{ width: `${m.value}%` }} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {hasScan && (
            <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1.5">
              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-medium">Analyst Note</p>
              <p className="text-[11px] leading-relaxed text-foreground/80">
                Your Barrier Resilience has dropped by 5% due to high stress levels. m.i. is rebalancing your Evening Deployment with 2× Ceramide Asset to recover the loss.
              </p>
            </div>
          )}

          <p className="text-[9px] text-muted-foreground/60 italic text-center leading-relaxed pt-1">
            m.i. is auditing your assets. <span className="font-heading not-italic">meanwhile.</span>, you stay focused on your goals.
          </p>
        </CardContent>
      </Card>

      <MetricInsightModal open={modalOpen} onOpenChange={setModalOpen} metricLabel={selectedMetric} metricValue={selectedValue} />
    </>
  );
};
