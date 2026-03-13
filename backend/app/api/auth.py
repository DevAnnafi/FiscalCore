from fastapi import APIRouter, HTTPException, status, Response, Cookie, Depends
from app.core.database import SessionLocal, get_db
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token
from sqlalchemy.orm import Session
from pydantic import BaseModel
from jose import jwt, JWTError
from app.core.config import settings


router = APIRouter()

class RegisterRequest(BaseModel):
    email:str
    password:str
    full_name:str

class LoginRequest(BaseModel):
    email:str
    password:str


@router.post("/register")
def register_request(request: RegisterRequest):
    with SessionLocal() as db:
       result = db.query(User).filter(User.email == request.email).first()
       if result is not None:
            raise HTTPException(status_code=400, detail="Email already registered")
       else:       
            user = User(email=request.email, hashed_password=hash_password(request.password), full_name=request.full_name)
            db.add(user)
            db.commit()
            return {"message": "User created successfully"}

@router.post("/login")
def login_request(request: LoginRequest, response: Response):
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == request.email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="Email does not exist")
        elif not verify_password(request.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if user.mfa_enabled:
            temp_token = create_access_token(data={"sub": user.email, "mfa_pending": True})
            response.set_cookie("temp_token", temp_token, httponly=True, secure=False, samesite="lax")
            return {"mfa_required": True}
        token = create_access_token(data={"sub": user.email})
        response.set_cookie("access_token", token, httponly=True, secure=False, samesite="lax")
        return {"message": "Login Successful"}
   
@router.get("/me")
def get_me(access_token: str = Cookie(None)):
    if access_token == None:
        raise HTTPException(status_code=400)
    payload = jwt.decode(access_token, settings.secret_key, algorithms=[settings.algorithm])
    email = payload.get("sub")
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return {"email": user.email, "full_name": user.full_name, "plan": user.plan, "mfa_enabled": user.mfa_enabled, "avatar": user.avatar}


@router.post("/logout")
def logout(response: Response, access_token: str = Cookie(None)):
   response.delete_cookie("access_token")
   return {
       "message" : "Logged Out"
   }

def get_current_user(access_token: str = Cookie(None), db: Session = Depends(get_db)):
    if access_token is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(access_token, settings.secret_key, algorithms=[settings.algorithm])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user
    
    
    
    
        