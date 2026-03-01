import { TaxRequest, TaxResult } from "@/types/tax";

export async function calculateTax(parameter: TaxRequest): 
Promise<TaxResult> {

    const options = {
        method : "POST", 
        headers : {"Content-Type": "application/json"}, 
        body: JSON.stringify(parameter)}
    const response = await fetch("http://localhost:8000/api/v1/calculate/federal", options)
    const data = await response.json()
    return data
}
   