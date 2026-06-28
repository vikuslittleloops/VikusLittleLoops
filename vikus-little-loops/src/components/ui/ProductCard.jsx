import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { fadeUp } from "@/lib/motion";

export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false);
  const out = product.stock === 0;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -12 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-xl2 bg-ivory shadow-soft"
    >
      {/* Image / placeholder */}
      <Link to={`/product/${product.slug}`} className="block">
        <div className={`relative h-[300px] overflow-hidden bg-gradient-to-br ${product.gradient}`}>
          <div className="absolute inset-0 grid place-items-center text-[4.4rem] transition-transform duration-[1100ms] ease-lux group-hover:scale-110 group-hover:rotate-3">
            {product.emoji}
          </div>

          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute left-4 top-4 z-10 rounded-full px-3.5 py-1.5 text-[0.64rem] font-medium uppercase tracking-[0.12em] shadow-soft backdrop-blur ${
                product.badge.includes("%")
                  ? "bg-olive text-white"
                  : "bg-white/90 text-blush-700"
              }`}
            >
              {product.badge}
            </span>
          )}

          {/* Out of stock veil */}
          {out && (
            <span className="absolute right-4 top-4 z-10 rounded-full bg-ink/80 px-3 py-1.5 text-[0.62rem] uppercase tracking-widest text-white">
              Sold out
            </span>
          )}

          {/* Quick view */}
          <span className="absolute inset-x-4 bottom-4 z-10 translate-y-5 rounded-2xl bg-ink/90 py-3.5 text-center text-[0.74rem] uppercase tracking-[0.12em] text-white opacity-0 backdrop-blur transition-all duration-500 ease-lux group-hover:translate-y-0 group-hover:opacity-100 hover:bg-blush-600">
            Quick View
          </span>
        </div>
      </Link>

      {/* Wishlist */}
      <button
        onClick={() => setWished((w) => !w)}
        aria-label="Add to wishlist"
        className="absolute right-3.5 top-3.5 z-20 grid h-10 w-10 -translate-y-2 place-items-center rounded-full bg-white/90 text-warmgray opacity-0 shadow-soft backdrop-blur transition-all duration-500 ease-lux hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100"
      >
        <FiHeart
          className={wished ? "fill-blush-500 text-blush-500" : ""}
          size={18}
        />
      </button>

      {/* Info */}
      <div className="p-6">
        <p className="text-[0.68rem] uppercase tracking-[0.16em] text-olive-deep">
          {product.category}
        </p>
        <h3 className="mt-1.5 font-display text-xl font-medium">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="mt-2 text-[0.82rem] tracking-[0.2em] text-blush-400">
          {"★".repeat(product.rating)}
          {"☆".repeat(5 - product.rating)}
        </div>
        <div className="mt-2 font-serif text-2xl font-semibold">
          ₹{product.price}
          {product.oldPrice && (
            <span className="ml-2 text-base font-normal text-warmgray line-through">
              ₹{product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
