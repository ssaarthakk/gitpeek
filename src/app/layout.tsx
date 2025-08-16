import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/components/Provider";
import dynamic from "next/dynamic";
import ScrollProgress from "@/components/animations/ScrollProgress";

export const metadata: Metadata = {
  title: "Git Peek",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="en" className="dark bg-[#0b0f14] text-[#f0f6fc]">
          <body className="flex flex-col min-h-screen w-screen overflow-x-hidden font-sans antialiased">
            <Provider>
              {/* <ScrollProgress /> */}
              {children}
            </Provider>
          </body>
        </html>
  );
}
