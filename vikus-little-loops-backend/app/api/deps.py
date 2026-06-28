from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_token
from app.models.admin import Admin

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

_credentials_exc = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Admin:
    payload = decode_token(token)
    if not payload or payload.get("role") != "admin":
        raise _credentials_exc
    admin_id = payload.get("sub")
    if admin_id is None:
        raise _credentials_exc
    admin = db.get(Admin, int(admin_id))
    if not admin or not admin.is_active:
        raise _credentials_exc
    return admin
