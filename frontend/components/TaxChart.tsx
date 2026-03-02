import { BracketResult } from "@/types/tax"; 
import { JSX } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function TaxChart({ brackets }: { brackets: BracketResult[] }): JSX.Element 
{
    const data = brackets.map((bracket) => ({
        name:`${bracket.rate * 100}%`, 
        tax: bracket.tax_in_bracket
    }))

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tax" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
