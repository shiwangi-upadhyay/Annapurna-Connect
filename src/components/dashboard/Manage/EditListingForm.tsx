'use client'

import { updateListing } from "@/features/food/actions";
import { useFormState } from "react-dom";
import Link from "next/link";

export default function EditListingForm({ listing }: { listing: any }) {
  // Bind the Listing ID to the server action
  const updateActionWithId = updateListing.bind(null, listing.id);
  const [state, dispatch] = useFormState(updateActionWithId, { error: "" });

  // Helper: Calculate remaining hours for the default value
  // (Expiry Date - Current Date) converted to hours
  const hoursRemaining = Math.max(
    1, // Minimum 1 hour default
    Math.round((new Date(listing.expiryAt).getTime() - new Date().getTime()) / (1000 * 60 * 60))
  );

  return (
    <form action={dispatch} className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-stone-200 max-w-xl mx-auto">
      
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {state.error}
        </div>
      )}

      {/* 1. Food Type */}
      <div>
        <label className="block text-sm font-bold text-stone-600 mb-2">Food Item</label>
        <input 
          name="foodType" 
          type="text" 
          defaultValue={listing.foodType}
          required
          className="w-full p-3 rounded-xl border border-stone-200 focus:border-[#C2410C] outline-none font-bold text-[#1F1F1F]"
        />
      </div>

      {/* 2. Quantity & Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-stone-600 mb-2">Total Qty (kg)</label>
          <input 
            name="quantity" 
            type="number" 
            step="0.5"
            defaultValue={listing.totalQtyKg}
            required
            className="w-full p-3 rounded-xl border border-stone-200 focus:border-[#C2410C] outline-none font-bold text-[#1F1F1F]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-600 mb-2">
            Reset Validity (Hours)
          </label>
          <input 
            name="expiryHours" 
            type="number" 
            min="1"
            defaultValue={hoursRemaining} 
            required
            className="w-full p-3 rounded-xl border border-stone-200 focus:border-[#C2410C] outline-none font-bold text-[#1F1F1F]"
          />
          <p className="text-[10px] text-stone-400 mt-1">Updates expiry from right now.</p>
        </div>
      </div>

      {/* 3. Description */}
      <div>
        <label className="block text-sm font-bold text-stone-600 mb-2">Description</label>
        <textarea 
          name="description" 
          rows={3}
          defaultValue={listing.description || ""}
          className="w-full p-3 rounded-xl border border-stone-200 focus:border-[#C2410C] outline-none text-stone-600"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <Link 
          href="/dashboard/manage"
          className="flex-1 py-3 bg-stone-100 text-stone-600 font-bold rounded-xl text-center hover:bg-stone-200 transition-colors"
        >
          Cancel
        </Link>
        <button 
          type="submit" 
          className="flex-1 py-3 bg-[#1F1F1F] text-white font-bold rounded-xl hover:bg-[#C2410C] transition-colors shadow-lg"
        >
          Save Changes
        </button>
      </div>

    </form>
  );
}