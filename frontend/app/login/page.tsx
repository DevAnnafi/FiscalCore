"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, verifyMFALogin } from "@/lib/api";
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mfaRequired, setMfaRequired] = useState(false);
    const [mfaCode, setMfaCode] = useState('');
    const router = useRouter();

    async function handleSubmit() {
        setLoading(true);
        setError(null);
        try {
            const data = await login(email, password);
            if (data.mfa_required) {
                setMfaRequired(true);
            } else {
                localStorage.removeItem('fiscalcore_last_result');
                router.push('/dashboard');
            }
        } catch {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    }

    async function handleMFASubmit() {
        setLoading(true);
        setError(null);
        try {
            const data = await verifyMFALogin(mfaCode);
            if (data.message === 'Login Successful') {
                localStorage.removeItem('fiscalcore_last_result');
                router.push('/dashboard');
            } else {
                setError(data.detail || 'Invalid code');
            }
        } catch {
            setError('Invalid code');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="w-full max-w-sm space-y-8">
                {/* Logo */}
                <div className="flex flex-col items-center gap-4">
                    <img src="/FiscalCoreLogo.png" alt="FiscalCore" className="w-25 h-25 object-contain" />
                    <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
                </div>

                {/* Form */}
                {!mfaRequired ? (
                    <div className="space-y-3">
                        <input type="email" placeholder="Enter your email address" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all text-sm" />
                        <input type="password" placeholder="Password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all text-sm" />
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <button onClick={handleSubmit} disabled={loading || !email || !password}
                            className="w-full py-3.5 bg-white text-slate-950 font-semibold rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                            {loading ? 'Signing in...' : 'Continue'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm text-slate-400 text-center">Enter the 6-digit code from your authenticator app.</p>
                        <input type="text" placeholder="000000" maxLength={6} value={mfaCode}
                            onChange={(e) => setMfaCode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleMFASubmit()}
                            className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all text-sm text-center tracking-widest text-lg" />
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <button onClick={handleMFASubmit} disabled={loading || mfaCode.length !== 6}
                            className="w-full py-3.5 bg-white text-slate-950 font-semibold rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                            {loading ? 'Verifying...' : 'Verify'}
                        </button>
                        <button onClick={() => { setMfaRequired(false); setMfaCode(''); setError(null); }}
                            className="w-full py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
                            ← Back to login
                        </button>
                    </div>
                )}

                {/* Footer */}
                <div className="space-y-4 text-center">
                    <p className="text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-white hover:text-slate-300 font-medium transition-colors">
                            Sign up
                        </Link>
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        By signing in, you agree to FiscalCore's{' '}
                        <a href="/terms" className="underline hover:text-slate-400 transition-colors">Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy" className="underline hover:text-slate-400 transition-colors">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}