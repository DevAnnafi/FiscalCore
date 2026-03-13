from fastapi import APIRouter, Depends
import json
from sqlalchemy.orm import Session
from app.domain.models import TaxInput, TaxResult
from app.services.tax_engine import TaxEngine, get_tax_engine
from app.core.database import get_db
from app.models.user import User
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.post("/calculate/federal", response_model=TaxResult)
def calculate_federal_tax(
    tax_input: TaxInput,
    engine: TaxEngine = Depends(get_tax_engine),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaxResult:
    result = engine.calculate_federal(tax_input)
    current_user.last_result = json.dumps({
        **result.model_dump(),
        "filing_status": tax_input.filing_status
    })
    db.commit()
    return result


@router.get("/calculate/last")
def get_last_result(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not current_user.last_result:
        return {}
    return json.loads(current_user.last_result)