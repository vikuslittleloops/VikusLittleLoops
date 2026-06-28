"""Import all models here so Alembic autogenerate & Base.metadata see them."""
from app.models.admin import Admin  # noqa: F401
from app.models.catalog import (  # noqa: F401
    Category,
    SubCategory,
    Collection,
    Color,
    Size,
    Product,
    ProductImage,
    ProductVariant,
    Inventory,
)
from app.models.commerce import (  # noqa: F401
    Customer,
    Cart,
    CartItem,
    Wishlist,
    Order,
    OrderItem,
    Coupon,
    CustomOrder,
)
from app.models.content import (  # noqa: F401
    Review,
    HomepageSection,
    FAQ,
    Policy,
    Newsletter,
)
