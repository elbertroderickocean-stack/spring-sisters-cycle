import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { HeaderBar } from '@/components/HeaderBar';
import { Cpu, Camera, ScanLine, TrendingUp, ChevronRight, Search } from 'lucide-react';
import { GlucoseWidget } from '@/components/intelligence/GlucoseWidget';
import { SleepWidget } from '@/components/intelligence/SleepWidget';
import { StressWidget } from '@/components/intelligence/StressWidget';
import { CausalityCard } from '@/components/intelligence/CausalityCard';
import { SkinAuditWidget } from '@/components/intelligence/SkinAuditWidget';

const Intelligence = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen mesh-gradient-bg pb-24">
      <HeaderBar>
        <div className="flex items-center gap-3">
          <Cpu className="h-5 w-5 text-[hsl(var(--intel-glucose))]" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">{t('intelligence.title')}</h1>
            <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase">{t('intelligence.subtitle')}</p>
          </div>
        </div>
      </HeaderBar>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <SkinAuditWidget />

        <div className="cursor-pointer" onClick={() => navigate('/intelligence/glucose')}>
          <GlucoseWidget />
          <div className="flex items-center justify-end gap-1 mt-1 pr-1">
            <span className="text-[10px] text-muted-foreground font-body">{t('intelligence.view_details')}</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="cursor-pointer" onClick={() => navigate('/intelligence/sleep')}>
            <SleepWidget />
            <div className="flex items-center justify-end gap-1 mt-1 pr-1">
              <span className="text-[10px] text-muted-foreground font-body">{t('intelligence.details')}</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
          <div className="cursor-pointer" onClick={() => navigate('/intelligence/stress')}>
            <StressWidget />
            <div className="flex items-center justify-end gap-1 mt-1 pr-1">
              <span className="text-[10px] text-muted-foreground font-body">{t('intelligence.details')}</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="h-14" onClick={() => navigate('/meal-scanner')}>
            <ScanLine className="h-4 w-4 mr-1.5 text-[hsl(var(--intel-glucose))]" />
            <span className="text-xs font-body">{t('intelligence.meal')}</span>
          </Button>
          <Button variant="outline" className="h-14" onClick={() => navigate('/skin-scanner')}>
            <Camera className="h-4 w-4 mr-1.5 text-[hsl(var(--intel-sleep))]" />
            <span className="text-xs font-body">{t('intelligence.skin')}</span>
          </Button>
          <Button variant="outline" className="h-14" onClick={() => navigate('/scanner')}>
            <Search className="h-4 w-4 mr-1.5 text-[hsl(var(--intel-stress))]" />
            <span className="text-xs font-body">{t('intelligence.analyze')}</span>
          </Button>
        </div>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/scanner')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[hsl(var(--intel-stress-light))] flex items-center justify-center">
              <Search className="h-5 w-5 text-[hsl(var(--intel-stress))]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-heading font-medium">{t('intelligence.external_title')}</p>
              <p className="text-xs text-muted-foreground font-body">
                {t('intelligence.external_body_prefix')}
                <strong className="text-foreground">{t('intelligence.external_body_brand')}</strong>
                {t('intelligence.external_body_suffix')}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <CausalityCard />

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/mi-chat')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[hsl(var(--intel-glucose-light))] flex items-center justify-center">
              <Cpu className="h-5 w-5 text-[hsl(var(--intel-glucose))]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-heading font-medium">{t('intelligence.ask_mi')}</p>
              <p className="text-xs text-muted-foreground font-body">{t('intelligence.ask_mi_desc')}</p>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Intelligence;
