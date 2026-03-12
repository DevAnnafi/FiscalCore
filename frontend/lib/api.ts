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
   
export async function login(email:string, password:string){
    const options = {
        method : "POST",
        headers : {"Content-Type": "application/json"}, 
        body: JSON.stringify({email, password}),
        credentials : "include"
    } as RequestInit
    const response = await fetch("http://localhost:8000/api/v1/auth/login", options)
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
    const response = await fetch("http://localhost:8000/api/v1/auth/register", options)
    const data = await response.json()
    return data
}

export async function getMe() {
     const options = {
        method : "GET",
        credentials : "include"
    } as RequestInit
    const response = await fetch("http://localhost:8000/api/v1/auth/me", options)
    const data = await response.json()
    return data
}
    
export async function logout() {
     const options = {
        method : "POST",
        credentials : "include"
    } as RequestInit
    const response = await fetch("http://localhost:8000/api/v1/auth/logout", options)
    const data = await response.json()
    return data
}