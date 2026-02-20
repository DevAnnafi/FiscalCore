from typing import Optional
from pydantic import BaseModel  

class TaxInput(BaseModel):
    gross_income : float
    filing_status : str

class BracketResult(BaseModel):
    rate : float
    floor : float
    ceiling : None
    taxable_income_in_bracket : float
    tax_in_bracket : float

class TaxResult(BaseModel):
    taxable_income : float
    standard_deduction : float
    total_tax : float
    effective_rate : float
    marginal_rate : float
    brackets : list[BracketResult]