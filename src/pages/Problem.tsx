import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Activity, Droplets, Moon, Cloud, Brain } from 'lucide-react';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';

const Problem = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showSystemModal, setShowSystemModal] = useState(false);

  const systemInputs = [
    { icon: Activity, label: t('problem.inputs.hormones'), description: t('problem.inputs.hormones_desc'), color: 'hsl(var(--phase-calm))' },
    { icon: Droplets, label: t('problem.inputs.glucose'), description: t('problem.inputs.glucose_desc'), color: 'hsl(var(--phase-glow))' },
    { icon: Moon, label: t('problem.inputs.sleep'), description: t('problem.inputs.sleep_desc'), color: 'hsl(var(--phase-balance))' },
    { icon: Cloud, label: t('problem.inputs.weather'), description: t('problem.inputs.weather_desc'), color: 'hsl(var(--phase-calm))' },
    { icon: Brain, label: t('problem.inputs.stress'), description: t('problem.inputs.stress_desc'), color: 'hsl(var(--phase-glow))' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <OnboardingProgressBar currentStep={2} />
      <div className="max-w-3xl text-center space-y-10 animate-slide-up">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-heading font-semibold text-foreground leading-tight">
            {t('problem.headline_1')}<br />{t('problem.headline_2')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            <Trans i18nKey="problem.body" components={{ strong: <strong className="text-foreground" /> }} />
          </p>
        </div>

        <div className="w-12 h-px bg-foreground/15 mx-auto" />

        <div className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-heading font-medium text-foreground">
            {t('problem.philosophy_title')}
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t('problem.philosophy_body')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          <Button variant="outline" size="lg" onClick={() => setShowSystemModal(true)} className="px-8 py-5 text-base rounded-lg border-primary/30 hover:bg-primary/5">
            {t('problem.how_btn')}
          </Button>
          <Button size="lg" onClick={() => navigate('/solution')} className="px-8 py-6 text-lg rounded-lg">
            {t('problem.choose_btn')}
          </Button>
        </div>
      </div>

      <Dialog open={showSystemModal} onOpenChange={setShowSystemModal}>
        <DialogContent className="max-w-lg mx-auto bg-background p-0 overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body">{t('problem.modal_eyebrow')}</p>
              <h3 className="text-2xl font-heading font-semibold text-foreground">
                {t('problem.modal_title')}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {systemInputs.map((input) => (
                <div key={input.label} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: input.color }}>
                    <input.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground text-sm">{input.label}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{input.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground italic">
              {t('problem.modal_outro')}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Problem;
