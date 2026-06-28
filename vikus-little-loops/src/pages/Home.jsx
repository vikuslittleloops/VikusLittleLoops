import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BestSellers from "@/components/home/BestSellers";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Marquee strip */}
      <div className="overflow-hidden whitespace-nowrap bg-ink py-4 text-cream">
        <div className="inline-flex animate-[scrollx_28s_linear_infinite] gap-12 font-serif text-xl tracking-wide">
          {[0, 1].map((k) => (
            <span key={k} className="inline-flex items-center gap-12">
              <span><b className="text-blush-300 font-normal">✿</b> Handmade in small batches</span>
              <span><b className="text-blush-300 font-normal">✿</b> Free gift wrapping</span>
              <span><b className="text-blush-300 font-normal">✿</b> Natural cotton yarn</span>
              <span><b className="text-blush-300 font-normal">✿</b> Custom orders welcome</span>
              <span><b className="text-blush-300 font-normal">✿</b> Stitched with love</span>
            </span>
          ))}
        </div>
      </div>

      <FeaturedCategories />
      <BestSellers />
      <Testimonials />
      <Newsletter />

      <style>{`@keyframes scrollx{to{transform:translateX(-50%)}}`}</style>
    </>
  );
}
