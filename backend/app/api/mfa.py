from fastapi import APIRouter, HTTPException, Cookie
from app.core.database import SessionLocal
from app.core.config import settings
from app.models.user import User
from jose import jwt
from pydantic import BaseModel
import pyotp
import qrcode
import qrcode.image.svg
import io
import base64

router = APIRouter()

class VerifyMFARequest(BaseModel):
    code: str

def get_user_from_token(access_token: str, db):
    payload = jwt.decode(access_token, settings.secret_key, algorithms=[settings.algorithm])
    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/mfa/setup")
def setup_mfa(access_token: str = Cookie(None)):
    if access_token is None:
        raise HTTPException(status_code=401)
    with SessionLocal() as db:
        user = get_user_from_token(access_token, db)
        secret = pyotp.random_base32()
        user.mfa_secret = secret
        db.commit()
        totp = pyotp.TOTP(secret)
        uri = totp.provisioning_uri(name=user.email, issuer_name="FiscalCore")
        img = qrcode.make(uri)
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        qr_b64 = base64.b64encode(buf.getvalue()).decode()
        return {"secret": secret, "qr_code": f"data:image/png;base64,{qr_b64}"}

@router.post("/mfa/verify")
def verify_mfa(request: VerifyMFARequest, access_token: str = Cookie(None)):
    if access_token is None:
        raise HTTPException(status_code=401)
    with SessionLocal() as db:
        user = get_user_from_token(access_token, db)
        if not user.mfa_secret:
            raise HTTPException(status_code=400, detail="MFA not set up")
        totp = pyotp.TOTP(user.mfa_secret)
        if not totp.verify(request.code):
            raise HTTPException(status_code=400, detail="Invalid code")
        user.mfa_enabled = True
        db.commit()
        return {"message": "MFA enabled successfully"}

@router.delete("/mfa")
def disable_mfa(access_token: str = Cookie(None)):
    if access_token is None:
        raise HTTPException(status_code=401)
    with SessionLocal() as db:
        user = get_user_from_token(access_token, db)
        user.mfa_enabled = False
        user.mfa_secret = None
        db.commit()
        return {"message": "MFA disabled successfully"}