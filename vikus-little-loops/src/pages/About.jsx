import { motion } from "framer-motion";
import { fadeUp, stagger, reveal } from "@/lib/motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

const timeline = [
  { year: "2021", title: "The First Loop", text: "A quiet evening, a hook, and one ball of cotton — the very first little flower was born." },
  { year: "2023", title: "Sharing the Joy", text: "Friends asked for their own. The Instagram page bloomed, and so did the little loops." },
  { year: "2025", title: "A Tiny Atelier", text: "Hundreds of handmade pieces later, every order is still stitched slowly, with the same love." },
];

export default function About() {
  return (
    <main className="container-lux pb-28 pt-36">
      <header className="mx-auto max-w-3xl text-center">
        <span className="text-[0.72rem] uppercase tracking-[0.2em] text-olive-deep">Our Story</span>
        <h1 className="heading-display mt-3 text-[clamp(2.4rem,5.5vw,4rem)]">A Little Loop of Love</h1>
        <p className="mx-auto mt-5 max-w-xl font-serif text-xl text-ink-soft">
          From a single ball of yarn to a tiny atelier of handmade treasures —
          everything here is made by hand, one loop at a time.
        </p>
      </header>

      {/* Mission / Vision */}
      <div className="mt-20 grid gap-7 md:grid-cols-2">
        {[
          { t: "Our Mission", d: "To bring a little handmade warmth into everyday moments — pieces that feel personal, gentle, and made just for you." },
          { t: "Our Vision", d: "A world that slows down to cherish the handmade: imperfect, soulful, and stitched with intention." },
        ].map((b) => (
          <motion.div key={b.t} variants={fadeUp} {...reveal} className="rounded-xl2 border border-blush-200/50 bg-ivory/80 p-10 shadow-soft">
            <h3 className="font-display text-2xl">{b.t}</h3>
            <p className="mt-3 font-serif text-lg text-ink-soft">{b.d}</p>
          </motion.div>
        ))}
      </div>

      {/* Timeline */}
      <section className="mt-28">
        <SectionHeading kicker="Crafting Journey" title="Loop by Loop" />
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-blush-400 to-transparent md:block" />
          <motion.div variants={stagger} {...reveal} className="space-y-12">
            {timeline.map((t, i) => (
              <motion.div key={t.year} variants={fadeUp} className={`relative md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-10" : "md:pr-10 md:text-right"}`}>
                <div className="rounded-xl2 border border-blush-200/50 bg-ivory/80 p-7 shadow-soft">
                  <div className="font-display text-2xl font-semibold text-blush-600">{t.year}</div>
                  <h4 className="mt-1 font-display text-lg">{t.title}</h4>
                  <p className="mt-2 font-serif text-base text-ink-soft">{t.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Maker */}
      <section className="mt-28 grid items-center gap-12 rounded-xl3 bg-gradient-to-br from-blush-100 to-lavender p-12 md:grid-cols-2 md:p-16">
        <div className="grid aspect-square max-w-sm place-items-center rounded-xl3 bg-white/50 text-[7rem] shadow-soft">👩‍🎨</div>
        <div>
          <span className="text-[0.72rem] uppercase tracking-[0.2em] text-olive-deep">Meet the Creator</span>
          <h2 className="heading-display mt-3 text-3xl">Hi, I'm Viku 🌷</h2>
          <p className="mt-4 font-serif text-lg text-ink-soft">
            Every piece you see is designed and crocheted by my own hands. What
            started as a calming hobby has grown into a little world I pour my
            heart into — and I'm so glad you're here.
          </p>
          <div className="mt-7"><Button to="/shop">Explore My Work</Button></div>
        </div>
      </section>
    </main>
  );
}
