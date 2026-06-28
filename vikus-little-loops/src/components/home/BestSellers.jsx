import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";
import { stagger, reveal } from "@/lib/motion";
import { products } from "@/data/products";

export default function BestSellers() {
  return (
    <section className="container-lux py-28">
      <SectionHeading
        kicker="Best Sellers"
        title="Loved a Little Extra"
        subtitle="The pieces our little community keeps coming back for."
      />
      <motion.div
        variants={stagger}
        {...reveal}
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </motion.div>
      <div className="mt-14 text-center">
        <Button to="/shop" variant="ghost">View All Products</Button>
      </div>
    </section>
  );
}
