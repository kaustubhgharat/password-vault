// src/app/(main)/layout.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut } from 'lucide-react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  const handleLogout = () => {
    logout();
    // In a real app, you'd also call an API endpoint to invalidate the cookie/token
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  if (!isLoggedIn) {
    // Optional: Render a loading spinner while checking auth state
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
       <header className="bg-white shadow-sm">
        <nav className="container flex items-center justify-between p-4 mx-auto">
          <h1 className="text-xl font-bold text-blue-600">Secure Vault</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100">
            <LogOut size={16} />
            Logout
          </button>
        </nav>
      </header>
      <main className="container p-4 mx-auto">
        {children}
      </main>
    </div>
  );
}