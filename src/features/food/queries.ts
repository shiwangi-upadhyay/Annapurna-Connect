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