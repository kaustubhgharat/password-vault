// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { deriveKey } from '@/utils/crypto';

interface AuthContextType {
  decryptionKey: string | null;
  isLoggedIn: boolean;
  setDecryptionKey: (password: string, salt: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [decryptionKey, setDecryptionKeyState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    try {
      const storedKey = sessionStorage.getItem('decryptionKey');
      if (storedKey) {
        setDecryptionKeyState(storedKey);
      }
    } catch (e) {
      console.error("Could not read from session storage", e);
    }
    setIsLoading(false);
  }, []);

  const setDecryptionKey = (password: string, salt: string) => {
    const key = deriveKey(password, salt);
    setDecryptionKeyState(key);
    sessionStorage.setItem('decryptionKey', key); 
  };

  const logout = () => {
    setDecryptionKeyState(null);
    sessionStorage.removeItem('decryptionKey'); 
  };

  const isLoggedIn = !!decryptionKey;

  if (isLoading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ decryptionKey, isLoggedIn, setDecryptionKey, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};