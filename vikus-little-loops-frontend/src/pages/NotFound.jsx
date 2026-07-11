import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-8xl"
        >
          🧶
        </motion.div>
        <h1 className="heading-display mt-6 text-[clamp(3rem,10vw,7rem)] leading-none">404</h1>
        <p className="mt-3 font-serif text-2xl text-ink-soft">
          This little loop unravelled somewhere.
        </p>
        <div className="mt-8"><Button to="/">Back Home</Button></div>
      </div>
    </main>
  );
}
