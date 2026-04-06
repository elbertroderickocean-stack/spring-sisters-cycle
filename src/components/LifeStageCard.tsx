import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useUser, LifeStage } from '@/contexts/UserContext';
import { Heart, Sparkles, Baby, Flower2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const SAGE = '#B2C2B2';

const stages: Array<{
  value: LifeStage;
  label: string;
  desc: string;
  icon: React.ReactNode;
}> = [
  {
    value: 'cycle',
    label: 'Hormonal Rhythm',
    desc: 'Regular cycle — 28-day adaptive intelligence',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    value: 'pregnancy',
    label: 'Pregnancy Mode',
    desc: 'Trimester-based protocols with safety filters',
    icon: <Baby className="h-5 w-5" />,
  },
  {
    value: 'postpartum',
    label: 'Postpartum Recovery',
    desc: 'Hormonal recovery and barrier rebuilding',
    icon: <Heart className="h-5 w-5" />,
  },
  {
    value: 'menopause',
    label: 'Longevity Management',
    desc: '7-day cellular training pulse',
    icon: <Flower2 className="h-5 w-5" />,
  },
];

export const LifeStageCard: React.FC = () => {
  const { userData, updateUserData } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<LifeStage>(userData.lifeStage);
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(userData.trimester || 1);

  const currentStage = stages.find(s => s.value === userData.lifeStage);

  const handleConfirm = () => {
    const updates: Partial<typeof userData> = {
      lifeStage: selectedStage,
      pregnancyMode: selectedStage === 'pregnancy',
      wiseBloomMode: selectedStage === 'menopause',
    };

    if (selectedStage === 'pregnancy') {
      updates.trimester = selectedTrimester;
    } else {
      updates.trimester = null;
      updates.dueDate = null;
    }

    updateUserData(updates);
    setShowModal(false);
  };

  return (
    <>
      <Card className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${SAGE}20` }}>
                <div style={{ color: SAGE }}>{currentStage?.icon}</div>
              </div>
              <div>
                <CardTitle className="font-heading text-lg">Life Stage</CardTitle>
                <p className="text-sm text-muted-foreground">{currentStage?.label}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
              Change
            </Button>
          </div>
        </CardHeader>
        {userData.pregnancyMode && userData.trimester && (
          <CardContent className="pt-0">
            <Badge variant="outline" className="text-xs gap-1">
              <Baby className="h-3 w-3" /> Trimester {userData.trimester}
            </Badge>
          </CardContent>
        )}
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Update Life Stage</DialogTitle>
            <DialogDescription className="text-sm">
              Life changes. Your routine adapts. Select your current stage and m.i. will recalibrate everything.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            {stages.map((stage) => (
              <button
                key={stage.value}
                onClick={() => setSelectedStage(stage.value)}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                  selectedStage === stage.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                )}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: selectedStage === stage.value ? `${SAGE}30` : 'hsl(var(--muted))',
                    color: selectedStage === stage.value ? SAGE : 'hsl(var(--muted-foreground))',
                  }}
                >
                  {stage.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{stage.label}</p>
                  <p className="text-xs text-muted-foreground">{stage.desc}</p>
                </div>
              </button>
            ))}

            {/* Trimester selector when pregnancy is chosen */}
            {selectedStage === 'pregnancy' && (
              <div className="pt-2 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Trimester</p>
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTrimester(t)}
                      className={cn(
                        'flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-all',
                        selectedTrimester === t
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border text-muted-foreground hover:border-primary/30'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleConfirm} className="w-full rounded-lg mt-2">
              Confirm Change
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
