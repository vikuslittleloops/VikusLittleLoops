# Viku's Little Loops — Backend API

FastAPI + PostgreSQL + SQLAlchemy 2.0 + Alembic. JWT-authenticated admin, Cloudinary-ready, fully normalized schema.

## Quick start

```bash
# 1. Create & activate a virtualenv
python -m venv .venv
.venv\Scripts\activate         # Windows
# source .venv/bin/activate    # macOS/Linux

# 2. Install deps
pip install -r requirements.txt

# 3. Configure
copy .env.example .env          # then edit DATABASE_URL, SECRET_KEY, etc.

# 4. Create a PostgreSQL database named `vikus_loops`
#    (or change DATABASE_URL to match yours)

# 5. Create tables + sample data (quick path)
python -m scripts.seed

#    --- OR, the production path with migrations ---
alembic revision --autogenerate -m "init schema"
alembic upgrade head
python -m scripts.seed

# 6. Run the API
uvicorn app.main:app --reload
```

Open **http://localhost:8000/docs** for interactive Swagger docs.

Default admin (from `.env`): `admin@vikuslittleloops.com` / `ChangeMe123!`

## Project layout

```
app/
  core/        config (pydantic-settings), database (engine/session/Base), security (JWT + bcrypt)
  models/      SQLAlchemy ORM — all tables, normalized
    admin.py       Admin
    catalog.py     Category, SubCategory, Collection, Color, Size,
                   Product, ProductImage, ProductVariant, Inventory
    commerce.py    Customer, Cart, CartItem, Wishlist, Order, OrderItem, Coupon, CustomOrder
    content.py     Review, HomepageSection, FAQ, Policy, Newsletter
  schemas/     Pydantic v2 request/response models
  api/
    deps.py    get_current_admin (JWT)
    routes/    auth, products, catalog, misc
  main.py      FastAPI app + CORS + router wiring
alembic/       migrations
scripts/seed.py
```

## Auth

`POST /api/auth/login` (OAuth2 form: `username`=email, `password`) → `{ access_token }`.
Send `Authorization: Bearer <token>` on admin-only endpoints. `GET /api/auth/me` returns the current admin.

## Key endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/products` | public | List with filter/sort/search + pagination |
| GET | `/api/products/{slug}` | public | Product detail (images + variants) |
| POST/PATCH/DELETE | `/api/products[/{id}]` | admin | Manage products (+ images, variants, inventory) |
| GET/POST/PATCH/DELETE | `/api/categories` | mixed | Categories (auto-feeds nav/shop/filters) |
| GET/POST | `/api/subcategories`, `/api/collections`, `/api/colors`, `/api/sizes` | mixed | Catalog meta |
| GET/POST | `/api/reviews` | mixed | Product reviews (admin approval) |
| POST/GET | `/api/custom-orders` | mixed | Custom order intake (admin inbox) |
| POST | `/api/newsletter` | public | Subscribe |
| GET | `/api/coupons/validate` · POST `/api/coupons` | mixed | Coupons |
| GET/POST | `/api/faqs` · GET `/api/policies/{slug}` | mixed | Content |

## Tables (normalized)

Admins · Categories · SubCategories · Collections · Colors · Sizes · Products ·
ProductImages · ProductVariants · Inventory · Customers · Carts · CartItems ·
Wishlist · Coupons · Orders · OrderItems · CustomOrders · Reviews ·
HomepageSections · FAQs · Policies · Newsletter.

## Connect the frontend

In the frontend `.env`: `VITE_API_URL=http://localhost:8000/api`.
`src/lib/api.js` already targets this and attaches the JWT.

## Next

- Cloudinary upload endpoint (`/api/uploads`) using the `cloudinary` SDK already in requirements.
- Orders/checkout endpoints + customer auth (Customer model & JWT role already in place).
- Admin dashboard analytics endpoints (counts, revenue).
