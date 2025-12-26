// src/app/register/page.tsx
'use client'

import { useFormState } from "react-dom";
import Link from "next/link";
import { registerUser } from "@/features/auth/actions";

const initialState = { error: "" };

export default function RegisterPage() {
  const [state, dispatch] = useFormState(registerUser, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center">
      
      {/* MAIN CARD CONTAINER */}
      {/* Added 'bg-white' here so the clipped area shows white */}
      <div className="w-full  bg-white overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT SIDE: Visual & Inspiration */}
        <div 
          className="relative w-full md:w-5/12 bg-stone-900 hidden md:flex flex-col justify-between p-8 text-white z-10 m-6 rounded-4xl "
          // === NEW: Added clip-path for the tilt effect ===
          style={{ clipPath: "polygon(0 0, 100% 0, 88% 100%, 0% 100%)" }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden ">
            <img 
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop" 
              alt="Community Food" 
              className="w-full h-full object-cover opacity-60 rounded-4xl"
            />
            
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 mt-4">
            <h3 className="text-lg font-bold tracking-widest uppercase opacity-80">Annapurna</h3>
          </div>

          <div className="relative z-10 mb-12 mr-8"> {/* Added margin right so text doesn't hit tilt */}
            <blockquote className="font-serif text-3xl leading-tight">
              "We make a living by what we get, but we make a life by what we give."
            </blockquote>
            <p className="mt-4 text-sm opacity-70">— Winston Churchill</p>
            
            <div className="mt-10 flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl w-max">
              <div className="h-10 w-10 rounded-full bg-amber-400 flex items-center justify-center text-stone-900 font-bold">
                A
              </div>
              <div className="text-xs">
                <p className="font-bold">Join 500+ Heroes</p>
                <p className="opacity-70">Rescuing food daily</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: The Form */}
        {/* Added '-ml-12' to pull the form slightly under the tilted edge for a layered look */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative md:-ml-12 z-0">
          
          <div className="absolute top-8 right-8 text-sm">
             <span className="text-stone-400">Have an account? </span>
             <Link href="/login" className="font-bold text-stone-800 hover:text-emerald-600 transition">Log In</Link>
          </div>

          <div className="max-w-md mx-auto w-full md:pl-10"> {/* Added padding left to center form visually */}
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-2">Create Account</h2>
            <p className="text-stone-500 mb-8">Start your journey as a food hero today.</p>

            <form action={dispatch} className="space-y-5">
              {state?.error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                  {state.error}
                </div>
              )}

              {/* Inputs... (No changes here) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Full Name</label>
                <input name="name" type="text" placeholder="e.g. Adarsh Foods" required
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Email Address</label>
                <input name="email" type="email" placeholder="name@example.com" required
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Password</label>
                <input name="password" type="password" placeholder="••••••••" required minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" 
                />
              </div>

              {/* Roles... (No changes here) */}
              <div className="pt-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2 block">I want to...</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="cursor-pointer">
                    <input type="radio" name="role" value="GIVER" className="peer sr-only" required />
                    <div className="text-center p-3 rounded-xl border border-stone-200 hover:bg-emerald-50 hover:border-emerald-200 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600 transition-all">
                      <span className="block font-bold">Donate Food</span>
                      <span className="text-[10px] opacity-70">Restaurant / Hotel</span>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="role" value="TAKER" className="peer sr-only" required />
                    <div className="text-center p-3 rounded-xl border border-stone-200 hover:bg-amber-50 hover:border-amber-200 peer-checked:bg-amber-500 peer-checked:text-white peer-checked:border-amber-500 transition-all">
                      <span className="block font-bold">Receive Food</span>
                      <span className="text-[10px] opacity-70">NGO / Charity</span>
                    </div>
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all duration-200">
                Sign Up
              </button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-xs text-stone-400">By signing up, you agree to our Terms and Privacy Policy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}