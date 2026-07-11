import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Slideshow from "@/components/ui/Slideshow";
import { scaleIn, reveal } from "@/lib/motion";
import { useHomepage } from "@/lib/hooks";

/**
 * Admin-uploaded photo section below the hero.
 * Compact 4:5 rotating frame with a small thumbnail row.
 */
export default function GalleryStrip() {
  const { data: hp } = useHomepage();
  const photos = hp?.home_gallery?.content?.photos || [];

  if (!photos.length) return null;

  return (
    <section className="container-lux py-20">
      <SectionHeading kicker="Little Glimpses" title="Fresh from the Atelier" />
      <motion.div variants={scaleIn} {...reveal} className="mx-auto max-w-[320px]">
        <Slideshow
          photos={photos}
          interval={1000}
          className="aspect-[4/5] w-full rounded-xl3 border border-blush-200/60 shadow-lift"
        />
      </motion.div>
      {photos.length > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {photos.slice(0, 5).map((src, i) => (
            <div key={i} className="h-20 w-20 overflow-hidden rounded-xl2 shadow-soft">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
