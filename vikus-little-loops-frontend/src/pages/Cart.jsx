import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { inr } from "@/lib/format";

export default function Cart() {
  const { items, setQty, remove, subtotal } = useCart();

  if (items.length === 0)
    return (
      <main className="container-lux grid min-h-[60vh] place-items-center pt-36 text-center">
        <div>
          <p className="text-7xl">🛍️</p>
          <h1 className="heading-display mt-5 text-4xl">Your cart is empty</h1>
          <p className="mt-3 font-serif text-xl text-ink-soft">Let's find something handmade to love.</p>
          <div className="mt-7"><Button to="/shop">Browse the Boutique</Button></div>
        </div>
      </main>
    );

  return (
    <main className="container-lux pb-16 pt-28 sm:pb-28 sm:pt-36">
      <h1 className="heading-display mb-10 text-[clamp(2.2rem,5vw,3.2rem)]">Your Cart</h1>
      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          {items.map((i) => (
            <motion.div
              key={i.product_id}
              layout
              className="flex items-start gap-4 rounded-xl2 border border-blush-200/50 bg-ivory/70 p-4 shadow-soft sm:items-center sm:gap-5 sm:p-5"
            >
              <Link to={`/product/${i.slug}`} className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-blush-100 sm:h-24 sm:w-24">
                {i.image ? <img src={i.image} alt={i.name} className="h-full w-full object-cover" /> : <span className="text-3xl sm:text-4xl">{i.emoji}</span>}
              </Link>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/product/${i.slug}`} className="font-display text-base leading-snug sm:text-lg">{i.name}</Link>
                  <p className="shrink-0 font-serif text-base font-semibold sm:text-xl">{inr(i.price * i.quantity)}</p>
                </div>
                <p className="text-sm text-ink-soft">{inr(i.price)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-blush-300/60 bg-white/60">
                    <button onClick={() => setQty(i.product_id, i.quantity - 1)} className="flex h-9 w-9 items-center justify-center"><FiMinus size={14} /></button>
                    <span className="w-7 text-center text-sm">{i.quantity}</span>
                    <button onClick={() => setQty(i.product_id, i.quantity + 1)} className="flex h-9 w-9 items-center justify-center"><FiPlus size={14} /></button>
                  </div>
                  <button onClick={() => remove(i.product_id)} className="flex items-center gap-1.5 text-sm text-warmgray hover:text-blush-600">
                    <FiTrash2 size={15} /> Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-xl2 border border-blush-200/50 bg-ivory/80 p-7 shadow-soft">
          <h3 className="font-display text-xl">Order Summary</h3>
          <div className="mt-5 space-y-3 text-ink-soft">
            <div className="flex justify-between"><span>Subtotal</span><span className="text-ink">{inr(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-olive-deep">Free</span></div>
            <div className="flex justify-between"><span>Gift wrapping</span><span className="text-olive-deep">Included</span></div>
          </div>
          <div className="mt-5 flex justify-between border-t border-blush-200/50 pt-5 font-serif text-2xl font-semibold">
            <span>Total</span><span>{inr(subtotal)}</span>
          </div>
          <Button to="/checkout" className="mt-6 w-full justify-center">Proceed to Checkout</Button>
          <Link to="/shop" className="mt-3 block text-center text-sm text-ink-soft hover:text-blush-600">Continue shopping</Link>
        </div>
      </div>
    </main>
  );
}
