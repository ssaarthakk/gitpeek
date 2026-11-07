import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "@/components/Provider";
import { ToastProvider } from "@/hooks/useToast";
import LoadingBar from "@/components/LoadingBar";
import { Suspense } from "react";
import { SignInLoadingProvider } from "@/components/landing/SignInLoadingContext";

// Self-hosted so builds don't depend on Google Fonts being reachable and well-formed.
const manrope = localFont({
  src: "./fonts/Manrope-Variable-latin.woff2",
  weight: "400 700",
  variable: "--font-sans-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GitPeek — share a private GitHub repo as a read-only link",
  description:
    "Share a private GitHub repository as a read-only link that expires. The reader can browse the code but can't clone it, push to it, or see anything else in your account.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${manrope.variable} bg-bg text-ink`}>
      <body className="flex flex-col min-h-screen font-sans antialiased">
        <Provider>
          <ToastProvider>
            <SignInLoadingProvider>
              <Suspense fallback={null}>
                <LoadingBar />
              </Suspense>
              {children}
            </SignInLoadingProvider>
          </ToastProvider>
        </Provider>
      </body>
    </html>
  );
}
