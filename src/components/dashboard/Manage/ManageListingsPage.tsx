// src/app/dashboard/manage/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import ManageDashboard from "@/components/dashboard/Manage/ManageDashboard";

async function getMyListings(userId: string) {
  return await prisma.foodListing.findMany({
    where: { 
      giverId: userId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      // OLD: _count: { select: { claims: true } }
      // NEW: Fetch actual claims + Taker info so we can show the list
      claims: {
        include: {
          taker: {
            select: { name: true, email: true }
          }
        }
      },
      _count: { select: { claims: true } } // Keep count for easy sorting if needed
    }
  });
}

export default async function ManageListingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  
  if (session.user.role !== "GIVER") {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-stone-500">Only Givers can manage listings.</p>
        <Link href="/dashboard" className="text-[#C2410C] font-bold underline mt-6 block">Go Back</Link>
      </div>
    );
  }

  const listings = await getMyListings(session.user.id!);

  return (
    <div className="pb-20">
      <ManageDashboard listings={listings} />
    </div>
  );
}