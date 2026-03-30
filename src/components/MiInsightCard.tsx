import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAILY_INSIGHTS = [
  "Ambient humidity below 40% detected in most indoor environments today. Ceramide deployment recommended to prevent transepidermal water loss.",
  "UV index elevated. Your Vitamin C Concentrate will provide 8-hour photoprotection when applied before sun exposure.",
  "Cortisol levels typically peak mid-week. Evening recovery protocol with Overnight Mask will counteract stress-induced barrier degradation.",
  "Your skin's circadian rhythm favors collagen synthesis between 11 PM–2 AM. Ensure recovery assets are deployed before sleep.",
  "Post-meal glucose spikes accelerate glycation. Consider pairing high-GI foods with fiber to protect collagen capital.",
  "Seasonal transition detected. Barrier reinforcement with Ceramide Concentrate prevents moisture depreciation during climate shifts.",
  "Hydration intake directly correlates with skin elasticity metrics. Target 2L minimum to maintain optimal turgor pressure.",
  "Blue light exposure from screens triggers oxidative stress. Antioxidant deployment via Vitamin C provides digital defense.",
  "Sleep quality impacts cellular turnover rate by up to 30%. Prioritize 7+ hours for maximum overnight recovery ROI.",
  "Wind and temperature fluctuations stress the lipid barrier. Double-layering moisturizer on exposed areas is a strategic hedge.",
  "Weekend recovery protocols show 23% higher efficacy when combined with reduced screen time and adequate hydration.",
  "Your skin barrier repairs most efficiently in low-stress states. Evening breathwork before skincare enhances product absorption.",
  "Omega-3 intake supports ceramide production from within. Consider adding fatty fish or supplements to your nutritional portfolio.",
  "Morning skin is typically more receptive to active ingredients. Deploy serums within 60 seconds of cleansing for maximum uptake.",
];

export const MiInsightCard: React.FC = () => {
  const navigate = useNavigate();
  const [insight, setInsight] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Pick a daily insight based on the date (consistent per day)
    const today = new Date();
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % DAILY_INSIGHTS.length;
    setInsight(DAILY_INSIGHTS[dayIndex]);
    
    // Animate in after a delay
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

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
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Daily Briefing</span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">
            {insight}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground group-hover:text-[hsl(var(--intel-glucose))] transition-colors">
            <span>Continue in chat</span>
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </button>
  );
};
