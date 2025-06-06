import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/contexts/WalletContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Luneshark - Holder Panel",
  description: "Access exclusive holder tools for $Luneshark token holders",
  generator: "v0.dev",
  icons: {
    icon: "/luneshark_logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-950`}>
        <WalletProvider>
          <main className="">{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
