import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClawKeys - Instant Wallets for AI Agents",
  description: "Non-custodial entropy generation at the edge. Enable your LLMs, bots, and autonomous scripts to hold assets, sign txns, and exist on-chain.",
  keywords: ["ai agents", "wallet", "crypto", "ethereum", "solana", "base", "non-custodial"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
