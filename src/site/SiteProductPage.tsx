import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import SiteLayout from "./SiteLayout";
import { getProduct, products } from "./products";
import { useSiteCart } from "./cart";
import { CartBar } from "./SiteShop";

export default function SiteProductPage() {
  const { id } = useParams();
  const p = getProduct(id);
  const { add } = useSiteCart();
  if (!p) return <SiteLayout><p className="pt-40 text-center">Product not found. <Link to="/shop" className="underline">Back to shop</Link></p></SiteLayout>;
  const related = products.filter((x) => x.collection === p.collection && x.id !== p.id).slice(0, 3);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-3 pt-24 md:px-6">
        <Link to="/shop" className="mb-4 inline-flex items-center gap-2 px-2 text-sm text-muted-foreground"><ArrowLeft size={14} /> Shop</Link>
        <div className="grid gap-3 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="glass-panel aspect-square overflow-hidden rounded-[32px]">
            {p.video ? (
              <video src={p.video} poster={p.image} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
            ) : (
              <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="glass-card flex flex-col rounded-[32px] p-8">
            <div className="flex justify-between text-sm text-muted-foreground"><span>{p.collection}</span><span>[m]</span></div>
            <h1 className="mt-6 text-5xl font-semibold leading-[1] tracking-[-0.04em]">{p.name}</h1>
            <p className="mt-4 text-lg">{p.tagline}</p>
            <p className="mt-4 text-muted-foreground">{p.description}</p>
            <div className="mt-8">
              {p.heroes.map((h, i) => (
                <p key={h} className={`text-3xl font-semibold tracking-tight ${i ? "text-foreground/20" : ""}`}>{i ? h : `(${h})`}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2 text-xs">
              <span className="glass-yellow rounded-full px-3 py-1.5 text-primary-foreground">{p.phase}</span>
              <span className="glass-badge rounded-full px-3 py-1.5">{p.size}</span>
            </div>
            <div className="mt-auto pt-10">
              <button onClick={() => add(p.id)} className="w-full rounded-2xl bg-foreground py-4 font-medium text-background">Add + · ${p.price}</button>
              <p className="mt-3 text-center text-xs text-muted-foreground">m.i. will schedule it into your framework automatically.</p>
            </div>
          </motion.div>
        </div>
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="px-2 text-3xl font-semibold tracking-tight">Also in {p.collection}</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} to={`/shop/${r.id}`} className="glass-card rounded-[28px] p-4">
                  <img src={r.image} alt={r.name} loading="lazy" className="aspect-square w-full rounded-[20px] object-cover" />
                  <div className="flex justify-between px-2 pt-4"><span className="font-semibold">{r.name}</span><span>${r.price}</span></div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
      <CartBar />
    </SiteLayout>
  );
}
