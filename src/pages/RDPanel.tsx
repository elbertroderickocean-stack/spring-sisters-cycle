import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

const RDPanel = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getCurrentPhase } = useUser();
  const phase = getCurrentPhase();
  const [selectedOption, setSelectedOption] = useState('');

  const getPhaseIconColor = () => {
    if (phase === 'calm') return 'hsl(200 50% 60%)';
    if (phase === 'glow') return 'hsl(30 90% 60%)';
    return 'hsl(120 40% 50%)';
  };
  const phaseIconColor = getPhaseIconColor();

  const options = [t('rd_panel.opt_sunscreen'), t('rd_panel.opt_balm'), t('rd_panel.opt_gel')];

  const handleVote = () => {
    if (!selectedOption) { toast.error(t('rd_panel.select_err')); return; }
    toast.success(t('rd_panel.cast_success'));
    setTimeout(() => navigate('/sisterhood'), 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/sisterhood')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-heading font-semibold">{t('rd_panel.title')}</h1>
        </div>

        <Card className="border border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" style={{ color: phaseIconColor }} />
              <CardTitle className="font-heading text-lg">{t('rd_panel.poll')}</CardTitle>
            </div>
            <CardDescription className="text-sm mt-3">{t('rd_panel.poll_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 rounded-[12px] border border-border hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setSelectedOption(option)}>
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm font-medium">{option}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            <Button onClick={handleVote} className="w-full rounded-full" style={{ backgroundColor: phaseIconColor }}>
              {t('rd_panel.cast')}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-accent/50 border-none">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">{t('rd_panel.footnote')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RDPanel;
