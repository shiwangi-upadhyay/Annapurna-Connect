// src/features/food/queries.ts
import { prisma } from "@/lib/db";

export async function getAvailableFood() {
  return await prisma.foodListing.findMany({
    where: {
      status: "AVAILABLE",
      expiryAt: {
        gt: new Date(), // Only show future expiry dates
      },
      remainingQty: {
        gt: 0, // Only show if there is food left
      }
    },
    include: {
      giver: {
        select: {
          name: true, // We need the giver's name for the card
        }
      }
    },
    orderBy: {
      createdAt: "desc" // Show newest food first
    }
  });
}

// Keep the getListingById function here if you added it earlier!
export async function getListingById(id: string) {
  return await prisma.foodListing.findUnique({
    where: { id },
    include: {
      giver: { select: { name: true, email: true, role: true } }
    }
  });
}


export async function getUserHistory(userId: string) {
  // 1. Fetch donations (Things I gave)
  const donations = await prisma.foodListing.findMany({
    where: { giverId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      claims: { // See who claimed my food
        include: {
          taker: { select: { name: true, email: true } }
        }
      }
    }
  });

  // 2. Fetch claims (Things I took)
  const claims = await prisma.claim.findMany({
    where: { takerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      listing: { // See details of the food I claimed
        include: {
          giver: { select: { name: true, phone: true, email: true } }
        }
      }
    }
  });

  return { donations, claims };
}