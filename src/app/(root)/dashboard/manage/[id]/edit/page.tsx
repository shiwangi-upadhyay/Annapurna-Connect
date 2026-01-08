import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import EditListingForm from "@/components/dashboard/Manage/EditListingForm";

export default async function EditPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await auth();
  const { id } = await params; // Await params for Next.js 15 support

  if (!session?.user) redirect("/login");

  // 1. Fetch the listing
  const listing = await prisma.foodListing.findUnique({
    where: { id },
  });

  if (!listing) return notFound();
  
  // 2. Security Check: Only the original Giver can edit
  if (listing.giverId !== session.user.id) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-3xl mb-4">🚫</h1>
        <h2 className="text-xl font-bold text-[#1F1F1F]">Unauthorized</h2>
        <p className="text-stone-500 mt-2">You do not have permission to edit this listing.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-serif font-bold text-[#1F1F1F] mb-2">Edit Listing</h1>
        <p className="text-stone-500">
          Updating details for <span className="font-bold text-[#C2410C]">{listing.foodType}</span>
        </p>
      </div>
      
      <EditListingForm listing={listing} />
    </div>
  );
}