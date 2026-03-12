'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, logout } from '@/lib/api';
import { IncomeForm } from '@/components/IncomeForm'

export default function Dashboard() {
    const [user, setUser] = useState<{email: string, full_name: string} | null> (null)
    const [loading, setLoading] = useState<boolean>(true)

    const router = useRouter()

    async function handleSignOut(): Promise<void> {   
            const data = await logout()
    
            router.push("/login")  
    }

    useEffect( () => {
        async function fetchUser() 
        {
            try 
            {
                const data = await getMe()
                setUser(data)
            }

            catch 
            {
                router.push("/login")
            }
            
            finally {
                setLoading(false)
            }

        }

        fetchUser()
        
    }, [])

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <p className="text-white text-xl">Loading...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Welcome, {user?.full_name}</h1>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-4 py-2 transition-colors" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
                <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-semibold text-white mb-6">Tax Calculator</h2>
                    <IncomeForm />
                </div>
            </div>
        </div>

    )

}