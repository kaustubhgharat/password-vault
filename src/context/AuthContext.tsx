"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { deriveKey } from '@/utils/crypto';

interface AuthContextType {
  decryptionKey: string | null;
  isLoggedIn: boolean;
  isLoading: boolean; 
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
    } finally {
      setIsLoading(false);
    }
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

  return (
    <AuthContext.Provider value={{ decryptionKey, isLoggedIn, isLoading, setDecryptionKey, logout }}>
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
