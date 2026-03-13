'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, logout, calculateTax, saveScenario, createCheckout, getScenarios} from '@/lib/api';
import { TaxRequest, TaxResult } from '@/types/tax';

export default function CalculatorPage() {
    const [user, setUser] = useState<{ email: string; full_name: string; plan: string; avatar?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const [grossIncome, setGrossIncome] = useState<number>(0);
    const [filingStatus, setFilingStatus] = useState<TaxRequest['filing_status']>('single');
    const [result, setResult] = useState<TaxResult | null>(null);
    const [calculating, setCalculating] = useState(false);
    const [scenarioName, setScenarioName] = useState('');
    const [saveMsg, setSaveMsg] = useState('');
    const profileRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        getMe().then((data) => {
            if (data.email) { setUser(data); setLoading(false); }
            else router.push('/login');
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


    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const renderAvatar = () => {
        if (user?.avatar?.startsWith('data:')) return <img src={user.avatar} className="w-8 h-8 rounded-full object-cover border border-white/10" />;
        if (user?.avatar?.startsWith('#')) return <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0" style={{background: user.avatar}}><span className="text-xs font-semibold text-white">{user ? getInitials(user.full_name) : '?'}</span></div>;
        return <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0"><span className="text-xs font-semibold text-white">{user ? getInitials(user.full_name) : '?'}</span></div>;
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
        { id: 'scenarios', label: 'Saved Scenarios', href: '/scenarios', pro: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
        { id: 'calculator', label: 'Tax Calculator', href: '/calculator', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg> },
        { id: 'summary', label: 'Estimated Summary', href: '/summary', pro: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
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
                        <a key={item.id} href={item.href} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${item.id === 'calculator' ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'} ${!sidebarOpen ? 'justify-center' : ''}`} title={!sidebarOpen ? item.label : undefined}>
                            <span className="shrink-0">{item.icon}</span>
                            {sidebarOpen && <span className="flex-1 flex items-center justify-between">{item.label}{(item as any).pro && !isPro && <span className="text-xs text-slate-500">🔒</span>}</span>}
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
                        {renderAvatar()}
                        {sidebarOpen && <div className="flex-1 text-left min-w-0"><p className="text-sm font-medium text-white truncate">{user?.full_name}</p><p className="text-xs truncate" style={{color: isPro ? '#2b9d8f' : '#71717a'}}>{isPro ? 'Pro Plan' : 'Free Plan'}</p></div>}
                        {sidebarOpen && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 shrink-0"><path d="M7 15l5-5 5 5"/></svg>}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0 flex flex-col">
                <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 space-y-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">Tax Calculator</h1>
                        <p className="text-slate-400 text-base">Estimate your federal income tax liability for 2025.</p>
                    </div>

                    {/* Income Details Card */}
                    <div className="bg-slate-900/40 border border-white/5 backdrop-blur-md rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
                        <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50">
                            <h2 className="text-xl font-semibold text-white tracking-tight">Income Details</h2>
                        </div>
                        <div className="p-6 sm:p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">Filing Status</label>
                                <div className="flex flex-wrap gap-2">
                                    {(['single', 'married_filing_jointly', 'married_filing_separately', 'head_of_household'] as TaxRequest['filing_status'][]).map((status) => {
                                        const labels: Record<string, string> = {
                                            single: 'Single', married_filing_jointly: 'Married Jointly',
                                            married_filing_separately: 'Married Separately', head_of_household: 'Head of Household',
                                        };
                                        return (
                                            <button key={status} onClick={() => setFilingStatus(status)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filingStatus === status ? 'bg-white text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                                                {labels[status]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Gross Annual Income</label>
                                <div className="relative max-w-sm">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-slate-500 font-medium text-lg">$</span>
                                    </div>
                                    <input type="number" value={grossIncome || ''} onChange={(e) => setGrossIncome(Number(e.target.value))} placeholder="0.00"
                                        className="block w-full pl-8 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all text-lg font-medium outline-none" />
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end border-t border-white/5">
                                <button onClick={handleCalculate} disabled={calculating || grossIncome <= 0}
                                    className="group inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] bg-white text-slate-950 hover:bg-slate-100">
                                    {calculating ? 'Calculating...' : 'Calculate Taxes'}
                                    {!calculating && (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                                            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    {result && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { label: 'Total Federal Tax', value: formatCurrency(result.total_tax) },
                                    { label: 'Effective Rate', value: `${(result.effective_rate * 100).toFixed(2)}%` },
                                    { label: 'Marginal Rate', value: `${(result.marginal_rate * 100).toFixed(0)}%` },
                                ].map((card) => (
                                    <div key={card.label} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 ring-1 ring-white/10">
                                        <p className="text-sm text-slate-500 mb-2">{card.label}</p>
                                        <p className="text-3xl font-bold text-white">{card.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Save Scenario */}
                            <div className="bg-slate-900/40 border border-white/5 backdrop-blur-md rounded-2xl ring-1 ring-white/10 overflow-hidden">
                                <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-white tracking-tight">Save Scenario</h2>
                                        <p className="text-sm text-slate-500 mt-1">Save this calculation to revisit later.</p>
                                    </div>
                                    {!isPro && <span className="text-xs text-slate-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">🔒 Pro feature</span>}
                                </div>
                                <div className="p-6 flex items-center gap-4">
                                    <input
                                        type="text"
                                        value={scenarioName}
                                        onChange={(e) => setScenarioName(e.target.value)}
                                        placeholder={isPro ? 'e.g. 2025 Full-time estimate' : 'Upgrade to Pro to save scenarios'}
                                        disabled={!isPro}
                                        className="flex-1 px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all text-sm outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                                    />
                                    {isPro ? (
                                        <button
                                            onClick={async () => {
                                                if (!result || !scenarioName.trim()) return;
                                                const res = await saveScenario({ name: scenarioName.trim(), gross_income: grossIncome, filing_status: filingStatus, total_tax: result.total_tax, effective_rate: result.effective_rate, marginal_rate: result.marginal_rate });
                                                if (res.id) { setSaveMsg('Saved!'); setScenarioName(''); setTimeout(() => setSaveMsg(''), 3000); }
                                            }}
                                            disabled={!scenarioName.trim()}
                                            className="px-6 py-3 text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white text-slate-950 hover:bg-slate-100">
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            onClick={async () => { const { url } = await createCheckout(); window.location.href = url; }}
                                            className="px-6 py-3 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all shrink-0">
                                            Upgrade
                                        </button>
                                    )}
                                    {saveMsg && <p className="text-sm text-emerald-400">{saveMsg}</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="border-t border-white/5 bg-slate-950/40 backdrop-blur-sm">
                    <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-500">© 2025 FiscalCore. All rights reserved.</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</a>
                            <a href="/terms" className="hover:text-slate-300 transition-colors">Terms</a>
                            <a href="/support" className="hover:text-slate-300 transition-colors">Support</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}