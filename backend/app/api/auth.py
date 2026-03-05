from fastapi import APIRouter, HTTPException, status, Response
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token
from sqlalchemy.orm import Session
from pydantic import BaseModel


router = APIRouter()

class RegisterRequest(BaseModel):
    email:str
    password:str

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
            user = User(email=request.email, hashed_password=hash_password(request.password))
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
        token = create_access_token(data={"sub": user.email})
        response.set_cookie("access_token", token, httponly=True, secure=False, samesite="lax")
        return {
            "message" : "Login Successful"
        }
   
        
        