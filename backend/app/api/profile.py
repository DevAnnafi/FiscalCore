from fastapi import APIRouter, HTTPException, Cookie
from app.core.database import SessionLocal
from app.core.security import verify_password, hash_password
from app.core.config import settings
from app.models.user import User
from jose import jwt
from pydantic import BaseModel

router = APIRouter()

class UpdateProfileRequest(BaseModel):
    full_name: str
    email: str

class UpdatePasswordRequest(BaseModel):
    current_password: str
    new_password: str

def get_user_from_token(access_token: str, db):
    payload = jwt.decode(access_token, settings.secret_key, algorithms=[settings.algorithm])
    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.put("/profile")
def update_profile(request: UpdateProfileRequest, access_token: str = Cookie(None)):
    if access_token is None:
        raise HTTPException(status_code=401)
    with SessionLocal() as db:
        user = get_user_from_token(access_token, db)
        existing = db.query(User).filter(User.email == request.email).first()
        if existing and existing.id != user.id:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.full_name = request.full_name
        user.email = request.email
        db.commit()
        return {"message": "Profile updated successfully"}

@router.put("/profile/password")
def update_password(request: UpdatePasswordRequest, access_token: str = Cookie(None)):
    if access_token is None:
        raise HTTPException(status_code=401)
    with SessionLocal() as db:
        user = get_user_from_token(access_token, db)
        if not verify_password(request.current_password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        user.hashed_password = hash_password(request.new_password)
        db.commit()
        return {"message": "Password updated successfully"}

@router.delete("/profile")
def delete_account(access_token: str = Cookie(None)):
    if access_token is None:
        raise HTTPException(status_code=401)
    with SessionLocal() as db:
        user = get_user_from_token(access_token, db)
        db.delete(user)
        db.commit()
        return {"message": "Account deleted successfully"}