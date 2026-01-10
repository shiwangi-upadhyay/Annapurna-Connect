// src/components/dashboard/History/ClaimsModal.tsx
'use client'

import CompleteButton from "./CompleteButton";

export default function ClaimsModal({ 
  listing, 
  onClose 
}: { 
  listing: any, 
  onClose: () => void 
}) {
  
  // Close if user clicks the darker backdrop background
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1F1F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      {/* Modal Content Box */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#FDFBF7] p-6 border-b border-stone-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold font-serif text-[#1F1F1F]">{listing.foodType}</h3>
            <p className="text-xs text-stone-500 uppercase tracking-wide font-bold">Manage Pickups</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto bg-stone-50/50">
          {listing.claims.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-stone-400 italic">No claims yet. Waiting for heroes.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {listing.claims.map((c: any) => (
                <div key={c.id} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex flex-col gap-3">
                  
                  {/* Top Row: User Info & Quantity */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#C2410C] font-bold">
                        {c.taker.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#1F1F1F] text-sm">{c.taker.name}</p>
                        <p className="text-xs text-stone-500">{c.taker.email}</p>
                      </div>
                    </div>
                    <span className="bg-stone-100 px-2 py-1 rounded text-xs font-bold text-stone-600">
                      Taking {c.claimedQty} kg
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-stone-100 w-full"></div>

                  {/* Bottom Row: Code & Action */}
                  <div className="flex justify-between items-center">
                    <div className="text-xs">
                      <span className="text-stone-400">Secure Code:</span>
                      <span className="ml-2 font-mono font-bold text-[#C2410C] text-sm tracking-widest">
                        {c.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    
                    <CompleteButton 
                      listingId={listing.id} 
                      claimId={c.id} 
                      isCompleted={c.status === "COMPLETED"} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white p-4 border-t border-stone-100 text-center text-xs text-stone-400">
          Click outside to close
        </div>
      </div>
    </div>
  );
}