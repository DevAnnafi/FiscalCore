import stripe
from fastapi import APIRouter, HTTPException, Cookie, Request
from app.core.database import SessionLocal
from app.core.config import settings
from app.models.user import User
from jose import jwt

router = APIRouter()

stripe.api_key = settings.stripe_secret_key

@router.post("/payments/checkout")
def create_checkout(access_token: str = Cookie(None)):
    if access_token is None:
        raise HTTPException(status_code=401)
    payload = jwt.decode(access_token, settings.secret_key, algorithms=[settings.algorithm])
    email = payload.get("sub")
    
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        mode="subscription",
        customer_email=email,
        line_items=[{
            "price_data": {
                "currency": "usd",
                "unit_amount": 1999,
                "recurring": {"interval": "month"},
                "product_data": {"name": "FiscalCore Pro"},
            },
            "quantity": 1,
        }],
        success_url="http://localhost:3000/dashboard?upgraded=true",
        cancel_url="http://localhost:3000/dashboard",
    )
    
    return {"url": session.url}

@router.post("/payments/webhook")
async def webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid webhook")
    
    if event["type"] == "checkout.session.completed":
        email = event["data"]["object"]["customer_email"]
        with SessionLocal() as db:
            user = db.query(User).filter(User.email == email).first()
            if user:
                user.plan = "pro"
                db.commit()
    
    return {"status": "ok"}