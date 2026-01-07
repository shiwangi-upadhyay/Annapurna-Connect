'use client'

import { useFormState } from "react-dom";
import { claimFood } from "@/features/food/actions";
import { useState } from "react";

export default function ClaimForm({ 
  listingId, 
  maxQty 
}: { 
  listingId: string, 
  maxQty: number 
}) {
  const [state, dispatch] = useFormState(claimFood, { error: "" });
  // Default to claiming everything, but user can change it
  const [qty, setQty] = useState(maxQty);

  return (
    <form action={dispatch} className="bg-stone-50 rounded-2xl p-6 border border-stone-200 mt-6">
      
      <h3 className="font-bold text-[#1F1F1F] mb-4">Reserve this Food</h3>
      
      {state?.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg font-medium">
          🚨 {state.error}
        </div>
      )}

      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
            Amount to take (kg)
          </label>
          <input 
            type="number" 
            name="claimQty"
            value={qty}
            onChange={(e) => setQty(parseFloat(e.target.value))}
            max={maxQty}
            min={0.5}
            step={0.5}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#C2410C] outline-none font-bold text-lg"
          />
        </div>
        
        {/* Hidden ID field so the action knows which food to claim */}
        <input type="hidden" name="listingId" value={listingId} />

        <button 
          type="submit"
          className="bg-[#1F1F1F] hover:bg-[#C2410C] text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all hover:-translate-y-1 h-[52px]"
        >
          Confirm Claim
        </button>
      </div>
      
      <p className="text-xs text-stone-400 mt-3">
        Maximum available: <strong>{maxQty} kg</strong>
      </p>
    </form>
  );
}