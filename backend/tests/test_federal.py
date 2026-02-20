import pytest
from app.domain.strategies.federal import FederalTaxStrategy
from app.domain.models import TaxInput

def test_income_below_standard_deduction():
    strategy = FederalTaxStrategy()
    tax_input = TaxInput(gross_income=10000, filing_status="single")
    result = strategy.calculate(tax_input)
    assert result.total_tax == 0
    assert result.effective_rate == 0
    assert result.marginal_rate == 0

def test_normal_income():
    strategy = FederalTaxStrategy()
    tax_input = TaxInput(gross_income=75000, filing_status="single")
    result = strategy.calculate(tax_input)
    assert result.total_tax > 0
    assert result.effective_rate < result.marginal_rate

def test_high_income():
    strategy = FederalTaxStrategy()
    tax_input = TaxInput(gross_income=700000, filing_status="single")
    result = strategy.calculate(tax_input)
    assert result.marginal_rate == 0.37

def test_bracket_count():
    strategy = FederalTaxStrategy()
    tax_input = TaxInput(gross_income=90000, filing_status="single")
    result = strategy.calculate(tax_input)
    assert len(result.brackets) == 3

