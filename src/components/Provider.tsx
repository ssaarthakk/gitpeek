'use client';

import { SessionProvider } from "next-auth/react";
import { HeroUIProvider } from "@heroui/react";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
    </SessionProvider>
  )
}