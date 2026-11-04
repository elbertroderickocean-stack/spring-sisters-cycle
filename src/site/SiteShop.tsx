import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SiteLayout from "./SiteLayout";
import { products, collections, Collection } from "./products";
import { useSiteCart } from "./cart";

export default function SiteShop() {
  const [filter, setFilter] = useState<Collection | "All">("All");
  const { add } = useSiteCart();
  const list = filter === "All" ? products : products.filter((p) => p.collection === filter);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-5 pt-32 md:px-8">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-6xl font-semibold tracking-[-0.05em] md:text-8xl">
          Shop the system
        </motion.h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">Fewer bottles, better timing. Build from the Constants, adapt with the Shifts, accelerate with the Assets.</p>
        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {(["All", ...collections.map((c) => c.name)] as const).map((c) => (
            <button key={c} onClick={() => setFilter(c as Collection | "All")} className={`glass-badge whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${filter === c ? "glass-ink text-background" : ""}`}>
              {c}
            </button>
          ))}
        </div>
        <motion.div layout className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }} className="glass-card group flex flex-col rounded-[28px] p-4">
                <Link to={`/shop/${p.id}`} className="relative block aspect-square overflow-hidden rounded-[20px] bg-secondary/60">
                  {p.video ? (
                    <video src={p.video} poster={p.image} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
                  ) : (
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                  <span className="glass-badge absolute left-3 top-3 rounded-full px-3 py-1 text-xs">{p.collection}</span>
                </Link>
                <div className="flex flex-1 flex-col px-2 pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-lg font-semibold tracking-tight">{p.name}</p>
                    <p className="font-medium">${p.price}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{p.size} · {p.phase}</p>
                  <button onClick={() => add(p.id)} className="mt-4 rounded-2xl bg-foreground py-3 text-sm font-medium text-background transition-transform active:scale-[0.98]">
                    Add +
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
      <CartBar />
    </SiteLayout>
  );
}

export function CartBar() {
  const { items, clear } = useSiteCart();
  const count = items.length;
  const total = items.reduce((s, id) => s + (products.find((p) => p.id === id)?.price ?? 0), 0);
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed inset-x-3 bottom-4 z-50 mx-auto flex max-w-md items-center justify-between rounded-full bg-foreground py-2 pl-6 pr-2 text-background shadow-2xl">
          <span className="text-sm">{count} in portfolio · ${total}</span>
          <div className="flex gap-2">
            <button onClick={clear} className="px-3 text-xs opacity-60">Clear</button>
            <span className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Checkout soon</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
