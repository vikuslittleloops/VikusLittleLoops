from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.core.database import get_db
from app.models.admin import Admin
from app.models.catalog import Category, Collection, Color, Size, SubCategory
from app.schemas.catalog import (
    CategoryCreate,
    CategoryOut,
    CategoryUpdate,
    CollectionCreate,
    CollectionOut,
    ColorCreate,
    ColorOut,
    SizeCreate,
    SizeOut,
    SubCategoryCreate,
    SubCategoryOut,
)

router = APIRouter(tags=["catalog"])


# ---------------- Categories ----------------
@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db), active_only: bool = True):
    stmt = select(Category).order_by(Category.sort_order, Category.name)
    if active_only:
        stmt = stmt.where(Category.is_active.is_(True))
    return db.scalars(stmt).all()


@router.post("/categories", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    if db.scalar(select(Category).where(Category.slug == payload.slug)):
        raise HTTPException(status_code=409, detail="Slug already exists")
    obj = Category(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.patch("/categories/{cid}", response_model=CategoryOut)
def update_category(cid: int, payload: CategoryUpdate, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    obj = db.get(Category, cid)
    if not obj:
        raise HTTPException(status_code=404, detail="Category not found")
    for f, v in payload.model_dump(exclude_unset=True).items():
        setattr(obj, f, v)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/categories/{cid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(cid: int, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    obj = db.get(Category, cid)
    if not obj:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(obj)
    db.commit()


# ---------------- SubCategories ----------------
@router.get("/subcategories", response_model=list[SubCategoryOut])
def list_subcategories(db: Session = Depends(get_db), category_id: int | None = None):
    stmt = select(SubCategory)
    if category_id:
        stmt = stmt.where(SubCategory.category_id == category_id)
    return db.scalars(stmt).all()


@router.post("/subcategories", response_model=SubCategoryOut, status_code=status.HTTP_201_CREATED)
def create_subcategory(payload: SubCategoryCreate, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    obj = SubCategory(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# ---------------- Collections ----------------
@router.get("/collections", response_model=list[CollectionOut])
def list_collections(db: Session = Depends(get_db)):
    return db.scalars(select(Collection)).all()


@router.post("/collections", response_model=CollectionOut, status_code=status.HTTP_201_CREATED)
def create_collection(payload: CollectionCreate, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    if db.scalar(select(Collection).where(Collection.slug == payload.slug)):
        raise HTTPException(status_code=409, detail="Slug already exists")
    obj = Collection(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# ---------------- Colors ----------------
@router.get("/colors", response_model=list[ColorOut])
def list_colors(db: Session = Depends(get_db)):
    return db.scalars(select(Color)).all()


@router.post("/colors", response_model=ColorOut, status_code=status.HTTP_201_CREATED)
def create_color(payload: ColorCreate, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    obj = Color(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# ---------------- Sizes ----------------
@router.get("/sizes", response_model=list[SizeOut])
def list_sizes(db: Session = Depends(get_db)):
    return db.scalars(select(Size).order_by(Size.sort_order)).all()


@router.post("/sizes", response_model=SizeOut, status_code=status.HTTP_201_CREATED)
def create_size(payload: SizeCreate, db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    obj = Size(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj
