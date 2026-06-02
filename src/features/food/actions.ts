// src/features/food/actions.ts
'use server'

import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Validation Rules
const ListingSchema = z.object({
  foodType: z.string().min(3, "Food name must be at least 3 characters"),
  description: z.string().optional(),
  quantity: z.coerce.number().min(0.5, "Quantity must be at least 0.5kg"),
  expiryHours: z.coerce.number().min(1, "Must be valid for at least 1 hour"),
  isEvent: z.boolean().optional(), // CHANGED: We will handle this as boolean now
});

export async function createListing(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "GIVER") {
    return { error: "Unauthorized" };
  }

  // --- THE FIX IS HERE ---
  // We use "||" to handle nulls safely
  const rawData = {
    foodType: formData.get("foodType")?.toString(), 
    
    // Fix 1: If description is null, treat it as empty string ""
    description: formData.get("description")?.toString() || "", 
    
    quantity: formData.get("quantity"),
    expiryHours: formData.get("expiryHours"),
    
    // Fix 2: Checkboxes return 'on' if checked, or null if unchecked.
    // We convert this directly to a true/false boolean here.
    isEvent: formData.get("isEvent") === "on", 
  };

  console.log("Sanitized Data:", rawData); // Debugging

  const validated = ListingSchema.safeParse(rawData);

  if (!validated.success) {
    const firstError = validated.error.issues[0].message;
    return { error: firstError };
  }

  const { foodType, description, quantity, expiryHours, isEvent } = validated.data;

  // Calculate Expiry
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + expiryHours);

  try {
    await prisma.foodListing.create({
      data: {
        giverId: session.user.id,
        foodType: foodType!,
        description: description,
        totalQtyKg: quantity,
        remainingQty: quantity,
        expiryAt: expiryDate,
        cookedAt: new Date(),
        isEvent: isEvent || false, // Ensure boolean
        listingType: "DONATION",
        status: "AVAILABLE",
      },
    });
  } catch (err) {
    console.error("Database Error:", err);
    return { error: "Database error. Please try again." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?posted=true");
}


const ClaimSchema = z.object({
  listingId: z.string(),
  // Edge Case A: Min bulk claim is 2kg, unless the total listing is smaller than 2kg (handled in logic)
  claimQty: z.coerce.number().min(0.5, "Minimum claim is 0.5kg"),
});

export async function claimFood(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
    return { error: "You must be logged in to claim food." };
  }

  const rawData = {
    listingId: formData.get("listingId"),
    claimQty: formData.get("claimQty"),
  };

  const validated = ClaimSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { listingId, claimQty } = validated.data;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Fetch User data for Edge Case B (Trust Score)
      const user = await tx.user.findUnique({
        where: { id: session.user.id! }
      });

      if (!user) throw new Error("User not found.");

      // Algorithmic Caps (Edge Case B: The Hoarder)
      const trustScore = user.trustScore || 0;
      let maxAllowedQty = 5; // Default 5kg for new users
      if (trustScore > 50) maxAllowedQty = 50;
      else if (trustScore > 20) maxAllowedQty = 20;

      if (claimQty > maxAllowedQty) {
        throw new Error(`Trust Score limit: You can only claim up to ${maxAllowedQty}kg at a time. Complete more distributions to raise your cap!`);
      }

      // 2. Fetch fresh listing data
      const listing = await tx.foodListing.findUnique({
        where: { id: listingId },
      });

      if (!listing) throw new Error("Listing not found.");
      if (listing.status !== "AVAILABLE") throw new Error("This food is no longer available.");
      if (listing.remainingQty < claimQty) throw new Error(`Only ${listing.remainingQty}kg is left.`);

      // Edge Case A (Free Meal Seeker): Cannot claim less than 2kg if the listing has >2kg available
      if (listing.remainingQty >= 2 && claimQty < 2) {
        throw new Error("B2B Rule: You must claim at least 2kg for distribution.");
      }

      // 3. Create the Claim Record
      await tx.claim.create({
        data: {
          listingId,
          takerId: session.user.id!,
          claimedQty: claimQty,
          status: "RESERVED",
        },
      });

      // 4. Update the Food Listing
      const newRemaining = listing.remainingQty - claimQty;
      const newStatus = newRemaining <= 0 ? "SOLD_OUT" : "AVAILABLE";

      await tx.foodListing.update({
        where: { id: listingId },
        data: {
          remainingQty: newRemaining,
          status: newStatus,
        },
      });
    });

  } catch (err: any) {
    return { error: err.message || "Failed to claim food." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard/history?claimed=true");
}

export async function markClaimAsCompleted(listingId: string, claimId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    // 1. Fetch the listing to check ownership
    const listing = await prisma.foodListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) return { error: "Listing not found" };

    // 2. Security Check: Only the GIVER can confirm pickup.
    if (listing.giverId !== session.user.id) {
      return { error: "Only the Giver can confirm pickup." };
    }
    
    // 3. Update Status to IN_TRANSIT (PoI Loop Phase 1)
    await prisma.claim.update({
      where: { id: claimId },
      data: { status: "IN_TRANSIT" }
    });

    revalidatePath("/dashboard/manage");
    revalidatePath("/dashboard/history");
    return { success: true };

  } catch (error) {
    return { error: "Failed to update status." };
  }
}

