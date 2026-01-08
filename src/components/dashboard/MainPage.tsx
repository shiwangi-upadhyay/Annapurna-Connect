// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import SuccessToast from "../SuccessToast";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = session.user;
  const isGiver = user?.role === "GIVER";

  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1F1F1F] text-white p-10 md:p-16 shadow-2xl shadow-stone-900/20">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-wider text-[#C2410C]">
               DASHBOARD
            </span>
            {/* DEBUG TAG: Shows your current role */}
            <span className="text-[10px] text-stone-500 uppercase tracking-widest border border-stone-700 px-2 py-0.5 rounded">
              Role: {user?.role}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Hello, {user?.name?.split(" ")[0]}! <span className="text-4xl">👋</span>
          </h1>
          
          <p className="text-stone-300 text-lg mb-8 leading-relaxed">
            {isGiver 
              ? "You have the power to feed a community today. Ready to turn surplus into smiles?"
              : "Connecting you with fresh, surplus food from local heroes. Let's ensure nothing goes to waste."}
          </p>

          {/* MAIN ACTION BUTTON */}
          <Link 
            href={isGiver ? "/dashboard/create" : "/dashboard/feed"}
            className="inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A3412] text-white px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 shadow-lg shadow-orange-900/50"
          >
            {isGiver ? "Donate Food Now" : "Browse Available Food"}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>

          {isGiver && (
              <Link 
                href="/dashboard/manage"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 backdrop-blur-sm"
              >
                Manage Listings
              </Link>
            )}
        </div>

        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C2410C] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
          <p className="text-sm text-stone-500 font-bold uppercase tracking-wider">Total Impact</p>
          <p className="text-3xl font-serif font-bold text-[#1F1F1F] mt-2">0 <span className="text-sm text-stone-400 font-sans font-normal">kg saved</span></p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
          <p className="text-sm text-stone-500 font-bold uppercase tracking-wider">{isGiver ? "Active Listings" : "Your Claims"}</p>
          <p className="text-3xl font-serif font-bold text-[#1F1F1F] mt-2">0 <span className="text-sm text-stone-400 font-sans font-normal">active</span></p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
          <p className="text-sm text-stone-500 font-bold uppercase tracking-wider">Community</p>
          <p className="text-3xl font-serif font-bold text-[#1F1F1F] mt-2">500+ <span className="text-sm text-stone-400 font-sans font-normal">heroes</span></p>
        </div>
      </div>

      {/* 3. MOBILE FLOATING ACTION BUTTON (Visible only on mobile + If Giver) */}
      {isGiver && (
        <Link 
          href="/dashboard/create"
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#C2410C] text-white rounded-full flex items-center justify-center shadow-2xl shadow-orange-900/40 z-50 hover:scale-110 transition-transform"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </Link>
      )}
      <SuccessToast />
    </div>
  );
}