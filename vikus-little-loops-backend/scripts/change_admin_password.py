"""Change an admin's password without touching any other data.

Usage:
    python -m scripts.change_admin_password <email> <new_password>

Example:
    python -m scripts.change_admin_password admin@vikuslittleloops.com "MyNewPass!"
"""
import sys

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.admin import Admin


def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    email, new_password = sys.argv[1], sys.argv[2]

    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.email == email).first()
        if not admin:
            print(f"No admin found with email: {email}")
            sys.exit(1)
        admin.hashed_password = hash_password(new_password)
        db.commit()
        print(f"Password updated for {email}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
