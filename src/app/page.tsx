// src/app/page.tsx
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1F1F1F] font-sans selection:bg-[#C2410C] selection:text-white overflow-x-hidden">
      
      {/* BACKGROUND NOISE TEXTURE (Optional: Adds a premium paper feel) */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* 1. NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-[#C2410C] to-[#ea580c] rounded-full flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">A</div>
          <span className="font-serif text-xl font-bold tracking-tight text-stone-800">Annapurna Connect</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-stone-600 hover:text-[#C2410C] transition-colors">Log In</Link>
          <Link href="/register" className="px-6 py-2.5 bg-[#1F1F1F] text-white text-sm font-bold rounded-full hover:bg-stone-800 transition-all shadow-xl shadow-stone-400/20 hover:shadow-stone-400/40 hover:-translate-y-0.5">
            Join Now
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-32 md:pb-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 shadow-sm mb-10 hover:shadow-md transition-shadow cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C2410C]"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Active in Gurugram & Delhi</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[1] mb-8 text-[#1F1F1F] tracking-tight">
            Share Food. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2410C] via-[#ea580c] to-[#ca8a04]">
              Share Love.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-500 leading-relaxed mb-12 max-w-2xl mx-auto font-light">
            Don't let good food go to waste. We connect surplus meals from restaurants with local communities in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/register?role=GIVER" 
              className="group relative px-8 py-4 bg-[#C2410C] text-white text-lg font-bold rounded-2xl shadow-xl shadow-orange-500/30 overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-2">
                Donate Food
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </Link>
            <Link 
              href="/register?role=TAKER" 
              className="px-8 py-4 bg-white text-[#1F1F1F] border border-stone-200 text-lg font-bold rounded-2xl hover:border-stone-400 hover:bg-stone-50 transition-all shadow-sm hover:shadow-lg"
            >
              I Need Food
            </Link>
          </div>
        </div>
      </main>

      {/* 3. INFINITE MARQUEE WITH FADE EDGES */}
      <div className="relative w-full overflow-hidden bg-[#1F1F1F] py-16 -rotate-1 scale-105 mb-32 border-y-4 border-[#C2410C]">
        {/* Gradient Overlay for Fade Effect */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#1F1F1F] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#1F1F1F] to-transparent z-10"></div>

        <div className="flex gap-8 animate-scroll whitespace-nowrap">
          {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((i, idx) => (
            <div key={idx} className="w-80 h-56 rounded-2xl overflow-hidden relative flex-shrink-0 border-4 border-stone-800 opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-500 cursor-pointer">
               <img 
                 src="/HomePage/infi1.jpg" // Using your single image
                 className="w-full h-full object-cover"
                 alt="Food Rescue" 
               />
               <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FEATURE CARDS (THE UPGRADE) */}
      <section className="max-w-7xl mx-auto px-6 mb-32 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-serif font-bold text-[#1F1F1F]">How it works</h2>
          <p className="text-stone-500 mt-3 text-lg">Simple steps to make a massive impact.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              step: "01", 
              icon: "📸", 
              title: "Snap & Upload", 
              text: "Restaurant or Hotel? Just take a photo of surplus food, set the quantity, and post it in 30 seconds." 
            },
            { 
              step: "02", 
              icon: "📍", 
              title: "Instant Alert", 
              text: "Verified NGOs and volunteers nearby get a notification instantly. No calls, no coordination headaches." 
            },
            { 
              step: "03", 
              icon: "🤝", 
              title: "Secure Pickup", 
              text: "The taker shows a secure secret code to the giver. Hand over the food, and the transaction is tracked." 
            }
          ].map((card, i) => (
            <div key={i} className="group relative p-8 rounded-[2.5rem] bg-white border border-stone-100 shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Watermark Number */}
              <div className="absolute -right-6 -top-6 text-9xl font-serif font-bold text-stone-50 group-hover:text-orange-100/50 transition-colors duration-500 pointer-events-none select-none">
                {card.step}
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center text-3xl mb-8 border border-orange-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-stone-800">{card.title}</h3>
                <p className="text-stone-500 leading-relaxed font-medium">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="bg-[#1F1F1F] text-white py-24 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C2410C]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
                Built for the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C2410C] to-[#fb923c]">Community.</span>
              </h2>
              <p className="text-stone-400 text-xl mb-10 max-w-md mx-auto lg:mx-0">
                A transparent network of trust between kitchens and shelters.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 text-[#C2410C] font-bold text-lg hover:text-white transition-colors group">
                Join our mission 
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
            
            <div className="flex-1 grid gap-6 w-full max-w-lg">
              {/* Card 1 */}
              <div className="bg-stone-800/50 backdrop-blur-sm p-8 rounded-3xl border border-stone-700 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex gap-1 mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-stone-300 italic mb-6 text-lg">"We used to throw away 5kg of rice daily. Now, it feeds 20 people at the shelter down the street."</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C2410C] to-orange-600 flex items-center justify-center font-bold text-white">RK</div>
                  <div>
                    <p className="font-bold text-white">The Royal Kitchen</p>
                    <p className="text-xs text-stone-500 uppercase tracking-wider">Restaurant Partner</p>
                  </div>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-[#FDFBF7] text-[#1F1F1F] p-8 rounded-3xl border border-stone-200 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 hover:z-10">
                <div className="flex gap-1 mb-4 text-[#C2410C]">⭐⭐⭐⭐⭐</div>
                <p className="font-serif text-xl mb-6 font-bold">"The OTP system makes it so safe. We know exactly who is donating and who is picking up."</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-600">HH</div>
                  <div>
                    <p className="font-bold">Helping Hands NGO</p>
                    <p className="text-xs text-stone-500 uppercase tracking-wider">Verified Taker</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#191919] border-t border-stone-800 text-stone-500 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400 font-serif font-bold text-xl">A</div>
          <p className="text-sm">© 2026 Annapurna Connect. Made with ❤️ in Gurugram.</p>
        </div>
      </footer>
    </div>
  );
}