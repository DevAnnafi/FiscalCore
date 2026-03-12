'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, logout, calculateTax } from '@/lib/api';
import { TaxRequest, TaxResult } from '@/types/tax';
import jsPDF from 'jspdf';

export default function Dashboard() {
    const [user, setUser] = useState<{ email: string; full_name: string; plan: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [grossIncome, setGrossIncome] = useState<number>(0);
    const [filingStatus, setFilingStatus] = useState<TaxRequest['filing_status']>('single');
    const [result, setResult] = useState<TaxResult | null>(null);
    const [calculating, setCalculating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const data = await getMe();
                setUser(data);
            } catch {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    async function handleSignOut(): Promise<void> {
        await logout();
        router.push('/login');
    }

    async function handleCalculate() {
        setCalculating(true);
        try {
            const data = await calculateTax({ gross_income: grossIncome, filing_status: filingStatus });
            setResult(data);
        } finally {
            setCalculating(false);
        }
    }

    function formatCurrency(n: number) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
    }

    function handleDownloadReport() {
        if (!result || !user) return;

        const filingLabel: Record<string, string> = {
            single: 'Single',
            married_filing_jointly: 'Married Filing Jointly',
            married_filing_separately: 'Married Filing Separately',
            head_of_household: 'Head of Household',
        };

        const lines = [
            '='.repeat(60),
            '           FISCALCORE TAX REPORT — 2025',
            '='.repeat(60),
            '',
            `Name:               ${user.full_name}`,
            `Email:              ${user.email}`,
            `Generated:          ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
            '',
            '-'.repeat(60),
            'INCOME DETAILS',
            '-'.repeat(60),
            `Gross Income:       ${formatCurrency(grossIncome)}`,
            `Filing Status:      ${filingLabel[filingStatus]}`,
            `Standard Deduction: ${formatCurrency(result.standard_deduction)}`,
            `Taxable Income:     ${formatCurrency(result.taxable_income)}`,
            '',
            '-'.repeat(60),
            'TAX SUMMARY',
            '-'.repeat(60),
            `Total Federal Tax:  ${formatCurrency(result.total_tax)}`,
            `Effective Rate:     ${(result.effective_rate * 100).toFixed(2)}%`,
            `Marginal Rate:      ${(result.marginal_rate * 100).toFixed(0)}%`,
            '',
            '-'.repeat(60),
            'BRACKET BREAKDOWN',
            '-'.repeat(60),
            ...result.brackets.map((b, i) =>
                `Bracket ${i + 1} (${(b.rate * 100).toFixed(0)}%): ${formatCurrency(b.taxable_income_in_bracket)} taxable → ${formatCurrency(b.tax_in_bracket)} tax`
            ),
            '',
            '='.repeat(60),
            'This report is for estimation purposes only.',
            'Consult a tax professional for official advice.',
            '='.repeat(60),
        ];

        const doc = new jsPDF()
        doc.setFontSize(10)
        doc.setFont('courier', 'normal')

        let y = 20
        lines.forEach((line) => {
            if (y > 280) {
                doc.addPage()
                y = 20
            }
            doc.text(line, 20, y)
            y += 6
        })

        doc.save(`fiscalcore-report-${new Date().getFullYear()}.pdf`)
    }

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="flex items-center gap-2">
                {[0, 150, 300].map((delay) => (
                    <div key={delay} className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-x-hidden">

            {/* Background glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-bold tracking-tight text-white text-lg">FiscalCore</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-200">{user?.full_name}</p>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                        <button onClick={handleSignOut} className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 rounded-lg hover:text-red-400 hover:bg-red-400/10 transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            <span className="hidden sm:block">Sign out</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-8">

                {/* Header */}
                <header>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-2">
                                Welcome back, {user?.full_name?.split(' ')[0]}.
                            </h1>
                            <p className="text-slate-400 text-base sm:text-lg">
                                Calculate your estimated federal tax liability for 2025.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-900/50 py-1.5 px-3 rounded-full border border-white/5 w-fit">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Tax year 2025 active
                        </div>
                    </div>
                </header>

                {/* Income Details Card */}
                <div className="bg-slate-900/40 border border-white/5 backdrop-blur-md rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50 flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-white tracking-tight">Income Details</h2>
                    </div>
                    <div className="p-6 sm:p-8 space-y-6">
                        {/* Filing status */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">Filing Status</label>
                            <div className="flex flex-wrap gap-2">
                                {(['single', 'married_filing_jointly', 'married_filing_separately', 'head_of_household'] as TaxRequest['filing_status'][]).map((status) => {
                                    const labels: Record<string, string> = {
                                        single: 'Single',
                                        married_filing_jointly: 'Married Jointly',
                                        married_filing_separately: 'Married Separately',
                                        head_of_household: 'Head of Household',
                                    };
                                    return (
                                        <button
                                            key={status}
                                            onClick={() => setFilingStatus(status)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                filingStatus === status
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                                            }`}
                                        >
                                            {labels[status]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Gross income */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Gross Annual Income</label>
                            <div className="relative group max-w-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-slate-500 font-medium text-lg group-focus-within:text-indigo-400 transition-colors">$</span>
                                </div>
                                <input
                                    type="number"
                                    value={grossIncome || ''}
                                    onChange={(e) => setGrossIncome(Number(e.target.value))}
                                    placeholder="0.00"
                                    className="block w-full pl-8 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-lg font-medium"
                                />
                            </div>
                        </div>

                        {/* Calculate button */}
                        <div className="pt-2 flex justify-end border-t border-white/5">
                            <button
                                onClick={handleCalculate}
                                disabled={calculating || grossIncome <= 0}
                                className="group inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {calculating ? 'Calculating...' : 'Calculate Taxes'}
                                {!calculating && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="space-y-6">

                        {/* Summary stat cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { label: 'Total Federal Tax', value: formatCurrency(result.total_tax), accent: 'text-red-400' },
                                { label: 'Effective Rate', value: `${(result.effective_rate * 100).toFixed(2)}%`, accent: 'text-indigo-400' },
                                { label: 'Marginal Rate', value: `${(result.marginal_rate * 100).toFixed(0)}%`, accent: 'text-blue-400' },
                            ].map((card) => (
                                <div key={card.label} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 ring-1 ring-white/10">
                                    <p className="text-sm text-slate-400 mb-2">{card.label}</p>
                                    <p className={`text-3xl font-bold ${card.accent}`}>{card.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Detailed summary */}
                        <div className="bg-slate-900/40 border border-white/5 backdrop-blur-md rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
                            <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold text-white tracking-tight">Estimated Summary</h2>
                                </div>
                                {user?.plan === 'pro' ? (
                                    <button
                                        onClick={handleDownloadReport}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors"
                                    >
                                        Download Report
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed opacity-50"
                                    >
                                        Pro Only (Report)
                                    </button>
                                )}
                            </div>

                            <div className="p-6 sm:p-8 space-y-8">
                                {/* Income details */}
                                <div className="space-y-3 pb-6 border-b border-white/10">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Income Details</h3>
                                    {[
                                        { label: 'Gross Income', value: formatCurrency(grossIncome), cls: 'text-slate-200' },
                                        { label: 'Standard Deduction', value: `−${formatCurrency(result.standard_deduction)}`, cls: 'text-red-400' },
                                        { label: 'Taxable Income', value: formatCurrency(result.taxable_income), cls: 'text-white font-semibold' },
                                    ].map((row) => (
                                        <div key={row.label} className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">{row.label}</span>
                                            <span className={row.cls}>{row.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Bracket breakdown */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bracket Breakdown</h3>
                                    {result.brackets.map((b, i) => {
                                        const maxTax = Math.max(...result.brackets.map(x => x.tax_in_bracket));
                                        const pct = maxTax > 0 ? (b.tax_in_bracket / maxTax) * 100 : 0;
                                        return (
                                            <div key={i} className="space-y-1.5">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-400">{(b.rate * 100).toFixed(0)}% bracket</span>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-slate-500 text-xs hidden sm:block">{formatCurrency(b.taxable_income_in_bracket)} taxable</span>
                                                        <span className="text-slate-200 font-medium w-24 text-right">{formatCurrency(b.tax_in_bracket)}</span>
                                                    </div>
                                                </div>
                                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-700"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Total */}
                                <div className="pt-6 border-t border-white/10 flex items-end justify-between">
                                    <div>
                                        <p className="text-base font-semibold text-white">Total Estimated Federal Tax</p>
                                        <p className="text-xs text-slate-500 mt-1">Based on 2025 {filingStatus.replace(/_/g, ' ')} brackets</p>
                                    </div>
                                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                                        {formatCurrency(result.total_tax)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-slate-950/40 mt-12 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">© 2025 FiscalCore. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
                        <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}