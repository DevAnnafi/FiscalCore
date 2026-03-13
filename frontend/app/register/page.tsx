"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from "@/lib/api";
import Link from 'next/link';

export default function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit() {
        if (password !== confirmPassword) { setError('Passwords do not match'); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
        setLoading(true);
        setError(null);
        try {
            await register(fullName, email, password);
            router.push('/login');
        } catch {
            setError('Could not create account. Email may already be in use.');
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
                    <h1 className="text-2xl font-bold text-white tracking-tight">Create an account</h1>
                </div>

                {/* Form */}
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all text-sm"
                    />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all text-sm"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all text-sm"
                    />
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all text-sm"
                    />

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !fullName || !email || !password || !confirmPassword}
                        className="w-full py-3.5 bg-white text-slate-950 font-semibold rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? 'Creating account...' : 'Continue'}
                    </button>
                </div>

                {/* Footer */}
                <div className="space-y-4 text-center">
                    <p className="text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white hover:text-slate-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        By signing up, you agree to FiscalCore's{' '}
                        <a href="/terms" className="underline hover:text-slate-400 transition-colors">Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy" className="underline hover:text-slate-400 transition-colors">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}