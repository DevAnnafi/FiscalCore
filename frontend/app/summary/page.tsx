'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, logout, createCheckout } from '@/lib/api';
import { getLastResult } from '@/lib/api';

interface TaxResult {
    filing_status: string;
    standard_deduction: number;
    taxable_income: number;
    total_tax: number;
    effective_rate: number;
    marginal_rate: number;
    brackets: { rate: number; taxable_income_in_bracket: number; tax_in_bracket: number }[];
}

export default function SummaryPage() {
    const [user, setUser] = useState<{ email: string; full_name: string; plan: string } | null>(null);
    const [result, setResult] = useState<TaxResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        getMe().then((data) => {
            if (data.email) {
                setUser(data);
                getLastResult().then((data) => { if (data?.total_tax !== undefined) setResult(data); });
                setLoading(false);
            } else {
                router.push('/login');
            }
        });
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function handleSignOut() { await logout(); router.push('/login'); }
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
    const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

    const filingLabels: Record<string, string> = {
        single: 'Single', married_filing_jointly: 'Married Filing Jointly',
        married_filing_separately: 'Married Filing Separately', head_of_household: 'Head of Household',
    };

    async function handleDownload() {
        if (!result || !user) return;
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        doc.setFont('courier', 'bold');
        doc.setFontSize(20);
        doc.text('FiscalCore', 20, 20);
        doc.setFont('courier', 'normal');
        doc.setFontSize(10);
        doc.text('Federal Tax Estimated Summary', 20, 28);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 34);
        doc.text(`For: ${user.full_name} (${user.email})`, 20, 40);
        doc.line(20, 44, 190, 44);
        doc.setFont('courier', 'bold');
        doc.setFontSize(11);
        doc.text('INPUTS', 20, 52);
        doc.setFont('courier', 'normal');
        doc.setFontSize(10);
        doc.text(`Gross Income: ${fmt(result.taxable_income + result.standard_deduction)}`, 20, 60);
        doc.text(`Filing Status: ${filingLabels[result.filing_status] || result.filing_status}`, 20, 67);
        doc.text(`Standard Deduction: ${fmt(result.standard_deduction)}`, 20, 74);
        doc.text(`Taxable Income: ${fmt(result.taxable_income)}`, 20, 81);
        doc.line(20, 86, 190, 86);
        doc.setFont('courier', 'bold');
        doc.setFontSize(11);
        doc.text('RESULTS', 20, 94);
        doc.setFont('courier', 'normal');
        doc.setFontSize(10);
        doc.text(`Total Federal Tax: ${fmt(result.total_tax)}`, 20, 102);
        doc.text(`Effective Rate: ${pct(result.effective_rate)}`, 20, 109);
        doc.text(`Marginal Rate: ${pct(result.marginal_rate)}`, 20, 116);
        doc.line(20, 121, 190, 121);
        doc.setFont('courier', 'bold');
        doc.setFontSize(11);
        doc.text('BRACKET BREAKDOWN', 20, 129);
        doc.setFont('courier', 'normal');
        doc.setFontSize(9);
        let y = 137;
        result.brackets.forEach((b) => {
            if (b.taxable_income_in_bracket > 0) {
                doc.text(`${pct(b.rate)} — Taxable: ${fmt(b.taxable_income_in_bracket)} — Tax: ${fmt(b.tax_in_bracket)}`, 20, y);
                y += 7;
            }
        });
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('This is an estimate only. Consult a tax professional for official advice.', 20, 285);
        doc.save(`fiscalcore-summary-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
        { id: 'scenarios', label: 'Saved Scenarios', href: '/scenarios', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
        { id: 'calculator', label: 'Tax Calculator', href: '/calculator', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg> },
        { id: 'summary', label: 'Estimated Summary', href: '/summary', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, pro: true },
    ];

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="flex gap-2">{[0,150,300].map(d => <div key={d} className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{animationDelay:`${d}ms`}}/>)}</div></div>;

    const isPro = user?.plan === 'pro';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex">
            {/* Sidebar */}
            <aside className={`relative flex flex-col h-screen sticky top-0 border-r border-white/5 bg-slate-950 transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'}`}>
                <div className="flex items-center justify-between px-4 h-16 border-b border-white/5 shrink-0">
                    {sidebarOpen && <img src="/FiscalCoreLogo.png" alt="FiscalCore" className="w-12 h-12 object-contain" />}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all ${!sidebarOpen ? 'mx-auto' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                    </button>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navItems.map((item) => (
                        <a key={item.id} href={item.href}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                                ${item.id === 'summary' ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                                ${!sidebarOpen ? 'justify-center' : ''}`}
                            title={!sidebarOpen ? item.label : undefined}>
                            <span className="shrink-0">{item.icon}</span>
                            {sidebarOpen && (
                                <span className="flex-1 flex items-center justify-between">
                                    {item.label}
                                    {item.pro && !isPro && <span className="text-xs text-slate-500">🔒</span>}
                                </span>
                            )}
                        </a>
                    ))}
                </nav>
                <div className="px-2 pb-4 shrink-0" ref={profileRef}>
                    {profileOpen && (
                        <div className={`mb-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl ${sidebarOpen ? 'mx-0' : 'absolute bottom-20 left-2 w-56'}`}>
                            <div className="px-4 py-3 border-b border-white/5"><p className="text-xs text-slate-500 truncate">{user?.email}</p></div>
                            {[
                                { label: 'Profile Settings', href: '/profile', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                                { label: 'Billing', href: '/billing', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
                                { label: 'Security & MFA', href: '/security', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                            ].map((item) => (
                                <a key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
                                    <span className="text-slate-400">{item.icon}</span>{item.label}
                                </a>
                            ))}
                            {!isPro && (
                                <button onClick={async () => { const { url } = await createCheckout(); window.location.href = url; }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-white/5 transition-colors border-b border-white/5" style={{color:'#2b9d8f'}}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    Upgrade to Pro
                                </button>
                            )}
                            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-colors">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                Sign Out
                            </button>
                        </div>
                    )}
                    <button onClick={() => setProfileOpen(!profileOpen)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-white/10 ${profileOpen ? 'bg-white/5 border-white/10' : ''} ${!sidebarOpen ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-semibold text-white">{user ? getInitials(user.full_name) : '?'}</span>
                        </div>
                        {sidebarOpen && <div className="flex-1 text-left min-w-0"><p className="text-sm font-medium text-white truncate">{user?.full_name}</p><p className="text-xs truncate" style={{color: isPro ? '#2b9d8f' : '#71717a'}}>{isPro ? 'Pro Plan' : 'Free Plan'}</p></div>}
                        {sidebarOpen && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 shrink-0"><path d="M7 15l5-5 5 5"/></svg>}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0">
                <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Estimated Summary</h1>
                            <p className="text-slate-400 text-sm">Your most recent federal tax calculation.</p>
                        </div>
                        {isPro && result && (
                            <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Download PDF
                            </button>
                        )}
                    </div>

                    {/* Locked state for free users */}
                    {!isPro && (
                        <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 p-10 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Pro Feature</h2>
                            <p className="text-slate-400 text-sm max-w-sm mb-6">The Estimated Summary page with PDF download is available on the Pro plan. Upgrade to unlock full breakdowns and downloadable reports.</p>
                            <button onClick={async () => { const { url } = await createCheckout(); window.location.href = url; }}
                                className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all">
                                Upgrade to Pro — $19.99/mo
                            </button>
                            <p className="text-xs text-slate-600 mt-3">7-day free trial · Cancel anytime</p>
                        </div>
                    )}

                    {/* No result yet */}
                    {isPro && !result && (
                        <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 p-10 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">No Calculation Yet</h2>
                            <p className="text-slate-400 text-sm max-w-sm mb-6">Run a tax calculation on the dashboard first to see your estimated summary here.</p>
                            <a href="/dashboard" className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all">
                                Go to Dashboard
                            </a>
                        </div>
                    )}

                    {/* Result display */}
                    {isPro && result && (
                        <>
                            {/* Key stats */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Total Tax', value: fmt(result.total_tax) },
                                    { label: 'Effective Rate', value: pct(result.effective_rate) },
                                    { label: 'Marginal Rate', value: pct(result.marginal_rate) },
                                ].map((s) => (
                                    <div key={s.label} className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 p-5">
                                        <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                                        <p className="text-2xl font-bold text-white">{s.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Income breakdown */}
                            <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 overflow-hidden">
                                <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50">
                                    <h2 className="text-lg font-semibold text-white">Income Breakdown</h2>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {[
                                        { label: 'Gross Income', value: fmt(result.taxable_income + result.standard_deduction) },
                                        { label: 'Filing Status', value: filingLabels[result.filing_status] || result.filing_status },
                                        { label: 'Standard Deduction', value: `− ${fmt(result.standard_deduction)}` },
                                        { label: 'Taxable Income', value: fmt(result.taxable_income), bold: true },
                                    ].map((row) => (
                                        <div key={row.label} className="flex items-center justify-between px-6 py-4">
                                            <span className="text-sm text-slate-400">{row.label}</span>
                                            <span className={`text-sm font-medium ${row.bold ? 'text-white' : 'text-slate-300'}`}>{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bracket breakdown */}
                            <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 overflow-hidden">
                                <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50">
                                    <h2 className="text-lg font-semibold text-white">Bracket Breakdown</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rate</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Taxable Amount</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Tax Owed</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {result.brackets.filter(b => b.taxable_income_in_bracket > 0).map((b, i) => (
                                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-white">{pct(b.rate)}</td>
                                                    <td className="px-6 py-4 text-right text-slate-300">{fmt(b.taxable_income_in_bracket)}</td>
                                                    <td className="px-6 py-4 text-right text-slate-300">{fmt(b.tax_in_bracket)}</td>
                                                </tr>
                                            ))}
                                            <tr className="bg-white/5">
                                                <td className="px-6 py-4 text-xs text-slate-500 font-medium uppercase">Total</td>
                                                <td className="px-6 py-4 text-right text-white font-semibold">{fmt(result.taxable_income)}</td>
                                                <td className="px-6 py-4 text-right text-white font-semibold">{fmt(result.total_tax)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 text-center">This is an estimate only. Consult a tax professional for official advice.</p>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}