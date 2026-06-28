from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class CheckoutItem(BaseModel):
    product_id: int
    variant_id: int | None = None
    quantity: int = Field(ge=1, default=1)


class CheckoutRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    address: str
    city: str
    state: str | None = None
    pincode: str | None = None
    notes: str | None = None
    coupon_code: str | None = None
    items: list[CheckoutItem]


class OrderItemPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    product_name: str
    unit_price: Decimal
    quantity: int


class OrderPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    order_number: str
    status: str
    payment_status: str
    subtotal: Decimal
    discount_amount: Decimal
    shipping_amount: Decimal
    total: Decimal
    ship_name: str | None = None
    created_at: datetime
    items: list[OrderItemPublic] = []
