import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ease = [0.76, 0, 0.24, 1] as const;
const KEY = "meanwhile.site.loaded";

/** Logo-assembly intro: [ ] fly in, m rises, yellow dot drops, wordmark types, curtain lifts. Once per session. */
export default function Preloader() {
  const [show, setShow] = useState(() => typeof window !== "undefined" && !sessionStorage.getItem(KEY));

  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      sessionStorage.setItem(KEY, "1");
      setShow(false);
    }, 2900);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, [show]);

  useEffect(() => {
    if (!show) document.documentElement.style.overflow = "";
  }, [show]);

  const word = "meanwhile".split("");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="pre"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary text-primary-foreground"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="relative flex items-center text-[28vw] font-semibold leading-none tracking-[-0.06em] md:text-[14vw]">
            <motion.span initial={{ x: "-60vw", opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.9, ease }}>[</motion.span>
            <span className="relative overflow-hidden px-[0.04em]">
              <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.55, duration: 0.8, ease }}>m</motion.span>
            </span>
            <motion.span initial={{ x: "60vw", opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.9, ease }}>]</motion.span>
            <motion.span
              className="absolute -right-[0.18em] bottom-[0.14em] h-[0.14em] w-[0.14em] rounded-full bg-primary-foreground"
              initial={{ y: "-80vh", scale: 0.4 }}
              animate={{ y: 0, scale: [0.4, 1.3, 1] }}
              transition={{ delay: 1.1, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            />
          </div>
          <div className="mt-6 flex overflow-hidden text-2xl font-medium tracking-tight md:text-3xl">
            {word.map((c, i) => (
              <motion.span key={i} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.45 + i * 0.05, duration: 0.5, ease }}>
                {c}
              </motion.span>
            ))}
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>.</motion.span>
          </div>
          <motion.div className="absolute bottom-10 left-1/2 h-px w-40 -translate-x-1/2 bg-primary-foreground/20">
            <motion.div className="h-full origin-left bg-primary-foreground" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2.6, ease: "easeInOut" }} />
          </motion.div>
          <motion.p className="absolute bottom-14 text-[10px] uppercase tracking-[0.3em] opacity-60" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.3 }}>
            Skin OS · loading your portfolio
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
