// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper to get random element from array
const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. CLEANUP: Delete old data first (Optional, but good for testing)
  // Note: We delete in order to respect Foreign Keys
  await prisma.claim.deleteMany()
  await prisma.foodListing.deleteMany()
  await prisma.user.deleteMany()
  console.log('🧹 Old data cleared.')

  // 2. CREATE USERS (20 Givers, 30 Takers)
  const users = []
  const roles = ['GIVER', 'GIVER', 'TAKER', 'TAKER', 'TAKER'] // Weighted towards Takers

  for (let i = 0; i < 50; i++) {
    const role = roles[i % roles.length];
    const user = await prisma.user.create({
      data: {
        name: `User ${i + 1}`,
        email: `user${i + 1}@test.com`,
        password: 'hashedpassword123', // In real app this should be hashed
        role: role as any, // Cast to any to avoid TS enum issues if strict
        phone: `98765432${i < 10 ? '0' + i : i}`,
        orgName: role === 'GIVER' ? `Restaurant ${i}` : `NGO ${i}`,
      }
    })
    users.push(user)
  }
  console.log('✅ Created 50 Users')

  // 3. CREATE FOOD LISTINGS (Only Givers post food)
  const givers = users.filter(u => u.role === 'GIVER')
  const foodTypes = ['Rice & Curry', 'Veg Biryani', 'Bread Packets', 'Leftover Buffet', 'Sandwiches', 'Pasta']
  const listings = []

  for (const giver of givers) {
    // Each giver posts 3-5 listings
        const postCount = Math.floor(Math.random() * 3) + 3; 
    
        for (let k = 0; k < postCount; k++) {
          const totalQty = Math.floor(Math.random() * 40) + 10; // 10kg to 50kg
          
          const listing = await prisma.foodListing.create({
            data: {
              giverId: giver.id,
              listingType: 'COOKED',
              cookedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
              foodType: random(foodTypes),
              description: "Fresh surplus food, cooked roughly 3 hours ago.",
              totalQtyKg: totalQty,
              remainingQty: totalQty, // Initially full
              expiryAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Expires in 24 hrs
              status: 'AVAILABLE',
            }
          })
          listings.push(listing)
        }
  }
  console.log(`✅ Created ${listings.length} Food Listings`)

  // 4. SIMULATE CLAIMS (Takers claim food)
  const takers = users.filter(u => u.role === 'TAKER')
  
  // Let's say 40% of listings get claimed
  for (const listing of listings) {
    if (Math.random() > 0.4) { 
      // Pick a random taker
      const taker = random(takers)
      const claimQty = Math.floor(Math.random() * 5) + 1; // Claim 1-5kg

      // Create the claim
      await prisma.claim.create({
        data: {
          listingId: listing.id,
          takerId: taker.id,
          claimedQty: claimQty,
          verificationCode: 'X7K9P2', // Hardcoded for testing simplicity
          status: 'COMPLETED'
        }
      })

      // Update the listing inventory
      await prisma.foodListing.update({
        where: { id: listing.id },
        data: { 
          remainingQty: listing.remainingQty - claimQty,
          status: (listing.remainingQty - claimQty <= 0) ? 'SOLD_OUT' : 'AVAILABLE'
        }
      })
    }
  }
  console.log('✅ Simulated Claims & Inventory Updates')
  console.log('🚀 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })