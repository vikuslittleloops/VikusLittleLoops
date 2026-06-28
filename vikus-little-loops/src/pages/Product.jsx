import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { fadeUp, stagger } from "@/lib/motion";
import { products } from "@/data/products";

const colors = ["#F2B0BF", "#E9E0F2", "#FBE0CF", "#94A06F", "#FFFBFB"];
const sizes = ["S", "M", "L"];

export default function Product() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug) || products[0];
  const [color, setColor] = useState(colors[0]);
  const [size, setSize] = useState("M");
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <main className="container-lux pb-28 pt-36">
      <Link to="/shop" className="text-sm text-ink-soft hover:text-blush-600">← Back to shop</Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`grid aspect-square place-items-center rounded-xl3 bg-gradient-to-br ${product.gradient} text-[9rem] shadow-soft`}
        >
          {product.emoji}
        </motion.div>

        {/* Details */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.p variants={fadeUp} className="text-[0.72rem] uppercase tracking-[0.2em] text-olive-deep">
            {product.category}
          </motion.p>
          <motion.h1 variants={fadeUp} className="heading-display mt-2 text-[clamp(2rem,4vw,3rem)]">
            {product.name}
          </motion.h1>
          <motion.div variants={fadeUp} className="mt-3 flex items-center gap-3">
            <span className="tracking-[0.2em] text-blush-400">{"★".repeat(product.rating)}</span>
            <span className="text-sm text-warmgray">({product.reviews} reviews)</span>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-5 font-serif text-3xl font-semibold">
            ₹{product.price}
            {product.oldPrice && <span className="ml-3 text-xl font-normal text-warmgray line-through">₹{product.oldPrice}</span>}
          </motion.div>

          <motion.p variants={fadeUp} className="mt-6 max-w-md font-serif text-lg text-ink-soft">
            Hand-stitched in small batches with soft natural cotton. Each piece is
            unique — made slowly, with love, just for you.
          </motion.p>

          {/* Color */}
          <motion.div variants={fadeUp} className="mt-7">
            <p className="text-sm font-medium">Colour</p>
            <div className="mt-2 flex gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ background: c }}
                  className={`h-9 w-9 rounded-full border transition-all ${color === c ? "ring-2 ring-blush-500 ring-offset-2" : "border-blush-200"}`}
                  aria-label={`Colour ${c}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Size */}
          <motion.div variants={fadeUp} className="mt-6">
            <p className="text-sm font-medium">Size</p>
            <div className="mt-2 flex gap-3">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-11 w-11 rounded-full text-sm transition-all ${size === s ? "bg-blush-500 text-white" : "border border-blush-300/60 bg-white/60"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="mt-9 flex items-center gap-4">
            <Button size="lg">Add to Cart</Button>
            <button className="grid h-14 w-14 place-items-center rounded-full border border-blush-300/60 bg-white/60 text-ink-soft transition-colors hover:text-blush-600">
              <FiHeart size={20} />
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 space-y-2 border-t border-blush-200/50 pt-6 font-serif text-base text-ink-soft">
            <p>🧶 Material: 100% natural cotton yarn</p>
            <p>🚚 Ships in 3–5 days · Free gift wrapping</p>
            <p>↩ Easy 7-day returns on ready-made pieces</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Related */}
      <section className="mt-28">
        <h2 className="heading-display mb-10 text-center text-[clamp(1.8rem,4vw,2.6rem)]">You May Also Love</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
