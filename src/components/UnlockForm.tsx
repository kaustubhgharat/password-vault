"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { LockKeyhole } from "lucide-react";

interface UnlockFormProps {
  salt: string;
}

export default function UnlockForm({ salt }: UnlockFormProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setDecryptionKey } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!password || !salt) {
      toast.error("An error occurred. Please try refreshing.");
      setIsLoading(false);
      return;
    }
    // Use the provided password and the fetched salt to re-derive the key
    setDecryptionKey(password, salt);
    toast.success("Vault unlocked!");
    // The main layout will automatically show the vault content now
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-sm p-8 space-y-6 text-center bg-white border rounded-lg shadow-sm">
        <div className="inline-block p-4 bg-blue-100 rounded-full">
          <LockKeyhole className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Unlock Your Vault</h2>
        <p className="text-sm text-gray-600">
          Your session is still active. Please enter your master password to continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="sr-only">Master Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your master password"
              className="w-full px-3 py-2 mt-1 text-center border rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? 'Unlocking...' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}
