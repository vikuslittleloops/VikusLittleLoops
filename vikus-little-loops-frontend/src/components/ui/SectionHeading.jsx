import { motion } from "framer-motion";
import { fadeUp, reveal } from "@/lib/motion";

export default function SectionHeading({ kicker, title, subtitle, align = "center" }) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <motion.div
      variants={fadeUp}
      {...reveal}
      className={`mb-14 max-w-2xl ${alignment}`}
    >
      {kicker && (
        <span className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-olive-deep">
          {kicker}
        </span>
      )}
      <h2 className="heading-display mt-3 text-[clamp(2rem,4.4vw,3.2rem)] leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 font-serif text-xl text-ink-soft">{subtitle}</p>
      )}
    </motion.div>
  );
}
