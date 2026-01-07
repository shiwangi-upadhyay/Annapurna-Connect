// src/components/dashboard/History/CompleteButton.tsx
'use client'

import { markClaimAsCompleted } from "@/features/food/actions";
import { useState } from "react";

export default function CompleteButton({ 
  listingId, 
  claimId, 
  isCompleted 
}: { 
  listingId: string, 
  claimId: string, 
  isCompleted: boolean 
}) {
  const [loading, setLoading] = useState(false);

  if (isCompleted) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
        ✅ Picked Up
      </span>
    );
  }

  const handleComplete = async () => {
    if (!confirm("Confirm that you have picked up this food?")) return;
    
    setLoading(true);
    await markClaimAsCompleted(listingId, claimId);
    setLoading(false);
  };

  return (
    <button 
      onClick={handleComplete}
      disabled={loading}
      className="text-xs bg-[#1F1F1F] text-white px-3 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
    >
      {loading ? "Updating..." : "Confirm Pickup"}
    </button>
  );
}