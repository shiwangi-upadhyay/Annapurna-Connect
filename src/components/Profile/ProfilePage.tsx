import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

// Helper to get initials
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // 1. Fetch User Data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: { listedFoods: true, claims: true },
      },
    },
  });

  if (!user) redirect("/login");

  const isGiver = user.role === "GIVER";
  const initials = getInitials(user.name || "User");
  const augmentedUser: (typeof user) & {
    image?: string | null;
    orgName?: string | null;
    bio?: string | null;
    address?: string | null;
  } = user as any;

  // 2. Calculate Impact
  let totalKg = 0;
  if (isGiver) {
    const stat = await prisma.foodListing.aggregate({
      where: { giverId: user.id },
      _sum: { totalQtyKg: true },
    });
    totalKg = stat._sum.totalQtyKg || 0;
  } else {
    const stat = await prisma.claim.aggregate({
      where: { takerId: user.id },
      _sum: { claimedQty: true },
    });
    totalKg = stat._sum.claimedQty || 0;
  }

  return (
    <div className="min-h-screen w-full bg-[#FDFBF7] flex flex-col items-center pt-20 pb-20 px-4">
      {/* 1. AVATAR (Large & Centered) */}
      <div className="mb-6 relative group">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#F5F5F4] text-[#1F1F1F] flex items-center justify-center text-5xl font-serif font-bold overflow-hidden shadow-sm border border-stone-200">
          {augmentedUser.image ? (
            <img
              src={augmentedUser.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
      </div>

      {/* 2. NAME & HANDLE */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1F1F1F] tracking-tight">
          {user.name}
        </h1>
        <div className="flex items-center justify-center gap-2 text-stone-500 font-medium">
          <span className="text-sm">@{user.role.toLowerCase()}</span>
          {augmentedUser.orgName && (
            <>
              <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
              <span className="text-sm font-bold text-[#1F1F1F]">
                {augmentedUser.orgName}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 3. IMPACT STATS (Minimal Text Line) */}
      <div className="flex items-center gap-6 text-sm md:text-base font-medium text-[#1F1F1F] mb-10">
        <div className="text-center">
          <span className="font-bold">
            {isGiver ? user._count.listedFoods : user._count.claims}
          </span>
          <span className="text-stone-500 ml-1">
            {isGiver ? "donations" : "pickups"}
          </span>
        </div>
        <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
        <div className="text-center">
          <span className="font-bold">{totalKg.toFixed(1)}kg</span>
          <span className="text-stone-500 ml-1">impact</span>
        </div>
      </div>

      {/* 4. ACTION BUTTONS (Pill Shape) */}
      <div className="flex items-center gap-4 mb-12">
        <Link
          href="/dashboard/profile/edit"
          className="px-8 py-3 bg-[#E5E5E5] hover:bg-[#d4d4d4] text-[#1F1F1F] font-bold rounded-full transition-colors"
        >
          Edit profile
        </Link>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="px-8 py-3 bg-[#E5E5E5] hover:bg-red-100 hover:text-red-600 text-[#1F1F1F] font-bold rounded-full transition-colors"
          >
            Log out
          </button>
        </form>
      </div>

      {/* 5. BIO / DETAILS SECTION (Clean & Text based) */}
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Bio */}
        {augmentedUser.bio ? (
          <p className="text-stone-600 text-lg leading-relaxed font-light">
            "{augmentedUser.bio}"
          </p>
        ) : (
          <div className="text-stone-400 italic text-sm">
            Add a bio to tell people about your mission.
          </div>
        )}

        {/* Contact Info (Only if exists) */}
        {(user.phone || augmentedUser.address) && (
          <div className="pt-8 border-t border-stone-200 flex flex-wrap justify-center gap-6 text-sm font-bold text-stone-500">
            {augmentedUser.address && (
              <div className="flex items-center gap-2">
                <span>📍</span> {augmentedUser.address}
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-2">
                <span>📞</span> {user.phone}
              </div>
            )}
          </div>
        )}

        <div className="pt-12">
          <Link
            href="/dashboard"
            className="text-stone-400 hover:text-[#C2410C] font-bold text-xs uppercase tracking-widest transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
