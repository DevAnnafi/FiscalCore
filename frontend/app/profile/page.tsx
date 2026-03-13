'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, logout, updateProfile, updatePassword, deleteAccount, createCheckout, uploadAvatar, updateAvatarColor } from '@/lib/api';

const PRESET_COLORS = ['#2b9d8f', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444', '#10b981', '#6366f1'];

export default function ProfilePage() {
    const [user, setUser] = useState<{ email: string; full_name: string; plan: string; avatar?: string } | null>(null);
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
    const [avatarMsg, setAvatarMsg] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const renderAvatar = (size: 'sm' | 'lg' = 'sm') => {
        const dim = size === 'lg' ? 'w-20 h-20' : 'w-8 h-8';
        const textCls = size === 'lg' ? 'text-2xl font-bold' : 'text-xs font-semibold';
        const name = user?.full_name ?? '';
        if (user?.avatar?.startsWith('data:')) return <img src={user.avatar} className={`${dim} rounded-full object-cover border border-white/10`} />;
        if (user?.avatar?.startsWith('#')) return <div className={`${dim} rounded-full border border-white/10 flex items-center justify-center shrink-0`} style={{ background: user.avatar }}><span className={`${textCls} text-white`}>{getInitials(name)}</span></div>;
        return <div className={`${dim} rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0`}><span className={`${textCls} text-white`}>{getInitials(name)}</span></div>;
    };

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { setAvatarMsg('Image must be under 2MB'); return; }
        setUploadingAvatar(true);
        const res = await uploadAvatar(file);
        if (res.avatar) {
            setUser(prev => prev ? { ...prev, avatar: res.avatar } : prev);
            setAvatarMsg('Avatar updated!');
        } else {
            setAvatarMsg(res.detail || 'Upload failed');
        }
        setUploadingAvatar(false);
        setTimeout(() => setAvatarMsg(''), 3000);
    }

    async function handleColorSelect(color: string) {
        setUploadingAvatar(true);
        const res = await updateAvatarColor(color);
        if (res.avatar) {
            setUser(prev => prev ? { ...prev, avatar: res.avatar } : prev);
            setAvatarMsg('Color updated!');
        } else {
            setAvatarMsg(res.detail || 'Failed');
        }
        setUploadingAvatar(false);
        setTimeout(() => setAvatarMsg(''), 3000);
    }

    async function handleUpdateProfile() {
        setSaving(true);
        const res = await updateProfile(fullName, email);
        setProfileMsg(res.message || res.detail || 'Updated');
        if (res.message) setUser(prev => prev ? { ...prev, full_name: fullName, email } : prev);
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

    async function handleDeleteAccount() { await deleteAccount(); router.push('/'); }

    const isPro = user?.plan === 'pro';

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
        { id: 'scenarios', label: 'Saved Scenarios', href: '/scenarios', pro: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
        { id: 'calculator', label: 'Tax Calculator', href: '/calculator', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg> },
        { id: 'summary', label: 'Estimated Summary', href: '/summary', pro: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    ];

    const inputCls = "w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all text-sm outline-none";

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="flex gap-2">{[0,150,300].map(d => <div key={d} className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{animationDelay:`${d}ms`}}/>)}</div></div>;

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
                        {renderAvatar('sm')}
                        {sidebarOpen && <div className="flex-1 text-left min-w-0"><p className="text-sm font-medium text-white truncate">{user?.full_name}</p><p className="text-xs truncate" style={{color: isPro ? '#2b9d8f' : '#71717a'}}>{isPro ? 'Pro Plan' : 'Free Plan'}</p></div>}
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

                    {/* Avatar Card */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl ring-1 ring-white/10 overflow-hidden">
                        <div className="px-6 py-5 border-b border-white/5 bg-slate-900/50">
                            <h2 className="text-lg font-semibold text-white">Profile Picture</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Upload a photo or choose a color.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Preview + upload button */}
                            <div className="flex items-center gap-5">
                                {renderAvatar('lg')}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingAvatar}
                                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all disabled:opacity-50"
                                    >
                                        {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                                    </button>
                                    <p className="text-xs text-slate-500">JPG, PNG or GIF · max 2MB</p>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                                </div>
                            </div>

                            {/* Color picker */}
                            <div>
                                <p className="text-xs font-medium text-slate-400 mb-3">Or choose a color</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {PRESET_COLORS.map((color) => {
                                        const isActive = user?.avatar === color;
                                        return (
                                            <button
                                                key={color}
                                                onClick={() => handleColorSelect(color)}
                                                disabled={uploadingAvatar}
                                                className="w-8 h-8 rounded-full transition-all disabled:opacity-50 relative"
                                                style={{ background: color }}
                                                title={color}
                                            >
                                                {isActive && (
                                                    <span className="absolute inset-0 flex items-center justify-center">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                    {/* Custom color input */}
                                    <label className="w-8 h-8 rounded-full border-2 border-dashed border-slate-600 hover:border-slate-400 transition-colors cursor-pointer flex items-center justify-center" title="Custom color">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M12 5v14M5 12h14"/></svg>
                                        <input type="color" className="sr-only" onChange={(e) => handleColorSelect(e.target.value)} />
                                    </label>
                                </div>
                            </div>

                            {avatarMsg && <p className={`text-sm ${avatarMsg.includes('updated') || avatarMsg.includes('!') ? 'text-emerald-400' : 'text-red-400'}`}>{avatarMsg}</p>}
                        </div>
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
                            {profileMsg && <p className={`text-sm ${profileMsg.includes('success') || profileMsg.includes('updated') || profileMsg.includes('Updated') ? 'text-emerald-400' : 'text-red-400'}`}>{profileMsg}</p>}
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
                            {passwordMsg && <p className={`text-sm ${passwordMsg.includes('updated') || passwordMsg.includes('success') || passwordMsg.includes('Updated') ? 'text-emerald-400' : 'text-red-400'}`}>{passwordMsg}</p>}
                            <div className="pt-2 flex justify-end border-t border-white/5">
                                <button onClick={handleUpdatePassword} disabled={saving} className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-all disabled:opacity-50">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
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