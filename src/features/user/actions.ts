// src/features/user/actions.ts
'use server'

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Validation Schema
const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 chars"),
  phone: z.string().optional(),
  address: z.string().optional(),
  orgName: z.string().optional(),
  bio: z.string().max(300, "Bio is too long (max 300 chars)").optional(),
});

export async function updateProfile(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  // 1. Collect Data
  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    orgName: formData.get("orgName"),
    bio: formData.get("bio"),
  };

  // 2. Validate
  const validated = ProfileSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || "Invalid input" };
  }

  // 3. Update Database
  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validated.data.name,
        phone: validated.data.phone || null,
        address: validated.data.address || null,
        orgName: validated.data.orgName || null,
        bio: validated.data.bio || null,
      },
    });
  } catch (error) {
    return { error: "Failed to update profile." };
  }

  // 4. Redirect back to Profile
  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile");
}