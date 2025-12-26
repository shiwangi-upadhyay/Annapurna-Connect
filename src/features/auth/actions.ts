// src/features/auth/actions.ts
'use server'

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

// Validation Rules
const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["GIVER", "TAKER"]),
});

export async function registerUser(prevState: any, formData: FormData) {
  // 1. Get raw data
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  // 2. Validate
  const validatedFields = RegisterSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: "Invalid input. Please check your details." };
  }

  const { name, email, password, role } = validatedFields.data;

  // 3. Check if exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // 4. Create User
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as "GIVER" | "TAKER",
      },
    });
  } catch (err) {
    return { error: "Database error. Please try again." };
  }

  // 5. Redirect
  redirect("/login?success=true");
}