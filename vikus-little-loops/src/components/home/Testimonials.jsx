import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, stagger, reveal } from "@/lib/motion";
import { testimonials } from "@/data/products";

export default function Testimonials() {
  return (
    <section className="container-lux py-28">
      <SectionHeading kicker="Loved By Many" title="Sweet Little Words" />
      <motion.div
        variants={stagger}
        {...reveal}
        className="grid gap-7 md:grid-cols-3"
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.id}
            variants={fadeUp}
            className="rounded-xl2 border border-blush-200/50 bg-ivory/80 p-8 shadow-soft"
          >
            <span className="font-display text-5xl leading-[0.2] text-blush-400 opacity-50">
              &ldquo;
            </span>
            <p className="mt-5 font-serif text-lg text-ink-soft">{t.text}</p>
            <div className="mt-6 flex items-center gap-3.5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-blush-200 to-peach text-xl">
                {t.emoji}
              </span>
              <div>
                <b className="block font-display font-medium">{t.name}</b>
                <small className="text-warmgray">{t.city}</small>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
