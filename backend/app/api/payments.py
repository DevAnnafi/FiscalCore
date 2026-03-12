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
        session_obj = event["data"]["object"]
        email = event["data"]["object"]["customer_email"]
        customer_id = session_obj.get("customer")
        with SessionLocal() as db:
            user = db.query(User).filter(User.email == email).first()
            if user:
                user.plan = "pro"
                user.stripe_customer_id = customer_id
                db.commit()
    
    return {"status": "ok"}

@router.get("/payments/billing")
def get_billing(access_token: str = Cookie(None)):
    if access_token is None:
        raise HTTPException(status_code=401)
    payload = jwt.decode(access_token, settings.secret_key, algorithms=[settings.algorithm])
    email = payload.get("sub")
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return {
            "plan": user.plan,
            "email": user.email,
        }

@router.post("/payments/cancel")
def cancel_subscription(access_token: str = Cookie(None)):
    if access_token is None:
        raise HTTPException(status_code=401)
    payload = jwt.decode(access_token, settings.secret_key, algorithms=[settings.algorithm])
    email = payload.get("sub")
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        if not user.stripe_customer_id:
            user.plan = "free"
            db.commit()
            return {"message": "Subscription cancelled successfully"}
        subscriptions = stripe.Subscription.list(customer=user.stripe_customer_id, limit=1)
        if subscriptions.data:
            stripe.Subscription.cancel(subscriptions.data[0].id)
        user.plan = "free"
        db.commit()
        return {"message": "Subscription cancelled successfully"}
        