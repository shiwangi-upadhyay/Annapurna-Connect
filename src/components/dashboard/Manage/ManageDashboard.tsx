// src/components/dashboard/Manage/ManageDashboard.tsx
'use client'

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge"; 
import DeleteButton from "@/components/common/DeleteButton"; 
import ClaimsModal from "@/components/dashboard/History/ClaimsModal"; // 👈 IMPORT THE MODAL
import { deleteListing } from "@/features/food/actions";

export default function ManageDashboard({ listings }: { listings: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "EXPIRED" | "SOLD_OUT">("ALL");
  
  // 👈 NEW: State to track which listing is open
  const [selectedListing, setSelectedListing] = useState<any>(null);

  // --- FILTERING LOGIC (Same as before) ---
  const filteredListings = listings.filter((item) => {
    const isExpired = new Date(item.expiryAt) < new Date();
    const isSoldOut = item.remainingQty <= 0;

    const matchesSearch = 
      item.foodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (filterStatus === "ACTIVE") matchesStatus = !isExpired && !isSoldOut;
    else if (filterStatus === "EXPIRED") matchesStatus = isExpired && !isSoldOut;
    else if (filterStatus === "SOLD_OUT") matchesStatus = isSoldOut;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="overflow-hidden min-h-150 flex flex-col">
        
        {/* HEADER & CONTROLS */}
        <div className="p-8 border-b border-stone-100 bg-[#FDFBF7]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#1F1F1F]">My Donations</h1>
              <p className="text-stone-500">Manage listings and verify pickups.</p>
            </div>
            
            <Link 
              href="/dashboard/create" 
              className="px-6 py-3 bg-[#1F1F1F] text-white font-bold rounded-xl hover:bg-[#C2410C] transition-all shadow-lg hover:-translate-y-1 flex items-center gap-2"
            >
              <span>+ Post Food</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text"
                placeholder="Search food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:border-[#C2410C] outline-none text-[#1F1F1F] font-medium placeholder:text-stone-400"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {["ALL", "ACTIVE", "EXPIRED", "SOLD_OUT"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold border whitespace-nowrap transition-colors ${
                    filterStatus === status 
                      ? "bg-[#1F1F1F] text-white border-[#1F1F1F]" 
                      : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LISTINGS AREA */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-stone-50/30">
          <div className="space-y-4">
            
            {filteredListings.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-3xl mb-4 grayscale opacity-50">🔍</div>
                <h3 className="text-lg font-bold text-stone-700">No listings found</h3>
              </div>
            ) : (
              filteredListings.map((item) => {
                const isExpired = new Date(item.expiryAt) < new Date();
                const isDistributed = item.remainingQty <= 0;
                const canEdit = !isDistributed && !isExpired;
                const hasClaims = item.claims.length > 0;

                return (
                  <div key={item.id} className="group bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:border-[#C2410C] hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-center gap-6">
                    
                    {/* Left: Info */}
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-[#1F1F1F] text-lg">{item.foodType}</h3>
                        <StatusBadge status={item.status} expiryAt={item.expiryAt} remainingQty={item.remainingQty} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-stone-500 font-medium">
                         <span>📅 {new Date(item.createdAt).toLocaleDateString()}</span>
                         <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                         <span className={`${item.remainingQty > 0 ? "text-[#C2410C] font-bold" : ""}`}>
                           {item.remainingQty}kg Left
                         </span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 border-stone-100 pt-4 sm:pt-0">
                      
                      {/* 1. VIEW CLAIMS BUTTON (New) */}
                      {hasClaims ? (
                        <button
                          onClick={() => setSelectedListing(item)}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#C2410C] font-bold text-xs rounded-xl hover:bg-[#C2410C] hover:text-white transition-colors border border-orange-100"
                        >
                          <span className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-full">
                            {item.claims.length}
                          </span>
                          View Pickups
                        </button>
                      ) : (
                        <span className="text-xs text-stone-300 font-bold px-4">No Claims</span>
                      )}

                      <div className="h-8 w-px bg-stone-100 mx-2"></div>

                      {/* 2. EDIT BUTTON */}
                      {canEdit ? (
                        <Link 
                          href={`/dashboard/manage/${item.id}/edit`}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-50 text-stone-500 hover:bg-[#1F1F1F] hover:text-white transition-colors"
                          title="Edit Listing"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </Link>
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-50 text-stone-200 cursor-not-allowed">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                      )}

                      {/* 3. DELETE BUTTON */}
                      {!hasClaims && (
                        <DeleteButton 
                          id={item.id} 
                          onDelete={deleteListing} 
                          confirmMessage="Remove this listing?"
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          label=""
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 👈 RENDER MODAL IF OPEN */}
      {selectedListing && (
        <ClaimsModal 
          listing={selectedListing} 
          onClose={() => setSelectedListing(null)} 
        />
      )}
    </>
  );
}