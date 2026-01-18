// src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface User {
    name?: string | null
    role?: string
    image?: string | null // Added image support
}

export default function Navbar({ user }: { user: User }) {
    const [isOpen, setIsOpen] = useState(false)

    // Helper to get initials (e.g. "John Doe" -> "JD")
    const initials = user.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#FDFBF7]/80 backdrop-blur-md border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    
                    {/* 1. LOGO */}
                    <div className="shrink-0 flex items-center gap-2">
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-[#C2410C] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-900/20 group-hover:scale-110 transition-transform">
                                A
                            </div>
                            <span className="font-serif text-2xl font-bold text-[#1F1F1F] tracking-tight">
                                Annapurna
                            </span>
                        </Link>
                    </div>

                    {/* 2. DESKTOP LINKS */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {/* Main Nav Links */}
                        <div className="flex items-center space-x-6 mr-4">
                            <Link href="/dashboard" className="text-stone-600 hover:text-[#C2410C] font-medium transition-colors">
                                Overview
                            </Link>
                            
                            {user.role === 'GIVER' ? (
                                <Link href="/dashboard/create" className="text-stone-600 hover:text-[#C2410C] font-medium transition-colors">
                                    Post Donation
                                </Link>
                            ) : (
                                <Link href="/dashboard/feed" className="text-stone-600 hover:text-[#C2410C] font-medium transition-colors">
                                    Find Food
                                </Link>
                            )}

                            <Link href="/dashboard/manage" className="text-stone-600 hover:text-[#C2410C] font-medium transition-colors">
                                {user.role === 'GIVER' ? 'My Donations' : 'My Pickups'}
                            </Link>
                        </div>

                        {/* User Profile Section */}
                        <div className="pl-6 border-l border-stone-200 flex items-center gap-4">
                            
                            {/* CLICKABLE PROFILE LINK */}
                            <Link 
                                href="/dashboard/profile" 
                                className="flex items-center gap-3 group hover:bg-stone-50 p-1.5 pr-3 rounded-full transition-colors"
                            >
                                {/* Avatar Circle */}
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C2410C] to-orange-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm overflow-hidden">
                                    {user.image ? (
                                        <img src={user.image} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        initials
                                    )}
                                </div>
                                
                                {/* Name Text */}
                                <div className="text-right hidden lg:block">
                                    <p className="text-xs font-bold text-[#1F1F1F] group-hover:text-[#C2410C] transition-colors">
                                        {user.name?.split(" ")[0]}
                                    </p>
                                    <p className="text-[10px] text-stone-500 uppercase tracking-wider">
                                        {user.role}
                                    </p>
                                </div>
                            </Link>

                            {/* Sign Out Icon Button */}
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                title="Sign Out"
                                className="w-9 h-9 flex items-center justify-center bg-stone-100 hover:bg-red-50 text-stone-500 hover:text-red-600 rounded-full transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* 3. MOBILE MENU BUTTON */}
                    <div className="md:hidden flex items-center gap-4">
                         {/* Mobile Profile Icon */}
                        <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden">
                             {user.image ? (
                                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-stone-500">{initials}</div>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-stone-600 hover:text-[#C2410C]"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. MOBILE MENU DROPDOWN */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-stone-200 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-stone-600 font-bold hover:bg-stone-50 rounded-xl">
                            Overview
                        </Link>
                        
                        {user.role === 'GIVER' ? (
                            <Link href="/dashboard/create" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-stone-600 font-bold hover:bg-stone-50 rounded-xl">
                                Post Donation
                            </Link>
                        ) : (
                            <Link href="/dashboard/feed" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-stone-600 font-bold hover:bg-stone-50 rounded-xl">
                                Find Food
                            </Link>
                        )}
                        
                        <Link href="/dashboard/manage" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-stone-600 font-bold hover:bg-stone-50 rounded-xl">
                            {user.role === 'GIVER' ? 'My Donations' : 'My Pickups'}
                        </Link>
                        
                        <div className="h-px bg-stone-100 my-2"></div>

                        <Link href="/dashboard/profile" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-[#C2410C] font-bold hover:bg-orange-50 rounded-xl">
                            My Profile
                        </Link>

                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="w-full text-left px-3 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}