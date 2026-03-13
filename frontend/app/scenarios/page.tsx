'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, logout, getScenarios, deleteScenario, createCheckout } from '@/lib/api';

interface Scenario {
    id: number;
    name: string;
    filing_status: string;
    gross_income: number;
    total_tax: number;
    effective_rate: number;
    marginal_rate: number;
    created_at: string;
}

export default function ScenariosPage() {
    const [user, setUser] = useState<{ email: string; full_name: string; plan: string; avatar?: string } | null>(null);
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        getMe().then((data) => {
            if (data.email) {
                setUser(data);
                if (data.plan === 'pro') getScenarios().then(setScenarios);
                setLoading(false);
            } else { router.push('/login'); }
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
    async function handleDelete(id: number) {
        setDeletingId(id);
        await deleteScenario(id);
        setScenarios(prev => prev.filter(s => s.id !== id));
        setDeletingId(null);
    }

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
    const filingLabels: Record<string, string> = { single: 'Single', married_filing_jointly: 'MFJ', married_filing_separately: 'MFS', head_of_household: 'HoH' };

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
            <aside className={`relative flex flex-col h-screen sticky top-0 border-r border-white/5 bg-slate-950 transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'}`}>
                <div className="flex items-center justify-between px-4 h-16 border-b border-white/5 shrink-0">
                    {sidebarOpen && <img src="/FiscalCoreLogo.png" alt="FiscalCore" className="w-12 h-12 object-contain" />}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all ${!sidebarOpen ? 'mx-auto' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                    </button>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navItems.map((item) => (
                        <a key={item.id} href={item.href} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${item.id === 'scenarios' ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'} ${!sidebarOpen ? 'justify-center' : ''}`} title={!sidebarOpen ? item.label : undefined}>
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

            <div className="flex-1 min-w-0">
                <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Saved Scenarios</h1>
                        <p className="text-slate-400 text-sm">Your saved tax calculations.</p>
                    </div>

                    {!isPro ? (
                        <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 p-10 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Pro Feature</h2>
                            <p className="text-slate-400 text-sm max-w-sm mb-6">Save and revisit up to 20 tax scenarios. Upgrade to Pro to unlock this feature.</p>
                            <button onClick={async () => { const { url } = await createCheckout(); window.location.href = url; }} className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all">Upgrade to Pro — $9.99/mo</button>
                            <p className="text-xs text-slate-600 mt-3">7-day free trial · Cancel anytime</p>
                        </div>
                    ) : scenarios.length === 0 ? (
                        <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 p-10 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">No Scenarios Yet</h2>
                            <p className="text-slate-400 text-sm max-w-sm mb-6">Run a calculation and save it to see it here.</p>
                            <a href="/calculator" className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all">Go to Calculator</a>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-500">{scenarios.length} / 20 scenarios used</p>
                                <a href="/calculator" className="px-4 py-2 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all">+ New Calculation</a>
                            </div>
                            <div className="grid gap-4">
                                {scenarios.map((s) => (
                                    <div key={s.id} className="group bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 p-6 hover:border-white/10 transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-base font-semibold text-white mb-1">{s.name}</h3>
                                                <p className="text-xs text-slate-500">{new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {filingLabels[s.filing_status] || s.filing_status}</p>
                                            </div>
                                            <button onClick={() => handleDelete(s.id)} disabled={deletingId === s.id} className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/5 transition-all">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            {[
                                                { label: 'Gross Income', value: fmt(s.gross_income) },
                                                { label: 'Total Tax', value: fmt(s.total_tax) },
                                                { label: 'Effective Rate', value: pct(s.effective_rate) },
                                                { label: 'Marginal Rate', value: pct(s.marginal_rate) },
                                            ].map((stat) => (
                                                <div key={stat.label}>
                                                    <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                                                    <p className="text-sm font-semibold text-white">{stat.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}