// src/components/SuccessToast.tsx
'use client'

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if URL has ?posted=true
    if (searchParams.get("posted") === "true") {
      setIsVisible(true);
      
      // Hide after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Optional: Clean up the URL (remove ?posted=true)
        router.replace("/dashboard");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
      <div className="bg-[#1F1F1F] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-stone-700">
        <div className="bg-green-500 rounded-full p-1">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-sm">Donation Posted!</h4>
          <p className="text-xs text-stone-400">Your food is now visible to the community.</p>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-stone-500 hover:text-white ml-2">
          ✕
        </button>
      </div>
    </div>
  );
}