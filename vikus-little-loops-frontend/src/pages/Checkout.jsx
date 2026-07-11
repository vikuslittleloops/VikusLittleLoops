import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { FiCopy } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useToast } from "@/context/ToastContext";
import { inr } from "@/lib/format";
import { customerApi } from "@/lib/api";
import { UPI_ID, upiLink } from "@/lib/shopConfig";
import UpiQR from "@/components/UpiQR";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Valid email please"),
  phone: z.string().min(7, "Please enter a phone number"),
  address: z.string().min(5, "Please enter your address"),
  city: z.string().min(2, "City required"),
  state: z.string().optional(),
  pincode: z.string().optional(),
  coupon_code: z.string().optional(),
  notes: z.string().optional(),
});

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { customer, loading: authLoading } = useCustomerAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(null);
  const [error, setError] = useState("");
  const [payRef, setPayRef] = useState("");
  const [refSubmitted, setRefSubmitted] = useState(false);
  const [refBusy, setRefBusy] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
    },
  });

  if (placed) {
    const copyUpi = async () => {
      try {
        await navigator.clipboard.writeText(UPI_ID);
        toast("UPI ID copied 🌸");
      } catch {
        toast("Couldn't copy — please copy manually", "info");
      }
    };

    const submitRef = async () => {
      if (payRef.trim().length < 4) return;
      setRefBusy(true);
      try {
        await customerApi.post(`/orders/${placed.order_number}/payment`, { reference: payRef.trim() });
        setRefSubmitted(true);
        toast("Payment details received — we'll verify & confirm 🌸");
      } catch {
        toast("Couldn't submit, please try again", "info");
      } finally {
        setRefBusy(false);
      }
    };

    return (
      <main className="container-lux grid min-h-[70vh] place-items-center pt-36 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <FiCheckCircle className="mx-auto text-olive" size={64} />
          <h1 className="heading-display mt-5 text-4xl">Order placed! 🌷</h1>
          <p className="mt-3 font-serif text-xl text-ink-soft">
            Order <b className="text-blush-700">{placed.order_number}</b> — pending payment.
          </p>

          {refSubmitted ? (
            <div className="mt-7 rounded-xl3 border border-blush-200/50 bg-ivory/80 p-8 text-center shadow-soft">
              <p className="text-5xl">💗</p>
              <h2 className="heading-display mt-3 text-2xl">Payment under verification</h2>
              <p className="mt-2 font-serif text-base text-ink-soft">
                Thank you! We'll verify your payment and confirm your order shortly.
                You can track it in your account.
              </p>
            </div>
          ) : (
            <div className="mt-7 rounded-xl3 border border-blush-200/50 bg-ivory/80 p-7 text-left shadow-soft">
              <p className="text-center font-display text-lg">Pay via UPI to confirm</p>
              <p className="mt-1 text-center font-serif text-base text-ink-soft">
                Step 1 — scan the QR (or use the UPI ID) to pay <b className="text-ink">{inr(placed.total)}</b>.
              </p>

              <div className="mt-5">
                <UpiQR amount={placed.total} note={placed.order_number} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-blush-200/60 bg-white/70 px-4 py-3">
                <div>
                  <p className="text-[0.66rem] uppercase tracking-wide text-warmgray">UPI ID</p>
                  <p className="font-medium">{UPI_ID}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={copyUpi} className="flex items-center gap-1.5 rounded-full border border-blush-300/60 px-3 py-2 text-xs text-ink-soft hover:text-blush-600">
                    <FiCopy size={14} /> Copy
                  </button>
                  <a href={upiLink({ amount: placed.total, note: placed.order_number })} className="rounded-full border border-blush-300/60 px-3 py-2 text-xs text-ink-soft hover:text-blush-600">
                    Open UPI app
                  </a>
                </div>
              </div>

              {/* Step 2 — submit reference */}
              <p className="mt-6 text-center font-serif text-base text-ink-soft">
                Step 2 — after paying, enter your <b className="text-ink">UPI reference / UTR number</b> so we can verify it.
              </p>
              <input
                value={payRef}
                onChange={(e) => setPayRef(e.target.value)}
                placeholder="e.g. 12-digit UTR number"
                className="mt-3 w-full rounded-2xl border border-blush-300/50 bg-white/80 px-5 py-3.5 text-sm outline-none transition-shadow focus:border-blush-500 focus:shadow-glow"
              />
              <button
                onClick={submitRef}
                disabled={refBusy || payRef.trim().length < 4}
                className="mt-3 w-full rounded-full bg-gradient-to-br from-blush-400 to-blush-600 py-3.5 text-sm uppercase tracking-[0.12em] text-white transition hover:shadow-lift disabled:opacity-50"
              >
                {refBusy ? "Submitting…" : "I've Paid — Submit for Verification"}
              </button>
              <p className="mt-3 text-center text-xs text-warmgray">
                Your order is confirmed once we verify the payment. You can also submit this later from your account.
              </p>
            </div>
          )}

          <div className="mt-7"><Button to="/account">View My Orders</Button></div>
        </motion.div>
      </main>
    );
  }

  if (authLoading)
    return (
      <main className="grid min-h-[60vh] place-items-center pt-36">
        <span className="h-12 w-12 animate-spin rounded-full border-2 border-blush-300 border-t-blush-500" />
      </main>
    );

  if (items.length === 0)
    return (
      <main className="container-lux grid min-h-[60vh] place-items-center pt-36 text-center">
        <div>
          <p className="text-7xl">🛍️</p>
          <h1 className="heading-display mt-5 text-3xl">Nothing to check out yet</h1>
          <div className="mt-6"><Button to="/shop">Browse the Boutique</Button></div>
        </div>
      </main>
    );

  // Require an account before checkout.
  if (!customer)
    return (
      <main className="container-lux grid min-h-[60vh] place-items-center pt-36 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md rounded-xl3 border border-blush-200/50 bg-ivory/80 p-10 shadow-soft"
        >
          <p className="text-6xl">🔐</p>
          <h1 className="heading-display mt-5 text-3xl">Please sign in to checkout</h1>
          <p className="mt-3 font-serif text-lg text-ink-soft">
            Create an account or log in so we can save your order and let you track it anytime.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3">
            <Button
              to="/login"
              state={{ from: { pathname: "/checkout" } }}
              className="w-full justify-center"
            >
              Login / Create Account
            </Button>
            <Link to="/cart" className="text-sm text-ink-soft hover:text-blush-600">
              ← Back to cart
            </Link>
          </div>
          <p className="mt-5 text-xs text-warmgray">Your {items.length} item{items.length > 1 ? "s" : ""} will be waiting in your cart.</p>
        </motion.div>
      </main>
    );

  const onSubmit = async (form) => {
    setError("");
    try {
      const payload = {
        ...form,
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      };
      const { data } = await customerApi.post("/orders", payload);
      clear();
      setPlaced(data);
    } catch (e) {
      setError(e?.response?.data?.detail || "Could not place order. Please try again.");
    }
  };

  const field = "w-full rounded-2xl border border-blush-300/50 bg-white/80 px-5 py-3.5 text-sm outline-none transition-shadow focus:border-blush-500 focus:shadow-glow";

  return (
    <main className="container-lux pb-16 pt-28 sm:pb-28 sm:pt-36">
      <h1 className="heading-display mb-8 text-[clamp(2rem,5vw,3.2rem)] sm:mb-10">Checkout</h1>
      <div className="flex flex-col-reverse gap-8 lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <h3 className="font-display text-xl">Shipping details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name}><input className={field} {...register("name")} /></Field>
            <Field label="Email" error={errors.email}><input type="email" className={field} {...register("email")} /></Field>
            <Field label="Phone" error={errors.phone}><input className={field} {...register("phone")} /></Field>
            <Field label="Pincode"><input className={field} {...register("pincode")} /></Field>
          </div>
          <Field label="Address" error={errors.address}><textarea rows={2} className={field} {...register("address")} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" error={errors.city}><input className={field} {...register("city")} /></Field>
            <Field label="State"><input className={field} {...register("state")} /></Field>
          </div>
          <Field label="Coupon code (optional)"><input className={`${field} uppercase`} {...register("coupon_code")} /></Field>
          <Field label="Order notes (optional)"><textarea rows={2} className={field} {...register("notes")} /></Field>

          {error && <p className="text-sm text-blush-700">{error}</p>}

          <Button type="submit" size="lg" className={isSubmitting ? "pointer-events-none opacity-60" : ""}>
            {isSubmitting ? "Placing order…" : "Place Order"}
          </Button>
          <p className="text-xs text-ink-soft">
            Pay securely via <b>Razorpay</b> (cards, UPI, netbanking &amp; wallets) — or UPI — with a
            pay button shown right after you place your order. Confirmed once payment is received.
          </p>
        </form>

        {/* Summary */}
        <div className="h-fit rounded-xl2 border border-blush-200/50 bg-ivory/80 p-7 shadow-soft">
          <h3 className="font-display text-xl">Your Order</h3>
          <div className="mt-5 space-y-4">
            {items.map((i) => (
              <div key={i.product_id} className="flex items-center gap-3">
                <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-blush-100">
                  {i.image ? <img src={i.image} alt="" className="h-full w-full object-cover" /> : <span className="text-2xl">{i.emoji}</span>}
                </span>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-ink-soft">Qty {i.quantity}</p>
                </div>
                <span className="font-serif font-medium">{inr(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-blush-200/50 pt-5 text-ink-soft">
            <div className="flex justify-between"><span>Subtotal</span><span className="text-ink">{inr(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-olive-deep">Free</span></div>
            <div className="flex justify-between"><span>Payment</span><span className="text-ink">Razorpay / UPI</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-blush-200/50 pt-4 font-serif text-2xl font-semibold">
            <span>Total</span><span>{inr(subtotal)}</span>
          </div>
          <Link to="/cart" className="mt-4 block text-center text-sm text-ink-soft hover:text-blush-600">Edit cart</Link>
        </div>
      </div>
    </main>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-blush-700">{error.message}</p>}
    </div>
  );
}
