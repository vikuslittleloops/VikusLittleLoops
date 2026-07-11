import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, stagger, reveal } from "@/lib/motion";
import { testimonials as fallback } from "@/data/products";
import { useFeaturedReviews } from "@/lib/hooks";

export default function Testimonials() {
  const { data: reviews } = useFeaturedReviews(4);

  // Admin/customer reviews from the API when available, else the built-in ones.
  const items = reviews?.length
    ? reviews.map((r, i) => ({
        id: `r-${r.id}`,
        text: r.body || r.title || "",
        name: r.author_name,
        city: "★".repeat(r.rating),
        emoji: ["🌷", "🌸", "🧶", "🌼", "🎀", "✨"][i % 6],
        photo: r.photo_url,
      }))
    : fallback;

  return (
    <section className="container-lux py-28">
      <SectionHeading kicker="Loved By Many" title="Sweet Little Words" />
      <motion.div
        variants={stagger}
        {...reveal}
        className={`grid gap-7 md:grid-cols-2 ${items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
      >
        {items.map((t) => (
          <motion.div
            key={t.id}
            variants={fadeUp}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl2 border border-blush-200/50 bg-ivory/80 p-8 shadow-soft transition-shadow duration-500 hover:shadow-lift"
          >
            {t.photo && (
              <div className="mb-5 overflow-hidden rounded-xl2">
                <img src={t.photo} alt="" loading="lazy" className="h-44 w-full object-cover" />
              </div>
            )}
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
                <small className="text-blush-500">{t.city}</small>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
