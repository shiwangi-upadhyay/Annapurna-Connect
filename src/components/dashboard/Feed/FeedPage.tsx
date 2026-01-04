// src/app/dashboard/feed/page.tsx
import { getAvailableFood } from "@/features/food/queries";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

// Helper to format "Expires at 4:00 PM"
function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

export default async function FeedPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // 1. Fetch the data
  const listings = await getAvailableFood();

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1F1F1F]">
            Available Food
          </h1>
          <p className="text-stone-500">
            Fresh listings from your local community.
          </p>
        </div>
      </div>

      {/* EMPTY STATE (If no food found) */}
      {listings.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🥣
          </div>
          <h3 className="text-xl font-bold text-stone-700">
            No food available right now
          </h3>
          <p className="text-stone-400 mt-2">
            Check back later or post a donation if you can!
          </p>
        </div>
      )}

      {/* FOOD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 hover:-translate-y-1"
          >
            {/* 1. Image Area */}
            <div className="h-48 bg-stone-200 relative overflow-hidden">
              {/* Using dynamic Unsplash images based on food name */}
              <img
                src={`https://source.unsplash.com/600x400/?food,${
                  item.foodType.split(" ")[0]
                }`}
                alt={item.foodType}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500"
              />

              {/* Event Badge */}
              {item.isEvent && (
                <div className="absolute top-3 right-3 bg-[#C2410C] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md uppercase tracking-wide">
                  Bulk Event
                </div>
              )}
            </div>

            {/* 2. Card Content */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-[#1F1F1F] leading-tight group-hover:text-[#C2410C] transition-colors">
                    {item.foodType}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    by <span className="font-semibold">{item.giver.name}</span>
                  </p>
                </div>
                <div className="bg-stone-100 px-2 py-1 rounded-lg text-xs font-bold text-stone-600">
                  {item.remainingQty} kg
                </div>
              </div>

              {/* Description (Truncated) */}
              <p className="text-sm text-stone-500 mb-4 line-clamp-2 min-h-[2.5em]">
                {item.description || "No description provided."}
              </p>

              {/* Footer */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="block text-stone-400 uppercase tracking-wider font-bold text-[10px]">
                    Expires
                  </span>
                  <span className="font-medium text-red-600">
                    {formatTime(item.expiryAt)}
                  </span>
                </div>

                {/* The Link to the Details Page */}
                <Link
                  href={`/dashboard/feed/${item.id}`}
                  className="bg-[#1F1F1F] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#C2410C] transition-colors shadow-lg shadow-stone-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
