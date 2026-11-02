import { motion } from "framer-motion";
import { ReactNode } from "react";

export function Phone({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/19] w-[260px] rounded-[44px] bg-foreground p-[10px] shadow-[0_40px_80px_-30px_hsl(var(--foreground)/0.45)] ${className}`}
    >
      <div className="absolute left-1/2 top-[18px] z-10 h-[22px] w-[80px] -translate-x-1/2 rounded-full bg-foreground" />
      <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-background">{children}</div>
    </div>
  );
}

const Row = ({ label, sub, done, ghost }: { label: string; sub: string; done?: boolean; ghost?: boolean }) => (
  <div className={`flex items-center gap-3 rounded-2xl p-3 ${ghost ? "border border-dashed border-foreground/20" : "bg-card"}`}>
    <span className={`h-3 w-3 rounded-full ${done ? "bg-foreground" : ghost ? "border border-foreground/30" : "bg-primary"}`} />
    <div className="flex-1">
      <p className={`text-[11px] font-semibold ${ghost ? "text-muted-foreground" : ""}`}>{label}</p>
      <p className="text-[9px] text-muted-foreground">{sub}</p>
    </div>
  </div>
);

export function TodayScreen() {
  return (
    <div className="flex h-full flex-col gap-3 px-4 pt-12">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold">[m] Today</span>
        <span className="rounded-full bg-primary px-2 py-0.5 text-[8px] font-semibold text-primary-foreground">Phase 2</span>
      </div>
      <p className="text-[22px] font-semibold leading-[1.05] tracking-tight">Portfolio status: optimizing</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-card p-3">
          <motion.p
            className="text-[26px] font-semibold tracking-tight"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            90%
          </motion.p>
          <p className="text-[8px] text-muted-foreground">Routine consistency this cycle</p>
        </div>
        <div className="rounded-2xl bg-primary p-3 text-primary-foreground">
          <p className="text-[26px] font-semibold tracking-tight">+12</p>
          <p className="text-[8px]">Return streak, days</p>
        </div>
      </div>
      <p className="mt-1 text-[9px] uppercase tracking-widest text-muted-foreground">Morning deployment</p>
      <Row label="Baseline Cleanser" sub="Constant · 60s" done />
      <Row label="Serum-02 [Glow]" sub="Shift · peak estrogen" />
      <Row label="SPF — missing" sub="Ghosted asset" ghost />
    </div>
  );
}

export function ChatScreen() {
  const msgs = [
    { me: true, t: "Slept 5h, big meeting today." },
    { me: false, t: "Cortisol is likely elevated. Skip the acid tonight — deploy Serum-03 [Calm]." },
    { me: true, t: "And my eye area?" },
    { me: false, t: "360° Eye Cream, AM. Cold tip first. meanwhile., your recovery index is on track." },
  ];
  return (
    <div className="flex h-full flex-col gap-2 px-4 pt-12">
      <p className="text-[11px] font-semibold">m.i. — meanwhile.intelligence</p>
      {msgs.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.5 }}
          className={`max-w-[85%] rounded-2xl px-3 py-2 text-[10px] leading-snug ${
            m.me ? "self-end bg-foreground text-background" : "self-start bg-card"
          }`}
        >
          {m.t}
        </motion.div>
      ))}
    </div>
  );
}

export function ShelfScreen() {
  const items = [
    { n: "meanwhile Serum-02", s: "Synergy 94%", m: true },
    { n: "Any brand · Vitamin C", s: "Overlap with Glow", m: false },
    { n: "Any brand · Retinol", s: "Pause in Phase 4", m: false },
    { n: "Moisturizer Rich", s: "Synergy 88%", m: true },
  ];
  return (
    <div className="flex h-full flex-col gap-3 px-4 pt-12">
      <p className="text-[11px] font-semibold">Unified Shelf</p>
      <div className="relative h-28 overflow-hidden rounded-2xl bg-secondary">
        <motion.div
          className="absolute inset-x-0 h-[2px] bg-primary shadow-[0_0_20px_hsl(var(--primary))]"
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <p className="absolute bottom-2 left-3 text-[9px] text-muted-foreground">Scanning ingredients…</p>
      </div>
      {items.map((it) => (
        <div key={it.n} className="flex items-center justify-between rounded-2xl bg-card p-3">
          <div>
            <p className="text-[10px] font-semibold">{it.n}</p>
            <p className="text-[8px] text-muted-foreground">{it.s}</p>
          </div>
          <span className={`h-2.5 w-2.5 rounded-full ${it.m ? "bg-primary" : "bg-foreground/30"}`} />
        </div>
      ))}
    </div>
  );
}
