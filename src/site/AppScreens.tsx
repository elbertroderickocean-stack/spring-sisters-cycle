import { useEffect, useState } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Moon, Droplet, Activity, ScanFace } from "lucide-react";
import { Phone, TodayScreen, ChatScreen, ShelfScreen } from "./PhoneMockup";
import scanFace from "@/assets/site/scan-face.jpg";


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

const FACE = { cx: 60, cy: 50, rx: 34, ry: 42 };

const contour = Array.from({ length: 30 }, (_, i) => {
  const a = (i / 30) * Math.PI * 2 - Math.PI / 2;
  return { x: FACE.cx + Math.cos(a) * FACE.rx, y: FACE.cy + Math.sin(a) * FACE.ry };
});

const eyeRing = (cx: number, cy: number) =>
  Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return { x: cx + Math.cos(a) * 6.5, y: cy + Math.sin(a) * 3 };
  });

const eyes = [...eyeRing(38.5, 22.2), ...eyeRing(74, 23.2)];

const spots: [number, number][] = [
  [39.5, 11],
  [75, 10],
  [44, 43],
  [39, 44.5],
  [49.5, 43.5],
  [40.5, 69.5],
  [49.7, 71.2],
  [59.5, 71.5],
  [30, 50],
  [80, 48],
  [55, 13],
  [68, 14],
];

const brackets = [
  "left-2 top-2 border-l border-t rounded-tl-lg",
  "right-2 top-2 border-r border-t rounded-tr-lg",
  "left-2 bottom-2 border-l border-b rounded-bl-lg",
  "right-2 bottom-2 border-r border-b rounded-br-lg",
];

function ScanScreen() {
  return (
    <div className="flex h-full flex-col gap-3 px-4 pt-12">
      <Head icon={ScanFace} t="Skin Scan" tag="Day 19" />
      <div className="relative aspect-[1280/1033] overflow-hidden rounded-2xl bg-foreground">
        <img src={scanFace} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/25 via-transparent to-foreground/75" />

        <motion.div
          className="absolute rounded-[50%] border border-dashed border-primary/45"
          style={{
            left: `${FACE.cx - FACE.rx}%`,
            top: `${FACE.cy - FACE.ry}%`,
            width: `${FACE.rx * 2}%`,
            height: `${FACE.ry * 2}%`,
          }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />

        {contour.map((p, i) => (
          <motion.span
            key={`c${i}`}
            className="absolute h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.04, duration: 0.3 }}
          />
        ))}

        {eyes.map((p, i) => (
          <motion.span
            key={`e${i}`}
            className="absolute h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/90"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 + i * 0.03, duration: 0.25 }}
          />
        ))}

        {spots.map(([x, y], i) => (
          <motion.span
            key={`s${i}`}
            className="absolute h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/60"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 + i * 0.05, duration: 0.3 }}
          />
        ))}

        <motion.div
          className="absolute left-[26%] top-[39%] h-[18%] w-[17%] rounded-lg border border-primary/70"
          initial={{ opacity: 0, scale: 1.25 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.9, duration: 0.6, ease: "easeOut" }}
        >
          <span className="absolute -bottom-4 left-0 whitespace-nowrap rounded-full bg-primary px-1.5 py-[1px] text-[6px] font-semibold text-primary-foreground">
            CHEEK · BARRIER
          </span>
        </motion.div>

        <motion.div
          className="absolute inset-x-0 z-10"
          animate={{ top: ["-12%", "112%", "-12%"] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-14 w-full -translate-y-full bg-gradient-to-b from-transparent to-primary/25" />
          <div className="h-[2px] w-full bg-primary shadow-[0_0_16px_hsl(var(--primary))]" />
        </motion.div>

        {brackets.map((b) => (
          <span key={b} className={`absolute h-5 w-5 border-primary/80 ${b}`} />
        ))}

        <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center">
          <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-foreground/75 px-2 py-[3px] text-[7px] font-medium text-background/90 backdrop-blur-sm">
            <span className="h-1 w-1 animate-pulse rounded-full bg-primary" />
            m.i. scanning · hydration, redness, texture
          </span>
        </div>
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
