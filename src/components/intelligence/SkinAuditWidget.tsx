import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface SkinMetric {
  label: string;
  sublabel: string;
  value: number; // 0-100
}

const DEFAULT_METRICS: SkinMetric[] = [
  { label: 'Hydration', sublabel: 'Увлажненность', value: 0 },
  { label: 'Barrier', sublabel: 'Защитный барьер', value: 0 },
  { label: 'Collagen', sublabel: 'Упругость', value: 0 },
  { label: 'Luminance', sublabel: 'Сияние', value: 0 },
  { label: 'Texture', sublabel: 'Чистота', value: 0 },
];

// Simulated last-scan data (will be replaced with real scan persistence later)
const DEMO_METRICS: SkinMetric[] = [
  { label: 'Hydration', sublabel: 'Увлажненность', value: 82 },
  { label: 'Barrier', sublabel: 'Защитный барьер', value: 68 },
  { label: 'Collagen', sublabel: 'Упругость', value: 75 },
  { label: 'Luminance', sublabel: 'Сияние', value: 88 },
  { label: 'Texture', sublabel: 'Чистота', value: 79 },
];

const hasScan = true; // Toggle for demo; later driven by real scan state

const getBarColor = (value: number) =>
  value >= 70 ? 'bg-primary' : 'bg-[hsl(var(--phase-glow-solid))]';

const getBarTextColor = (value: number) =>
  value >= 70 ? 'text-primary' : 'text-[hsl(var(--intel-stress))]';

const RadarChart = ({ metrics }: { metrics: SkinMetric[] }) => {
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
      {/* Grid */}
      {gridPolygons.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity={0.5} />
      ))}
      {/* Axis lines */}
      {Array.from({ length: n }, (_, i) => {
        const p = point(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="hsl(var(--border))" strokeWidth="0.5" opacity={0.3} />;
      })}
      {/* Data fill */}
      <polygon
        points={dataPolygon}
        fill="hsl(var(--primary) / 0.15)"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
      />
      {/* Data points with glow */}
      {dataPoints.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="hsl(var(--primary) / 0.2)" />
          <circle cx={p.x} cy={p.y} r="2.5" fill="hsl(var(--primary))" />
        </g>
      ))}
      {/* Labels */}
      {labelPoints.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground"
          style={{ fontSize: '7px', letterSpacing: '0.05em' }}
        >
          {metrics[i].label}
        </text>
      ))}
    </svg>
  );
};

export const SkinAuditWidget = () => {
  const navigate = useNavigate();
  const metrics = hasScan ? DEMO_METRICS : DEFAULT_METRICS;

  return (
    <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg overflow-hidden">
      <CardContent className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">m.i. Skin Audit</h3>
            <p className="text-xs font-heading font-semibold text-foreground mt-0.5">Asset Performance Report</p>
          </div>
          {hasScan && (
            <span className="text-[8px] uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Live
            </span>
          )}
        </div>

        {/* Radar Chart */}
        {hasScan ? (
          <RadarChart metrics={metrics} />
        ) : (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-full max-w-[200px] aspect-square rounded-full border border-dashed border-muted-foreground/20 flex items-center justify-center">
              <p className="text-[10px] text-muted-foreground/50 text-center px-6 leading-relaxed">
                Deployment pending
              </p>
            </div>
            <button
              onClick={() => navigate('/skin-scanner')}
              className="text-[10px] text-primary hover:text-primary/80 tracking-wider uppercase transition-colors"
            >
              Scan for a real-time audit →
            </button>
          </div>
        )}

        {/* Progress bars */}
        {hasScan && (
          <div className="space-y-2.5">
            {metrics.map((m) => (
              <div key={m.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground tracking-wide">{m.label} <span className="opacity-50">· {m.sublabel}</span></span>
                  <span className={`text-[9px] font-heading font-bold tabular-nums ${getBarTextColor(m.value)}`}>{m.value}%</span>
                </div>
                <div className="h-1 rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getBarColor(m.value)}`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analyst note */}
        {hasScan && (
          <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1.5">
            <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-medium">Analyst Note</p>
            <p className="text-[11px] leading-relaxed text-foreground/80">
              Your Barrier Resilience has dropped by 5% due to high stress levels. m.i. is rebalancing your Evening Deployment with 2× Ceramide Asset to recover the loss.
            </p>
          </div>
        )}

        {/* meanwhile. footer */}
        <p className="text-[9px] text-muted-foreground/60 italic text-center leading-relaxed pt-1">
          m.i. is auditing your assets. <span className="font-heading not-italic">meanwhile.</span>, you stay focused on your goals.
        </p>
      </CardContent>
    </Card>
  );
};
