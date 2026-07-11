from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.core.database import get_db
from app.models.admin import Admin
from app.models.content import HomepageSection
from app.schemas.misc import HomepageSectionOut, HomepageSectionUpdate

router = APIRouter(tags=["homepage"])


@router.get("/homepage")
def get_homepage(db: Session = Depends(get_db)):
    """Public — returns active sections keyed by their `key` for easy consumption."""
    rows = db.scalars(
        select(HomepageSection).where(HomepageSection.is_active.is_(True)).order_by(HomepageSection.sort_order)
    ).all()
    return {
        r.key: {"title": r.title, "subtitle": r.subtitle, "content": r.content or {}}
        for r in rows
    }


@router.get("/admin/homepage", response_model=list[HomepageSectionOut])
def admin_homepage(db: Session = Depends(get_db), _: Admin = Depends(get_current_admin)):
    return db.scalars(select(HomepageSection).order_by(HomepageSection.sort_order)).all()


@router.put("/admin/homepage/{key}", response_model=HomepageSectionOut)
def upsert_section(
    key: str,
    payload: HomepageSectionUpdate,
    db: Session = Depends(get_db),
    _: Admin = Depends(get_current_admin),
):
    section = db.scalar(select(HomepageSection).where(HomepageSection.key == key))
    if not section:
        section = HomepageSection(key=key, content={})
        db.add(section)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(section, field, value)
    db.commit()
    db.refresh(section)
    return section
