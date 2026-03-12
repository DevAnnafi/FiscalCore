"use client";

import { useState } from 'react';
import { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { login } from "@/lib/api";
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    async function handleSubmit(): Promise<void> {
        try {

            const data = await login(email, password)

            router.push("/dashboard")
        }

        catch (err) {
            setError("Invalid email or password")
        }

    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
            <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl">
                <h1 className="text-2xl text-center font-bold text-white mb-8"> Sign In </h1>
                <input className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500" placeholder='Email'
                type="email"
                value={email}
                onChange={(e) => setEmail(String(e.target.value))}
            />
                <input className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500" placeholder='Password'
                type="password"
                value={password}
                onChange={(e) => setPassword(String(e.target.value))}
            />
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg p-3 mt-2 transition-colors" onClick={handleSubmit}> Submit </button>

                {error && <p>{error}</p>}

                <Link className="text-blue-400 hover:text-blue-300 text-sm mt-4 block text-center" href='/register'>Dont have an account? Sign Up</Link>

            </div>
        </div>
    )

}