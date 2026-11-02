import { useEffect, useState } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Moon, Droplet, Activity, ScanFace } from "lucide-react";
import { Phone, TodayScreen, ChatScreen, ShelfScreen } from "./PhoneMockup";

const Head = ({ icon: I, t, tag }: { icon: typeof Moon; t: string; tag: string }) => (
  <div className="flex items-center justify-between">
    <span className="flex items-center gap-1.5 text-[11px] font-semibold"><I size={12} />{t}</span>
    <span className="rounded-full bg-primary px-2 py-0.5 text-[8px] font-semibold text-primary-foreground">{tag}</span>
  </div>
);

function GlucoseScreen() {
  const pts = [40, 38, 42, 70, 82, 60, 45, 42, 48, 66, 58, 44, 40];
  const d = pts.map((v, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * 220},${100 - v}`).join(" ");
  return (
    <div className="flex h-full flex-col gap-3 px-4 pt-12">
      <Head icon={Droplet} t="Glucose" tag="Stable" />
      <p className="text-[34px] font-semibold leading-none tracking-tight">94<span className="ml-1 text-[11px] text-muted-foreground">mg/dL</span></p>
      <div className="rounded-2xl bg-card p-3">
        <svg viewBox="0 0 220 100" className="h-28 w-full">
          <rect x="0" y="40" width="220" height="30" className="fill-primary/40" />
          <motion.path d={d} fill="none" strokeWidth="2.5" className="stroke-foreground" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} />
        </svg>
        <div className="flex justify-between text-[8px] text-muted-foreground"><span>6am</span><span>12pm</span><span>6pm</span></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-card p-3"><p className="text-[18px] font-semibold">86%</p><p className="text-[8px] text-muted-foreground">Time in range</p></div>
        <div className="rounded-2xl bg-foreground p-3 text-background"><p className="text-[18px] font-semibold">Low</p><p className="text-[8px] opacity-60">Glycation risk</p></div>
      </div>
      <div className="rounded-2xl border border-dashed border-foreground/20 p-3 text-[9px] leading-snug">
        <b>m.i.</b> Lunch spiked at 2pm. Tonight: antioxidant serum, no extra actives.
      </div>
    </div>
  );
}

function SleepScreen() {
  const bars = [30, 55, 80, 60, 90, 70, 40, 65, 85, 50];
  return (
    <div className="flex h-full flex-col gap-3 px-4 pt-12">
      <Head icon={Moon} t="Recovery & Sleep" tag="Repair" />
      <p className="text-[34px] font-semibold leading-none tracking-tight">7h 24m</p>
      <p className="-mt-2 text-[9px] text-muted-foreground">Restorative hours · deep sleep 1h 48m</p>
      <div className="flex h-28 items-end gap-1.5 rounded-2xl bg-foreground p-3">
        {bars.map((h, i) => (
          <motion.span key={i} className={`flex-1 rounded-full ${i === 4 || i === 8 ? "bg-primary" : "bg-background/30"}`} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.08, duration: 0.8 }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-card p-3"><p className="text-[18px] font-semibold">82</p><p className="text-[8px] text-muted-foreground">Sleep quality</p></div>
        <div className="rounded-2xl bg-primary p-3 text-primary-foreground"><p className="text-[18px] font-semibold">+14%</p><p className="text-[8px]">Barrier repair</p></div>
      </div>
      <div className="rounded-2xl bg-card p-3 text-[9px] leading-snug"><b>m.i.</b> Great night. Your skin can handle retinol tonight.</div>
    </div>
  );
}

function StressScreen() {
  return (
    <div className="flex h-full flex-col items-center gap-3 px-4 pt-12">
      <div className="w-full"><Head icon={Activity} t="Stress Index" tag="Calm" /></div>
      <div className="relative mt-2 grid h-36 w-36 place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="42" strokeWidth="8" fill="none" className="stroke-secondary" />
          <motion.circle cx="50" cy="50" r="42" strokeWidth="8" fill="none" strokeLinecap="round" className="stroke-foreground" initial={{ pathLength: 0 }} animate={{ pathLength: 0.32 }} transition={{ duration: 1.6 }} />
        </svg>
        <div className="text-center"><p className="text-[30px] font-semibold leading-none">32</p><p className="text-[8px] text-muted-foreground">Cortisol load</p></div>
      </div>
      <div className="grid w-full grid-cols-3 gap-2 text-center">
        {[["HRV", "58ms"], ["Resting", "61bpm"], ["Breath", "14/m"]].map(([a, b]) => (
          <div key={a} className="rounded-2xl bg-card p-2"><p className="text-[12px] font-semibold">{b}</p><p className="text-[7px] text-muted-foreground">{a}</p></div>
        ))}
      </div>
      <div className="w-full rounded-2xl bg-primary p-3 text-[9px] leading-snug text-primary-foreground"><b>m.i.</b> Low stress today — a good day for actives.</div>
    </div>
  );
}

function ScanScreen() {
  return (
    <div className="flex h-full flex-col gap-3 px-4 pt-12">
      <Head icon={ScanFace} t="Skin Scan" tag="Day 19" />
      <div className="relative h-40 overflow-hidden rounded-2xl bg-foreground">
        <div className="absolute inset-6 rounded-[50%] border border-dashed border-primary/70" />
        {[...Array(18)].map((_, i) => (
          <span key={i} className="absolute h-1 w-1 rounded-full bg-primary" style={{ left: `${30 + ((i * 37) % 40)}%`, top: `${20 + ((i * 53) % 60)}%` }} />
        ))}
        <motion.div className="absolute inset-x-0 h-[2px] bg-primary shadow-[0_0_20px_hsl(var(--primary))]" animate={{ top: ["5%", "95%", "5%"] }} transition={{ duration: 3, repeat: Infinity }} />
      </div>
      {[["Hydration", 78], ["Redness", 22], ["Texture", 64], ["Radiance", 71]].map(([k, v]) => (
        <div key={k as string}>
          <div className="flex justify-between text-[9px]"><span>{k}</span><span className="text-muted-foreground">{v}</span></div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
            <motion.div className="h-full rounded-full bg-foreground" initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 1.2 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const screens = [
  { s: TodayScreen, t: "Today", d: "Your daily protocol, rebuilt every morning from your data." },
  { s: GlucoseScreen, t: "Glucose", d: "See how meals echo on your skin — and what to do about it." },
  { s: SleepScreen, t: "Sleep", d: "Recovery hours decide which actives your skin can take tonight." },
  { s: StressScreen, t: "Stress", d: "HRV and cortisol load, translated into a calmer routine." },
  { s: ScanScreen, t: "Skin scan", d: "A 30-second face scan tracks hydration, redness and texture." },
  { s: ChatScreen, t: "m.i. chat", d: "Ask anything. Your personal skin specialist answers in context." },
  { s: ShelfScreen, t: "Open Shelf", d: "Scan any product from any brand and see how it fits." },
];

export default function AppScreens() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = screens.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 3800);
    return () => clearInterval(id);
  }, [paused, i]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50) go(1);
    else if (info.offset.x > 50) go(-1);
  };

  return (
    <div className="mt-16" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <motion.div className="relative mx-auto h-[600px] max-w-5xl touch-pan-y [perspective:1400px]" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={onDragEnd}>
        {screens.map((sc, k) => {
          let off = k - i;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          const abs = Math.abs(off);
          const S = sc.s;
          return (
            <motion.div
              key={sc.t}
              className="absolute left-1/2 top-0 cursor-grab active:cursor-grabbing"
              animate={{
                x: `calc(-50% + ${off * 62}%)`,
                rotateY: off * -28,
                scale: 1 - abs * 0.14,
                z: -abs * 120,
                opacity: abs > 2 ? 0 : 1 - abs * 0.3,
                filter: abs ? "blur(2px)" : "blur(0px)",
              }}
              style={{ zIndex: 10 - abs }}
              transition={{ type: "spring", stiffness: 180, damping: 26 }}
              onClick={() => off && go(off)}
            >
              <Phone className="w-[270px]">{abs <= 1 ? <S key={i} /> : <div />}</Phone>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mx-auto mt-4 flex max-w-md flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
            <p className="text-3xl font-semibold tracking-tight">{screens[i].t}</p>
            <p className="mt-2 text-muted-foreground">{screens[i].d}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex items-center gap-4">
          <button aria-label="Previous" onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-full bg-card"><ChevronLeft size={18} /></button>
          <div className="flex gap-1.5">
            {screens.map((_, k) => (
              <button key={k} aria-label={`Screen ${k + 1}`} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? "w-8 bg-foreground" : "w-1.5 bg-foreground/20"}`} />
            ))}
          </div>
          <button aria-label="Next" onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-full bg-card"><ChevronRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}
