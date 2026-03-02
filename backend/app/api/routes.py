from fastapi import APIRouter, Depends

from app.domain.models import TaxInput, TaxResult
from app.services.tax_engine import TaxEngine, get_tax_engine

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.post("/calculate/federal", response_model=TaxResult)
def calculate_federal_tax(
    tax_input: TaxInput,
    engine: TaxEngine = Depends(get_tax_engine),
) -> TaxResult:
    return engine.calculate_federal(tax_input)
