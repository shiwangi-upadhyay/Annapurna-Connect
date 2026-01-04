// src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface User {
	name?: string | null
	role?: string
}

export default function Navbar({ user }: { user: User }) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<nav className="sticky top-0 z-50 w-full bg-[#FDFBF7]/80 backdrop-blur-md border-b border-stone-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-20 items-center">
					{/* LOGO */}
					<div className="shrink-0 flex items-center gap-2">
						<div className="w-8 h-8 bg-[#C2410C] rounded-full flex items-center justify-center text-white font-bold text-sm">
							A
						</div>
						<Link
							href="/dashboard"
							className="font-serif text-2xl font-bold text-[#1F1F1F] tracking-tight"
						>
							Annapurna
						</Link>
					</div>

					{/* DESKTOP LINKS */}
					<div className="hidden md:flex space-x-8 items-center">
						<Link
							href="/dashboard"
							className="text-stone-600 hover:text-[#C2410C] font-medium transition-colors"
						>
							Overview
						</Link>

						{/* Conditional Links based on Role */}
						{user.role === 'GIVER' ? (
							<Link
								href="/dashboard/create"
								className="text-stone-600 hover:text-[#C2410C] font-medium transition-colors"
							>
								Post Donation
							</Link>
						) : (
							<Link
								href="/dashboard/feed"
								className="text-stone-600 hover:text-[#C2410C] font-medium transition-colors"
							>
								Find Food
							</Link>
						)}

						<Link
							href="/dashboard/history"
							className="text-stone-600 hover:text-[#C2410C] font-medium transition-colors"
						>
							History
						</Link>

						{/* User Profile / Logout */}
						<div className="pl-4 border-l border-stone-200 flex items-center gap-4">
							<div className="text-right">
								<p className="text-xs font-bold text-[#1F1F1F]">{user.name}</p>
								<p className="text-[10px] text-stone-500 uppercase tracking-wider">
									{user.role}
								</p>
							</div>
							<button
								onClick={() => signOut({ callbackUrl: '/login' })}
								className="bg-stone-100 hover:bg-stone-200 text-stone-600 px-4 py-2 rounded-xl text-sm font-bold transition-all"
							>
								Sign Out
							</button>
						</div>
					</div>

					{/* MOBILE MENU BUTTON */}
					<div className="md:hidden flex items-center">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="text-stone-600 hover:text-[#C2410C]"
						>
							<svg
								className="w-8 h-8"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* MOBILE MENU DROPDOWN */}
			{isOpen && (
				<div className="md:hidden bg-white border-b border-stone-200">
					<div className="px-4 pt-2 pb-6 space-y-2">
						<Link
							href="/dashboard"
							className="block px-3 py-2 text-stone-600 font-medium hover:bg-stone-50 rounded-lg"
						>
							Overview
						</Link>
						{user.role === 'GIVER' ? (
							<Link
								href="/dashboard/create"
								className="block px-3 py-2 text-stone-600 font-medium hover:bg-stone-50 rounded-lg"
							>
								Post Donation
							</Link>
						) : (
							<Link
								href="/dashboard/feed"
								className="block px-3 py-2 text-stone-600 font-medium hover:bg-stone-50 rounded-lg"
							>
								Find Food
							</Link>
						)}
						<button
							onClick={() => signOut({ callbackUrl: '/login' })}
							className="w-full text-left px-3 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg mt-4"
						>
							Sign Out
						</button>
					</div>
				</div>
			)}
		</nav>
	)
}
