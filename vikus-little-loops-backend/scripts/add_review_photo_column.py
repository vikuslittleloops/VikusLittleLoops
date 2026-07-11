"""One-time migration: add photo_url column to the reviews table.

Safe to run multiple times (IF NOT EXISTS).

Usage (Railway console or locally):
    python -m scripts.add_review_photo_column
"""
from sqlalchemy import text

from app.core.database import engine


def main() -> None:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE reviews ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500)"))
        conn.commit()
    print("Done — reviews.photo_url column is in place.")


if __name__ == "__main__":
    main()
