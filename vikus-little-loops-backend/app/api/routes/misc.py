from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.core.database import get_db
from app.models.admin import Admin
from app.models.commerce import Coupon, CustomOrder
from app.models.content import FAQ, Newsletter, Policy, Review
from app.schemas.misc import (
    CouponCreate,
    CouponOut,
    CouponValidateOut,
    CustomOrderCreate,
    CustomOrderOut,
    FAQCreate,
    FAQOut,
    NewsletterIn,
    NewsletterOut,
    PolicyOut,
    ReviewCreate,
    ReviewOut,
)

router = APIRouter(tags=["misc"])


# ---------------- Reviews ----------------
@router.get("/reviews", response_model=list[ReviewOut])
def list_reviews(product_id: int, db: Session = Depends(get_db)):
    return db.scalars(
        select(Review)
        .where(Review.product_id == product_id, Review.is_approved.is_(True))
        .order_by(Review.created_at.desc())
    ).all()


@router.post("/reviews", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(payload: ReviewCreate, db: Session = Depends(get_db)):
    if not (1 <= payload.rating <= 5):
        raise HTTPException(status_code=422, detail="Rating must be 1–5")
    obj = Review(**payload.model_dump())  # awaits admin approval
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# ---------------- Custom orders ----------------
@router.post("/custom-orders", response_model=CustomOrderOut, status_code=status.HTTP_201_CREATED)
def submit_custom_order(payload: CustomOrderCreate, db: Session = Depends(get_db)):
    obj = CustomOrder(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    # TODO: notify admin (email / webhook)
    return obj


@router.get("/custom-orders", response_model=list[CustomOrderOut])
def list_custom_orders(db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    return db.scalars(select(CustomOrder).order_by(CustomOrder.created_at.desc())).all()


# ---------------- Newsletter ----------------
@router.post("/newsletter", response_model=NewsletterOut, status_code=status.HTTP_201_CREATED)
def subscribe(payload: NewsletterIn, db: Session = Depends(get_db)):
    existing = db.scalar(select(Newsletter).where(Newsletter.email == payload.email))
    if existing:
        existing.is_subscribed = True
        db.commit()
        db.refresh(existing)
        return existing
    obj = Newsletter(email=payload.email)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# ---------------- Coupons ----------------
@router.get("/coupons/validate", response_model=CouponValidateOut)
def validate_coupon(code: str, order_amount: float = 0, db: Session = Depends(get_db)):
    c = db.scalar(select(Coupon).where(Coupon.code == code.upper()))
    if not c or not c.is_active:
        return CouponValidateOut(valid=False, message="Invalid coupon")
    if c.expires_at and c.expires_at < datetime.now(timezone.utc):
        return CouponValidateOut(valid=False, message="Coupon expired")
    if c.usage_limit is not None and c.used_count >= c.usage_limit:
        return CouponValidateOut(valid=False, message="Coupon usage limit reached")
    if order_amount < float(c.min_order_amount):
        return CouponValidateOut(valid=False, message=f"Minimum order ₹{c.min_order_amount}")
    return CouponValidateOut(valid=True, message="Applied!", discount_type=c.discount_type, value=c.value)


@router.post("/coupons", response_model=CouponOut, status_code=status.HTTP_201_CREATED)
def create_coupon(payload: CouponCreate, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    data = payload.model_dump()
    data["code"] = data["code"].upper()
    obj = Coupon(**data)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# ---------------- FAQs / Policies ----------------
@router.get("/faqs", response_model=list[FAQOut])
def list_faqs(db: Session = Depends(get_db)):
    return db.scalars(
        select(FAQ).where(FAQ.is_active.is_(True)).order_by(FAQ.sort_order)
    ).all()


@router.post("/faqs", response_model=FAQOut, status_code=status.HTTP_201_CREATED)
def create_faq(payload: FAQCreate, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    obj = FAQ(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/policies/{slug}", response_model=PolicyOut)
def get_policy(slug: str, db: Session = Depends(get_db)):
    obj = db.scalar(select(Policy).where(Policy.slug == slug, Policy.is_active.is_(True)))
    if not obj:
        raise HTTPException(status_code=404, detail="Policy not found")
    return obj
