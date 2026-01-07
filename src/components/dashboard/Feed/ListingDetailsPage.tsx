// src/app/dashboard/feed/[id]/page.tsx
import { getListingById } from "@/features/food/queries";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClaimForm from "./ClaimForm";

// Helper for formatted time
function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: 'short',
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

export default async function ListingDetailsPage({ id }: { id: string }) {
  const session = await auth();
  
  // 2. Use the ID directly (no more params.id)
  const listing = await getListingById(id);

  if (!listing) {
    return notFound();
  }

  const isOwner = session?.user?.email === listing.giver.email;
  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* 1. BACK BUTTON */}
      <Link href="/dashboard/feed" className="inline-flex items-center text-sm text-stone-500 hover:text-[#C2410C] mb-6 transition-colors">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Feed
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* 2. LEFT COLUMN: IMAGE & HERO */}
        <div className="space-y-6">
          <div className="aspect-square bg-stone-200 rounded-3xl overflow-hidden shadow-lg relative">
             <img 
               src={`https://source.unsplash.com/800x800/?food,${listing.foodType.split(" ")[0]}`} 
               alt={listing.foodType}
               className="w-full h-full object-cover"
             />
             {listing.isEvent && (
                <div className="absolute top-4 left-4 bg-[#C2410C] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
                  Bulk Event
                </div>
             )}
          </div>
        </div>

        {/* 3. RIGHT COLUMN: DETAILS & ACTIONS */}
        <div className="flex flex-col justify-center">
          
          <h1 className="text-4xl font-serif font-bold text-[#1F1F1F] mb-2">{listing.foodType}</h1>
          <p className="text-stone-500 text-lg mb-6">Posted by <span className="font-semibold text-[#1F1F1F]">{listing.giver.name}</span></p>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-stone-200">
              <span className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Quantity</span>
              <span className="text-2xl font-bold text-[#1F1F1F]">{listing.remainingQty} <span className="text-sm font-normal text-stone-500">kg</span></span>
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <span className="block text-xs font-bold text-orange-400 uppercase tracking-wider">Expires</span>
              <span className="text-xl font-bold text-[#C2410C]">{formatDateTime(listing.expiryAt)}</span>
            </div>
          </div>

          <div className="prose prose-stone mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">Description</h3>
            <p className="text-stone-600 leading-relaxed">
              {listing.description || "No specific details provided. Please contact the giver for more info."}
            </p>
          </div>

          {/* ACTION BUTTON AREA */}
          <div className="pt-6 border-t border-stone-200">
            {isOwner ? (
              <div className="bg-stone-100 text-stone-500 font-bold py-4 rounded-xl text-center border border-stone-200">
                This is your listing
              </div>
            ) : (
              /* 2. Render the new form here */
              <ClaimForm listingId={listing.id} maxQty={listing.remainingQty} />
            )}
            
            <p className="text-center text-xs text-stone-400 mt-4">
              By claiming, you agree to pickup within the expiry time.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}