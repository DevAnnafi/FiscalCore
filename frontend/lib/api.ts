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

export async function updateProfile(full_name: string, email: string) {
    const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ full_name, email }),
    });
    return res.json();
}

export async function updatePassword(current_password: string, new_password: string) {
    const res = await fetch(`${API_BASE}/profile/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ current_password, new_password }),
    });
    return res.json();
}

export async function deleteAccount() {
    const res = await fetch(`${API_BASE}/profile`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return res.json();
}

export async function getBilling() {
    const res = await fetch(`${API_BASE}/payments/billing`, {
        credentials: 'include',
    });
    return res.json();
}

export async function cancelSubscription() {
    const res = await fetch(`${API_BASE}/payments/cancel`, {
        method: 'POST',
        credentials: 'include',
    });
    return res.json();
}

export async function setupMFA() {
    const res = await fetch(`${API_BASE}/mfa/setup`, {
        method: 'POST',
        credentials: 'include',
    });
    return res.json();
}

export async function verifyMFA(code: string) {
    const res = await fetch(`${API_BASE}/mfa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code }),
    });
    return res.json();
}

export async function disableMFA() {
    const res = await fetch(`${API_BASE}/mfa`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return res.json();
}