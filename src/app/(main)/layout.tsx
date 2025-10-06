"use client";

import { useAuth } from "@/context/AuthContext";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut } from "lucide-react";
import UnlockForm from "@/components/UnlockForm";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Call useSession() only ONCE at the top level.
  // Get both `data` (renamed to `session`) and `status`.
  const { data: session, status } = useSession();
  const { isLoggedIn, isLoading: isAuthLoading, logout: lockVault } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading || status === 'loading') {
      return; 
    }
    if (status !== 'authenticated') {
      router.replace("/login");
    }
  }, [isAuthLoading, status, router]);
  
  const handleLogout = async () => {
    lockVault(); 
    await signOut({ redirect: false }); 
    window.location.href = '/login';
  };

  if (isAuthLoading || status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // 2. If authenticated but the vault is locked...
  if (status === 'authenticated' && !isLoggedIn) {
      // 3. Use the `session` object from the top-level hook. Do NOT call useSession() again.
      const salt = session?.user?.encryptionSalt;
      
      if(!salt) {
          return <div className="flex items-center justify-center min-h-screen">Initializing...</div>;
      }
      return (
          <main className="container p-4 mx-auto">
              <UnlockForm salt={salt} />
          </main>
      );
  }

  if (status === 'authenticated' && isLoggedIn) {
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

  return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
}

