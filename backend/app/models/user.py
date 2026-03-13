from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False, unique=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime)
    full_name = Column(String, nullable=False)
    plan = Column(String, nullable=False, default="free")
    mfa_secret = Column(String, nullable=True)
    mfa_enabled = Column(Boolean, default=False)
    stripe_customer_id = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    last_result = Column(Text, nullable=True)