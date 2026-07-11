import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { easeLux } from "@/lib/motion";
import { useHomepage } from "@/lib/hooks";

const florals = [
  { e: "🧶", c: "left-[7%] top-[18%] text-3xl" },
  { e: "🌷", c: "right-[9%] top-[22%] text-5xl" },
  { e: "🌸", c: "left-[12%] bottom-[20%] text-4xl" },
  { e: "🧶", c: "right-[13%] bottom-[26%] text-3xl" },
  { e: "🌼", c: "left-[4%] top-[48%] text-2xl" },
  { e: "🌷", c: "right-[5%] top-[54%] text-3xl" },
];

// Letter-by-letter reveal helper
function SplitText({ text, className = "", delay = 0 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden align-top">
          {[...word].map((ch, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              initial={{ y: "110%", opacity: 0, rotate: 8 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 1, ease: easeLux, delay: delay + (wi * 0.08 + ci * 0.03) }}
            >
              {ch}
            </motion.span>
          ))}
          {wi < text.split(" ").length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { data: hp } = useHomepage();
  const hero = hp?.hero || {};
  const hc = hero.content || {};
  const eyebrow = hc.eyebrow || "Handmade Luxury · Crochet Atelier";
  const titleLine = hero.title || "Handcrafted with love.";
  const titleAccent = hc.title_accent || "Delivered with Charm";
  const subtitle =
    hero.subtitle ||
    "Discover cozy, one-of-a-kind crochet creations stitched just for you. From my hands to your home, every package is thoughtfully crafted to brighten your day and beautifully packaged for an exceptional unboxing experience.";
  const ctaPrimary = hc.cta_primary || "Shop Our Creations";
  const ctaSecondary = hc.cta_secondary || "Explore the Collection";

  useEffect(() => {
    const onMove = (e) =>
      setMouse({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <header className="relative grid min-h-[100svh] place-items-center overflow-hidden px-4 pb-16 pt-24 text-center sm:px-6 sm:pt-32 sm:pb-20">
      {/* Animated blobs */}
      <div className="blob h-[420px] w-[420px] animate-blob bg-[radial-gradient(circle,#F8CDD6,transparent_70%)]" style={{ top: -80, left: -100 }} />
      <div className="blob h-[360px] w-[360px] animate-blob bg-[radial-gradient(circle,#E9E0F2,transparent_70%)]" style={{ top: "40%", right: -120, animationDelay: "-6s" }} />

      {/* Floating florals with parallax - hidden on small screens to avoid overlap */}
      {florals.map((f, i) => (
        <motion.span
          key={i}
          className={`pointer-events-none absolute hidden select-none opacity-60 sm:block ${f.c}`}
          style={{ x: mouse.x * ((i % 3) + 1) * 18, y: mouse.y * ((i % 3) + 1) * 18 }}
        >
          <motion.span
            className="inline-block"
            animate={{ y: [0, -22, 0], rotate: [-6, 8, -6] }}
            transition={{ duration: 12 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {f.e}
          </motion.span>
        </motion.span>
      ))}

      <div className="container-lux">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeLux }}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-blush-300/50 bg-white/60 px-5 py-2 text-[0.72rem] uppercase tracking-[0.25em] text-blush-700"
        >
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-olive" />
          {eyebrow}
        </motion.span>

        <h1 key={titleLine + titleAccent} className="heading-display text-balance text-[clamp(2.6rem,7.2vw,5.8rem)] font-bold leading-[1.03]">
          <SplitText text={titleLine} />
          <br />
          <SplitText text={titleAccent} className="italic font-medium text-blush-600" delay={0.4} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeLux, delay: 0.9 }}
          className="mx-auto mt-5 max-w-xl px-2 font-serif text-[clamp(1rem,2.2vw,1.45rem)] text-ink-soft sm:mt-7 sm:max-w-2xl sm:px-0 sm:text-[clamp(1.15rem,2.2vw,1.55rem)]"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeLux, delay: 1.1 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4"
        >
          <Button to="/shop" className="w-full max-w-xs sm:w-auto">{ctaPrimary}</Button>
          <Button to="/about" variant="ghost" className="w-full max-w-xs sm:w-auto">{ctaSecondary}</Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.66rem] uppercase tracking-[0.25em] text-warmgray"
      >
        <span className="flex h-9 w-6 justify-center rounded-full border border-warmgray/50 pt-2">
          <motion.span
            className="h-1.5 w-0.5 rounded-full bg-blush-600"
            animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: easeLux }}
          />
        </span>
        Scroll
      </motion.div>
    </header>
  );
}
