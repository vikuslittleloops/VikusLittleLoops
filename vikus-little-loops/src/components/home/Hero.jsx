import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { easeLux } from "@/lib/motion";

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

  useEffect(() => {
    const onMove = (e) =>
      setMouse({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <header className="relative grid min-h-screen place-items-center overflow-hidden px-6 pb-20 pt-32 text-center">
      {/* Animated blobs */}
      <div className="blob h-[420px] w-[420px] animate-blob bg-[radial-gradient(circle,#F8CDD6,transparent_70%)]" style={{ top: -80, left: -100 }} />
      <div className="blob h-[360px] w-[360px] animate-blob bg-[radial-gradient(circle,#E9E0F2,transparent_70%)]" style={{ top: "40%", right: -120, animationDelay: "-6s" }} />

      {/* Floating florals with parallax */}
      {florals.map((f, i) => (
        <motion.span
          key={i}
          className={`pointer-events-none absolute select-none opacity-60 ${f.c}`}
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
          Handmade Luxury · Crochet Atelier
        </motion.span>

        <h1 className="heading-display text-balance text-[clamp(2.6rem,7.2vw,5.8rem)] font-bold leading-[1.03]">
          <SplitText text="Handmade With Love," />
          <br />
          <SplitText text="Crafted Forever." className="italic font-medium text-blush-600" delay={0.4} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeLux, delay: 0.9 }}
          className="mx-auto mt-7 max-w-2xl font-serif text-[clamp(1.15rem,2.2vw,1.55rem)] text-ink-soft"
        >
          Beautiful handmade crochet accessories, stitched one loop at a time —
          designed to make every moment memorable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeLux, delay: 1.1 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Button to="/shop">Shop Collection</Button>
          <Button to="/about" variant="ghost">Explore Handmade</Button>
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
