import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Apple } from "lucide-react";
import SiteLayout, { Bracket } from "./SiteLayout";
import { products, collections } from "./products";
import heroFace from "@/assets/site/hero-face.jpg";
import eyeCream from "@/assets/site/eye-cream-sky.jpg";
import lineup from "@/assets/site/lineup.jpg";
import shelf from "@/assets/site/open-shelf.jpg";
import mask from "@/assets/site/mask-face.jpg";
import serumTrio from "@/assets/site/serum-trio.jpg";
import appIcon from "@/assets/site/app-icon.png";
import serumFilm from "@/assets/meanwhile-serum-01-film.mp4.asset.json";
import Preloader from "./Preloader";
import Lookbook from "./Lookbook";
import AppScreens from "./AppScreens";
import faceFilm from "@/assets/site/hero-face-film.mp4.asset.json";
import { Problem, Science, Morning, HowItWorks, Horizon, Epilogue } from "./Story";

const fade = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex rounded-full border border-foreground/80 px-3 py-1 text-xs font-medium">{children}</span>
);

function useIsDesktop() {
  const [d, setD] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setD(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return d;
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const desktop = useIsDesktop();
  const words = ["Beauty", "has", "no", "deadline"];
  return (
    <section ref={ref} className="px-3 pt-20 md:px-6">
      <div className="mx-auto max-w-7xl pb-10 pt-10 text-center md:pt-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Pill>Skin OS · powered by m.i.</Pill>
        </motion.div>
        <h1 className="mt-6 text-[15vw] font-semibold leading-[0.9] tracking-[-0.05em] md:text-[8.5vw]">
          {words.map((w, i) => (
            <motion.span
              key={w}
              className="inline-block pr-[0.2em]"
              initial={{ opacity: 0, y: "60%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
        >
          While you live your life, meanwhile works in the background. An app that reads your sleep, stress, glucose, cycle and weather — and turns them into today's skin protocol.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Link to="/welcome" className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 font-medium text-background transition-transform hover:scale-[1.03]">
            Start your portfolio <ArrowRight size={16} />
          </Link>
          <Link to="/site/shop" className="rounded-full bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:scale-[1.03]">
            Shop the system
          </Link>
        </motion.div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-2">
        {[[eyeCream, serumFilm.url], [heroFace, faceFilm.url]].map(([src, film], i) => (
          <ApertureCard key={i} src={src} film={film} delay={desktop ? 0.4 + i * 0.25 : 0.3} label={i === 1} />
        ))}
      </div>
    </section>
  );
}

/** Brand-dot "aperture" reveal: a yellow dot lands, then opens like a lens iris into the video. */
function ApertureCard({ src, film, delay, label }: { src: string; film: string; delay: number; label: boolean }) {
  const ease = [0.65, 0, 0.35, 1] as const;
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.35 }}
      className="relative aspect-[4/4.6] overflow-hidden rounded-[28px] bg-secondary md:aspect-[4/4.4]"
    >
      <motion.span
        variants={{ hidden: { scale: 0, opacity: 1 }, shown: { scale: [0, 1, 1.6], opacity: [1, 1, 0] } }}
        transition={{ delay, duration: 1.1, times: [0, 0.4, 1], ease }}
        className="absolute left-1/2 top-1/2 z-20 -ml-4 -mt-4 h-8 w-8 rounded-full bg-primary"
      />
      <motion.div
        variants={{ hidden: { clipPath: "circle(0% at 50% 50%)" }, shown: { clipPath: "circle(75% at 50% 50%)" } }}
        transition={{ delay: delay + 0.35, duration: 1.4, ease }}
        className="absolute inset-0"
      >
        <motion.video
          src={film}
          poster={src}
          autoPlay
          muted
          loop
          playsInline
          variants={{ hidden: { scale: 1.35, rotate: -4 }, shown: { scale: 1, rotate: 0 } }}
          transition={{ delay: delay + 0.35, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover"
        />
        {label && (
          <motion.span
            variants={{ hidden: { opacity: 0, y: 20 }, shown: { opacity: 1, y: 0 } }}
            transition={{ delay: delay + 1.2, duration: 0.8 }}
            className="absolute bottom-5 left-6 text-5xl font-semibold tracking-tight text-primary md:text-7xl"
          >
            meanwhile
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}

function Marquee() {
  const items = ["Niacinamide", "Peptides", "Vitamin C", "Beta-Glucan", "PDRN", "Ceramides", "Caffeine", "Centella"];
  return (
    <div className="overflow-hidden border-y border-border py-6">
      <motion.div className="flex w-max gap-12 whitespace-nowrap text-4xl font-semibold tracking-tight md:text-6xl" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className={i % 4 === 0 ? "" : "text-foreground/15"}>
            {i % 4 === 0 ? `(${t})` : t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Manifesto() {
  const cols = [
    { h: "Skin = market", t: "Skin is dynamic. It changes. It reacts. It moves through phases. It's sensitive to overload." },
    { h: "FinTech ≠ one product for everyone", t: "In finance there is no single tool that works for every situation. There are strategies. There is timing. Skin works the same way." },
    { h: "Tech — approach", t: "A digital layer reads external signals — weather, UV, humidity, sleep, stress, cycle — and tells you exactly what to use, and when." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-28 md:px-8">
      <motion.div {...fade} className="text-center">
        <Pill>Brand idea</Pill>
        <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold leading-[1] tracking-[-0.04em] md:text-7xl">
          Skincare is an investment. <span className="text-foreground/25">The earlier you start, the better the long-term outcome.</span>
        </h2>
      </motion.div>
      <div className="mt-20 grid gap-10 md:grid-cols-3">
        {cols.map((c, i) => (
          <motion.div key={c.h} {...fade} transition={{ ...fade.transition, delay: i * 0.12 }}>
            <p className="mb-4 text-xl font-semibold underline decoration-1 underline-offset-4">{c.h}</p>
            <p className="text-lg leading-snug text-muted-foreground">{c.t}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function AppSection() {
  const ref = useRef(null);
  return (
    <section id="app" ref={ref} className="mx-3 mt-28 overflow-hidden rounded-[36px] bg-secondary px-5 py-24 md:mx-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <motion.div {...fade} className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Pill>The app</Pill>
            <h2 className="mt-6 max-w-2xl text-5xl font-semibold leading-[1] tracking-[-0.04em] md:text-7xl">
              Your skin's passive income.
            </h2>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              m.i. — meanwhile.intelligence — reads your cycle, sleep, stress, glucose and weather, then deploys the right asset at the right moment. You just show up.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <img src={appIcon} alt="meanwhile app icon" width={1024} height={1024} loading="lazy" className="h-[57px] w-[57px] shrink-0 self-start rounded-[16px] shadow-xl" />
            <div className="flex flex-col gap-2">
              <Link to="/welcome" className="inline-flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-background">
                <Apple size={20} />
                <span className="leading-tight">
                  <span className="block text-[10px] opacity-70">Coming soon on the</span>
                  <span className="text-sm font-semibold">App Store</span>
                </span>
              </Link>
              <Link to="/welcome" className="text-center text-xs text-muted-foreground underline underline-offset-4">Try the web app now</Link>
            </div>
          </div>
        </motion.div>

        <AppScreens />

        <div className="mt-24 grid gap-3 md:grid-cols-4">
          {[
            ["Hormonal rhythm", "Four phases, four strategies. Your routine shifts with your cycle."],
            ["Skin scanner", "A 30-second face scan builds your baseline and tracks drift."],
            ["Live telemetry", "Sleep, stress, glucose and UV feed every recommendation."],
            ["Longevity mode", "7-day cellular training micro-cycles for compounding results."],
          ].map(([h, t], i) => (
            <motion.div key={h} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }} className="rounded-3xl bg-card p-6">
              <p className="text-sm text-muted-foreground">0{i + 1}</p>
              <p className="mt-10 text-xl font-semibold tracking-tight">{h}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OpenShelf() {
  return (
    <section id="shelf" className="mx-auto max-w-7xl px-5 py-28 md:px-8">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <motion.div {...fade}>
          <Pill>Open Shelf</Pill>
          <h2 className="mt-6 text-5xl font-semibold leading-[1] tracking-[-0.04em] md:text-7xl">
            m.i. doesn't replace your favorite brands. <span className="text-foreground/25">It gives them intelligence.</span>
          </h2>
          <div className="mt-8 space-y-5 text-lg text-muted-foreground">
            <p>Most brands want you to throw everything out and start again. We think that's bad portfolio management.</p>
            <p>Scan any product from any brand. m.i. reads the ingredients, checks synergy and conflicts, and places it into your framework. Gaps appear as ghosted steps — so you only buy what's actually missing.</p>
          </div>
          <ul className="mt-8 grid grid-cols-3 gap-3 text-sm">
            {["Scan any brand", "Synergy check", "Fill only the gaps"].map((t) => (
              <li key={t} className="rounded-2xl bg-secondary p-4 font-medium">{t}</li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...fade} className="relative">
          <div className="overflow-hidden rounded-[32px]">
            <motion.img initial={{ scale: 1.2 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} src={shelf} alt="An open shelf mixing brands" width={1600} height={1200} loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="absolute -bottom-6 left-4 rounded-2xl bg-card p-4 shadow-xl md:-left-10">
            <p className="text-xs text-muted-foreground">Unified Shelf</p>
            <p className="text-2xl font-semibold tracking-tight">7 assets · 1 gap</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ProductFilm() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  return (
    <section id="film" ref={ref} className="mx-3 mt-28 overflow-hidden rounded-[36px] bg-foreground px-5 py-16 text-background md:mx-6 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <motion.div {...fade} className="order-1 overflow-hidden rounded-[28px]" style={{ y }}>
          <motion.video src={serumFilm.url} autoPlay muted loop playsInline preload="metadata" style={{ scale }} className="aspect-[4/5] w-full object-cover" />
        </motion.div>
        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.15 }} className="order-2">
          <span className="inline-flex rounded-full border border-background/40 px-3 py-1 text-xs font-medium">Product film</span>
          <h2 className="mt-6 text-5xl font-semibold leading-[1] tracking-[-0.04em] md:text-7xl">
            Serum-01 <span className="text-background/30">[Balance]</span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-background/60">
            Deployed when your data says sebum is climbing — not when a calendar says so. One asset, one phase, exact timing.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-primary px-3 py-1.5 font-medium text-primary-foreground">Phase 3 · Luteal</span>
            <span className="rounded-full border border-background/25 px-3 py-1.5">15ml · $42</span>
          </div>
          <Link to="/site/shop/serum-01-balance" className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3.5 font-medium text-foreground transition-transform hover:scale-[1.03]">
            See the asset <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ProductsStrip() {
  return (
    <section className="px-3 md:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div {...fade} className="mb-10 flex items-end justify-between px-2">
          <h2 className="text-5xl font-semibold tracking-[-0.04em] md:text-7xl">The system</h2>
          <Link to="/site/shop" className="hidden items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-medium md:inline-flex">
            Shop all <ArrowRight size={14} />
          </Link>
        </motion.div>
        <motion.div {...fade} className="overflow-hidden rounded-[32px] bg-secondary">
          <img src={lineup} alt="meanwhile lineup" width={1920} height={1088} loading="lazy" className="w-full" />
        </motion.div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {collections.map((c, i) => (
            <motion.div key={c.name} {...fade} transition={{ ...fade.transition, delay: i * 0.1 }} className="rounded-[28px] bg-card p-8">
              <p className="text-2xl font-semibold tracking-tight">{c.name}</p>
              <p className="mt-2 text-muted-foreground">{c.subtitle}</p>
              <ul className="mt-6 space-y-2">
                {products.filter((p) => p.collection === c.name).map((p) => (
                  <li key={p.id}>
                    <Link to={`/site/shop/${p.id}`} className="flex justify-between border-t border-border pt-2 text-sm hover:text-muted-foreground">
                      <span>{p.name}</span><span>${p.price}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const imgs = [mask, serumTrio, heroFace];
  const captions = ["Meanwhile, it's working", "(Phase 2)", "Skin is an investment"];
  return (
    <section className="mx-auto mt-28 grid max-w-7xl gap-3 px-3 md:grid-cols-3 md:px-6">
      {imgs.map((s, i) => (
        <motion.div key={i} {...fade} transition={{ ...fade.transition, delay: i * 0.12 }} className="group relative aspect-[4/5] overflow-hidden rounded-[28px]">
          <img src={s} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
          <p className="absolute bottom-6 left-6 text-2xl font-semibold tracking-tight text-background drop-shadow">{captions[i]}</p>
        </motion.div>
      ))}
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-3 mt-28 rounded-[36px] bg-primary px-6 py-24 text-center text-primary-foreground md:mx-6">
      <motion.div {...fade}>
        <Bracket className="text-6xl md:text-8xl" />
        <h2 className="mx-auto mt-8 max-w-3xl text-5xl font-semibold leading-[1] tracking-[-0.04em] md:text-7xl">Open your skin portfolio today.</h2>
        <Link to="/welcome" className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-4 font-medium text-background transition-transform hover:scale-[1.03]">
          Start free <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
}

export default function SiteHome() {
  return (
    <SiteLayout>
      <Preloader />
      <Hero />
      <div className="mt-24"><Marquee /></div>
      <Problem />
      <Science />
      <Morning />
      <AppSection />
      <HowItWorks />
      <OpenShelf />
      <Manifesto />
      <ProductFilm />
      <div className="mt-28"><ProductsStrip /></div>
      <Horizon />
      <Lookbook />
      <Gallery />
      <Epilogue />
      <FinalCta />
    </SiteLayout>
  );
}
