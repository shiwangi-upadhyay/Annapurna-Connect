"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/dashboard/Manage/StatusBadge";
import ClaimsModal from "./ClaimsModal"; // Import the new modal

export default function HistoryDashboard({
  donations,
  claims,
}: {
  donations: any[];
  claims: any[];
}) {
  const [activeTab, setActiveTab] = useState<"DONATIONS" | "PICKUPS">(
    "PICKUPS"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "ACTIVE" | "COMPLETED"
  >("ALL");

  // NEW: Track which donation is currently open in the modal
  const [selectedDonation, setSelectedDonation] = useState<any>(null);

  // --- FILTERING LOGIC (Keep existing logic) ---
  const filterData = (data: any[], type: "DONATION" | "PICKUP") => {
    return data.filter((item) => {
      const matchesSearch =
        item.foodType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.listing?.foodType
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.id.includes(searchQuery);

      let matchesStatus = true;
      if (filterStatus === "ACTIVE") {
        matchesStatus =
          type === "DONATION"
            ? item.status === "AVAILABLE"
            : item.status === "RESERVED";
      } else if (filterStatus === "COMPLETED") {
        matchesStatus =
          type === "DONATION"
            ? item.status === "SOLD_OUT" || item.remainingQty === 0
            : item.status === "COMPLETED";
      }

      return matchesSearch && matchesStatus;
    });
  };

  const filteredDonations = filterData(donations, "DONATION");
  const filteredClaims = filterData(claims, "PICKUP");

  return (
    <>
      <div className="overflow-hidden min-h-150 flex flex-col">
        {/* 1. HEADER & CONTROLS (Keep existing code) */}
        <div className="p-8 border-b border-stone-100 bg-[#FDFBF7]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#1F1F1F]">
                My History
              </h1>
              <p className="text-stone-500">
                Manage your impact and transactions.
              </p>
            </div>
            <div className="bg-stone-200/50 p-1 rounded-xl flex gap-1">
              <button
                onClick={() => setActiveTab("PICKUPS")}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "PICKUPS"
                    ? "bg-white text-[#C2410C] shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                My Pickups
              </button>
              <button
                onClick={() => setActiveTab("DONATIONS")}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "DONATIONS"
                    ? "bg-white text-[#C2410C] shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                My Donations
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search food, ID, or names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:border-[#C2410C] outline-none text-[#1F1F1F] font-medium placeholder:text-stone-400"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {["ALL", "ACTIVE", "COMPLETED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold border whitespace-nowrap transition-colors ${
                    filterStatus === status
                      ? "bg-[#1F1F1F] text-white border-[#1F1F1F]"
                      : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. SCROLLABLE LIST AREA */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-stone-50/30">
          {/* --- VIEW: PICKUPS (Keep existing code) --- */}
          {activeTab === "PICKUPS" && (
            <div className="space-y-4">
              {filteredClaims.length === 0 ? (
                <EmptyState type="PICKUP" isSearch={!!searchQuery} />
              ) : (
                filteredClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="group bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6"
                  >
                    <div
                      className={`w-full md:w-1 h-1 md:h-auto rounded-full ${
                        claim.status === "COMPLETED"
                          ? "bg-green-500"
                          : "bg-[#C2410C]"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-[#1F1F1F]">
                          {claim.listing.foodType}
                        </h3>
                        <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded">
                          #{claim.id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-stone-500">
                        <span className="flex items-center gap-1">
                          <span className="text-[#C2410C] font-bold">
                            {claim.claimedQty}kg
                          </span>{" "}
                          claimed
                        </span>
                        <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                        <span>
                          From:{" "}
                          <span className="font-medium text-stone-700">
                            {claim.listing.giver.name}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#FDFBF7] px-6 py-3 rounded-xl border border-stone-200 flex flex-col items-center justify-center min-w-35">
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                        Your Code
                      </span>
                      <span className="text-2xl font-mono font-bold text-[#C2410C] tracking-widest">
                        {claim.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* --- VIEW: DONATIONS (UPDATED: Clean Rows) --- */}
          {activeTab === "DONATIONS" && (
            <div className="space-y-3">
              {filteredDonations.length === 0 ? (
                <EmptyState type="DONATION" isSearch={!!searchQuery} />
              ) : (
                filteredDonations.map((item) => (
                  <div
                    key={item.id}
                    className=" p-4 rounded-2xl border border-stone-100 shadow-sm hover:border-[#C2410C] hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-center gap-4"
                  >
                    {/* Left: Info */}
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-[#1F1F1F] text-lg">
                          {item.foodType}
                        </h3>
                        <StatusBadge
                          status={item.status}
                          expiryAt={item.expiryAt}
                          remainingQty={item.remainingQty}
                        />
                      </div>
                      <p className="text-xs text-stone-400">
                        {new Date(item.createdAt).toLocaleDateString()} •{" "}
                        {item.remainingQty}kg remaining
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {/* Compact Count Badge */}
                      <div className="flex flex-col items-center sm:items-end">
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                          Claims
                        </span>
                        <span className="text-xl font-bold text-[#1F1F1F]">
                          {item.claims.length}
                        </span>
                      </div>

                      {/* The Button to Open Modal */}
                      <button
                        onClick={() => setSelectedDonation(item)}
                        className="flex-1 sm:flex-none px-6 py-3 bg-[#1F1F1F] text-white text-sm font-bold rounded-xl hover:bg-[#C2410C] transition-colors shadow-lg shadow-stone-200"
                      >
                        View List
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. THE MODAL (Conditionally Rendered) */}
      {selectedDonation && (
        <ClaimsModal
          listing={selectedDonation}
          onClose={() => setSelectedDonation(null)}
        />
      )}
    </>
  );
}

function EmptyState({ type, isSearch }: { type: string; isSearch: boolean }) {
  return (
    <div className="text-center py-20 flex flex-col items-center">
      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-3xl mb-4 grayscale opacity-50">
        {type === "PICKUP" ? "🥡" : "🍲"}
      </div>
      <h3 className="text-lg font-bold text-stone-700">
        {isSearch ? "No results found" : `No ${type.toLowerCase()}s yet`}
      </h3>
      <p className="text-stone-400 text-sm max-w-xs mx-auto mt-2">
        {isSearch
          ? "Try adjusting your search or filters."
          : type === "PICKUP"
          ? "You haven't claimed any food yet. Check the feed!"
          : "You haven't donated any food yet. Start sharing!"}
      </p>
    </div>
  );
}
