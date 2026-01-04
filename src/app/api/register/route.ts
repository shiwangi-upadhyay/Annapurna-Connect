// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Use your existing db connection
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // 1. Read JSON from Postman
    const body = await req.json();
    const { email, name, password, role } = body;

    // 2. Validate Inputs
    if (!email || !password || !name || !role) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // 3. Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 409 });
    }

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create User
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({ message: "User created!", user: newUser }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "Server Error", error }, { status: 500 });
  }
}