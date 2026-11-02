import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue, useInView, animate, type Variants } from "framer-motion";
import { Moon, Activity, Droplet, CalendarDays, Sun, ScanFace, Cpu, Sparkles, RefreshCw, Layers } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;
export const fadeUp = {
  initial: { opacity: 0, y: 40, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease },
};

export const Pill = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${dark ? "border-background/40" : "border-foreground/80"}`}>{children}</span>
);

/* ---------- Scroll-scrubbed word reveal ---------- */
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">{children}</motion.span>;
}
export function ScrubText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.4"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>
      ))}
    </p>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

/* ---------- Problem cards: layered curtain reveal ---------- */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 56, rotateX: -12, clipPath: "inset(0 0 100% 0)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 1.05, ease, delay: i * 0.16 },
  }),
};

const cardRule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.3, ease, delay: 0.5 } },
};

const cardNumber: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease, delay: 0.6 } },
};

const cardMask: Variants = {
  hidden: { opacity: 0, y: "115%" },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease, delay: 0.62 } },
};

const cardBody: Variants = {
  hidden: { opacity: 0, y: "120%" },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease, delay: 0.78 } },
};

const cardDot: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: -120 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 280, damping: 15, delay: 0.9 } },
};

function ProblemCard({ i, h, t }: { i: number; h: string; t: string }) {
  return (
    <motion.div
      custom={i}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      style={{ transformPerspective: 1200 }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="group relative overflow-hidden rounded-[28px] bg-secondary p-7"
    >
      <motion.span aria-hidden variants={cardRule} className="absolute inset-x-0 top-0 h-[2px] origin-left rounded-full bg-primary" />
      <span aria-hidden className="pointer-events-none absolute -bottom-20 -right-12 h-44 w-44 rounded-full bg-primary/0 blur-2xl transition-colors duration-700 group-hover:bg-primary/25" />
      <div className="flex items-start justify-between">
        <motion.p variants={cardNumber} className="text-sm text-muted-foreground">0{i + 1}</motion.p>
        <motion.span variants={cardDot} className="h-2.5 w-2.5 rounded-full bg-primary" />
      </div>
      <div className="mt-10 overflow-hidden">
        <motion.p variants={cardMask} className="text-2xl font-semibold tracking-tight">{h}</motion.p>
      </div>
      <div className="overflow-hidden">
        <motion.p variants={cardBody} className="mt-2 text-muted-foreground">{t}</motion.p>
      </div>
    </motion.div>
  );
}

/* ---------- 1. Problem: Beauty Anxiety ---------- */
export function Problem() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-28 md:px-8 md:py-40">
      <motion.div {...fadeUp}><Pill>Chapter 01 · The problem nobody names</Pill></motion.div>
      <ScrubText
        className="mt-10 text-[9vw] font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl"
        text="Skin is the most honest diary your body keeps. It records sleep, stress, sugar, travel, hormones and weather. But that diary has no translator."
      />
      <div className="mt-20 grid gap-3 md:grid-cols-3">
        {[
          ["Too many products", "Tens of thousands of launches. Every jar sold as an object: apply and hope."],
          ["Too much advice", "Contradicting feeds, twelve-step routines, a new miracle every week."],
          ["Zero feedback", "Nobody comes back in the morning to tell you whether it worked."],
        ].map(([h, t], i) => (
          <ProblemCard key={h} i={i} h={h} t={t} />
        ))}
      </div>
      <motion.div {...fadeUp} className="mt-3 grid items-end gap-6 rounded-[32px] bg-foreground p-8 text-background md:grid-cols-[auto_1fr] md:p-12">
        <p className="text-[28vw] font-semibold leading-[0.8] tracking-[-0.06em] text-primary md:text-[11rem]"><Counter to={73} suffix="%" /></p>
        <div>
          <p className="text-2xl font-semibold tracking-tight md:text-3xl">of women say skincare went from a source of joy to a source of anxiety.</p>
          <p className="mt-4 text-background/60">We call it <span className="text-background">Beauty Anxiety</span> — not "not pretty enough," but a constant background noise. Beauty became a chore. We're here to fire it.</p>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- 2. Science: sticky signal stack ---------- */
const signals = [
  { icon: Activity, k: "Stress", h: "The brain–skin axis", t: "Chronic cortisol cuts ceramide synthesis, speeds collagen breakdown via MMPs and drives sebum and inflammation. Students in exam season show a thinner stratum corneum and slower barrier repair.", m: "Cortisol ↑" },
  { icon: Moon, k: "Sleep", h: "The night shift", t: "Deep sleep releases growth hormone — the master repair signal. Two nights of 5 hours and measured water loss rises while perceived radiance drops. Skin feels it before your mood does.", m: "6h 12m" },
  { icon: Droplet, k: "Glucose", h: "The silent glycation storm", t: "Every spike lets sugar cross-link collagen and elastin into AGEs — stiff, inelastic fibers. It starts long before wrinkles. CGMs made it visible. We make it manageable.", m: "AGEs" },
  { icon: CalendarDays, k: "Cycle", h: "A 28-day market", t: "Follicular: a stronger barrier that tolerates actives. Luteal: sensitivity, water retention, breakouts. The same retinol in different weeks is two different products.", m: "Day 19" },
  { icon: Sun, k: "Environment", h: "The dermatological constants", t: "UV drives up to 80% of visible photoaging. Humidity under 30% accelerates water loss. Hard water, smog, temperature swings — every one leaves a measurable trace.", m: "UV 7" },
];

export function Science() {
  return (
    <section id="science" className="mx-3 rounded-[36px] bg-foreground px-5 py-24 text-background md:mx-6 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div {...fadeUp} className="max-w-3xl">
          <Pill dark>Chapter 02 · The science</Pill>
          <h2 className="mt-6 text-5xl font-semibold leading-[1] tracking-[-0.04em] md:text-7xl">
            Skin is a terminal, <span className="text-background/30">not decoration.</span>
          </h2>
          <p className="mt-6 text-lg text-background/60">It isn't a surface to "improve." It's the most readable indicator of what's happening inside your body.</p>
        </motion.div>
        <div className="mt-16 space-y-4">
          {signals.map((s, i) => (
            <div key={s.k} className="sticky" style={{ top: `${88 + i * 18}px` }}>
              <motion.div
                {...fadeUp}
                className="grid gap-6 rounded-[28px] border border-background/10 bg-foreground p-7 shadow-[0_-20px_40px_-20px_hsl(var(--foreground))] md:grid-cols-[200px_1fr_auto] md:items-center md:p-10"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground"><s.icon size={20} /></span>
                  <span className="text-sm uppercase tracking-[0.2em] text-background/50">{s.k}</span>
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight md:text-3xl">{s.h}</p>
                  <p className="mt-3 max-w-2xl text-background/60">{s.t}</p>
                </div>
                <p className="text-4xl font-semibold tracking-tight text-primary md:text-5xl">{s.m}</p>
              </motion.div>
            </div>
          ))}
        </div>
        <motion.div {...fadeUp} className="mt-24 grid gap-8 md:grid-cols-2 md:items-end">
          <p className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            All of it is <span className="text-primary">already measured.</span>
          </p>
          <p className="text-lg text-background/60">
            Your Apple Watch knows more about you than your aesthetician: HRV, heart rate, sleep, steps. A CGM adds glucose. Your cycle app knows the day. A weather API knows the UV outside. One link is missing — the system that brings these signals together and translates them into care. That link is meanwhile.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- 3. 07:42 morning ---------- */
const miMessage =
  "You slept less than usual — 6h 12m, and your overnight heart rate ran high. Today we drop the acids so we don't stress your barrier. Your cream stays — I'm only adding the missing antioxidant. By 3pm, recovery mode.";

function Typing({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setN((x) => (x >= text.length ? (clearInterval(id), x) : x + 2)), 22);
    return () => clearInterval(id);
  }, [inView, text]);
  return (
    <p ref={ref} className="text-[15px] leading-snug">
      {text.slice(0, n)}
      {n < text.length && <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-foreground align-middle" />}
    </p>
  );
}

export function Morning() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <motion.div {...fadeUp}>
          <Pill>Chapter 03 · Meanwhile, it's working</Pill>
          <p className="mt-8 font-mono text-7xl font-semibold tracking-[-0.05em] md:text-9xl">07:42</p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
            An ordinary morning. <span className="text-foreground/25">One decision, made for you.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            No twelve steps. No hour of doubt. "Meanwhile" means while you live your life, the system works in the background. You don't open another checklist app — m.i. watches and adjusts.
          </p>
        </motion.div>
        <div className="relative mx-auto w-full max-w-md">
          <motion.div aria-hidden className="absolute -inset-10 rounded-full bg-primary/60 blur-3xl" animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }} transition={{ duration: 6, repeat: Infinity }} />
          <motion.div {...fadeUp} className="relative rounded-[28px] border border-border bg-background/80 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-2 font-semibold text-foreground"><span className="grid h-6 w-6 place-items-center rounded-md bg-primary text-[8px] text-primary-foreground">[m]</span>m.i.</span>
              <span>now</span>
            </div>
            <Typing text={miMessage} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.8, ease }} className="relative mt-3 ml-10 rounded-[24px] bg-secondary p-5">
            <p className="text-xs text-muted-foreground">Next day · after a late dessert</p>
            <p className="mt-1 text-[15px] leading-snug">Slight puffiness, lower HRV. No lecture — tomorrow gets less sugar in the plan and more antioxidant support.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.3, duration: 0.8, ease }} className="relative mt-3 rounded-[24px] bg-foreground p-5 text-background">
            <p className="text-xs text-background/50">Day 30</p>
            <p className="mt-1 text-[15px] leading-snug">Not a shelf upgrade. A <span className="text-primary">protocol</span> — living, daily, personal, learning from your own skin.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. How it works: horizontal scroll ---------- */
const steps = [
  { icon: Layers, h: "Collect", t: "m.i. connects to Apple Health (sleep, HRV, activity, heart rate), your cycle, weather (UV, humidity) and — optionally — a glucose sensor." },
  { icon: ScanFace, h: "Scan", t: "One face scan with your phone camera. A vision model reads hydration, redness, texture and fatigue — the third data source: body + skin + surroundings." },
  { icon: Cpu, h: "Model", t: "The AI layer connects the dots: low sleep + cortisol pattern + luteal phase + dry air → today's skin mode." },
  { icon: Sparkles, h: "Act", t: "Your routine rebuilds itself: what stays, what goes, what's added. From your own products — and meanwhile assets dosed to the moment." },
  { icon: RefreshCw, h: "Learn", t: "Every reaction feeds back into the model. Week by week, more precise. In six months: a digital twin of your skin." },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 w-full max-w-7xl px-5 md:px-8">
          <Pill>Chapter 04 · Skin OS, under the hood</Pill>
          <h2 className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.04em] md:text-7xl">
            Signals → intelligence → <span className="text-foreground/25">protocol.</span>
          </h2>
          <div className="mt-6 h-[3px] w-full max-w-sm overflow-hidden rounded-full bg-secondary">
            <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-foreground" />
          </div>
        </div>
        <motion.div style={{ x }} className="flex gap-4 pl-5 md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {steps.map((s, i) => (
            <div key={s.h} className={`flex h-[52vh] min-h-[360px] w-[80vw] shrink-0 flex-col justify-between rounded-[32px] p-8 md:w-[34vw] ${i === 4 ? "bg-primary text-primary-foreground" : i % 2 ? "bg-foreground text-background" : "bg-secondary"}`}>
              <div className="flex items-center justify-between">
                <s.icon size={28} />
                <span className="text-sm opacity-50">0{i + 1} / 05</span>
              </div>
              <div>
                <p className="text-5xl font-semibold tracking-[-0.04em] md:text-6xl">{s.h}</p>
                <p className="mt-4 max-w-sm opacity-70">{s.t}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- 6. Horizon ---------- */
export function Horizon() {
  const h = [
    { k: "Now", h: "Skin", t: "Cycle, sleep, stress, glucose and weather — translated into a daily protocol." },
    { k: "Next", h: "Supplements", t: "Adaptogens, omega, collagen, antioxidants — matched to your state, not to everyone. A supplement without data is faith. Inside Skin OS, it's a measurable intervention." },
    { k: "Then", h: "Women's health", t: "Pregnancy, postpartum, perimenopause — the transitions where skin and wellbeing shift dramatically and personal support barely exists." },
    { k: "Horizon", h: "Sleep & Longevity", t: "Glucose, sleep, stress, hormones, inflammation — the classic longevity biomarkers, worn on the skin as the earliest indicator." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-36">
      <motion.div {...fadeUp} className="text-center">
        <Pill>Chapter 05 · What's next</Pill>
        <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold leading-[1] tracking-[-0.04em] md:text-7xl">
          Skin is the beginning, <span className="text-foreground/25">not the ceiling.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">One app that grows with you — from skin to your whole well-being.</p>
      </motion.div>
      <div className="relative mt-16 grid gap-3 md:grid-cols-4">
        <motion.div aria-hidden className="absolute left-0 right-0 top-[38px] hidden h-px origin-left bg-foreground md:block" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease }} />
        {h.map((x, i) => (
          <motion.div key={x.h} {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 + i * 0.15 }} className="relative">
            <span className={`relative z-10 inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] ${i === 0 ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}`}>{x.k}</span>
            <div className="mt-6 rounded-[28px] bg-secondary p-7">
              <p className="text-2xl font-semibold tracking-tight">{x.h}</p>
              <p className="mt-3 text-muted-foreground">{x.t}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Epilogue ---------- */
export function Epilogue() {
  const lines = ["A cream with intelligence.", "An app with memory.", "A morning without anxiety."];
  return (
    <section className="mx-auto max-w-6xl px-5 py-28 text-center md:px-8 md:py-40">
      <motion.p {...fadeUp} className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Epilogue · 07:42, again</motion.p>
      <motion.p {...fadeUp} className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">
        The mirror, a little anxiety: "what's wrong with my face?" In the world of meanwhile, your phone already told you why — and what to do about it. One short sentence instead of twelve steps.
      </motion.p>
      <p className="mt-6 text-sm text-muted-foreground">Not just a cream. Not just an app.</p>
      <div className="mt-10 space-y-2">
        {lines.map((l, i) => (
          <div key={l} className="overflow-hidden">
            <motion.p initial={{ y: "110%" }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 1, ease }} className={`text-[10vw] font-semibold leading-[1] tracking-[-0.05em] md:text-7xl ${i === 2 ? "" : "text-foreground/30"}`}>
              {l}
            </motion.p>
          </div>
        ))}
      </div>
      <motion.div {...fadeUp} className="mx-auto mt-14 flex max-w-2xl flex-wrap justify-center gap-2 text-sm">
        {["Skin — the interface", "Routine — the protocol", "Product — the entry"].map((t) => (
          <span key={t} className="rounded-full bg-secondary px-4 py-2">{t}</span>
        ))}
      </motion.div>
    </section>
  );
}
