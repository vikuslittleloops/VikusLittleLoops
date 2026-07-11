import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger, scaleIn, reveal } from "@/lib/motion";
import Button from "@/components/ui/Button";
import Seo from "@/components/Seo";
import { useHomepage } from "@/lib/hooks";

/* Fallback if no photos uploaded in admin yet: drop files in /public/creator/. */
const FALLBACK_PHOTOS = ["/creator/varnika-1.jpg", "/creator/varnika-2.jpg"];

const timeline = [
  { year: "2021", title: "The First Loop", text: "A quiet evening, a hook, and one ball of cotton — the very first little flower was born." },
  { year: "2023", title: "Sharing the Joy", text: "Friends asked for their own. The Instagram page bloomed, and so did the little loops." },
  { year: "2025", title: "A Tiny Atelier", text: "Hundreds of handmade pieces later, every order is still stitched slowly, with the same love." },
];

const process = [
  { icon: "🧶", title: "Choose the Yarn", text: "Soft, natural cotton in dreamy pastel tones." },
  { icon: "🪡", title: "Hand Crochet", text: "Every stitch made slowly, by hand — never rushed." },
  { icon: "🌸", title: "Finishing Touches", text: "Shaped, blocked, and detailed with quiet care." },
  { icon: "🎁", title: "Lovingly Packaged", text: "Wrapped for a warm, joyful unboxing." },
];

const florals = [
  { e: "🧶", c: "left-[6%] top-[22%] text-3xl" },
  { e: "🌷", c: "right-[8%] top-[18%] text-5xl" },
  { e: "🌸", c: "left-[12%] bottom-[14%] text-3xl" },
  { e: "🌼", c: "right-[12%] bottom-[20%] text-2xl" },
];

function CreatorImage({ src, className }) {
  const [err, setErr] = useState(false);
  if (err)
    return (
      <div className={`grid place-items-center bg-gradient-to-br from-blush-200 to-mauve text-5xl ${className}`}>
        🌷
      </div>
    );
  return (
    <img src={src} alt="The maker behind Viku's Little Loops" loading="lazy" onError={() => setErr(true)} className={className} />
  );
}

