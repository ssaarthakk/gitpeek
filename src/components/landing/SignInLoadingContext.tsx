'use client';

import React, { createContext, useContext, useState } from 'react';

interface SignInLoadingContextType {
  isSignInLoading: boolean;
  setSignInLoading: (loading: boolean) => void;
}

const SignInLoadingContext = createContext<SignInLoadingContextType | undefined>(undefined);

export function SignInLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isSignInLoading, setIsSignInLoading] = useState(false);

  const setSignInLoading = (loading: boolean) => {
    setIsSignInLoading(loading);
  };

  return (
    <SignInLoadingContext.Provider value={{ isSignInLoading, setSignInLoading }}>
      {children}
    </SignInLoadingContext.Provider>
  );
}

export function useSignInLoading() {
  const context = useContext(SignInLoadingContext);
  if (context === undefined) {
    // For static generation, return a default state
    if (typeof window === 'undefined') {
      return { 
        isSignInLoading: false, 
        setSignInLoading: () => {} 
      };
    }
    throw new Error('useSignInLoading must be used within a SignInLoadingProvider');
  }
  return context;
}
