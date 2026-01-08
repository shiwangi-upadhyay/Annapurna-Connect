// src/app/dashboard/manage/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { deleteListing } from "@/features/food/actions"; // Import the specific action
import DeleteButton from "@/components/common/DeleteButton";
// Function to fetch ONLY my active listings
async function getMyListings(userId: string) {
  return await prisma.foodListing.findMany({
    where: {
      giverId: userId,
      // We want to see everything, even if expired, so we can manage it
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { claims: true } }, // Count how many claims exist
    },
  });
}

export default async function ManageListingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Security: Only Givers can access this
  if (session.user.role !== "GIVER") {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-stone-500">Only Givers can manage listings.</p>
        <Link href="/dashboard" className="text-[#C2410C] underline mt-4 block">
          Go Back
        </Link>
      </div>
    );
  }

  const listings = await getMyListings(session.user.id!);

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1F1F1F]">
            Manage Listings
          </h1>
          <p className="text-stone-500">
            Edit or remove your active donations.
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="hidden md:inline-flex bg-[#1F1F1F] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#C2410C] transition-colors"
        >
          + Create New
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-200">
          <p className="text-stone-400 mb-4">
            You haven't posted any food yet.
          </p>
          <Link
            href="/dashboard/create"
            className="text-[#C2410C] font-bold hover:underline"
          >
            Post your first donation
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 border-b border-stone-100 text-xs font-bold text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="p-4">Food Item</th>
                <th className="p-4">Status</th>
                <th className="p-4">Qty Left</th>
                <th className="p-4">Claims</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {listings.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-stone-50/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-bold text-[#1F1F1F]">
                      {item.foodType}
                    </div>
                    <div className="text-xs text-stone-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        item.status === "AVAILABLE"
                          ? "bg-green-100 text-green-700"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-stone-600">
                    {item.remainingQty} kg
                  </td>
                  <td className="p-4 text-sm text-stone-500">
                    {item._count.claims > 0 ? (
                      <span className="text-[#C2410C] font-bold">
                        {item._count.claims} Active
                      </span>
                    ) : (
                      <span className="text-stone-300">None</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    
                    <Link 
      href={`/dashboard/manage/${item.id}/edit`}
      className="text-stone-400 hover:text-[#1F1F1F] transition-colors"
      title="Edit Listing"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    </Link>

                    {item._count.claims === 0 ? (
                      <DeleteButton
                        id={item.id}
                        onDelete={deleteListing} // 👈 Pass the server action function here!
                        confirmMessage="Are you sure you want to remove this food listing?"
                      />
                    ) : (
                      <span className="text-xs text-stone-300 italic pr-2">
                        Cannot delete
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
