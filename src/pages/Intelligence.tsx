import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { HeaderBar } from '@/components/HeaderBar';
import { useUser } from '@/contexts/UserContext';
import { Cpu, Camera, ScanLine, TrendingUp, ChevronRight, Moon, Activity } from 'lucide-react';
import { GlucoseWidget } from '@/components/intelligence/GlucoseWidget';
import { SleepWidget } from '@/components/intelligence/SleepWidget';
import { StressWidget } from '@/components/intelligence/StressWidget';
import { CausalityCard } from '@/components/intelligence/CausalityCard';
import { SkinAuditWidget } from '@/components/intelligence/SkinAuditWidget';

const Intelligence = () => {
  const navigate = useNavigate();
  const { userData } = useUser();

  return (
    <div className="min-h-screen bg-background pb-24">
      <HeaderBar>
        <div className="flex items-center gap-3">
          <Cpu className="h-5 w-5 text-[hsl(var(--intel-glucose))]" />
          <div>
            <h1 className="text-xl font-heading font-semibold tracking-tight">meanwhile.intelligence</h1>
            <p className="text-xs text-muted-foreground tracking-wide uppercase">Strategic Skin Analytics</p>
          </div>
        </div>
      </HeaderBar>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Glucose Hero Widget — clickable */}
        <div className="cursor-pointer" onClick={() => navigate('/intelligence/glucose')}>
          <GlucoseWidget />
          <div className="flex items-center justify-end gap-1 mt-1 pr-1">
            <span className="text-[10px] text-muted-foreground">View details</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>

        {/* Sleep & Stress Row — clickable */}
        <div className="grid grid-cols-2 gap-4">
          <div className="cursor-pointer" onClick={() => navigate('/intelligence/sleep')}>
            <SleepWidget />
            <div className="flex items-center justify-end gap-1 mt-1 pr-1">
              <span className="text-[10px] text-muted-foreground">Details</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
          <div className="cursor-pointer" onClick={() => navigate('/intelligence/stress')}>
            <StressWidget />
            <div className="flex items-center justify-end gap-1 mt-1 pr-1">
              <span className="text-[10px] text-muted-foreground">Details</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Scanner Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-14 border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg hover:shadow-md"
            onClick={() => navigate('/meal-scanner')}
          >
            <ScanLine className="h-4 w-4 mr-2 text-[hsl(var(--intel-glucose))]" />
            <span className="text-xs">Scan Meal</span>
          </Button>
          <Button
            variant="outline"
            className="h-14 border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg hover:shadow-md"
            onClick={() => navigate('/skin-scanner')}
          >
            <Camera className="h-4 w-4 mr-2 text-[hsl(var(--intel-sleep))]" />
            <span className="text-xs">Scan Skin</span>
          </Button>
        </div>

        {/* Causality Section */}
        <CausalityCard />

        {/* CTA to m.i. chat */}
        <Card 
          className="border border-[hsl(var(--intel-glass-border))] bg-[hsl(var(--intel-glass))] backdrop-blur-lg cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/mi-chat')}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[hsl(var(--intel-glucose))]/10 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-[hsl(var(--intel-glucose))]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Ask m.i.</p>
              <p className="text-xs text-muted-foreground">Your strategic partner in skin longevity</p>
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
