"use client";

import { updateProfile } from "@/features/user/actions";
import { useFormState } from "react-dom";
import Link from "next/link";
import { useState } from "react";

export default function EditProfileForm({ user }: { user: any }) {
  const [state, dispatch] = useFormState(updateProfile, { error: "" });
  const [loading, setLoading] = useState(false);

  // Helper for Initials
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <form
      action={(payload) => {
        setLoading(true);
        dispatch(payload);
      }}
      className="w-full max-w-xl mx-auto flex flex-col items-center"
    >
      {/* 1. AVATAR UPLOAD */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full bg-[#F5F5F4] text-[#C2410C] flex items-center justify-center text-4xl font-serif font-bold overflow-hidden border border-stone-200">
          {user.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <button
          type="button"
          className="text-sm font-bold text-[#1F1F1F] hover:text-[#C2410C] bg-[#E5E5E5] px-4 py-2 rounded-full transition-colors"
        >
          Change photo
        </button>
      </div>

      {/* Error Message */}
      {state?.error && (
        <div className="w-full mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold text-center">
          {state.error}
        </div>
      )}

      {/* 2. FORM FIELDS (Clean, Minimal Labels) */}
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 ml-3">
              First Name
            </label>
            <input
              name="name"
              defaultValue={user.name || ""}
              placeholder="Your Name"
              className="w-full px-5 py-3 bg-white rounded-2xl border border-stone-200 text-[#1F1F1F] font-bold focus:border-[#C2410C] outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 ml-3">
              Organization
            </label>
            <input
              name="orgName"
              defaultValue={user.orgName || ""}
              placeholder="Company / NGO"
              className="w-full px-5 py-3 bg-white rounded-2xl border border-stone-200 text-[#1F1F1F] font-medium focus:border-[#C2410C] outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-500 ml-3">Bio</label>
          <textarea
            name="bio"
            rows={3}
            defaultValue={user.bio || ""}
            placeholder="Tell your story..."
            className="w-full px-5 py-3 bg-white rounded-2xl border border-stone-200 text-[#1F1F1F] focus:border-[#1F1F1F] outline-none transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 ml-3">
              Phone
            </label>
            <input
              name="phone"
              defaultValue={user.phone || ""}
              placeholder="+91..."
              className="w-full px-5 py-3 bg-white rounded-2xl border border-stone-200 text-[#1F1F1F] font-medium focus:border-[#1F1F1F] outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 ml-3">
              Location
            </label>
            <input
              name="address"
              defaultValue={user.address || ""}
              placeholder="City, State"
              className="w-full px-5 py-3 bg-white rounded-2xl border border-stone-200 text-[#1F1F1F] font-medium focus:border-[#1F1F1F] outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* 3. ACTIONS */}
      <div className="flex items-center gap-4 mt-10">
        <Link
          href="/dashboard/profile"
          className="px-8 py-3 bg-[#E5E5E5] hover:bg-[#d4d4d4] text-[#1F1F1F] font-bold rounded-full transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-[#1F1F1F] text-white font-bold rounded-full hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
