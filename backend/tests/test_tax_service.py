from app.domain.strategies.federal import FederalTaxStrategy
from app.domain.models import TaxInput
from app.services.tax_service import TaxService

def test_tax_service():
    strategy = FederalTaxStrategy()
    tax_input = TaxInput(gross_income=75000, filing_status="single")
    service = TaxService(strategy)
    result = service.calculate(tax_input)
    assert result.total_tax > 0