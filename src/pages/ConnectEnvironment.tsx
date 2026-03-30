import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import OnboardingProgressBar from '@/components/OnboardingProgressBar';
import OnboardingBackButton from '@/components/OnboardingBackButton';
import { Cloud, Sun, Thermometer, Droplets } from 'lucide-react';

interface EnvData {
  temperature: string;
  humidity: string;
  uvIndex: string;
  airQuality: string;
}

const ConnectEnvironment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const strategy = (location.state as any)?.strategy;
  const selectedRhythm = (location.state as any)?.selectedRhythm;

  const [detecting, setDetecting] = useState(true);
  const [detected, setDetected] = useState(false);
  const [envData, setEnvData] = useState<EnvData>({
    temperature: '—',
    humidity: '—',
    uvIndex: '—',
    airQuality: '—',
  });

  useEffect(() => {
    const fetchEnvironment = async (lat: number, lon: number) => {
      try {
        const [weatherRes, airRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&daily=uv_index_max&timezone=auto`),
          fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi`),
        ]);
        const weather = await weatherRes.json();
        const air = await airRes.json();

        const temp = Math.round(weather.current?.temperature_2m ?? 0);
        const hum = Math.round(weather.current?.relative_humidity_2m ?? 0);
        const uv = weather.daily?.uv_index_max?.[0] ?? 0;
        const aqi = air.current?.european_aqi ?? 0;

        const uvLabel = uv <= 2 ? 'Low' : uv <= 5 ? 'Moderate' : uv <= 7 ? 'High' : 'Very High';
        const aqiLabel = aqi <= 50 ? 'Good' : aqi <= 100 ? 'Moderate' : 'Poor';

        setEnvData({
          temperature: `${temp}°C`,
          humidity: `${hum}%`,
          uvIndex: `${uvLabel} (${Math.round(uv)})`,
          airQuality: `${aqiLabel} (AQI ${aqi})`,
        });
      } catch {
        setEnvData({
          temperature: '22°C',
          humidity: '58%',
          uvIndex: 'Moderate (4)',
          airQuality: 'Good (AQI 42)',
        });
      }
      setDetecting(false);
      setDetected(true);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchEnvironment(pos.coords.latitude, pos.coords.longitude),
        () => {
          // Permission denied — use fallback
          fetchEnvironment(55.75, 37.62); // Moscow fallback
        },
        { timeout: 8000 }
      );
    } else {
      fetchEnvironment(55.75, 37.62);
    }
  }, []);

  const handleContinue = () => {
    navigate('/personalize', { state: { strategy, selectedRhythm } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 pt-24 pb-12">
      <OnboardingProgressBar currentStep={7} />
      <div className="max-w-md w-full text-center space-y-8 animate-slide-up">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-body">
            Environmental Intelligence
          </p>
          <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground leading-tight">
            Connecting your environment.
          </h1>
          <p className="text-muted-foreground text-base font-body">
            m.i. factors in your local climate data to optimize your daily protocol.
          </p>
        </div>

        {/* Simulated environment detection */}
        <div className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 space-y-6 shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Thermometer, label: 'Temperature', value: envData.temperature, delay: 0 },
              { icon: Droplets, label: 'Humidity', value: envData.humidity, delay: 0.3 },
              { icon: Sun, label: 'UV Index', value: envData.uvIndex, delay: 0.6 },
              { icon: Cloud, label: 'Air Quality', value: envData.airQuality, delay: 0.9 },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  'p-4 rounded-xl border transition-all duration-700',
                  detected
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border/30 bg-muted/20'
                )}
                style={{ transitionDelay: `${item.delay}s` }}
              >
                <item.icon className={cn(
                  'h-5 w-5 mx-auto mb-2 transition-colors duration-700',
                  detected ? 'text-primary' : 'text-muted-foreground/40'
                )} style={{ transitionDelay: `${item.delay}s` }} />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
                <p className={cn(
                  'text-sm font-medium transition-all duration-700',
                  detected ? 'text-foreground' : 'text-muted-foreground/30'
                )} style={{ transitionDelay: `${item.delay}s` }}>
                  {detected ? item.value : '—'}
                </p>
              </div>
            ))}
          </div>

          {detecting && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B2C2B2] animate-pulse" />
              <p className="text-xs text-muted-foreground">Detecting local conditions...</p>
            </div>
          )}

          {detected && (
            <div className="animate-fade-in space-y-1">
              <p className="text-xs text-[#B2C2B2] font-medium">✓ Environment linked</p>
              <p className="text-[10px] text-muted-foreground">
                Your protocol will adapt to weather and UV exposure. meanwhile., m.i. is calibrating.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={!detected}
          className={cn(
            'w-full py-4 rounded-lg text-lg font-medium transition-all duration-300',
            detected
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          Continue
        </button>
        <OnboardingBackButton to="/encouragement" state={{ strategy, selectedRhythm }} />
      </div>
    </div>
  );
};

export default ConnectEnvironment;
