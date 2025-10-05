// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { deriveKey } from '@/utils/crypto';

interface AuthContextType {
  decryptionKey: string | null;
  setDecryptionKey: (password: string, salt: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [decryptionKey, setDecryptionKeyState] = useState<string | null>(null);

  const setDecryptionKey = (password: string, salt: string) => {
    const key = deriveKey(password, salt);
    setDecryptionKeyState(key);
  };

  const logout = () => {
    setDecryptionKeyState(null);
  };

  return (
    <AuthContext.Provider value={{ decryptionKey, setDecryptionKey, logout, isLoggedIn: !!decryptionKey }}>
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