import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import cap from "@/assets/site/ref-cap.jpg.asset.json";
import bag from "@/assets/site/ref-bag.jpg.asset.json";
import maskGlow from "@/assets/site/ref-mask-glow.jpg.asset.json";
import maskBlack from "@/assets/site/ref-masks-black.jpg.asset.json";
import maskWhite from "@/assets/site/ref-masks-white.jpg.asset.json";
import eyeBlue from "@/assets/site/ref-eye-blue.jpg.asset.json";
import turntable from "@/assets/site/ref-turntable.jpg.asset.json";
import bathroom from "@/assets/site/ref-bathroom.jpg.asset.json";
import billboard from "@/assets/site/ref-billboard.jpg.asset.json";

const rowA = [maskGlow, cap, eyeBlue, bathroom, maskBlack];
const rowB = [bag, turntable, maskWhite, eyeBlue, cap];

function Row({ items, from, to, tags }: { items: { url: string }[]; from: string; to: string; tags: string[] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={{ x }} className="flex w-max gap-3">
        {[...items, ...items].map((it, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 0.97, rotate: i % 2 ? 1 : -1 }}
            className="group relative h-[46vw] w-[38vw] shrink-0 overflow-hidden rounded-[24px] md:h-[22rem] md:w-[18rem]"
          >
            <img src={it.url} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
            <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-medium backdrop-blur">
              {tags[i % tags.length]}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Lookbook() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.82, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.5], [60, 28]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <section className="mt-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="mx-auto mb-10 flex max-w-7xl items-end justify-between px-5 md:px-8"
      >
        <h2 className="text-5xl font-semibold leading-[1] tracking-[-0.04em] md:text-7xl">
          The world <span className="text-foreground/25">of meanwhile.</span>
        </h2>
        <span className="hidden text-sm text-muted-foreground md:block">(Lookbook 2026)</span>
      </motion.div>
      <div className="space-y-3">
        <Row items={rowA} from="0%" to="-30%" tags={["Mask-01 [Glow]", "Merch", "360° Eye Cream", "Bathroom shelf", "Mask [Night]"]} />
        <Row items={rowB} from="-30%" to="0%" tags={["Travel kit", "Eye Cream · Studio", "Mask [Calm]", "Out in the sun", "Phase 02"]} />
      </div>
      <div ref={ref} className="mx-3 mt-16 md:mx-6">
        <motion.div style={{ scale, borderRadius: radius }} className="relative overflow-hidden">
          <motion.img style={{ y: imgY }} src={billboard.url} alt="meanwhile, it's working — street campaign" loading="lazy" className="h-[70vh] w-full scale-110 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-background md:bottom-10 md:left-10 md:right-10">
            <p className="max-w-xl text-4xl font-semibold leading-[1] tracking-[-0.04em] md:text-6xl">Precise care for every phase.</p>
            <span className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">meanwhile, it's working</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
