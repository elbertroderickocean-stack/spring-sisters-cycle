import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Pill } from 'lucide-react';
import OnboardingBackButton from '@/components/OnboardingBackButton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';

const Personalize = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserData } = useUser();
  const { t } = useTranslation();
  const strategy = (location.state as any)?.strategy as 'hormonal' | 'longevity' | 'pregnancy' | undefined;

  const [lastPeriodDate, setLastPeriodDate] = useState<Date>();
  const [cycleLength, setCycleLength] = useState<string>('28');
  const [cgmChoice, setCgmChoice] = useState<'apple-health' | 'manual' | null>(null);
  const [takesHormones, setTakesHormones] = useState<boolean | null>(null);
  const [hormoneName, setHormoneName] = useState('');

  const isHormonal = strategy === 'hormonal';
  const isPregnancy = strategy === 'pregnancy';

  const handleNext = () => {
    const medicationData = {
      takesHormonalMedication: takesHormones === true,
      hormonalMedicationName: takesHormones ? hormoneName.trim() : '',
    };

    if (isPregnancy && cgmChoice && takesHormones !== null) {
      updateUserData(medicationData);
      navigate('/inventory');
    } else if (isHormonal && lastPeriodDate && cycleLength && cgmChoice && takesHormones !== null) {
      updateUserData({
        lastPeriodDate,
        cycleLength: parseInt(cycleLength),
        wiseBloomMode: false,
        ...medicationData,
      });
      navigate('/inventory');
    } else if (!isHormonal && !isPregnancy && cgmChoice && takesHormones !== null) {
      updateUserData(medicationData);
      navigate('/wise-bloom', { state: { selectedRhythm: 'cellular' } });
    }
  };

  const canProceed = cgmChoice && takesHormones !== null && (takesHormones === false || hormoneName.trim().length > 0) && (isHormonal ? (lastPeriodDate && cycleLength) : true);

  const eyebrow = isPregnancy ? t('personalize.eyebrow_pregnancy') : isHormonal ? t('personalize.eyebrow_hormonal') : t('personalize.eyebrow_longevity');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={6} />
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground font-body">{eyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground">
            {t('personalize.title')}
          </h2>
        </div>

        <div className="space-y-6 pt-4">
          <div className="space-y-3">
            <Label className="text-base font-medium text-foreground">{t('personalize.cgm_q')}</Label>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => setCgmChoice('apple-health')}
                className={cn('p-4 rounded-xl border-2 text-left transition-all',
                  cgmChoice === 'apple-health' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40')}>
                <p className="font-medium text-foreground">{t('personalize.cgm_yes')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('personalize.cgm_yes_desc')}</p>
              </button>
              <button onClick={() => setCgmChoice('manual')}
                className={cn('p-4 rounded-xl border-2 text-left transition-all',
                  cgmChoice === 'manual' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40')}>
                <p className="font-medium text-foreground">{t('personalize.cgm_manual')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('personalize.cgm_manual_desc')}</p>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium text-foreground flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary" />
              {t('personalize.horm_q')}
            </Label>
            <p className="text-xs text-muted-foreground -mt-1">{t('personalize.horm_hint')}</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setTakesHormones(true)}
                className={cn('p-4 rounded-xl border-2 text-left transition-all',
                  takesHormones === true ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40')}>
                <p className="font-medium text-foreground">{t('personalize.yes')}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t('personalize.yes_desc')}</p>
              </button>
              <button onClick={() => { setTakesHormones(false); setHormoneName(''); }}
                className={cn('p-4 rounded-xl border-2 text-left transition-all',
                  takesHormones === false ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40')}>
                <p className="font-medium text-foreground">{t('personalize.no')}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t('personalize.no_desc')}</p>
              </button>
            </div>

            {takesHormones && (
              <div className="animate-fade-in space-y-2 pt-2">
                <Label htmlFor="hormone-name" className="text-sm text-foreground">{t('personalize.med_name')}</Label>
                <Input id="hormone-name" type="text" placeholder={t('personalize.med_placeholder')} value={hormoneName} onChange={(e) => setHormoneName(e.target.value)} className="h-12 text-base" maxLength={100} />
                <p className="text-[10px] text-muted-foreground">{t('personalize.med_note')}</p>
              </div>
            )}
          </div>

          {isHormonal && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-3">
                <Label htmlFor="period-date" className="text-base">{t('personalize.period_label')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-full justify-start text-left font-normal h-12', !lastPeriodDate && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {lastPeriodDate ? format(lastPeriodDate, 'PPP') : <span>{t('personalize.pick_date')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto bg-popover z-50" align="start">
                    <Calendar mode="single" selected={lastPeriodDate} onSelect={setLastPeriodDate} initialFocus className="pointer-events-auto" disabled={(date) => date > new Date()} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <Label htmlFor="cycle-length" className="text-base">{t('personalize.cycle_len')}</Label>
                <Input id="cycle-length" type="number" min="21" max="40" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} className="h-12 text-base" />
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center pt-2">{t('personalize.privacy')}</p>

          <Button size="lg" onClick={handleNext} disabled={!canProceed} className="w-full mt-4 h-12 text-base rounded-lg">
            {t('common.next')}
          </Button>
          <OnboardingBackButton to="/connect-environment" />
        </div>
      </div>
    </div>
  );
};

export default Personalize;
