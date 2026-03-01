"use client";

import { useState } from 'react';
import { JSX } from 'react';
import { TaxRequest, TaxResult } from '@/types/tax';
import { calculateTax } from '@/lib/api';

export function IncomeForm(): JSX.Element {

    const [grossIncome, setGrossIncome] = useState(0)
    const [filingStatus, setFilingStatus] = useState<TaxRequest["filing_status"]>("single")
    const [result, setResult] = useState<TaxResult | null>(null)

    async function handleSubmit(): Promise<void> {

    const request = {

        gross_income: grossIncome, 
        filing_status: filingStatus
    }

    const data = await calculateTax(request)
    setResult(data)
}

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
            <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl">
                <h1 className="text-2xl font-bold text-white mb-8">FiscalCore</h1>
           <input className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(Number(e.target.value))}
            />

            <select className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500" value={filingStatus}  onChange= {(e) => setFilingStatus(e.target.value as TaxRequest["filing_status"])}>
                <option value="single">Single</option>
                <option value="married_filing_jointly">Married Filing Jointly</option>
                <option value="married_filing_separately">Married Filing Separately</option>
                <option value="head_of_household">Head of Household</option>
            </select>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg p-3 mt-2 transition-colors" onClick={handleSubmit}> Calculate </button>

            {result && (
                <div className="mt-6 bg-gray-700 rounded-xl p-6 space-y-3">
                    <p className="text-gray-300 text-lg">
                        Total Tax: <span className="text-white font-bold"> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.total_tax)} </span>
                    </p>

                    <p className="text-gray-300 text-lg">
                        Effective Rate: <span className="text-white font-bold"> {(result.effective_rate * 100).toFixed(2)}% </span>
                    </p>

                    <p className="text-gray-300 text-lg">
                        Marginal Rate: <span className="text-white font-bold"> {(result.marginal_rate * 100).toFixed(2)}% </span>
                    </p>

                </div>
            )}

            </div>

        </div>

    )
};