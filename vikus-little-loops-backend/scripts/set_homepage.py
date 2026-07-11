"""Set the homepage hero + announcement bar to the current brand copy.

Run once against an existing database to push the new copy live:
    python -m scripts.set_homepage

(Afterwards you can keep editing everything from Admin → Homepage.)
"""
from app.core.database import Base, SessionLocal, engine
from app.models.content import HomepageSection

HERO = {
    "title": "Handcrafted with love.",
    "subtitle": (
        "Discover cozy, one-of-a-kind crochet creations stitched just for you. "
        "From my hands to your home, every package is thoughtfully crafted to "
        "brighten your day and beautifully packaged for an exceptional unboxing experience."
    ),
    "content": {
        "eyebrow": "Handmade Luxury · Crochet Atelier",
        "title_accent": "Delivered with Charm",
        "cta_primary": "Shop Our Creations",
        "cta_secondary": "Explore the Collection",
    },
}

MARQUEE_ITEMS = [
    "Handcrafted with love",
    "Custom orders welcome",
    "Beautifully packaged",
    "Smiles in every parcel",
    "Made just for you",
]


def upsert(db, key, **fields):
    section = db.query(HomepageSection).filter_by(key=key).first()
    if not section:
        section = HomepageSection(key=key, content={})
        db.add(section)
    for k, v in fields.items():
        setattr(section, k, v)


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        upsert(db, "hero", title=HERO["title"], subtitle=HERO["subtitle"], content=HERO["content"], is_active=True)
        upsert(db, "marquee", content={"items": MARQUEE_ITEMS}, is_active=True)
        db.commit()
        print("✓ Homepage hero + announcement bar updated.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
