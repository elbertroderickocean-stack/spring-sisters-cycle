import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { markIntroDone } from "./intro";

const ease = [0.76, 0, 0.24, 1] as const;
const soft = [0.22, 1, 0.36, 1] as const;

/** Calm intro: logo pieces drift in and lock together, thin progress line, curtain lifts. Once per session. */
export default function Preloader() {
  const [show, setShow] = useState(() => typeof window !== "undefined" && !sessionStorage.getItem(INTRO_KEY));

  useEffect(() => {
    if (!show) {
      document.documentElement.style.overflow = "";
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      markIntroDone();
      setShow(false);
    }, 2700);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, [show]);

  const pieces: { c: string; x: number; y: number; d: number }[] = [
    { c: "[", x: -60, y: -30, d: 0 },
    { c: "m", x: 0, y: 40, d: 0.25 },
    { c: "]", x: 60, y: -40, d: 0.5 },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="pre"
          className="fixed inset-0 z-[100] grid place-items-center bg-background text-foreground"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease }}
        >
          <motion.div
            className="flex flex-col items-center gap-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: soft }}
          >
            <div className="flex items-center gap-3">
              <span className="relative flex items-center text-4xl font-semibold leading-none tracking-tight" aria-hidden>
                {pieces.map((p) => (
                  <motion.span
                    key={p.c}
                    className="inline-block"
                    initial={{ x: p.x, y: p.y, opacity: 0, filter: "blur(6px)" }}
                    animate={{ x: 0, y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: p.d, duration: 0.9, ease: soft }}
                  >
                    {p.c}
                  </motion.span>
                ))}
                <motion.span
                  className="absolute -right-2 bottom-1 h-1.5 w-1.5 rounded-full bg-primary"
                  initial={{ x: 70, y: 30, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ delay: 0.75, duration: 0.9, ease: soft }}
                />
              </span>
              <motion.span
                className="ml-2 text-3xl font-light tracking-tight"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.7, ease: soft }}
              >
                meanwhile.
              </motion.span>
            </div>
            <div className="h-px w-40 overflow-hidden bg-border">
              <motion.div
                className="h-px w-full origin-left bg-foreground/70"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.1, duration: 2.3, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
