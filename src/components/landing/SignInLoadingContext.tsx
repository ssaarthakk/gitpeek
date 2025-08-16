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
    // Return a default implementation if used outside provider
    console.warn('useSignInLoading used outside SignInLoadingProvider, falling back to local state');
    const [isSignInLoading, setIsSignInLoading] = useState(false);
    return { 
      isSignInLoading, 
      setSignInLoading: setIsSignInLoading 
    };
  }
  return context;
}
