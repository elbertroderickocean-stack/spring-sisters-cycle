import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Plus } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { fadeUp, Pill } from "./Story";

const ease = [0.22, 1, 0.36, 1] as const;
const emailSchema = z.string().trim().email().max(255);

/* ---------- Waitlist form ---------- */
export function WaitlistForm({ source, dark = false }: { source: string; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) { setState("error"); setMsg("Please enter a valid email."); return; }
    setState("loading");
    const { error } = await supabase.from("waitlist_signups").insert({ email: parsed.data.toLowerCase(), source });
    if (error && error.code !== "23505") { setState("error"); setMsg("Something went wrong. Please try again."); return; }
    setState("done");
  };

  if (state === "done")
    return (
      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-medium ${dark ? "bg-background text-foreground" : "bg-foreground text-background"}`}>
        <Check size={16} /> You're on the list. We'll write when it's your turn.
      </motion.p>
    );

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <div className={`flex items-center gap-1 rounded-full p-1.5 ${dark ? "bg-background/10 ring-1 ring-background/25" : "bg-card ring-1 ring-border"}`}>
        <input
          type="email"
          required
          maxLength={255}
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
          placeholder="your@email.com"
          aria-label="Email address"
          className={`min-w-0 flex-1 bg-transparent px-4 py-2.5 text-[15px] outline-none ${dark ? "placeholder:text-background/40" : "placeholder:text-muted-foreground"}`}
        />
        <button disabled={state === "loading"} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.03] disabled:opacity-60 ${dark ? "bg-background text-foreground" : "bg-foreground text-background"}`}>
          {state === "loading" ? "Joining…" : "Join the waitlist"} <ArrowRight size={14} />
        </button>
      </div>
      <p className={`mt-2 px-4 text-xs ${state === "error" ? "text-destructive" : dark ? "text-background/50" : "text-muted-foreground"}`}>
        {state === "error" ? msg : "Early access to the iOS app. No spam, unsubscribe anytime."}
      </p>
    </form>
  );
}

