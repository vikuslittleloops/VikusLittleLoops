import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Slideshow from "@/components/ui/Slideshow";
import { scaleIn, reveal } from "@/lib/motion";
import { useHomepage } from "@/lib/hooks";

/**
 * Admin-uploaded photo section below the hero.
 * Big rotating frame (1s) + thumbnails of the other photos.
 */
export default function GalleryStrip() {
  const { data: hp } = useHomepage();
  const photos = hp?.home_gallery?.content?.photos || [];

  if (!photos.length) return null;

  return (
    <section className="container-lux py-20">
      <SectionHeading kicker="Little Glimpses" title="Fresh from the Atelier" />
      <motion.div variants={scaleIn} {...reveal} className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <Slideshow
          photos={photos}
          interval={1000}
          className="aspect-[16/10] w-full rounded-xl3 shadow-lift md:aspect-auto md:min-h-[420px]"
        />
        <div className="hidden grid-rows-3 gap-4 md:grid">
          {photos.slice(0, 3).map((src, i) => (
            <div key={i} className="overflow-hidden rounded-xl2 shadow-soft">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
