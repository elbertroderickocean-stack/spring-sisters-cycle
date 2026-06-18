import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, TrendingDown, Zap, Camera, Utensils, Trash2 } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis, ReferenceLine } from 'recharts';
import { useMealLog, type MealLogEntry } from '@/hooks/useMealLog';

const generateFullDayGlucose = () => {
  const data = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const t = h + m / 60;
      let base = 82;
      if (t >= 7.5 && t <= 9) base = 85 + 40 * Math.exp(-0.5 * Math.pow(t - 8, 2));
      else if (t >= 12 && t <= 14) base = 85 + 50 * Math.exp(-0.5 * Math.pow(t - 12.8, 2));
      else if (t >= 18.5 && t <= 21) base = 85 + 35 * Math.exp(-0.5 * Math.pow(t - 19.2, 2));
      data.push({
        time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
        glucose: Math.round(base + (Math.random() - 0.5) * 6),
      });
    }
  }
  return data;
};

const chartConfig: ChartConfig = {
  glucose: { label: 'Glucose mg/dL', color: 'hsl(270 40% 45%)' },
};

const giColors: Record<string, string> = {
  Low: 'bg-[hsl(var(--intel-sleep))]/15 text-[hsl(var(--intel-sleep))]',
  Medium: 'bg-[hsl(var(--intel-glucose))]/15 text-[hsl(var(--intel-glucose))]',
  High: 'bg-[hsl(var(--intel-stress))]/15 text-[hsl(var(--intel-stress))]',
};

