export interface TaxRequest {
    gross_income: number,
    filing_status: "single" | "married_filing_jointly" | "married_filing_separately" | "head_of_household"
}

export interface BracketResult {
    rate : number,
    floor : number,
    ceiling : number | null,
    taxable_income_in_bracket : number,
    tax_in_bracket : number
}

export interface TaxResult {
    taxable_income : number,
    standard_deduction : number,
    total_tax : number,
    effective_rate : number,
    marginal_rate : number,
    brackets : BracketResult[]
}