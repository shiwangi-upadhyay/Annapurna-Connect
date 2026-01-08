// src/components/ui/DeleteButton.tsx
'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

// Define the type for the delete function (Server Action)
type DeleteAction = (id: string) => Promise<{ error?: string; success?: boolean }>;

interface DeleteButtonProps {
  id: string;
  onDelete: DeleteAction;  // Pass the specific server action here
  label?: string;          // Default: "Delete"
  loadingLabel?: string;   // Default: "Deleting..."
  confirmMessage?: string; // Default confirmation text
  className?: string;      // Override styles if needed
}

export default function DeleteButton({ 
  id, 
  onDelete, 
  label = "Delete",
  loadingLabel = "Deleting...",
  confirmMessage = "Are you sure you want to delete this? This cannot be undone.",
  className = "text-red-500 hover:text-red-700 hover:bg-red-50" // Default red style
}: DeleteButtonProps) {
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(confirmMessage)) return;

    setLoading(true);
    
    // Call the dynamic server action passed via props
    const result = await onDelete(id);
    
    if (result?.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 ${className}`}
    >
      {loading ? loadingLabel : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          {label}
        </>
      )}
    </button>
  );
}