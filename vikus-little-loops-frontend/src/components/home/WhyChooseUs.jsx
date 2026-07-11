import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeUp, stagger, reveal } from "@/lib/motion";
import { useHomepage } from "@/lib/hooks";

/* Defaults — overridden by whatever is saved in Admin → Site Content. */
const DEFAULTS = [
  {
    n: "01",
    title: "Handcrafted with Love",
    text: "Every single stitch is made with care and patience, ensuring you receive a premium, unique piece.",
    emoji: "🧶",
    gradient: "from-blush-100 to-peach",
    photos: [],
  },
  {
    n: "02",
    title: "Brought to Life for You",
    text: "Gladly accepting custom orders to match your exact vision.",
    emoji: "🎨",
    gradient: "from-mauve to-blush-200",
    photos: [],
  },
  {
    n: "03",
    title: "Smiles in Every Package",
    text: "Opening your order feels like receiving a warm hug.",
    emoji: "🎁",
    gradient: "from-lavender to-blush-100",
    photos: [],
  },
];

function ImageArea({ feature }) {
  const photos = feature.photos || [];
  if (photos.length === 0) {
    return (
      <div className={`relative grid h-56 place-items-center overflow-hidden rounded-xl2 bg-gradient-to-br ${feature.gradient}`}>
        <span className="text-6xl opacity-90">{feature.emoji}</span>
      </div>
    );
  }
  if (photos.length === 1) {
    return (
      <div className="h-56 overflow-hidden rounded-xl2">
        <img src={photos[0]} alt={feature.title} loading="lazy" className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div className="grid h-56 grid-cols-2 gap-2 overflow-hidden rounded-xl2">
      {photos.slice(0, 2).map((src, i) => (
        <img key={i} src={src} alt={feature.title} loading="lazy" className="h-full w-full object-cover" />
      ))}
    </div>
  );
}

export default function WhyChooseUs() {
  const { data: hp } = useHomepage();
  const saved = hp?.why_choose_us?.content?.items;

  const features = DEFAULTS.map((d, i) => ({
    ...d,
    ...(saved?.[i]?.title ? { title: saved[i].title } : {}),
    ...(saved?.[i]?.text ? { text: saved[i].text } : {}),
    photos: saved?.[i]?.photos?.length ? saved[i].photos : d.photos,
  }));

  return (
    <section className="container-lux py-24">
      <SectionHeading
        kicker="Why Choose Us"
        title="Made by hand, made for you"
        subtitle="Little touches that turn a purchase into a moment to remember."
      />

      <motion.div variants={stagger} {...reveal} className="grid gap-8 md:grid-cols-3">
        {features.map((f) => (
          <motion.article
            key={f.n}
            variants={fadeUp}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col overflow-hidden rounded-xl3 border border-blush-200/50 bg-ivory/70 p-5 shadow-soft"
          >
            <ImageArea feature={f} />
            <div className="px-2 pt-6">
              <span className="font-display text-sm tracking-[0.3em] text-blush-400">{f.n}</span>
              <h3 className="mt-2 font-display text-2xl font-medium">{f.title}</h3>
              <p className="mt-3 font-serif text-lg leading-relaxed text-ink-soft">{f.text}</p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
