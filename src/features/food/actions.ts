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