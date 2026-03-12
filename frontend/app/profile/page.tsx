'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, logout, updateProfile, updatePassword, deleteAccount, createCheckout } from '@/lib/api';

export default function ProfilePage() {
    const [user, setUser] = useState<{ email: string; full_name: string; plan: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileMsg, setProfileMsg] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        getMe().then((data) => {
            if (data.email) {
                setUser(data);
                setFullName(data.full_name);
                setEmail(data.email);
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

    async function handleUpdateProfile() {
        setSaving(true);
        const res = await updateProfile(fullName, email);
        setProfileMsg(res.message || res.detail || 'Updated');
        setSaving(false);
        setTimeout(() => setProfileMsg(''), 3000);
    }

    async function handleUpdatePassword() {
        if (newPassword !== confirmPassword) { setPasswordMsg('Passwords do not match'); return; }
        if (newPassword.length < 8) { setPasswordMsg('Password must be at least 8 characters'); return; }
        setSaving(true);
        const res = await updatePassword(currentPassword, newPassword);
        setPasswordMsg(res.message || res.detail || 'Updated');
        setSaving(false);
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        setTimeout(() => setPasswordMsg(''), 3000);
    }

    async function handleDeleteAccount() {
        await deleteAccount();
        router.push('/');
    }

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
        { id: 'scenarios', label: 'Saved Scenarios', href: '/dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
        { id: 'calculator', label: 'Tax Calculator', href: '/dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg> },
    ];

    const inputCls = "w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all text-sm outline-none";

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="flex gap-2">{[0,150,300].map(d => <div key={d} className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{animationDelay:`${d}ms`}}/>)}</div></div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex">
            {/* Sidebar */}
            <aside className={`relative flex flex-col h-screen sticky top-0 border-r border-white/5 bg-slate-950 transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'}`}>
                <div className="flex items-center justify-between px-4 h-16 border-b border-white/5 shrink-0">
                    {sidebarOpen && <span className="font-bold tracking-tight text-white text-base">Fiscal<span style={{color:'#2b9d8f'}}>Core</span></span>}
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
                        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Profile Settings</h1>
                        <p className="text-slate-400 text-sm">Manage your account information.</p>
                    </div>

                    {/* Profile Info */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 overflow-hidden">
                        <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50">
                            <h2 className="text-lg font-semibold text-white">Personal Information</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2">Full Name</label>
                                <input className={inputCls} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2">Email Address</label>
                                <input className={inputCls} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                            </div>
                            {profileMsg && <p className={`text-sm ${profileMsg.includes('success') || profileMsg.includes('updated') ? 'text-emerald-400' : 'text-red-400'}`}>{profileMsg}</p>}
                            <div className="pt-2 flex justify-end border-t border-white/5">
                                <button onClick={handleUpdateProfile} disabled={saving} className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all disabled:opacity-50">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 overflow-hidden">
                        <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50">
                            <h2 className="text-lg font-semibold text-white">Change Password</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2">Current Password</label>
                                <input className={inputCls} type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2">New Password</label>
                                <input className={inputCls} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-2">Confirm New Password</label>
                                <input className={inputCls} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                            </div>
                            {passwordMsg && <p className={`text-sm ${passwordMsg.includes('updated') || passwordMsg.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>{passwordMsg}</p>}
                            <div className="pt-2 flex justify-end border-t border-white/5">
                                <button onClick={handleUpdatePassword} disabled={saving} className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all disabled:opacity-50">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Delete Account */}
                    <div className="bg-slate-900/40 border border-red-500/20 rounded-2xl ring-1 ring-red-500/10 overflow-hidden">
                        <div className="px-6 py-5 border-b border-red-500/10 bg-slate-900/50">
                            <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-400 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                            {!deleteConfirm ? (
                                <button onClick={() => setDeleteConfirm(true)} className="px-6 py-2.5 text-sm font-semibold rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all">
                                    Delete Account
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <p className="text-sm text-red-400 font-medium">Are you sure? This is permanent.</p>
                                    <button onClick={handleDeleteAccount} className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all">Yes, delete</button>
                                    <button onClick={() => setDeleteConfirm(false)} className="px-4 py-2 text-sm font-semibold rounded-lg border border-white/10 text-slate-400 hover:text-white transition-all">Cancel</button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}