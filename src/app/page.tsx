import { auth, signOut} from "../lib/auth"; // <--- Using your v5 'auth' helper
// import { signOut } from "@/lib/auth"; // <--- Import server-side signOut
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // If not logged in, force them to login page
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5E6D3] p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-[#C2410C]/10 max-w-lg w-full text-center">
        
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">🎉</span>
        </div>

        <h1 className="text-3xl font-serif font-bold text-[#1F1F1F] mb-2">
          Login Successful!
        </h1>
        
        <p className="text-stone-500 mb-8">
          Welcome back, <span className="font-bold text-[#C2410C]">{session.user?.name || "User"}</span>.
        </p>

        <div className="bg-stone-50 p-4 rounded-xl text-left text-sm mb-8 border border-stone-200">
          <p><span className="font-bold text-stone-700">Email:</span> {session.user?.email}</p>
          <p><span className="font-bold text-stone-700">Role:</span> {session.user?.role || "N/A"}</p>
        </div>

        {/* In v5, SignOut works best as a server action form */}
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button 
            type="submit"
            className="block w-full bg-[#1F1F1F] text-white font-bold py-3 rounded-xl hover:bg-black transition"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}