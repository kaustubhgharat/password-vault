// src/app/(main)/layout.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, logout: lockVault } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const handleLogout = async () => {
    lockVault();
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <header className="bg-white shadow-sm">
        <nav className="container flex items-center justify-between p-4 mx-auto">
          <h1 className="text-xl font-bold text-blue-600">Secure Vault</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100"
          >
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
