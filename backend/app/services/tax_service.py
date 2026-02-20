from app.domain.models import TaxInput, TaxResult

class TaxService():
    def __init__(self, strategy):
        self.strategy = strategy
    
    def calculate(self, tax_input):
        result = self.strategy.calculate(tax_input)
        return result