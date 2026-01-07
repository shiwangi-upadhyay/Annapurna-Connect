import { getUserHistory } from "@/features/food/queries";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SuccessToast from "@/components/SuccessToast";
import CompleteButton from "@/components/dashboard/History/CompleteButton";

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { donations, claims } = await getUserHistory(session.user.id!);

  return (
    <div className="space-y-12 pb-20">
      
      {/* Toast handles ?claimed=true or ?posted=true */}
      <SuccessToast />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#1F1F1F]">My History</h1>
        <p className="text-stone-500">Track your contributions and pickups.</p>
      </div>

      {/* SECTION 1: MY PICKUPS (What I am taking) */}
      <section>
        <h2 className="text-xl font-bold text-[#1F1F1F] mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#1F1F1F] text-white flex items-center justify-center text-xs">⬇</span>
          My Pickups (Claims)
        </h2>
        
        {claims.length === 0 ? (
          <p className="text-stone-400 text-sm italic">You haven't claimed any food yet.</p>
        ) : (
          <div className="grid gap-4">
            {claims.map((claim) => (
              <div key={claim.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                
                {/* Left: Food Details */}
                <div>
                  <h3 className="font-bold text-lg text-[#1F1F1F]">{claim.listing.foodType}</h3>
                  <div className="text-sm text-stone-500 mt-2 space-y-1">
                    <p>Quantity: <span className="font-bold text-stone-700">{claim.claimedQty} kg</span></p>
                    <p>From: <span className="font-semibold">{claim.listing.giver.name}</span></p>
                    <p>Giver Contact: <span className="text-[#C2410C]">{claim.listing.giver.email}</span></p>
                  </div>
                </div>
                
                {/* Right: The Secret Verification Code */}
                <div className="bg-[#FDFBF7] p-4 rounded-xl border border-stone-100 min-w-[200px] flex flex-col justify-center text-center">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                    Pickup Verification
                  </p>
                  
                  {/* The Code Box */}
                  <div className="bg-white border-2 border-dashed border-stone-200 rounded-lg p-3 mb-2">
                    <span className="block text-[10px] text-stone-400 uppercase mb-1">Show this to Giver</span>
                    <span className="font-mono text-2xl font-bold text-[#C2410C] tracking-widest selection:bg-[#C2410C] selection:text-white">
                      {claim.id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 mt-1">
                    Status: <span className={`font-bold ${claim.status === 'COMPLETED' ? 'text-green-600' : 'text-stone-700'}`}>{claim.status}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: MY DONATIONS (What I gave) */}
      <section>
        <h2 className="text-xl font-bold text-[#1F1F1F] mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#C2410C] text-white flex items-center justify-center text-xs">⬆</span>
          My Donations
        </h2>

        {donations.length === 0 ? (
          <p className="text-stone-400 text-sm italic">You haven't donated any food yet.</p>
        ) : (
          <div className="grid gap-4">
            {donations.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                
                {/* Donation Header */}
                <div className="flex justify-between items-start mb-4 border-b border-stone-100 pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-[#1F1F1F]">{item.foodType}</h3>
                    <p className="text-xs text-stone-500">Posted on {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-500'}`}>
                    {item.status}
                  </span>
                </div>

                {/* Claims List (Who is coming?) */}
                <div className="bg-stone-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                    Claims & Pickups ({item.claims.length})
                  </p>
                  
                  {item.claims.length === 0 ? (
                    <p className="text-sm text-stone-400">No one has claimed this yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {item.claims.map((c) => (
                        <li key={c.id} className="text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded-lg border border-stone-200 shadow-sm gap-3">
                          
                          {/* Taker Info */}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#1F1F1F]">{c.taker.name}</span>
                              <span className="text-xs bg-stone-100 px-1.5 py-0.5 rounded text-stone-500">{c.taker.email}</span>
                            </div>
                            <div className="text-xs text-stone-500 mt-1">
                              Taking <span className="font-bold text-stone-800">{c.claimedQty} kg</span> 
                              <span className="mx-2 text-stone-300">|</span>
                              Code: <span className="font-mono font-bold text-[#C2410C]">{c.id.slice(-6).toUpperCase()}</span>
                            </div>
                          </div>

                          {/* Action Button (Confirm Pickup) */}
                          <div>
                            <CompleteButton 
                              listingId={item.id} 
                              claimId={c.id} 
                              isCompleted={c.status === "COMPLETED"} 
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}