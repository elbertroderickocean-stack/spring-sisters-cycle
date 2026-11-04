import { useEffect, useState } from "react";

/**
 * One-shot signal: true once the intro curtain is gone.
 * The hero reads it so its animation never plays hidden behind the preloader.
 */
export const INTRO_KEY = "meanwhile.site.loaded";

const listeners = new Set<() => void>();
let introDone =
  typeof window !== "undefined" && !!sessionStorage.getItem(INTRO_KEY);

export function markIntroDone() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* private mode: the curtain just stays gone for this session */
  }
  introDone = true;
  listeners.forEach((l) => l());
}

export function useIntroReady() {
  const [ready, setReady] = useState(introDone);

  useEffect(() => {
    if (introDone) {
      setReady(true);
      return;
    }
    const l = () => setReady(true);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return ready;
}
