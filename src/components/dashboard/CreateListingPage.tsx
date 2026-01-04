// src/app/dashboard/create/page.tsx
'use client'

import { useFormState } from "react-dom";
import { createListing } from "@/features/food/actions";
import Link from "next/link";

const initialState = { error: "" };

export default function CreateListingPage() {
  const [state, dispatch] = useFormState(createListing, initialState);

  return (
    <div className="max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-stone-500 hover:text-[#C2410C] mb-2 inline-block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-3xl font-serif font-bold text-[#1F1F1F]">Donate Surplus Food</h1>
        <p className="text-stone-500 mt-2">
          Your contribution can feed a family today. Please provide accurate details.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-stone-200 border border-stone-100">
        <form action={dispatch} className="space-y-6">
          
          {/* Error Message */}
          {state?.error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 font-medium">
              🚨 {state.error}
            </div>
          )}

          {/* 1. Food Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">What are you donating?</label>
            <input 
              name="foodType" 
              type="text" 
              placeholder="e.g. Mixed Veg Curry & Rice" 
              required
              className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-stone-200 focus:bg-white focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] outline-none transition-all font-medium text-[#1F1F1F]"
            />
          </div>

          {/* 2. Quantity & Expiry Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Quantity (kg)</label>
              <div className="relative">
                <input 
                  name="quantity" 
                  type="number" 
                  min="1" 
                  step="0.5"
                  placeholder="e.g. 5" 
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-stone-200 focus:bg-white focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] outline-none transition-all font-medium text-[#1F1F1F]"
                />
                <span className="absolute right-4 top-3.5 text-stone-400 text-sm font-bold">kg</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Good for (Hours)</label>
              <div className="relative">
                <input 
                  name="expiryHours" 
                  type="number" 
                  min="1" 
                  placeholder="e.g. 4" 
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-stone-200 focus:bg-white focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] outline-none transition-all font-medium text-[#1F1F1F]"
                />
                <span className="absolute right-4 top-3.5 text-stone-400 text-sm font-bold">hrs</span>
              </div>
            </div>
          </div>

          {/* 3. Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Description / Notes</label>
            <textarea 
              name="description" 
              rows={3}
              placeholder="Contains nuts? Spicy? Pickup instructions?" 
              className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-stone-200 focus:bg-white focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] outline-none transition-all text-sm text-[#1F1F1F]"
            />
          </div>

          {/* 4. Event Toggle */}
          <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <input 
              type="checkbox" 
              name="isEvent" 
              id="eventCheck"
              className="w-5 h-5 text-[#C2410C] rounded focus:ring-[#C2410C] border-gray-300" 
            />
            <label htmlFor="eventCheck" className="text-sm text-stone-700">
              <span className="block font-bold text-[#C2410C]">Is this a Bulk Event? (Panghat)</span>
              <span className="text-xs opacity-80">Check this if this is leftover from a wedding or large party.</span>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all hover:-translate-y-1 mt-4 text-lg"
          >
            Post Donation
          </button>

        </form>
      </div>
    </div>
  );
}