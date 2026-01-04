// src/app/login/page.tsx
'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    // BACKGROUND: Vintage Paper color
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f7ecde]">
      
      {/* MAIN CARD */}
      <div className="w-full max-w-7xl rounded-4xl  overflow-hidden flex flex-col md:flex-row justify-between  gap-4 min-h-137.5">
        
        {/* LEFT SIDE: Visual Wrapper (Hidden on Mobile) */}
        <div className="hidden md:block relative w-[40%] -ml-10 transform -skew-x-6 overflow-hidden rounded-r-[2.5rem] z-10">
            
            {/* IMAGE */}
            <div className="absolute inset-0 transform skew-x-6 scale-125 origin-center">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop" 
                alt="Community Food" 
                className="w-full h-full object-cover"
              />
              {/* OVERLAY: Warm Rust tint */}
              <div className="absolute inset-0 bg-[#C2410C]/40 mix-blend-multiply"></div>
            </div>

            {/* CONTENT */}
            <div className="relative h-full flex flex-col justify-between p-10 pl-14 text-white transform skew-x-6">
                <div>
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase opacity-90">Annapurna</h3>
                </div>

                <div className="max-w-sm">
                  <h2 className="font-serif text-3xl leading-tight mb-4 text-white drop-shadow-sm">
                    Welcome Back Hero
                  </h2>
                  <p className="text-sm opacity-90 mb-6 leading-relaxed">
                    "Food is symbolic of love when words are inadequate." — Alan D. Wolfelt
                  </p>
                </div>
            </div>
        </div>

        {/* RIGHT SIDE: The Form */}
        <div className="w-full md:w-[60%] flex flex-col justify-center p-8 md:pr-12 md:pl-12 relative z-0">
          
          <div className="absolute top-6 right-6 text-xs md:text-sm">
             <span className="text-stone-400">New here? </span>
             <Link href="/register" className="font-bold text-[#C2410C] hover:text-[#9A3412] transition underline decoration-[#C2410C]/30 underline-offset-4">Create Account</Link>
          </div>

          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1F1F1F] mb-1">Log In</h2>
            <p className="text-xs md:text-sm text-stone-500 mb-6">Continue your journey of giving.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-2 bg-red-50 text-red-600 text-xs rounded-lg text-center font-medium border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Email Address</label>
                <input name="email" type="email" placeholder="name@example.com" required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-stone-200 text-sm text-stone-800 focus:bg-white focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] outline-none transition-all placeholder:text-stone-300" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Password</label>
                    <a href="#" className="text-[10px] font-bold text-[#C2410C] hover:underline">Forgot?</a>
                </div>
                <input name="password" type="password" placeholder="••••••••" required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-stone-200 text-sm text-stone-800 focus:bg-white focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] outline-none transition-all placeholder:text-stone-300" 
                />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#C2410C] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#C2410C]/20 hover:bg-[#9A3412] hover:shadow-[#C2410C]/30 hover:-translate-y-0.5 transition-all duration-200 mt-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? "Signing in..." : "Log In"}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px bg-stone-200 flex-1"></div>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Or continue with</span>
              <div className="h-px bg-stone-200 flex-1"></div>
            </div>

            <button type="button" className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-600 font-bold py-3 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-all text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}