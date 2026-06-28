"""Seed the database with an admin + sample catalog data.

Usage (from backend root, with venv active and DB running):
    python -m scripts.seed
"""
from decimal import Decimal

from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models.admin import Admin
from app.models.catalog import (
    Category,
    Collection,
    Color,
    Inventory,
    Product,
    ProductImage,
    ProductVariant,
    Size,
)
from app.models.content import FAQ, HomepageSection, Policy

CATEGORIES = [
    ("Tulips & Florals", "tulips", "🌷"),
    ("Sakura Collection", "sakura", "🌸"),
    ("Rings & Bracelets", "rings-bracelets", "💍"),
    ("Hairbands & Charms", "hairbands", "🎀"),
    ("Bag Charms", "bag-charms", "🧺"),
    ("Gift Sets", "gift-sets", "🎁"),
]

COLORS = [
    ("Blush Pink", "blush-pink", "#F2B0BF"),
    ("Lavender", "lavender", "#E9E0F2"),
    ("Peach", "peach", "#FBE0CF"),
    ("Olive", "olive", "#94A06F"),
    ("Ivory", "ivory", "#FFFBFB"),
]

SIZES = [("Small", "S", 1), ("Medium", "M", 2), ("Large", "L", 3)]

PRODUCTS = [
    dict(name="Eternal Tulip Bouquet", slug="eternal-tulip-bouquet", price=Decimal("899"),
         short_description="A forever-blooming crochet bouquet.", cat="tulips",
         is_new_arrival=True, is_trending=True),
    dict(name="Cherry Blossom Hairband", slug="cherry-blossom-hairband", price=Decimal("689"),
         discount_percent=20, short_description="Soft sakura-pink hairband.", cat="sakura",
         is_best_seller=True),
    dict(name="Daisy Bag Charm", slug="daisy-bag-charm", price=Decimal("399"),
         short_description="A tiny daisy companion for your bag.", cat="bag-charms",
         is_best_seller=True),
    dict(name="Daisy Loop Ring", slug="daisy-loop-ring", price=Decimal("299"),
         short_description="Dainty everyday crochet ring.", cat="rings-bracelets",
         is_trending=True),
    dict(name="Lavender Bow Clip", slug="lavender-bow-clip", price=Decimal("449"),
         discount_percent=22, short_description="Pretty lavender bow clip.", cat="hairbands",
         is_new_arrival=True),
    dict(name="Little Loop Gift Set", slug="mini-gift-set", price=Decimal("1299"),
         short_description="A curated set, wrapped with love.", cat="gift-sets",
         is_best_seller=True, is_featured=True),
]


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Admin
        if not db.query(Admin).filter_by(email=settings.FIRST_ADMIN_EMAIL).first():
            db.add(Admin(
                name="Viku",
                email=settings.FIRST_ADMIN_EMAIL,
                hashed_password=hash_password(settings.FIRST_ADMIN_PASSWORD),
                is_active=True,
                is_superadmin=True,
            ))
            print(f"✓ Admin created: {settings.FIRST_ADMIN_EMAIL}")

        # Categories
        cat_map = {}
        for name, slug, emoji in CATEGORIES:
            cat = db.query(Category).filter_by(slug=slug).first()
            if not cat:
                cat = Category(name=name, slug=slug, emoji=emoji)
                db.add(cat)
                db.flush()
            cat_map[slug] = cat

        # Collection
        if not db.query(Collection).filter_by(slug="signature").first():
            db.add(Collection(name="Signature", slug="signature", is_featured=True))

        # Colors & sizes
        color_objs = []
        for name, slug, hexc in COLORS:
            c = db.query(Color).filter_by(slug=slug).first()
            if not c:
                c = Color(name=name, slug=slug, hex_code=hexc)
                db.add(c)
                db.flush()
            color_objs.append(c)

        size_objs = []
        for name, label, order in SIZES:
            s = db.query(Size).filter_by(name=name).first()
            if not s:
                s = Size(name=name, label=label, sort_order=order)
                db.add(s)
                db.flush()
            size_objs.append(s)

        # Products
        for p in PRODUCTS:
            if db.query(Product).filter_by(slug=p["slug"]).first():
                continue
            cat = cat_map[p["cat"]]
            product = Product(
                name=p["name"], slug=p["slug"], price=p["price"],
                discount_percent=p.get("discount_percent", 0),
                short_description=p.get("short_description"),
                long_description="Hand-stitched in small batches with soft natural cotton. "
                                 "Each piece is unique — made slowly, with love.",
                category_id=cat.id, stock=12, material="100% natural cotton yarn",
                care_instructions="Spot clean only. Keep away from moisture.",
                is_featured=p.get("is_featured", False),
                is_trending=p.get("is_trending", False),
                is_best_seller=p.get("is_best_seller", False),
                is_new_arrival=p.get("is_new_arrival", False),
                tags=["handmade", "crochet"],
                meta_title=p["name"], alt_text=p["name"],
            )
            db.add(product)
            db.flush()
            db.add(ProductImage(
                product_id=product.id,
                url="https://res.cloudinary.com/demo/image/upload/sample.jpg",
                is_primary=True, sort_order=0, alt_text=p["name"],
            ))
            # one variant per color (medium) with inventory
            for color in color_objs[:3]:
                v = ProductVariant(product_id=product.id, color_id=color.id, size_id=size_objs[1].id)
                db.add(v)
                db.flush()
                db.add(Inventory(variant_id=v.id, quantity=4))

        # Homepage sections
        for key, title in [("hero", "Handmade With Love, Crafted Forever."),
                           ("best_sellers", "Loved a Little Extra"),
                           ("instagram", "From the Atelier")]:
            if not db.query(HomepageSection).filter_by(key=key).first():
                db.add(HomepageSection(key=key, title=title, content={}))

        # Policies & FAQs
        if not db.query(Policy).filter_by(slug="shipping").first():
            db.add(Policy(slug="shipping", title="Shipping",
                          body="Orders ship in 3–5 days with free gift wrapping."))
        if not db.query(Policy).filter_by(slug="returns").first():
            db.add(Policy(slug="returns", title="Returns",
                          body="Easy 7-day returns on ready-made pieces."))
        if db.query(FAQ).count() == 0:
            db.add_all([
                FAQ(question="How long does a custom order take?",
                    answer="Usually 1–2 weeks depending on complexity.", sort_order=1),
                FAQ(question="Do you ship worldwide?",
                    answer="Yes! Shipping is calculated at checkout.", sort_order=2),
            ])

        db.commit()
        print("✓ Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
