import { useSyncExternalStore } from "react";

const KEY = "meanwhile.site.cart";
let items: string[] = (() => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
})();
const subs = new Set<() => void>();
const set = (next: string[]) => {
  items = next;
  localStorage.setItem(KEY, JSON.stringify(items));
  subs.forEach((f) => f());
};

export function useSiteCart() {
  const snap = useSyncExternalStore(
    (f) => { subs.add(f); return () => subs.delete(f); },
    () => items,
  );
  return { items: snap, add: (id: string) => set([...items, id]), clear: () => set([]) };
}
