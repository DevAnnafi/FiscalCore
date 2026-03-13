'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, logout, getBilling, cancelSubscription, createCheckout } from '@/lib/api';

export default function BillingPage() {
    const [user, setUser] = useState<{ email: string; full_name: string; plan: string } | null>(null);
    const [billing, setBilling] = useState<{ plan: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const [cancelConfirm, setCancelConfirm] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [msg, setMsg] = useState('');
    const profileRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        getMe().then((data) => {
            if (data.email) {
                setUser(data);
                getBilling().then((b) => { setBilling(b); setLoading(false); });
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
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    async function handleCancel() {
        setCancelling(true);
        const res = await cancelSubscription();
        setMsg(res.message || res.detail || 'Cancelled');
        setCancelConfirm(false);
        setCancelling(false);
        getMe().then(setUser);
        getBilling().then(setBilling);
        setTimeout(() => setMsg(''), 4000);
    }

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
        { id: 'scenarios', label: 'Saved Scenarios', href: '/dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
        { id: 'calculator', label: 'Tax Calculator', href: '/dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg> },
    ];

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="flex gap-2">{[0,150,300].map(d => <div key={d} className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{animationDelay:`${d}ms`}}/>)}</div></div>;

    const isPro = billing?.plan === 'pro';

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
                        <a key={item.id} href={item.href} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-slate-400 hover:text-white hover:bg-white/5 ${!sidebarOpen ? 'justify-center' : ''}`} title={!sidebarOpen ? item.label : undefined}>
                            <span className="shrink-0">{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
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
                            {user?.plan !== 'pro' && (
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
                        {sidebarOpen && <div className="flex-1 text-left min-w-0"><p className="text-sm font-medium text-white truncate">{user?.full_name}</p><p className="text-xs truncate" style={{color: user?.plan === 'pro' ? '#2b9d8f' : '#71717a'}}>{user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}</p></div>}
                        {sidebarOpen && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 shrink-0"><path d="M7 15l5-5 5 5"/></svg>}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0">
                <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Billing</h1>
                        <p className="text-slate-400 text-sm">Manage your subscription and plan.</p>
                    </div>

                    {msg && <div className="px-5 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">{msg}</div>}

                    {/* Current Plan */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 overflow-hidden">
                        <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50">
                            <h2 className="text-lg font-semibold text-white">Current Plan</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-2xl font-bold text-white">{isPro ? 'Pro Plan' : 'Free Plan'}</span>
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${isPro ? 'bg-white/10 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                            {isPro ? 'ACTIVE' : 'FREE'}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm">{isPro ? '$19.99 / month' : 'Limited features'}</p>
                                </div>
                                {isPro && (
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'#2b9d8f'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    </div>
                                )}
                            </div>

                            {/* Features list */}
                            <div className="space-y-2 mb-6">
                                {[
                                    { label: 'Federal tax calculations', included: true },
                                    { label: 'All filing statuses', included: true },
                                    { label: 'Saved scenarios (up to 20)', included: isPro },
                                    { label: 'PDF tax reports', included: isPro },
                                    { label: 'Priority support', included: isPro },
                                ].map((f) => (
                                    <div key={f.label} className="flex items-center gap-3 text-sm">
                                        <span className={f.included ? 'text-emerald-400' : 'text-slate-600'}>
                                            {f.included ? '✓' : '✗'}
                                        </span>
                                        <span className={f.included ? 'text-slate-300' : 'text-slate-600'}>{f.label}</span>
                                    </div>
                                ))}
                            </div>

                            {!isPro && (
                                <button onClick={async () => { const { url } = await createCheckout(); window.location.href = url; }}
                                    className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all">
                                    Upgrade to Pro — $19.99/mo
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Trial info */}
                    {!isPro && (
                        <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 overflow-hidden">
                            <div className="p-6 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">7-day free trial</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Try Pro free for 7 days. No charge until the trial ends. Cancel anytime.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cancel subscription */}
                    {isPro && (
                        <div className="bg-slate-900/40 border border-red-500/20 rounded-2xl ring-1 ring-red-500/10 overflow-hidden">
                            <div className="px-6 py-5 border-b border-red-500/10 bg-slate-900/50">
                                <h2 className="text-lg font-semibold text-red-400">Cancel Subscription</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-400 mb-4">Cancelling will downgrade your account to the Free plan immediately. Your saved scenarios and reports will no longer be accessible.</p>
                                {!cancelConfirm ? (
                                    <button onClick={() => setCancelConfirm(true)} className="px-6 py-2.5 text-sm font-semibold rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all">
                                        Cancel Subscription
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm text-red-400 font-medium">Are you sure?</p>
                                        <button onClick={handleCancel} disabled={cancelling} className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50">
                                            {cancelling ? 'Cancelling...' : 'Yes, cancel'}
                                        </button>
                                        <button onClick={() => setCancelConfirm(false)} className="px-4 py-2 text-sm font-semibold rounded-lg border border-white/10 text-slate-400 hover:text-white transition-all">Keep Plan</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}