const NutrientBar = ({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-baseline">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-xs font-heading font-bold">{value}<span className="text-[9px] text-muted-foreground ml-0.5">{unit}</span></span>
    </div>
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
  </div>
);

const MealLogCard = ({ entry, onRemove }: { entry: MealLogEntry; onRemove: (id: string) => void }) => {
  const { t } = useTranslation();
  const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className="p-3 rounded-xl border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-heading font-semibold">{entry.foodName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${giColors[entry.glycemicIndex] || ''}`}>
            {t('glucose_detail.gi')}: {entry.glycemicIndex}
          </span>
          <button onClick={() => onRemove(entry.id)} className="p-1 hover:bg-muted rounded-md transition-colors">
            <Trash2 className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      </div>
      
      {entry.nutrients && (
        <div className="grid grid-cols-6 gap-1.5">
          {[
            { l: t('glucose_detail.cal'), v: entry.nutrients.calories, u: '' },
            { l: t('glucose_detail.prot'), v: entry.nutrients.protein, u: 'g' },
            { l: t('glucose_detail.carbs'), v: entry.nutrients.carbs, u: 'g' },
            { l: t('glucose_detail.fat'), v: entry.nutrients.fat, u: 'g' },
            { l: t('glucose_detail.fiber'), v: entry.nutrients.fiber, u: 'g' },
            { l: t('glucose_detail.sugar'), v: entry.nutrients.sugar, u: 'g' },
          ].map((n) => (
            <div key={n.l} className="text-center p-1 rounded-md bg-muted/40">
              <p className="text-[11px] font-heading font-bold">{n.v}<span className="text-[8px] text-muted-foreground">{n.u}</span></p>
              <p className="text-[8px] text-muted-foreground uppercase">{n.l}</p>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-[10px] text-muted-foreground">{time} · {entry.skinImpact?.slice(0, 80)}...</p>
    </div>
  );
};

const GlucoseDetail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const data = useMemo(generateFullDayGlucose, []);
  const peakValue = Math.max(...data.map((d) => d.glucose));
  const { entries, todayEntries, todayNutrients, removeEntry } = useMealLog();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/intelligence')} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-heading font-semibold tracking-tight">{t('glucose_detail.title')}</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t('glucose_detail.subtitle')}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading">{t('glucose_detail.curve')}</CardTitle>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('glucose_detail.24h')}</span>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="glucoseDetailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(270 40% 45%)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(270 40% 45%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={15} />
                <YAxis domain={[60, 150]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <ReferenceLine y={120} stroke="hsl(35 50% 60%)" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: t('glucose_detail.glycation_zone'), fontSize: 9, fill: 'hsl(35 50% 60%)' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="glucose" stroke="hsl(270 40% 45%)" strokeWidth={1.5} fill="url(#glucoseDetailGrad)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: t('glucose_detail.peak'), value: `${peakValue} mg/dL`, icon: Zap, color: '--intel-glucose' },
            { label: t('glucose_detail.spikes'), value: t('glucose_detail.spikes_today'), icon: AlertTriangle, color: '--intel-stress' },
            { label: t('glucose_detail.avg'), value: '92 mg/dL', icon: TrendingDown, color: '--intel-sleep' },
          ].map((m) => (
            <Card key={m.label} className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
              <CardContent className="p-3 flex flex-col items-center gap-1.5">
                <m.icon className={`h-4 w-4 text-[hsl(var(${m.color}))]`} />
                <span className="text-base font-heading font-bold">{m.value}</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{m.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-heading">{t('glucose_detail.today_nutrition')}</CardTitle>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('glucose_detail.meals_logged', { count: todayEntries.length })}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayEntries.length > 0 ? (
              <>
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <p className="text-3xl font-heading font-bold">{todayNutrients.calories}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t('glucose_detail.total_calories')}</p>
                </div>
                <div className="space-y-2.5">
                  <NutrientBar label={t('glucose_detail.protein')} value={todayNutrients.protein} max={120} unit="g" color="bg-[hsl(var(--intel-sleep))]" />
                  <NutrientBar label={t('glucose_detail.carbs')} value={todayNutrients.carbs} max={250} unit="g" color="bg-[hsl(var(--intel-glucose))]" />
                  <NutrientBar label={t('glucose_detail.fat')} value={todayNutrients.fat} max={80} unit="g" color="bg-[hsl(var(--intel-stress))]" />
                  <NutrientBar label={t('glucose_detail.fiber')} value={todayNutrients.fiber} max={30} unit="g" color="bg-accent" />
                  <NutrientBar label={t('glucose_detail.sugar')} value={todayNutrients.sugar} max={50} unit="g" color="bg-destructive/60" />
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-2">
                <Utensils className="h-8 w-8 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground">{t('glucose_detail.no_meals')}</p>
                <p className="text-[10px] text-muted-foreground">{t('glucose_detail.no_meals_hint')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {entries.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-heading font-semibold uppercase tracking-widest text-muted-foreground px-1">{t('glucose_detail.food_log')}</h2>
            {entries.map((entry) => (
              <MealLogCard key={entry.id} entry={entry} onRemove={removeEntry} />
            ))}
          </div>
        )}

        <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading text-[hsl(var(--intel-glucose))]">{t('glucose_detail.bio_impact')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed">
              {t('glucose_detail.bio_body_1')}<span className="font-medium">{peakValue} mg/dL</span>{t('glucose_detail.bio_body_2')}
            </p>
            <div className="p-3 rounded-lg bg-[hsl(var(--intel-glucose-light))] border border-[hsl(var(--intel-glucose))]/15">
              <p className="text-xs text-muted-foreground italic">{t('glucose_detail.bio_hint')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">{t('glucose_detail.skin_action')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs leading-relaxed">
                {t('glucose_detail.action_body')}
                <span className="block mt-2 text-muted-foreground italic">
                  {t('glucose_detail.action_italic')}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() => navigate('/meal-scanner')}
          className="w-full bg-[hsl(var(--intel-glucose))] hover:bg-[hsl(var(--intel-glucose))]/90 text-white"
        >
          <Camera className="h-4 w-4 mr-2" />
          {t('glucose_detail.scan_meal')}
        </Button>
      </main>
    </div>
  );
};

export default GlucoseDetail;
