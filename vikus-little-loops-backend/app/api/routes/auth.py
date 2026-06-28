from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.core.database import get_db
from app.core.security import create_access_token, verify_password
from app.models.admin import Admin
from app.schemas.auth import AdminOut, Token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Admin login. `username` field carries the email (OAuth2 form convention)."""
    admin = db.scalar(select(Admin).where(Admin.email == form.username))
    if not admin or not verify_password(form.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password"
        )
    if not admin.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")
    token = create_access_token(admin.id, extra={"role": "admin"})
    return Token(access_token=token)


@router.get("/me", response_model=AdminOut)
def me(current: Admin = Depends(get_current_admin)):
    return current