export async function submitProofOfImpact(claimId: string, base64Image: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "TAKER") {
    return { error: "Unauthorized" };
  }

  try {
    // 1. Fetch the claim to ensure ownership
    const claim = await prisma.claim.findUnique({
      where: { id: claimId },
    });

    if (!claim || claim.takerId !== session.user.id) {
      return { error: "Claim not found or unauthorized" };
    }

    if (claim.status !== "IN_TRANSIT") {
      return { error: "Claim must be IN_TRANSIT to upload Proof of Impact" };
    }

    // 2. Update Claim and User Trust Score in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.claim.update({
        where: { id: claimId },
        data: { 
          status: "COMPLETED",
          poiImageUrl: base64Image,
          poiUploadedAt: new Date(),
        }
      });

      // Increase trust score by 10 for a successful distribution
      await tx.user.update({
        where: { id: session.user.id! },
        data: { trustScore: { increment: 10 } }
      });
    });

    revalidatePath("/dashboard/history");
    return { success: true };
  } catch (error) {
    return { error: "Failed to submit Proof of Impact." };
  }
}


export async function deleteListing(listingId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    // 1. Check if listing exists and belongs to user
    const listing = await prisma.foodListing.findUnique({
      where: { id: listingId },
      include: { claims: true } // We need to check claims!
    });

    if (!listing) return { error: "Listing not found" };
    
    if (listing.giverId !== session.user.id) {
      return { error: "You do not have permission to delete this." };
    }

    // 2. Safety Check: Prevent deleting if someone already claimed it
    if (listing.claims.length > 0) {
      return { error: "Cannot delete: Someone has already claimed part of this food." };
    }

    // 3. Delete it
    await prisma.foodListing.delete({
      where: { id: listingId },
    });

    revalidatePath("/dashboard/manage"); // We will create this page next
    return { success: true };

  } catch (error) {
    return { error: "Failed to delete listing." };
  }
}


export async function updateListing(listingId: string, prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  // Reuse the same schema as Create, but make things optional if needed
  // For simplicity, we assume full re-submission
  const rawData = {
    foodType: formData.get("foodType"),
    quantity: formData.get("quantity"),
    expiryHours: formData.get("expiryHours"),
    description: formData.get("description"),
  };

  const validated = ListingSchema.safeParse(rawData); // Reusing the schema from create
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { foodType, quantity, expiryHours, description } = validated.data;

  // Calculate Expiry
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + expiryHours);

  try {
    // 1. Check ownership & current state
    const existing = await prisma.foodListing.findUnique({
      where: { id: listingId },
      include: { claims: true }
    });

    if (!existing) return { error: "Not found" };
    if (existing.giverId !== session.user.id) return { error: "Unauthorized" };

    // 2. Logic: If claims exist, we cannot lower quantity below what is already claimed
    const totalClaimed = existing.totalQtyKg - existing.remainingQty;
    if (quantity < totalClaimed) {
      return { error: `Cannot reduce quantity below ${totalClaimed}kg (already claimed).` };
    }

    // Recalculate remaining
    const newRemaining = quantity - totalClaimed;

    // 3. Update
    await prisma.foodListing.update({
      where: { id: listingId },
      data: {
        foodType,
        totalQtyKg: quantity,
        remainingQty: newRemaining,
        expiryAt: expiryDate,
        description,
      },
    });

  } catch (err) {
    return { error: "Failed to update listing." };
  }

  revalidatePath("/dashboard/manage");
  redirect("/dashboard/manage");
}