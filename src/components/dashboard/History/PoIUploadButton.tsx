"use client";

import { useState } from "react";
import { submitProofOfImpact } from "@/features/food/actions";

export default function PoIUploadButton({ claimId }: { claimId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Convert to Base64 for prototyping (In production, upload to Supabase Storage)
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;

        // 2. Submit to Server Action
        const res = await submitProofOfImpact(claimId, base64data);
        if (res?.error) {
          setError(res.error);
        }
        setIsUploading(false);
      };
    } catch (err) {
      setError("Failed to process image");
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all ${
        isUploading 
          ? "bg-stone-300 text-stone-500 cursor-not-allowed" 
          : "bg-[#C2410C] text-white hover:bg-[#9c3409]"
      }`}>
        {isUploading ? "Uploading..." : "Upload Proof of Impact"}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" // Suggests mobile camera
          className="hidden" 
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      <p className="text-[10px] text-stone-400 mt-1">Required: Photo of distribution</p>
    </div>
  );
}
