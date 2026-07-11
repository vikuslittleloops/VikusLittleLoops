import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function ScrollWidgets() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-blush-500 to-olive"
      />

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/918979011405"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 left-6 z-[65] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-2xl text-white shadow-soft transition-transform duration-500 ease-lux hover:scale-110 hover:rotate-6"
      >
        <FaWhatsapp />
      </a>

      {/* Back to top */}
      <AnimatePresence>
        {show && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-[65] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blush-400 to-blush-600 text-lg text-white shadow-soft hover:shadow-lift"
          >
            <FiArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
