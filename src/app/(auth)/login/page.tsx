"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // If the user is already authenticated, redirect them to the vault.
    // The main layout will then handle showing the vault or the unlock screen.
    if (status === 'authenticated') {
      router.push('/vault');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // We call signIn and let the useEffect handle the redirect on success.
      const result = await signIn('credentials', {
        redirect: false, // Important: We handle the redirect manually
        email,
        password,
      });

      if (result?.error) {
        throw new Error("Invalid credentials");
      }
      // On success, the `status` will change to 'authenticated',
      // and the useEffect will trigger the redirect.
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      setIsLoading(false); // Only stop loading on error
    }
  };

  // While the session is being checked or if the user is already logged in,
  // show a loading message to prevent the form from flashing.
  if (status === 'loading' || status === 'authenticated') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Only render the form if the user is unauthenticated
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
          <button type="submit" disabled={isLoading} className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
         <p className="text-sm text-center">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
      </div>
    </div>
  );
}

