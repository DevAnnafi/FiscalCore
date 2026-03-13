from fastapi import APIRouter, HTTPException, Cookie, UploadFile, File
from app.core.database import SessionLocal
from app.core.security import verify_password, hash_password
from app.core.config import settings
from app.models.user import User
from jose import jwt
from pydantic import BaseModel
import base64

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
    
@router.post("/profile/avatar")
async def update_avatar(file: UploadFile = File(...), access_token: str = Cookie(None)):
    if access_token is None:
        raise HTTPException(status_code=401)
    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 2MB")
    b64 = base64.b64encode(contents).decode()
    mime = file.content_type
    data_url = f"data:{mime};base64,{b64}"
    with SessionLocal() as db:
        user = get_user_from_token(access_token, db)
        user.avatar = data_url
        db.commit()
        return {"avatar": data_url}

@router.put("/profile/avatar/color")
def update_avatar_color(request: dict, access_token: str = Cookie(None)):
    if access_token is None:
        raise HTTPException(status_code=401)
    with SessionLocal() as db:
        user = get_user_from_token(access_token, db)
        user.avatar = request.get("color")
        db.commit()
        return {"avatar": user.avatar}