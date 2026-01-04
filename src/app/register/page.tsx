// // src/app/register/page.tsx
// 'use client'

// import { useFormState } from "react-dom";
// import Link from "next/link";
// import { registerUser } from "@/features/auth/actions";

// const initialState = { error: "" };

// export default function RegisterPage() {
//   const [state, dispatch] = useFormState(registerUser, initialState);

//   return (
//     // WRAPPER: Reduced padding (p-4) to save screen space
//     <div className="min-h-screen w-full flex items-center justify-center">
      
//       {/* MAIN CARD: Reduced width (max-w-5xl) and height (min-h-[550px]) to remove scrollbar */}
//       <div className="w-full max-w-7xl rounded-4xl  overflow-hidden flex flex-col md:flex-row justify-between min-h-137.5">
        
//         {/* LEFT SIDE: Visual Wrapper */}
//         {/* skew-x-[-6deg] creates the slant. -ml-10 pulls it left. rounded-r-[2rem] softens the edge. */}
//         <div className="hidden md:block relative w-[40%] -ml-10 transform -skew-x-6 overflow-hidden rounded-r-[2.5rem] z-10">
            
//             {/* BACKGROUND IMAGE (Counter-Skewed) */}
//             <div className="absolute inset-0 transform skew-x-6 scale-125 origin-center">
//               <img 
//                 src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop" 
//                 alt="Community Food" 
//                 className="w-full h-full object-cover opacity-80"
//               />
//               <div className="absolute inset-0 bg-emerald-950/40 mix-blend-multiply"></div>
//             </div>

//             {/* CONTENT OVERLAY (Counter-Skewed) */}
//             <div className="relative h-full flex flex-col justify-between p-10 pl-14 text-white transform skew-x-[6deg]">
//                 <div>
//                   <h3 className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">Annapurna</h3>
//                 </div>

//                 <div className="max-w-sm">
//                   {/* Reduced font size from 4xl to 2xl/3xl for better fit */}
//                   <blockquote className="font-serif text-2xl lg:text-3xl leading-tight mb-4">
//                     "We make a living by what we get, but we make a life by what we give."
//                   </blockquote>
//                   <p className="text-sm opacity-70 mb-6">— Winston Churchill</p>
                  
//                   <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl w-max border border-white/10 shadow-lg">
//                     <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-stone-900 font-bold text-lg">
//                       A
//                     </div>
//                     <div>
//                       <p className="font-bold text-xs">Join 500+ Heroes</p>
//                       <p className="text-[10px] opacity-70">Rescuing food daily</p>
//                     </div>
//                   </div>
//                 </div>
//             </div>
//         </div>

//         {/* RIGHT SIDE: The Form */}
//         {/* Added pl-8 md:pl-12 to create the GAP between the slanted image and the form */}
//         <div className="w-full md:w-[60%] flex flex-col justify-center p-8 md:pr-12 md:pl-12 relative z-0">
          
//           <div className="absolute top-6 right-6 text-xs md:text-sm">
//               <span className="text-stone-400">Have an account? </span>
//               <Link href="/login" className="font-bold text-stone-800 hover:text-emerald-600 transition">Log In</Link>
//           </div>

//           <div className="w-full max-w-sm mx-auto">
//             {/* Reduced Header Size */}
//             <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-1">Create Account</h2>
//             <p className="text-xs md:text-sm text-stone-500 mb-6">Start your journey as a food hero today.</p>

//             {/* Tighter Spacing (space-y-4 instead of 5) */}
//             <form action={dispatch} className="space-y-4">
//               {state?.error && (
//                 <div className="p-2 bg-red-50 text-red-600 text-xs rounded-lg text-center font-medium border border-red-100">
//                   {state.error}
//                 </div>
//               )}

//               <div className="space-y-1">
//                 <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Full Name</label>
//                 <input name="name" type="text" placeholder="e.g. Adarsh Foods" required
//                   className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all" 
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Email Address</label>
//                 <input name="email" type="email" placeholder="name@example.com" required
//                   className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all" 
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Password</label>
//                 <input name="password" type="password" placeholder="••••••••" required minLength={6}
//                   className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all" 
//                 />
//               </div>

//               <div className="pt-1">
//                 <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-2 block">I want to...</label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <label className="cursor-pointer group">
//                     <input type="radio" name="role" value="GIVER" className="peer sr-only" required />
//                     <div className="text-center p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-500 peer-checked:bg-amber-600 peer-checked:text-white peer-checked:border-amber-600 transition-all duration-200">
//                       <span className="block font-bold text-sm">Donate Food</span>
//                       <span className="text-[10px] opacity-70 group-hover:opacity-100">Restaurant / Hotel</span>
//                     </div>
//                   </label>
//                   <label className="cursor-pointer group">
//                     <input type="radio" name="role" value="TAKER" className="peer sr-only" required />
//                     <div className="text-center p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-500 peer-checked:bg-amber-500 peer-checked:text-white peer-checked:border-amber-500 transition-all duration-200">
//                       <span className="block font-bold text-sm">Receive Food</span>
//                       <span className="text-[10px] opacity-70 group-hover:opacity-100">NGO / Charity</span>
//                     </div>
//                   </label>
//                 </div>
//               </div>

//               <button type="submit" className="w-full bg-amber-600 text-white font-bold py-3.5 rounded-xl shadow-sm shadow-amber-200 hover:bg-amber-500 hover:shadow-amber-300 hover:-translate-y-0.5 transition-all duration-200 mt-2 text-sm">
//                 Sign Up
//               </button>
//             </form>

