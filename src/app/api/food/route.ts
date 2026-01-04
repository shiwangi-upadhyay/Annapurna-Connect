// src/app/api/food/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAvailableFood } from "@/features/food/queries";

// 1. GET: Fetch the Feed (View Food)
export async function GET() {
  try {
    const listings = await getAvailableFood();
    return NextResponse.json({ 
      success: true, 
      count: listings.length, 
      data: listings 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
  }
}

// 2. POST: Create Food (For Postman Testing)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { giverId, foodType, quantity, expiryHours, description } = body;

    // Validation for API testing
    if (!giverId) {
      return NextResponse.json({ error: "giverId is required for API testing" }, { status: 400 });
    }

    // Calculate Expiry
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + (expiryHours || 24));

    // Save to DB
    const newListing = await prisma.foodListing.create({
      data: {
        giverId, // The ID you copied
        foodType,
        totalQtyKg: parseFloat(quantity),
        remainingQty: parseFloat(quantity), // Initially full
        expiryAt: expiryDate,
        cookedAt: new Date(),
        listingType: "DONATION",
        status: "AVAILABLE",
        description: description || "Posted via Postman API",
      },
    });

    return NextResponse.json({ success: true, message: "Food posted!", data: newListing }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}