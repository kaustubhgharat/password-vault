"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { status, data: session } = useSession();
  const { setDecryptionKey, isLoggedIn } = useAuth();

  // ✅ Jab session + encryptionSalt ready ho, tabhi decryption key set karo
  useEffect(() => {
    if (status === "authenticated" && session?.user?.encryptionSalt && !isLoggedIn) {
      const savedPassword = sessionStorage.getItem("lastLoginPassword");
      if (savedPassword) {
        setDecryptionKey(savedPassword, session.user.encryptionSalt);
        sessionStorage.removeItem("lastLoginPassword");
      }
    }
    if (status === "authenticated" && isLoggedIn) {
      router.replace("/vault");
    }
  }, [status, session, isLoggedIn, setDecryptionKey, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      sessionStorage.setItem("lastLoginPassword", password);

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error("Invalid credentials");
      }
      // redirect ka kaam ab useEffect karega
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      setIsLoading(false);
    }
  };

  // Agar session check ho raha hai to loader dikhaye
  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Agar already authenticated + vault unlocked hai to login page mat dikhao
  if (status === "authenticated" && isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
  }

  // ✅ Agar unauthenticated hai to login form dikhaye
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center">Login to Your Vault</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Master Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