//             <div className="mt-6 text-center">
//               <p className="text-[10px] text-stone-400">
//                 By signing up, you agree to our <a href="#" className="underline hover:text-stone-600">Terms</a> and <a href="#" className="underline hover:text-stone-600">Privacy Policy</a>.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// src/app/register/page.tsx
'use client'

import { useFormState } from "react-dom";
import Link from "next/link";
import { registerUser } from "@/features/auth/actions";

const initialState = { error: "" };

export default function RegisterPage() {
  const [state, dispatch] = useFormState(registerUser, initialState);

  return (
    // BACKGROUND: Vintage Paper color
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f7ecde]">
      
      {/* MAIN CARD */}
      <div className="w-full max-w-7xl  rounded-4xl  overflow-hidden flex flex-col md:flex-row justify-between min-h-137.5">
        
        {/* LEFT SIDE: Visual Wrapper (Skewed Image) */}
        <div className="hidden md:block relative w-[40%] -ml-10 transform -skew-x-6 overflow-hidden rounded-r-[2.5rem] z-10">  
            
            {/* IMAGE */}
            <div className="absolute inset-0 transform skew-x-6 scale-125 origin-center">
              <img 
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop" 
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
                  <blockquote className="font-serif text-2xl lg:text-3xl leading-tight mb-4 text-white drop-shadow-sm">
                    "We make a living by what we get, but we make a life by what we give."
                  </blockquote>
                  <p className="text-sm opacity-90 mb-6">— Winston Churchill</p>
                  
                  {/* BADGE */}
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl w-max border border-white/20">
                    <div className="h-10 w-10 rounded-full bg-[#C2410C] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      A
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">Join 500+ Heroes</p>
                      <p className="text-[10px] opacity-90">Rescuing food daily</p>
                    </div>
                  </div>
                </div>
            </div>
        </div>

        {/* RIGHT SIDE: The Form */}
        <div className="w-full md:w-[60%] flex flex-col justify-center p-8 md:pr-12 md:pl-12 relative z-0">
          
          <div className="absolute top-6 right-6 text-xs md:text-sm">
              <span className="text-stone-400">Have an account? </span>
              <Link href="/login" className="font-bold text-[#C2410C] hover:text-[#9A3412] transition underline decoration-[#C2410C]/30 underline-offset-4">Log In</Link>
          </div>

          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1F1F1F] mb-1">Create Account</h2>
            <p className="text-xs md:text-sm text-stone-500 mb-6">Start your journey as a food hero today.</p>

            <form action={dispatch} className="space-y-4">
              {state?.error && (
                <div className="p-2 bg-red-50 text-red-600 text-xs rounded-lg text-center font-medium border border-red-100">
                  {state.error}
                </div>
              )}

              {/* INPUTS */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Full Name</label>
                <input name="name" type="text" placeholder="e.g. Adarsh Foods" required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-stone-200 text-sm text-stone-800 focus:bg-white focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] outline-none transition-all placeholder:text-stone-300" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Email Address</label>
                <input name="email" type="email" placeholder="name@example.com" required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-stone-200 text-sm text-stone-800 focus:bg-white focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] outline-none transition-all placeholder:text-stone-300" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Password</label>
                <input name="password" type="password" placeholder="••••••••" required minLength={6}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-stone-200 text-sm text-stone-800 focus:bg-white focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] outline-none transition-all placeholder:text-stone-300" 
                />
              </div>

              {/* ROLES: Fixed Colors (Both use Rust Orange now) */}
              <div className="pt-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-2 block">I want to...</label>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* CARD 1: Donate Food */}
                  <label className="cursor-pointer group">
                    <input type="radio" name="role" value="GIVER" className="peer sr-only" required />
                    <div className="text-center p-3 rounded-xl border border-stone-200 bg-white text-stone-500 hover:border-[#C2410C] hover:text-[#C2410C] peer-checked:bg-[#C2410C] hover:peer-checked:text-white peer-checked:text-white peer-checked:border-[#C2410C] transition-all duration-200">
                      <span className="block font-bold text-sm">Donate Food</span>
                      <span className="text-[10px] opacity-70 peer-checked:opacity-100">Restaurant / Hotel</span>
                    </div>
                  </label>
                  
                  {/* CARD 2: Receive Food (Fixed: Removed Black, added Rust Orange) */}
                  <label className="cursor-pointer group">
                    <input type="radio" name="role" value="TAKER" className="peer sr-only" required />
                    <div className="text-center p-3 rounded-xl border border-stone-200 bg-white text-stone-500 hover:border-[#C2410C] hover:text-[#C2410C] peer-checked:bg-[#C2410C] hover:peer-checked:text-white peer-checked:text-white peer-checked:border-[#C2410C] transition-all duration-200">
                      <span className="block font-bold text-sm">Receive Food</span>
                      <span className="text-[10px] opacity-70 peer-checked:opacity-100">NGO / Charity</span>
                    </div>
                  </label>

                </div>
              </div>

              {/* BUTTON */}
              <button type="submit" className="w-full bg-[#C2410C] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#C2410C]/20 hover:bg-[#9A3412] hover:shadow-[#C2410C]/30 hover:-translate-y-0.5 transition-all duration-200 mt-2 text-sm">
                Sign Up
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[10px] text-stone-400">
                By signing up, you agree to our <a href="#" className="underline hover:text-[#C2410C]">Terms</a> and <a href="#" className="underline hover:text-[#C2410C]">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}