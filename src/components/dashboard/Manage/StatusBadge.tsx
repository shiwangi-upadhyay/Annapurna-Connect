export default function StatusBadge({ 
  status, 
  expiryAt, 
  remainingQty 
}: { 
  status: string, 
  expiryAt: Date, 
  remainingQty: number 
}) {
  const isExpired = new Date(expiryAt) < new Date();
  const isSoldOut = remainingQty <= 0; // or < 0.1 depending on your precision

  // 1. ✅ CHECK QUANTITY FIRST (The Fix)
  // If no food is left, it is "Completed" / "Distributed", even if time has passed.
  if (isSoldOut || status === "SOLD_OUT") {
    return (
      <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-200">
        Distributed
      </span>
    );
  }

  // 2. ⚠️ CHECK EXPIRY SECOND
  // Only show "Expired" if there is actually food remaining that went to waste.
  if (isExpired) {
    return (
      <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200">
        Expired
      </span>
    );
  }

  // 3. OTHERWISE ACTIVE
  return (
    <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-200 flex items-center gap-1 w-fit">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
      Active
    </span>
  );
}