export default function About() {
  const { data: hp } = useHomepage();
  const uploaded = hp?.about_creator?.content?.photos;
  const photos = uploaded?.length ? uploaded : FALLBACK_PHOTOS;
  const gallery = hp?.about_gallery?.content?.photos || [];

  // Admin-editable texts (Admin → Site Content → About Page Texts)
  const texts = hp?.about_texts?.content || {};
  const journeyHeading = texts.journey_heading || "Loop by Loop";
  const creatorKicker = texts.creator_kicker || "Meet the Creator";
  const creatorHeading = texts.creator_heading || "Hello, lovely soul ✨";
  const creatorSignature = texts.creator_signature || "With love and gratitude,\nVarnika Agarwal 💗";
  const creatorParagraphs = texts.creator_body
    ? texts.creator_body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : null;

  return (
    <main>
      <Seo title="Our Story" description="From a single ball of yarn to a tiny atelier of handmade treasures — meet the maker behind Viku's Little Loops." />

      {/* ===== HERO ===== */}
      <header className="relative overflow-hidden px-4 pb-12 pt-28 text-center sm:px-6 sm:pb-16 sm:pt-40">
        <div className="blob h-[360px] w-[360px] animate-blob bg-[radial-gradient(circle,#F8CDD6,transparent_70%)]" style={{ top: -60, left: -80 }} />
        <div className="blob h-[320px] w-[320px] animate-blob bg-[radial-gradient(circle,#E9E0F2,transparent_70%)]" style={{ top: 40, right: -90, animationDelay: "-6s" }} />

        {florals.map((f, i) => (
          <motion.span
            key={i}
            className={`pointer-events-none absolute select-none opacity-60 ${f.c}`}
            animate={{ y: [0, -18, 0], rotate: [-6, 8, -6] }}
            transition={{ duration: 11 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {f.e}
          </motion.span>
        ))}

        <motion.div initial="hidden" animate="show" variants={stagger} className="relative">
          <motion.span variants={fadeUp} className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-blush-300/50 bg-white/60 px-5 py-2 text-[0.72rem] uppercase tracking-[0.25em] text-blush-700">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-olive" /> Our Story
          </motion.span>
          <motion.h1 variants={fadeUp} className="heading-display text-balance text-[clamp(2.8rem,7vw,5.4rem)] font-bold leading-[1.04]">
            A Little Loop
            <br />
            <span className="italic font-medium text-blush-600">of Love</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl font-serif text-[clamp(1.15rem,2.2vw,1.5rem)] text-ink-soft">
            From a single ball of yarn to a tiny atelier of handmade treasures —
            everything here is made by hand, one loop at a time.
          </motion.p>
        </motion.div>
      </header>

      <div className="container-lux">
        {/* ===== BRAND STORY INTRO ===== */}
        <motion.div variants={scaleIn} {...reveal} className="mx-auto max-w-3xl py-16 text-center">
          <span className="mx-auto block h-px w-16 bg-blush-300" />
          <p className="mt-8 font-serif text-2xl leading-relaxed text-ink md:text-3xl">
            Viku's Little Loops began as a quiet way to slow down — and turned into a
            cozy world of crochet made to be <span className="italic text-blush-600">treasured, gifted, and kept close</span> for years to come.
          </p>
          <span className="mx-auto mt-8 block h-px w-16 bg-blush-300" />
        </motion.div>

        {/* ===== MISSION / VISION ===== */}
        <div className="grid gap-7 py-10 md:grid-cols-2">
          {[
            { icon: "🌙", t: "Our Mission", d: "To bring a little handmade warmth into everyday moments — pieces that feel personal, gentle, and made just for you." },
            { icon: "✨", t: "Our Vision", d: "A world that slows down to cherish the handmade: imperfect, soulful, and stitched with intention." },
          ].map((b) => (
            <motion.div
              key={b.t}
              variants={fadeUp}
              {...reveal}
              whileHover={{ y: -8 }}
              className="rounded-xl3 border border-blush-200/50 bg-ivory/70 p-10 shadow-soft transition-shadow duration-500 hover:shadow-lift"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blush-100 to-peach text-2xl">{b.icon}</span>
              <h3 className="mt-5 font-display text-2xl">{b.t}</h3>
              <p className="mt-3 font-serif text-lg text-ink-soft">{b.d}</p>
            </motion.div>
          ))}
        </div>

        {/* ===== CRAFTING PROCESS ===== */}
        <section className="py-20">
          <div className="text-center">
            <span className="text-[0.72rem] uppercase tracking-[0.2em] text-olive-deep">How It's Made</span>
            <h2 className="heading-display mt-3 text-[clamp(2rem,4.4vw,3rem)]">The Crafting Process</h2>
          </div>
          <motion.div variants={stagger} {...reveal} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <motion.div key={p.title} variants={fadeUp} className="relative rounded-xl2 border border-blush-200/50 bg-ivory/60 p-7 text-center shadow-soft">
                <span className="absolute right-5 top-4 font-display text-3xl text-blush-200">0{i + 1}</span>
                <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-blush-100 to-lavender text-3xl">{p.icon}</span>
                <h3 className="mt-5 font-display text-xl">{p.title}</h3>
                <p className="mt-2 font-serif text-base text-ink-soft">{p.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ===== TIMELINE ===== */}
        <section className="py-16">
          <div className="text-center">
            <span className="text-[0.72rem] uppercase tracking-[0.2em] text-olive-deep">Crafting Journey</span>
            <h2 className="heading-display mt-3 text-[clamp(2rem,4.4vw,3rem)]">{journeyHeading}</h2>
          </div>
          <div className="relative mx-auto mt-14 max-w-2xl">
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-blush-400 to-transparent md:block" />
            <motion.div variants={stagger} {...reveal} className="space-y-10">
              {timeline.map((t, i) => (
                <motion.div key={t.year} variants={fadeUp} className={`relative md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-10" : "md:pr-10 md:text-right"}`}>
                  <div className="rounded-xl2 border border-blush-200/50 bg-ivory/80 p-6 shadow-soft sm:p-7">
                    <div className="font-display text-2xl font-semibold text-blush-600">{t.year}</div>
                    <h4 className="mt-1 font-display text-lg">{t.title}</h4>
                    <p className="mt-2 font-serif text-base text-ink-soft">{t.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===== PULL QUOTE ===== */}
        <motion.section variants={scaleIn} {...reveal} className="my-12 overflow-hidden rounded-xl3 bg-gradient-to-br from-blush-100 via-peach to-lavender px-6 py-14 text-center sm:my-16 sm:px-8 sm:py-20">
          <span className="font-display text-5xl leading-[0] text-white/70 sm:text-6xl">“</span>
          <p className="mx-auto mt-5 max-w-2xl font-serif text-xl italic leading-relaxed text-ink sm:mt-6 sm:text-3xl md:text-4xl">
            Every loop tells a quiet little story of patience and love.
          </p>
        </motion.section>

        {/* ===== MEET THE CREATOR ===== */}
        <section className="py-12 sm:py-16">
          <motion.div
            variants={fadeUp}
            {...reveal}
            className="grid items-center gap-8 rounded-xl3 border border-blush-200/50 bg-ivory/70 p-6 shadow-soft sm:gap-12 md:grid-cols-[0.85fr_1.15fr] md:p-14"
          >
            <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
              <CreatorImage src={photos[0]} className="aspect-[3/4] w-full rounded-xl3 object-cover shadow-soft" />
              {photos[1] && (
                <CreatorImage src={photos[1]} className="absolute -bottom-6 -right-4 hidden h-44 w-32 rounded-2xl border-4 border-cream object-cover shadow-lift sm:block" />
              )}
              <span className="absolute -left-4 -top-4 animate-float text-4xl">🌸</span>
            </div>

            <div>
              <span className="text-[0.72rem] uppercase tracking-[0.2em] text-olive-deep">{creatorKicker}</span>
              <h2 className="heading-display mt-3 text-2xl sm:text-3xl">{creatorHeading}</h2>
              <div className="mt-4 space-y-3.5 font-serif text-lg leading-relaxed text-ink-soft">
                {creatorParagraphs ? (
                  creatorParagraphs.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <>
                    <p>
                      Welcome to my cozy little corner of the internet — stitched together with love, cute
                      vibes, and a whole lot of yarn. I'm a physicist, artist, and empath at heart, happiest
                      when my hands are busy making something beautiful.
                    </p>
                    <p>
                      Crochet found me during my master's as a gentle escape — a way to make gifts for
                      friends that bloomed into a little shop of the cutest packages. For me it's about joy,
                      not just a product: every order is hand-packed in decorated paper, sealed with cute
                      stickers, and sprinkled with a little extra love.
                    </p>
                    <p>
                      Here you'll find my crochet goodies alongside my hand-drawn portraits. Thank you for
                      being here, and for letting me be a part of your story.
                    </p>
                  </>
                )}
                <p className="whitespace-pre-line font-serif text-lg italic text-blush-600">
                  {creatorSignature}
                </p>
              </div>
              <div className="mt-6"><Button to="/shop">Explore My Work</Button></div>
            </div>
          </motion.div>
        </section>

        {/* ===== GALLERY ===== */}
        {gallery.length > 0 && (
          <section className="py-16">
            <div className="text-center">
              <span className="text-[0.72rem] uppercase tracking-[0.2em] text-olive-deep">Little Moments</span>
              <h2 className="heading-display mt-3 text-[clamp(2rem,4.4vw,3rem)]">From the Atelier</h2>
            </div>
            <motion.div
              variants={stagger}
              {...reveal}
              className="mt-12 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4"
            >
              {gallery.map((src, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden rounded-xl2 shadow-soft"
                >
                  <img src={src} alt="" loading="lazy" className="w-full object-cover transition-transform duration-700 ease-lux hover:scale-105" />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* ===== CTA ===== */}
        <motion.section variants={fadeUp} {...reveal} className="py-20 text-center">
          <h2 className="heading-display text-[clamp(1.9rem,4vw,2.8rem)]">Ready to find your little loop?</h2>
          <p className="mx-auto mt-3 max-w-md font-serif text-xl text-ink-soft">Each piece is made to order, with love.</p>
          <div className="mt-7 flex justify-center gap-4">
            <Button to="/shop">Shop the Collection</Button>
            <Button to="/custom-order" variant="ghost">Request a Custom Piece</Button>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
