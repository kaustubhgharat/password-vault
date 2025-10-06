"use client";

import { useAuth } from "@/context/AuthContext";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const { isLoggedIn, isLoading: isAuthLoading, logout: lockVault } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading || status === "loading") return;

    if (status !== "authenticated") {
      router.replace("/login");
    }
  }, [isAuthLoading, status, router]);

  const handleLogout = async () => {
    lockVault();
    await signOut({ redirect: false });
    window.location.href = "/login";
  };

  if (isAuthLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (status === "authenticated" && isLoggedIn) {
    return (
      <div>
        <header className="bg-white dark:bg-gray-900 shadow-sm">
          <nav className="container flex items-center justify-between p-4 mx-auto">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Secure Vault
            </h1>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </nav>
        </header>
        <main className="container p-4 mx-auto bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
          {children}
        </main>
      </div>
    );
  }

  if (status === "authenticated" && !isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Initializing vault...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>
  );
}
