"use client"
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface User {
  id: string;
  email: string;
}

interface ResetPasswordData {
  email: string;
  otp: string;
}

interface AuthContextType {
  currentUser: User | null;
  resetPasswordData: ResetPasswordData;
  setCurrentUser: (user: User | null) => void;
  setResetPasswordData: (data: ResetPasswordData) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [resetPasswordData, setResetPasswordData] = useState<ResetPasswordData>({
    email: '',
    otp: '',
  });

  return (
    <AuthContext.Provider value={{ currentUser, resetPasswordData, setCurrentUser, setResetPasswordData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
