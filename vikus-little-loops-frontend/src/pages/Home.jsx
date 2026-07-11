import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BestSellers from "@/components/home/BestSellers";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import Seo from "@/components/Seo";
import { useHomepage } from "@/lib/hooks";

const DEFAULT_MARQUEE = [
  "Handmade in small batches",
  "Free gift wrapping",
  "Natural cotton yarn",
  "Custom orders welcome",
  "Stitched with love",
];

export default function Home() {
  const { data: hp } = useHomepage();
  const items = hp?.marquee?.content?.items?.length ? hp.marquee.content.items : DEFAULT_MARQUEE;

  return (
    <>
      <Seo
        title={null}
        description="Beautiful handmade crochet accessories designed to make every moment memorable. Tulips, sakura charms, hairbands, gift sets & more — handmade with love."
      />
      <Hero />

      {/* Marquee strip */}
      <div className="overflow-hidden whitespace-nowrap bg-ink py-4 text-cream">
        <div className="inline-flex animate-[scrollx_28s_linear_infinite] gap-12 font-serif text-xl tracking-wide">
          {[0, 1].map((k) => (
            <span key={k} className="inline-flex items-center gap-12">
              {items.map((t, i) => (
                <span key={i}>
                  <b className="font-normal text-blush-300">✿</b> {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <WhyChooseUs />
      <FeaturedCategories />
      <BestSellers />
      <Testimonials />
      <Newsletter />

      <style>{`@keyframes scrollx{to{transform:translateX(-50%)}}`}</style>
    </>
  );
}
