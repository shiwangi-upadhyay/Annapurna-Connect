// src/components/SuccessToast.tsx
'use client'

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("posted") === "true") {
      setMessage("Donation Posted Successfully!");
    } else if (searchParams.get("claimed") === "true") {
      setMessage("Food Reserved Successfully!");
    }

    if (searchParams.get("posted") || searchParams.get("claimed")) {
      const timer = setTimeout(() => {
        setMessage("");
        router.replace("/dashboard/history"); // Clear URL
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
      <div className="bg-[#1F1F1F] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-stone-700">
        <div className="bg-green-500 rounded-full p-1">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-sm">Success!</h4>
          <p className="text-xs text-stone-400">{message}</p>
        </div>
      </div>
    </div>
  );
}