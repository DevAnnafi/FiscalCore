import pytest
from app.domain.models import TaxInput
from app.services.tax_engine import get_tax_engine


def test_tax_engine():
    engine = get_tax_engine()
    tax_input = TaxInput(gross_income=80000, filing_status="single")
    result = engine.calculate_federal(tax_input)
    assert result.total_tax > 0
