from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from app.core.database import Base

class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    gross_income = Column(Float)
    filing_status = Column(String)
    total_tax = Column(Float)
    effective_rate = Column(Float)
    marginal_rate = Column(Float)
    created_at = Column(DateTime)
    name = Column(String)

