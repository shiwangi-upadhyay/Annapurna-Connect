import { getUserHistory } from "@/features/food/queries";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SuccessToast from "@/components/SuccessToast";
import HistoryDashboard from "@/components/dashboard/History/HistoryDashboard"; // Import the new client component

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fetch all data
  const { donations, claims } = await getUserHistory(session.user.id!);

  return (
    <div className="pb-20">
      <SuccessToast />
      
      {/* Hand over everything to the Client Dashboard */}
      <HistoryDashboard donations={donations} claims={claims} />
    </div>
  );
}