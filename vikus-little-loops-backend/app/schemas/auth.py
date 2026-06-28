from pydantic import BaseModel, ConfigDict, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminBase(BaseModel):
    name: str
    email: EmailStr


class AdminCreate(AdminBase):
    password: str
    is_superadmin: bool = False


class AdminOut(AdminBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    is_active: bool
    is_superadmin: bool
