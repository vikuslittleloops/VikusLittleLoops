from __future__ import annotations

from sqlalchemy import (
    Boolean,
    ForeignKey,
    Integer,
    JSON,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.mixins import TimestampMixin


class Category(Base, TimestampMixin):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(140), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(String(500))
    emoji: Mapped[str | None] = mapped_column(String(16))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    subcategories: Mapped[list["SubCategory"]] = relationship(
        back_populates="category", cascade="all, delete-orphan"
    )
    products: Mapped[list["Product"]] = relationship(back_populates="category")


class SubCategory(Base, TimestampMixin):
    __tablename__ = "subcategories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(140), unique=True, index=True, nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id", ondelete="CASCADE"))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    category: Mapped["Category"] = relationship(back_populates="subcategories")
    products: Mapped[list["Product"]] = relationship(back_populates="subcategory")


class Collection(Base, TimestampMixin):
    __tablename__ = "collections"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(140), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(String(500))
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    products: Mapped[list["Product"]] = relationship(back_populates="collection")


class Color(Base):
    __tablename__ = "colors"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(60), nullable=False)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    hex_code: Mapped[str | None] = mapped_column(String(9))

    variants: Mapped[list["ProductVariant"]] = relationship(back_populates="color")


class Size(Base):
    __tablename__ = "sizes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    label: Mapped[str | None] = mapped_column(String(60))
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    variants: Mapped[list["ProductVariant"]] = relationship(back_populates="size")


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True, nullable=False)
    short_description: Mapped[str | None] = mapped_column(String(400))
    long_description: Mapped[str | None] = mapped_column(Text)

    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    discount_percent: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    sku: Mapped[str | None] = mapped_column(String(80), unique=True, index=True)
    stock: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    category_id: Mapped[int | None] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"))
    subcategory_id: Mapped[int | None] = mapped_column(ForeignKey("subcategories.id", ondelete="SET NULL"))
    collection_id: Mapped[int | None] = mapped_column(ForeignKey("collections.id", ondelete="SET NULL"))

    tags: Mapped[list] = mapped_column(JSON, default=list)
    material: Mapped[str | None] = mapped_column(String(160))
    weight: Mapped[str | None] = mapped_column(String(60))
    dimensions: Mapped[str | None] = mapped_column(String(120))
    care_instructions: Mapped[str | None] = mapped_column(Text)

    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_trending: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_best_seller: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_new_arrival: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # SEO
    meta_title: Mapped[str | None] = mapped_column(String(200))
    meta_description: Mapped[str | None] = mapped_column(String(400))
    alt_text: Mapped[str | None] = mapped_column(String(200))

    category: Mapped["Category"] = relationship(back_populates="products")
    subcategory: Mapped["SubCategory"] = relationship(back_populates="products")
    collection: Mapped["Collection"] = relationship(back_populates="products")
    images: Mapped[list["ProductImage"]] = relationship(
        back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.sort_order"
    )
    variants: Mapped[list["ProductVariant"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )
    reviews: Mapped[list["Review"]] = relationship(back_populates="product", cascade="all, delete-orphan")  # type: ignore[name-defined]  # noqa: F821


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    public_id: Mapped[str | None] = mapped_column(String(255))  # Cloudinary public_id
    alt_text: Mapped[str | None] = mapped_column(String(200))
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    product: Mapped["Product"] = relationship(back_populates="images")


class ProductVariant(Base):
    __tablename__ = "product_variants"
    __table_args__ = (UniqueConstraint("product_id", "variant_name", name="uq_variant_name"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    # Human-readable name — e.g. "Red Rose Bag", "Pink Rose Bag"
    variant_name: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    # Free-text color label — e.g. "Dusty Rose", "Sage Green" (not tied to any Color table)
    color_label: Mapped[str | None] = mapped_column(String(80))
    # Optional variant-specific photo
    image_url: Mapped[str | None] = mapped_column(String(500))
    image_public_id: Mapped[str | None] = mapped_column(String(255))
    # Legacy FK fields (kept nullable for backwards compatibility)
    color_id: Mapped[int | None] = mapped_column(ForeignKey("colors.id", ondelete="SET NULL"))
    size_id: Mapped[int | None] = mapped_column(ForeignKey("sizes.id", ondelete="SET NULL"))
    sku: Mapped[str | None] = mapped_column(String(80), unique=True, index=True)
    price_override: Mapped[float | None] = mapped_column(Numeric(10, 2))

    product: Mapped["Product"] = relationship(back_populates="variants")
    color: Mapped["Color"] = relationship(back_populates="variants")
    size: Mapped["Size"] = relationship(back_populates="variants")
    inventory: Mapped["Inventory"] = relationship(
        back_populates="variant", cascade="all, delete-orphan", uselist=False
    )


class Inventory(Base, TimestampMixin):
    __tablename__ = "inventory"

    id: Mapped[int] = mapped_column(primary_key=True)
    variant_id: Mapped[int] = mapped_column(
        ForeignKey("product_variants.id", ondelete="CASCADE"), unique=True
    )
    quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    low_stock_threshold: Mapped[int] = mapped_column(Integer, default=3, nullable=False)

    variant: Mapped["ProductVariant"] = relationship(back_populates="inventory")
