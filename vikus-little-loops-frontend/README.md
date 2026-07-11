# Viku's Little Loops — Frontend

Handmade luxury crochet boutique. Pink-forward design system, built with React 19, Vite, Tailwind CSS, and Framer Motion.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173

> Requires Node 18+. Fonts load from Google Fonts (needs internet on first load).

## Stack

- **React 19** + **Vite** — fast SPA
- **Tailwind CSS** — pink luxury design tokens in `tailwind.config.js`
- **Framer Motion** — all animations (`src/lib/motion.js` for shared variants)
- **React Router** — routing with page transitions
- **React Query** + **Axios** — data layer (`src/lib/api.js`, wired for the FastAPI backend)
- **React Hook Form** + **Zod** — validated forms (newsletter, contact, custom order)
- **React Icons** — iconography

## Structure

```
src/
  components/
    layout/      Navbar, Footer
    home/        Hero, FeaturedCategories, BestSellers, Testimonials, Newsletter
    ui/          Button, ProductCard, SectionHeading, ScrollWidgets
  pages/         Home, Shop, Product, About, Contact, CustomOrder, NotFound
  data/          products.js  (mock data — mirrors future API shape)
  lib/           motion.js (variants), api.js (axios + JWT)
  index.css      Tailwind + base theme
```

## Pink palette

Defined in `tailwind.config.js` under `colors`: `blush` (primary scale), `rose`,
`peach`, `mauve`, `lavender`, `olive` (accent), `cream`/`ivory` (neutrals).

## What's done

- ✅ Pink luxury design system & tokens
- ✅ Animated homepage: preloader-free hero with letter-by-letter reveal, floating
  florals + mouse parallax, marquee, featured categories, best sellers, testimonials, newsletter
- ✅ Shop with live filter / sort / search
- ✅ Product detail with colour & size selectors + related products
- ✅ About (story timeline + maker), Contact (form + FAQ), Custom Order (full form)
- ✅ Animated 404, scroll progress, back-to-top, floating WhatsApp, page transitions

## Admin panel

Visit **`/admin`** (e.g. http://localhost:5173/admin). Log in with the backend admin
credentials (`admin@vikuslittleloops.com` / `ChangeMe123!` after seeding).

- Dark, enterprise-style dashboard with analytics cards + Recharts (revenue, order status)
- Product management — list, create/edit with **drag-and-drop Cloudinary image upload**,
  flags (featured / trending / best seller / new arrival), SEO fields
- Category & collection management (new categories auto-feed the storefront)
- Coupons, custom-order inbox (with status), orders, customers
- JWT auth via `src/admin/context/AuthContext.jsx`; admin lives under `src/admin/`

Requires the backend running with `VITE_API_URL` pointing at it.

## Next steps

1. **Backend** — FastAPI + PostgreSQL + SQLAlchemy + Alembic (the ~25-table schema).
2. **Cloudinary** — swap emoji placeholders for optimized product imagery.
3. **Admin panel** — dashboard, product/category/inventory management (JWT-protected).
4. **Cart & checkout**, wishlist persistence, reviews.

Wire `src/lib/api.js` to the backend and replace `src/data/products.js` usage with
React Query hooks — the data shapes already match.
