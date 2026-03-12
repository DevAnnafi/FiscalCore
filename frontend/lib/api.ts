import { TaxRequest, TaxResult } from "@/types/tax";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function calculateTax(parameter: TaxRequest): 
Promise<TaxResult> {

    const options = {
        method : "POST", 
        headers : {"Content-Type": "application/json"}, 
        body: JSON.stringify(parameter)}
    const response = await fetch(`${API_BASE}/calculate/federal`, options)
    const data = await response.json()
    return data
}
   
export async function login(email:string, password:string){
    const options = {
        method : "POST",
        headers : {"Content-Type": "application/json"}, 
        body: JSON.stringify({email, password}),
        credentials : "include"
    } as RequestInit
    const response = await fetch(`${API_BASE}/auth/login`, options)
    const data = await response.json()
    return data
}

export async function register(full_name:string, email:string, password:string) {
        const options = {
        method : "POST",
        headers : {"Content-Type": "application/json"}, 
        body: JSON.stringify({email, password, full_name}),
        credentials : "include"
    } as RequestInit
    const response = await fetch(`${API_BASE}/auth/register`, options)
    const data = await response.json()
    return data
}

export async function getMe() {
     const options = {
        method : "GET",
        credentials : "include"
    } as RequestInit
    const response = await fetch(`${API_BASE}/auth/me`, options)
    const data = await response.json()
    return data
}
    
export async function logout() {
     const options = {
        method : "POST",
        credentials : "include"
    } as RequestInit
    const response = await fetch(`${API_BASE}/auth/logout`, options)
    const data = await response.json()
    return data
}

export async function saveScenario(data: {
    name: string;
    gross_income: number;
    filing_status: string;
    total_tax: number;
    effective_rate: number;
    marginal_rate: number;
}) {
    const res = await fetch(`${API_BASE}/scenarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function getScenarios() {
    const res = await fetch(`${API_BASE}/scenarios`, {
        credentials: 'include',
    });
    return res.json();
}

export async function deleteScenario(id: number) {
    const res = await fetch(`${API_BASE}/scenarios/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return res.json();
}

export async function createCheckout() {
    const res = await fetch(`${API_BASE}/payments/checkout`, {
        method: 'POST',
        credentials: 'include',
    });
    return res.json();
}