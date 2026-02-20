from app.domain.models import TaxInput, BracketResult, TaxResult

stand_deduct = {
    "single" : 15750,
    "married_filing_jointly" : 31500,
    "married_filing_separately" : 15750,
    "head_of_household" : 23625
}

tax_brackets = {
    "single" : 
    [
        (0, 11925, 0.10),
        (11925, 48475, 0.12),
        (48475, 103350, 0.22),
        (103350, 197300, 0.24),
        (197300, 250525, 0.32),
        (250525, 626350, 0.35),
        (626350, None, 0.37)
    ],

    "married_filing_jointly" : 
    [
        (0, 23850, 0.10),
        (23850, 96950, 0.12),
        (96950, 206700, 0.22),
        (206700, 394600, 0.24),
        (394600, 501050, 0.32),
        (501050, 751600, 0.35),
        (751600, None, 0.37)
    ],

    "married_filing_separately" :
    [
        (0, 11925, 0.10),
        (11925, 48475, 0.12),
        (48475, 103350, 0.22),
        (103350, 197300, 0.24),
        (197300, 250525, 0.32),
        (250525, 626350, 0.35),
        (626350, None, 0.37)
    ],

    "head_of_household" :
    [
        (0, 17000, 0.10),
        (17000, 64850, 0.12),
        (64850, 103350, 0.22),
        (103350, 197300, 0.24),
        (197300, 250500, 0.32),
        (250500, 626350, 0.35),
        (626350, None, 0.37)
    ]
}

class FederalTaxStrategy():
    def get_brackets(self, filing_status):
        return tax_brackets[filing_status]

    def get_standard_deduction(self, filing_status):
        return stand_deduct[filing_status]

    def calculate(self, tax_input):
        taxable_income = tax_input.gross_income - self.get_standard_deduction(tax_input.filing_status)
        if taxable_income <= 0:
            effective_rate = 0 
            marginal_rate = 0 
            total_tax = 0
            return TaxResult(taxable_income=taxable_income, standard_deduction=self.get_standard_deduction(tax_input.filing_status), total_tax=total_tax, effective_rate=effective_rate, marginal_rate=marginal_rate, brackets=[])
        brackets = self.get_brackets(tax_input.filing_status)
        total_tax = 0
        total_brackets = []
        for floor, ceiling, rate in brackets:
            if ceiling is None:
                income_cap = taxable_income
            else:
                income_cap = min(taxable_income, ceiling) 

            if taxable_income <= floor:
                break

            income_in_bracket = income_cap - floor
            total_tax += income_in_bracket * rate

            bracket_result = BracketResult(rate=rate, floor=floor, ceiling=ceiling, taxable_income_in_bracket=income_in_bracket, tax_in_bracket=income_in_bracket * rate)
            total_brackets.append(bracket_result)

        effective_rate = (total_tax / taxable_income)
        marginal_rate = rate

        tax_result = TaxResult(taxable_income=taxable_income, standard_deduction=self.get_standard_deduction(tax_input.filing_status), total_tax=total_tax, effective_rate=effective_rate, marginal_rate=marginal_rate, brackets=total_brackets)
        return tax_result






