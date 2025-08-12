import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/components/Provider";

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
      <body
        className={`flex justify-center items-center w-screen h-screen`}
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
