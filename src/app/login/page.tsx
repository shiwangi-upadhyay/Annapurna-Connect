// src/app/login/page.tsx
'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* Background Shapes */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
        <div className="p-8 md:p-12">
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-stone-900 font-serif">Welcome Back</h2>
            <p className="mt-3 text-stone-500">Continue your journey with Annapurna.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 p-4 text-sm text-red-600 text-center animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl border-stone-200 bg-stone-50 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-all duration-300"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Password</label>
              </div>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl border-stone-200 bg-stone-50 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-500">
            New to Annapurna?{" "}
            <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 underline decoration-2 decoration-transparent hover:decoration-emerald-600 transition-all">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}