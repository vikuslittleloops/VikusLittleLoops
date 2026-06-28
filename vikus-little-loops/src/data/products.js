// Mock data — mirrors the future API response shape so swapping to the
// FastAPI backend later is a drop-in replacement (see src/lib/api.js).

export const categories = [
  { id: 1, name: "Tulips & Florals", slug: "tulips", emoji: "🌷", blurb: "Forever-blooming bouquets", gradient: "from-blush-200 to-peach" },
  { id: 2, name: "Sakura Collection", slug: "sakura", emoji: "🌸", blurb: "Soft cherry-blossom charm", gradient: "from-mauve to-blush-200" },
  { id: 3, name: "Rings & Bracelets", slug: "rings-bracelets", emoji: "💍", blurb: "Dainty everyday wear", gradient: "from-rose-soft to-rose-gold" },
  { id: 4, name: "Hairbands & Charms", slug: "hairbands", emoji: "🎀", blurb: "Little finishing touches", gradient: "from-lavender to-mauve" },
  { id: 5, name: "Bag Charms", slug: "bag-charms", emoji: "🧺", blurb: "Tiny companions for every bag", gradient: "from-peach to-blush-300" },
  { id: 6, name: "Gift Sets", slug: "gift-sets", emoji: "🎁", blurb: "Wrapped with love", gradient: "from-blush-100 to-lavender" },
];

export const products = [
  {
    id: 1, slug: "eternal-tulip-bouquet", name: "Eternal Tulip Bouquet",
    category: "Tulip Collection", price: 899, oldPrice: null,
    rating: 5, reviews: 42, emoji: "🌷", gradient: "from-blush-100 to-peach",
    badge: "New", stock: 8, bestSeller: false, trending: true, newArrival: true,
  },
  {
    id: 2, slug: "cherry-blossom-hairband", name: "Cherry Blossom Hairband",
    category: "Sakura Collection", price: 549, oldPrice: 689,
    rating: 5, reviews: 67, emoji: "🌸", gradient: "from-mauve to-blush-200",
    badge: "-20%", stock: 14, bestSeller: true, trending: false, newArrival: false,
  },
  {
    id: 3, slug: "daisy-bag-charm", name: "Daisy Bag Charm",
    category: "Bag Charms", price: 399, oldPrice: null,
    rating: 4, reviews: 31, emoji: "🧺", gradient: "from-peach to-blush-300",
    badge: "Bestseller", stock: 5, bestSeller: true, trending: false, newArrival: false,
  },
  {
    id: 4, slug: "daisy-loop-ring", name: "Daisy Loop Ring",
    category: "Rings", price: 299, oldPrice: null,
    rating: 5, reviews: 53, emoji: "💍", gradient: "from-rose-soft to-rose-gold",
    badge: "Trending", stock: 21, bestSeller: false, trending: true, newArrival: false,
  },
  {
    id: 5, slug: "lavender-bow-clip", name: "Lavender Bow Clip",
    category: "Hairbands", price: 349, oldPrice: 449,
    rating: 5, reviews: 28, emoji: "🎀", gradient: "from-lavender to-mauve",
    badge: "-22%", stock: 0, bestSeller: false, trending: false, newArrival: true,
  },
  {
    id: 6, slug: "mini-gift-set", name: "Little Loop Gift Set",
    category: "Gift Sets", price: 1299, oldPrice: null,
    rating: 5, reviews: 19, emoji: "🎁", gradient: "from-blush-100 to-lavender",
    badge: "Curated", stock: 6, bestSeller: true, trending: false, newArrival: true,
  },
];

export const testimonials = [
  { id: 1, name: "Ananya R.", city: "Bengaluru", emoji: "🌷", text: "The tulips are even prettier in person. They sit on my desk and never fail to make me smile." },
  { id: 2, name: "Meera S.", city: "Mumbai", emoji: "🌸", text: "Wrapped so beautifully it felt like a gift to myself. The craftsmanship is unreal." },
  { id: 3, name: "Riya K.", city: "Delhi", emoji: "🎀", text: "Ordered a custom charm for my bestie — she cried happy tears. Thank you for the magic." },
];
