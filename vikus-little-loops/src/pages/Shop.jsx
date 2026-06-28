import { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import ProductCard from "@/components/ui/ProductCard";
import { stagger } from "@/lib/motion";
import { products, categories } from "@/data/products";

const sorts = ["Featured", "Newest", "Best Selling", "Price: Low", "Price: High"];

export default function Shop() {
  const [active, setActive] = useState("all");
  const [sort, setSort] = useState("Featured");
  const [query, setQuery] = useState("");

  let list = products.filter(
    (p) =>
      (active === "all" || p.category.toLowerCase().includes(active)) &&
      p.name.toLowerCase().includes(query.toLowerCase())
  );
  if (sort === "Price: Low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "Price: High") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "Newest") list = [...list].sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
  if (sort === "Best Selling") list = [...list].sort((a, b) => b.reviews - a.reviews);

  return (
    <main className="container-lux pb-28 pt-36">
      <header className="mb-12 text-center">
        <span className="text-[0.72rem] uppercase tracking-[0.2em] text-olive-deep">The Boutique</span>
        <h1 className="heading-display mt-3 text-[clamp(2.2rem,5vw,3.4rem)]">Shop All Handmade</h1>
      </header>

      {/* Toolbar */}
      <div className="mb-10 flex flex-col items-center justify-between gap-5 lg:flex-row">
        <div className="flex flex-wrap justify-center gap-2.5">
          <Chip label="All" value="all" active={active} set={setActive} />
          {categories.map((c) => (
            <Chip key={c.id} label={c.name} value={c.slug.split("-")[0]} active={active} set={setActive} />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-blush-300/50 bg-white/70 px-4 py-2.5">
            <FiSearch className="text-warmgray" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-32 bg-transparent text-sm outline-none placeholder:text-warmgray"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-blush-300/50 bg-white/70 px-4 py-2.5 text-sm outline-none"
          >
            {sorts.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-6xl">🧺</p>
          <p className="mt-4 font-serif text-2xl text-ink-soft">No little loops found here yet.</p>
        </div>
      ) : (
        <motion.div
          key={active + sort + query}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.div>
      )}
    </main>
  );
}

function Chip({ label, value, active, set }) {
  const on = active === value;
  return (
    <button
      onClick={() => set(value)}
      className={`rounded-full px-4 py-2 text-[0.78rem] tracking-wide transition-all duration-300 ${
        on
          ? "bg-blush-500 text-white shadow-soft"
          : "border border-blush-300/50 bg-white/60 text-ink-soft hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}
