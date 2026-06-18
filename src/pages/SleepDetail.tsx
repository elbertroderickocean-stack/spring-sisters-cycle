import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Moon, Brain, Wind } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

const chartConfig: ChartConfig = {
  hours: { label: 'Hours', color: 'hsl(210 45% 55%)' },
};

const SleepDetail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sleepStages = [
    { stage: t('sleep_detail.stage_awake'), hours: 0.5, fill: 'hsl(0 0% 60%)' },
    { stage: t('sleep_detail.stage_light'), hours: 3.2, fill: 'hsl(210 30% 70%)' },
    { stage: t('sleep_detail.stage_deep'), hours: 1.8, fill: 'hsl(210 45% 45%)' },
    { stage: t('sleep_detail.stage_rem'), hours: 1.5, fill: 'hsl(270 40% 50%)' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/intelligence')} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-heading font-semibold tracking-tight">{t('sleep_detail.title')}</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t('sleep_detail.subtitle')}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">{t('sleep_detail.architecture')}</CardTitle>
            <p className="text-xs text-muted-foreground">{t('sleep_detail.last_night')}</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={sleepStages} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis type="number" domain={[0, 4]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={50} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="hours" radius={[0, 6, 6, 0]} barSize={20}>
                  {sleepStages.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: t('sleep_detail.deep_sleep'), value: '1.8h', icon: Moon, color: '--intel-sleep' },
            { label: t('sleep_detail.rem'), value: '1.5h', icon: Brain, color: '--intel-glucose' },
            { label: t('sleep_detail.resp_rate'), value: '14 bpm', icon: Wind, color: '--intel-stress' },
          ].map((m) => (
            <Card key={m.label} className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
              <CardContent className="p-3 flex flex-col items-center gap-1.5">
                <m.icon className={`h-4 w-4 text-[hsl(var(${m.color}))]`} />
                <span className="text-lg font-heading font-bold">{m.value}</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{m.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading text-[hsl(var(--intel-sleep))]">{t('sleep_detail.bio_impact')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed">
              {t('sleep_detail.bio_body_1')}<span className="font-medium">1.8h</span>{t('sleep_detail.bio_body_2')}<span className="font-medium">1.5h</span>{t('sleep_detail.bio_body_3')}
            </p>
            <div className="p-3 rounded-lg bg-[hsl(var(--intel-sleep-light))] border border-[hsl(var(--intel-sleep))]/15">
              <p className="text-xs text-muted-foreground italic">{t('sleep_detail.bio_hint')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">{t('sleep_detail.skin_action')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs leading-relaxed">
                {t('sleep_detail.action_body')}
                <span className="block mt-2 text-muted-foreground italic">
                  {t('sleep_detail.action_italic')}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SleepDetail;
