import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, stagger, reveal } from "@/lib/motion";
import { categories } from "@/data/products";

export default function FeaturedCategories() {
  return (
    <section id="categories" className="container-lux py-28">
      <SectionHeading
        kicker="Featured Categories"
        title="Find Your Little Loop"
        subtitle="Handcrafted worlds — each piece made to order with soft, natural yarn."
      />
      <motion.div
        variants={stagger}
        {...reveal}
        className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
      >
        {categories.map((c) => (
          <motion.div key={c.id} variants={fadeUp}>
            <Link
              to={`/shop?category=${c.slug}`}
              className={`group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-xl2 bg-gradient-to-br ${c.gradient} p-8 text-ink shadow-soft transition-shadow duration-500 ease-lux hover:shadow-lift`}
            >
              <span className="absolute right-7 top-7 text-6xl opacity-90 transition-transform duration-700 ease-lux group-hover:-rotate-12 group-hover:scale-110">
                {c.emoji}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/15 to-transparent" />
              <div className="relative">
                <h3 className="font-display text-2xl font-medium">{c.name}</h3>
                <p className="mt-1 text-sm tracking-wide text-ink-soft">{c.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[0.74rem] uppercase tracking-[0.16em] text-blush-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  Explore →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
