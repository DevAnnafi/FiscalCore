from fastapi import APIRouter, HTTPException, Cookie
from app.core.database import SessionLocal
from jose import jwt, JWTError
from app.core.config import settings
from datetime import datetime, timezone
from pydantic import BaseModel
from app.models.scenario import Scenario
from app.models.user import User

router = APIRouter()

class SaveScenarioRequest(BaseModel):
    name:str
    gross_income:float
    filing_status:str
    total_tax:float
    effective_rate:float
    marginal_rate:float

@router.get("/scenarios")
def scenarios(access_token: str = Cookie(None)):
    if access_token == None:
        raise HTTPException(status_code=400)
    payload = jwt.decode(access_token, settings.secret_key, algorithms=[settings.algorithm])
    email = payload.get("sub")
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).first()       
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        scenarios = db.query(Scenario).filter(Scenario.user_id == user.id).all()
        return scenarios

@router.post("/scenarios")
def save_scenarios(request:SaveScenarioRequest,access_token: str = Cookie(None)):
    payload = jwt.decode(access_token, settings.secret_key, algorithms=[settings.algorithm])
    email = payload.get("sub")
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).first()
        new_scenario = Scenario(
            user_id=user.id,
            name=request.name,
            gross_income=request.gross_income,
            filing_status=request.filing_status,
            total_tax=request.total_tax,
            effective_rate=request.effective_rate,
            marginal_rate=request.marginal_rate,
            created_at=datetime.now(timezone.utc)
        )
        db.add(new_scenario)
        db.commit()
        return {"message": "Scenario saved successfully"}
    
@router.delete('/scenarios/{id}')
def delete_scenario(id:int, access_token: str = Cookie(None)):
    payload = jwt.decode(access_token, settings.secret_key, algorithms=[settings.algorithm])
    email = payload.get("sub")
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).first()
        scenario = db.query(Scenario).filter(Scenario.id == id, Scenario.user_id == user.id).first()
        if scenario is None:
            raise HTTPException(status_code=404)
        else:
            db.delete(scenario)
            db.commit()



