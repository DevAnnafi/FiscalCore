from app.domain.models import TaxInput, TaxResult
from app.domain.strategies.federal import FederalTaxStrategy


class TaxEngine:
    def __init__(self, federal_strategy: FederalTaxStrategy):
        self._federal = federal_strategy

    def calculate_federal(self, tax_input: TaxInput) -> TaxResult:
        return self._federal.calculate(tax_input)


def get_tax_engine() -> TaxEngine:
    return TaxEngine(federal_strategy=FederalTaxStrategy())
