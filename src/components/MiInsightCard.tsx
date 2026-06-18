import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export const MiInsightCard: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [insight, setInsight] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const insights = t('mi_insight.insights', { returnObjects: true }) as string[];
    const today = new Date();
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % insights.length;
    setInsight(insights[dayIndex]);

    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, [i18n.language, t]);

  return (
    <button
      onClick={() => navigate('/mi-chat')}
      className={cn(
        "w-full text-left glass-card p-4 rounded-2xl transition-all duration-500 group hover:scale-[1.01]",
        "border border-[hsl(var(--intel-glucose))]/20",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[hsl(var(--intel-glucose))]/10 flex items-center justify-center shrink-0 mt-0.5">
          <Cpu className="h-4 w-4 text-[hsl(var(--intel-glucose))]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold tracking-wider uppercase text-[hsl(var(--intel-glucose))]">m.i.</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{t('mi_insight.daily_briefing')}</span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">
            {insight}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground group-hover:text-[hsl(var(--intel-glucose))] transition-colors">
            <span>{t('mi_insight.continue_in_chat')}</span>
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </button>
  );
};
