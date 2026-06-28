// Currency in INR.
export const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

// Soft gradient fallback when a product has no image yet.
const GRADIENTS = [
  "from-blush-100 to-peach",
  "from-mauve to-blush-200",
  "from-peach to-blush-300",
  "from-rose-soft to-rose-gold",
  "from-lavender to-mauve",
  "from-blush-100 to-lavender",
];

const EMOJI = ["🌷", "🌸", "🧺", "💍", "🎀", "🎁"];

// Normalize an API product into the shape the storefront UI expects.
export function productView(p) {
  if (!p) return null;
  const price = Number(p.price);
  const hasDiscount = p.discount_percent > 0;
  const salePrice = hasDiscount ? Math.round(price * (1 - p.discount_percent / 100)) : price;
  const primary = p.images?.find((i) => i.is_primary) || p.images?.[0];
  const idx = (p.id || 0) % GRADIENTS.length;

  let badge = null;
  if (p.is_new_arrival) badge = "New";
  else if (p.is_best_seller) badge = "Bestseller";
  else if (p.is_trending) badge = "Trending";
  else if (hasDiscount) badge = `-${p.discount_percent}%`;

  return {
    ...p,
    image: primary?.url || null,
    emoji: p.category?.emoji || EMOJI[idx],
    gradient: GRADIENTS[idx],
    displayPrice: salePrice,
    oldPrice: hasDiscount ? price : null,
    discountBadge: hasDiscount ? `-${p.discount_percent}%` : null,
    badge,
    categoryName: p.category?.name || "Handmade",
  };
}