/* ---------- Tap-to-explain term ---------- */
export function Term({ children, tip }: { children: React.ReactNode; tip: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button type="button" onClick={() => setOpen((v) => !v)} onBlur={() => setOpen(false)} className="cursor-help underline decoration-dotted decoration-1 underline-offset-4">
        {children}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute bottom-full left-1/2 z-20 mb-2 w-60 -translate-x-1/2 rounded-2xl bg-card p-3 text-left text-xs font-normal leading-snug text-foreground shadow-xl ring-1 ring-border">
            {tip}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ---------- What is meanwhile (clarity block) ---------- */
export function WhatItIs() {
  const items = [
    { k: "The app", h: "Free to start", t: "Core protocol, skin scan and the Open Shelf. m.i. Premium — full live data and daily guidance — is $9.99/month." },
    { k: "Your shelf", h: "Start with what you own", t: "Scan the products you already have. m.i. builds your routine around them first." },
    { k: "Our products", h: "Optional, always", t: "If there's a real gap, m.i. may suggest a meanwhile product — or any brand that fits. You decide." },
    { k: "Launch", h: "iOS first", t: "Coming to the App Store. Android after. Join the waitlist for early access." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 pt-28 md:px-8">
      <motion.div {...fadeUp} className="max-w-3xl">
        <Pill>What is meanwhile.</Pill>
        <h2 className="mt-6 text-5xl font-semibold leading-[1] tracking-[-0.04em] md:text-7xl">
          An app first. <span className="text-foreground/25">Products only when you need them.</span>
        </h2>
      </motion.div>
      <div className="mt-14 grid gap-3 md:grid-cols-4">
        {items.map((x, i) => (
          <motion.div
            key={x.k}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
            whileHover={{ y: -6, transition: { duration: 0.4, ease } }}
            className={`rounded-[28px] p-7 ${i === 1 ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            <div className="flex items-center gap-2">
              <motion.span
                aria-hidden
                className="relative flex h-1.5 w-1.5 items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08 + 0.5, type: "spring", stiffness: 340, damping: 18 }}
              >
                <motion.span
                  className="absolute inset-0 rounded-full bg-current"
                  animate={{ scale: [1, 3.4], opacity: [0.45, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: "easeOut", delay: i * 0.08 + 1 }}
                />
                <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
              </motion.span>
              <p className="text-xs uppercase tracking-[0.2em] opacity-60">{x.k}</p>
            </div>
            <motion.span
              aria-hidden
              className="mt-4 block h-px w-full origin-left bg-current opacity-20"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08 + 0.35, duration: 0.9, ease }}
            />
            <p className="mt-8 text-2xl font-semibold tracking-tight">{x.h}</p>
            <p className="mt-3 text-sm opacity-70">{x.t}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- For every age: menopause & perimenopause ---------- */
export function EveryAge() {
  const days = [
    { d: "1–2", h: "Recovery", t: "Calm & renew" },
    { d: "3", h: "Exfoliation", t: "Gentle renewal" },
    { d: "4", h: "Activation", t: "Glow & energize" },
    { d: "5–6", h: "Recovery", t: "Calm & renew" },
    { d: "7", h: "Flex", t: "Your choice" },
  ];
  return (
    <section id="every-age" className="mx-3 mt-28 rounded-[36px] bg-secondary px-5 py-24 md:mx-6 md:px-12">
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[1fr_1.1fr] md:items-center">
        <motion.div {...fadeUp}>
          <Pill>For every stage of life</Pill>
          <h2 className="mt-6 text-5xl font-semibold leading-[1] tracking-[-0.04em] md:text-6xl">
            No cycle? <span className="text-foreground/25">Still a rhythm.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            In perimenopause and menopause, estrogen drops and skin loses density, moisture and bounce. A routine built for a monthly cycle stops making sense — so m.i. switches to <b className="font-semibold text-foreground">Longevity mode</b>.
          </p>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">
            Instead of a 28-day calendar, your evenings follow a 7-day training cycle for your skin: rest days and active days alternate, like a good workout plan. Skin gets stimulated, then has time to recover — so results build instead of plateauing.
          </p>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground">
            Pregnancy and postpartum get their own gentle mode with pregnancy-safe ingredients.
          </p>
        </motion.div>
        <div className="space-y-2">
          {days.map((x, i) => (
            <motion.div
              key={x.d}
              initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.8, ease }}
              className={`flex items-center gap-5 rounded-[22px] p-5 ${x.h === "Activation" ? "bg-foreground text-background" : x.h === "Exfoliation" ? "bg-primary text-primary-foreground" : "bg-card"}`}
            >
              <span className="w-16 shrink-0 text-xs uppercase tracking-[0.15em] opacity-60">Day {x.d}</span>
              <span className="text-xl font-semibold tracking-tight">{x.h}</span>
              <span className="ml-auto text-sm opacity-60">{x.t}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const faqs = [
  { q: "Does meanwhile replace my dermatologist?", a: "No. meanwhile is a wellness and skincare guidance app, not a medical device. It doesn't diagnose or treat conditions. For persistent or worrying skin changes, see a dermatologist — and feel free to share your meanwhile history with them." },
  { q: "What does the skin scan actually measure?", a: "It looks at visible signs in a photo — dryness, redness, texture and uneven tone — and tracks how they change over time. It can't measure what's happening inside your skin." },
  { q: "What happens to my data?", a: "Your health and scan data is used only to build your routine. We don't sell it, and you can delete your account and data at any time. Health data from Apple Health stays under your control and permissions." },
  { q: "How much does it cost?", a: "Starting is free. m.i. Premium is $9.99/month. Our skincare products are optional — the app works with whatever you already own." },
  { q: "Do I need a glucose sensor or a smartwatch?", a: "No. They make recommendations more precise, but meanwhile works with just your phone: cycle, weather and skin scans." },
  { q: "Is there an Android version?", a: "iOS comes first. Android is planned next — join the waitlist and we'll let you know." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-4xl px-5 py-28 md:px-8">
      <motion.div {...fadeUp} className="text-center">
        <Pill>FAQ</Pill>
        <h2 className="mt-6 text-5xl font-semibold tracking-[-0.04em] md:text-6xl">Honest answers.</h2>
      </motion.div>
      <div className="mt-12 divide-y divide-border border-y border-border">
        {faqs.map((f, i) => (
          <div key={f.q}>
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left">
              <span className="text-lg font-medium tracking-tight md:text-xl">{f.q}</span>
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary"><Plus size={16} /></motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
                  <p className="pb-6 pr-12 text-muted-foreground">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
