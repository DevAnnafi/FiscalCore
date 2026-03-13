'use client';

import { useState, useEffect, useRef } from 'react';
import { getLastResult } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { getMe, logout, getScenarios, createCheckout } from '@/lib/api';
import { TaxResult } from '@/types/tax';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    AreaChart, Area,
} from 'recharts';

export default function Dashboard() {
    const [user, setUser] = useState<{ email: string; full_name: string; plan: string; avatar?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<TaxResult | null>(null);
    const [scenarios, setScenarios] = useState<any[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        getMe().then((data) => {
            if (!data.email) { router.push('/login'); return; }
            setUser(data);
            // Load last result from localStorage
            getLastResult().then((data) => { if (data?.total_tax !== undefined) setResult(data); });
            getScenarios().then((s) => { if (Array.isArray(s)) setScenarios(s); });
            setLoading(false);
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

    function formatCurrency(n: number) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
    }

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const renderAvatar = () => {
        if (user?.avatar?.startsWith('data:')) return <img src={user.avatar} className="w-8 h-8 rounded-full object-cover border border-white/10" />;
        if (user?.avatar?.startsWith('#')) return <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0" style={{ background: user.avatar }}><span className="text-xs font-semibold text-white">{user ? getInitials(user.full_name) : '?'}</span></div>;
        return <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0"><span className="text-xs font-semibold text-white">{user ? getInitials(user.full_name) : '?'}</span></div>;
    };

    const isPro = user?.plan === 'pro';

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
        { id: 'scenarios', label: 'Saved Scenarios', href: '/scenarios', pro: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
        { id: 'calculator', label: 'Tax Calculator', href: '/calculator', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg> },
        { id: 'summary', label: 'Estimated Summary', href: '/summary', pro: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    ];

    // Chart data derived from result
    const pieData = result ? [
        { name: 'Tax Owed', value: result.total_tax },
        { name: 'Take-Home', value: result.taxable_income - result.total_tax },
    ] : [];

    const bracketBarData = result
        ? result.brackets.filter(b => b.taxable_income_in_bracket > 0).map(b => ({
            name: `${(b.rate * 100).toFixed(0)}%`,
            tax: parseFloat(b.tax_in_bracket.toFixed(2)),
            taxable: parseFloat(b.taxable_income_in_bracket.toFixed(2)),
        }))
        : [];

    const incomeBreakdownData = result ? [
        { name: 'Gross Income', value: result.taxable_income + result.standard_deduction },
        { name: 'Std Deduction', value: result.standard_deduction },
        { name: 'Taxable Income', value: result.taxable_income },
        { name: 'After Tax', value: result.taxable_income - result.total_tax },
    ] : [];

    const scenarioAreaData = scenarios.slice(-6).map((s, i) => ({
        name: s.name?.slice(0, 10) || `#${i + 1}`,
        tax: parseFloat(s.total_tax.toFixed(2)),
        income: parseFloat(s.gross_income.toFixed(2)),
    }));

    const PIE_COLORS = ['#2b9d8f', '#1e293b'];
    const BAR_COLOR = '#2b9d8f';
    const AREA_COLOR = '#2b9d8f';

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 shadow-2xl text-sm">
                {label && <p className="text-slate-400 mb-1">{label}</p>}
                {payload.map((p: any, i: number) => (
                    <p key={i} style={{ color: p.color || '#fff' }} className="font-semibold">
                        {p.name}: {typeof p.value === 'number' && p.value > 100 ? formatCurrency(p.value) : `${p.value}`}
                    </p>
                ))}
            </div>
        );
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="flex gap-2">{[0, 150, 300].map(d => <div key={d} className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div>
        </div>
    );

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
                        <a key={item.id} href={item.href} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${item.id === 'dashboard' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'} ${!sidebarOpen ? 'justify-center' : ''}`} title={!sidebarOpen ? item.label : undefined}>
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
                                <button onClick={async () => { const { url } = await createCheckout(); window.location.href = url; }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-white/5 transition-colors border-b border-white/5" style={{ color: '#2b9d8f' }}>
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
                        {sidebarOpen && <div className="flex-1 text-left min-w-0"><p className="text-sm font-medium text-white truncate">{user?.full_name}</p><p className="text-xs truncate" style={{ color: isPro ? '#2b9d8f' : '#71717a' }}>{isPro ? 'Pro Plan' : 'Free Plan'}</p></div>}
                        {sidebarOpen && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 shrink-0"><path d="M7 15l5-5 5 5"/></svg>}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0 flex flex-col">
                <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                                Welcome back, {user?.full_name?.split(' ')[0]}.
                            </h1>
                            <p className="text-slate-400 text-base">Here's your tax overview for 2025.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-900/50 py-1.5 px-3 rounded-full border border-white/5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Tax year 2025 active
                            </div>
                            <a href="/calculator" className="px-4 py-2 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all">
                                Open Calculator →
                            </a>
                        </div>
                    </div>

                    {/* Free plan banner */}
                    {!isPro && (
                        <div className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-sm text-slate-300">You're on the <span className="font-semibold text-white">Free plan.</span> Upgrade to Pro to unlock saved scenarios, PDF reports, and more.</p>
                            <button onClick={async () => { const { url } = await createCheckout(); window.location.href = url; }} className="ml-4 shrink-0 px-4 py-2 text-xs font-semibold rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all">
                                Upgrade →
                            </button>
                        </div>
                    )}

                    {/* No data state */}
                    {!result ? (
                        <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 p-16 flex flex-col items-center justify-center text-center space-y-5">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                                    <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-white">No calculations yet</p>
                                <p className="text-sm text-slate-500 mt-1">Run a tax calculation to see your overview here.</p>
                            </div>
                            <a href="/calculator" className="px-6 py-3 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all">
                                Go to Calculator →
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: 'Gross Income', value: formatCurrency(result.taxable_income + result.standard_deduction), sub: 'Before deductions' },
                                    { label: 'Total Federal Tax', value: formatCurrency(result.total_tax), sub: 'Estimated 2025' },
                                    { label: 'Effective Rate', value: `${(result.effective_rate * 100).toFixed(2)}%`, sub: 'Of gross income' },
                                    { label: 'Marginal Rate', value: `${(result.marginal_rate * 100).toFixed(0)}%`, sub: 'Highest bracket' },
                                ].map((card) => (
                                    <div key={card.label} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 ring-1 ring-white/10">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{card.label}</p>
                                        <p className="text-2xl font-bold text-white">{card.value}</p>
                                        <p className="text-xs text-slate-600 mt-1">{card.sub}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Charts Row 1 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {/* Donut — Tax vs Take-Home */}
                                <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 overflow-hidden">
                                    <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50">
                                        <h2 className="text-base font-semibold text-white">Tax vs Take-Home</h2>
                                        <p className="text-xs text-slate-500 mt-0.5">Of taxable income</p>
                                    </div>
                                    <div className="p-6 flex items-center gap-6">
                                        <ResponsiveContainer width={160} height={160}>
                                            <PieChart>
                                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value" strokeWidth={0}>
                                                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="space-y-3 flex-1">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#2b9d8f' }} />
                                                    <span className="text-xs text-slate-400">Tax Owed</span>
                                                </div>
                                                <p className="text-lg font-bold text-white ml-4">{formatCurrency(result.total_tax)}</p>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700 shrink-0" />
                                                    <span className="text-xs text-slate-400">Take-Home</span>
                                                </div>
                                                <p className="text-lg font-bold text-white ml-4">{formatCurrency(result.taxable_income - result.total_tax)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bar — Income Breakdown */}
                                <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 overflow-hidden">
                                    <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50">
                                        <h2 className="text-base font-semibold text-white">Income Breakdown</h2>
                                        <p className="text-xs text-slate-500 mt-0.5">Gross → taxable → after-tax</p>
                                    </div>
                                    <div className="p-4 pt-6">
                                        <ResponsiveContainer width="100%" height={160}>
                                            <BarChart data={incomeBreakdownData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                                <Bar dataKey="value" fill={BAR_COLOR} radius={[4, 4, 0, 0]} name="Amount" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Row 2 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {/* Bar — Bracket Breakdown */}
                                <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 overflow-hidden">
                                    <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50">
                                        <h2 className="text-base font-semibold text-white">Tax by Bracket</h2>
                                        <p className="text-xs text-slate-500 mt-0.5">Tax owed per bracket</p>
                                    </div>
                                    <div className="p-4 pt-6">
                                        <ResponsiveContainer width="100%" height={180}>
                                            <BarChart data={bracketBarData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                                <Bar dataKey="tax" fill={BAR_COLOR} radius={[4, 4, 0, 0]} name="Tax Owed" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Area — Scenarios trend OR rates card */}
                                {isPro && scenarioAreaData.length >= 2 ? (
                                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 overflow-hidden">
                                        <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50">
                                            <h2 className="text-base font-semibold text-white">Scenario Trend</h2>
                                            <p className="text-xs text-slate-500 mt-0.5">Tax across saved scenarios</p>
                                        </div>
                                        <div className="p-4 pt-6">
                                            <ResponsiveContainer width="100%" height={180}>
                                                <AreaChart data={scenarioAreaData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#2b9d8f" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#2b9d8f" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Area type="monotone" dataKey="tax" stroke={AREA_COLOR} strokeWidth={2} fill="url(#areaGrad)" name="Tax Owed" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 overflow-hidden">
                                        <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50">
                                            <h2 className="text-base font-semibold text-white">Effective vs Marginal Rate</h2>
                                            <p className="text-xs text-slate-500 mt-0.5">Your current rates at a glance</p>
                                        </div>
                                        <div className="p-6 space-y-5">
                                            {[
                                                { label: 'Effective Rate', value: result.effective_rate, color: '#2b9d8f' },
                                                { label: 'Marginal Rate', value: result.marginal_rate, color: '#94a3b8' },
                                            ].map((item) => (
                                                <div key={item.label}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm text-slate-400">{item.label}</span>
                                                        <span className="text-sm font-semibold text-white">{(item.value * 100).toFixed(2)}%</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(item.value * 100).toFixed(1)}%`, background: item.color }} />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-3 border-t border-white/5 space-y-2">
                                                {[
                                                    { label: 'Standard Deduction', value: formatCurrency(result.standard_deduction) },
                                                    { label: 'Taxable Income', value: formatCurrency(result.taxable_income) },
                                                    { label: 'Filing Status', value: result.filing_status?.replace(/_/g, ' ') ?? '—' },
                                                ].map(row => (
                                                    <div key={row.label} className="flex items-center justify-between text-sm">
                                                        <span className="text-slate-500">{row.label}</span>
                                                        <span className="text-slate-300 font-medium capitalize">{row.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { label: 'Run New Calculation', desc: 'Update your tax estimate', href: '/calculator', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg> },
                                    { label: 'View Saved Scenarios', desc: isPro ? `${scenarios.length} saved` : 'Pro feature', href: isPro ? '/scenarios' : '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, locked: !isPro },
                                    { label: 'Estimated Summary', desc: isPro ? 'Full breakdown + PDF' : 'Pro feature', href: isPro ? '/summary' : '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>, locked: !isPro },
                                ].map((item) => (
                                    <a key={item.label} href={item.href} className={`group bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 p-5 flex items-center gap-4 transition-all ${item.locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 hover:border-white/10'}`}>
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-white transition-colors">
                                            {item.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{item.label}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                        </div>
                                        {!item.locked && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 ml-auto shrink-0 group-hover:text-slate-400 transition-colors"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                        )}
                                        {item.locked && <span className="text-xs text-slate-600 ml-auto shrink-0">🔒</span>}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </main>

                <footer className="border-t border-white/5 bg-slate-950/40 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
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