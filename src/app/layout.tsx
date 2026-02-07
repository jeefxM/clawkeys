import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clawkeys.xyz"),
  title: {
    default: "ClawKeys - Instant Wallet Generation for AI Agents",
    template: "%s | ClawKeys",
  },
  description:
    "Generate non-custodial EVM wallets for AI agents in milliseconds. No accounts, no KYC. Support for Ethereum, Base, Polygon, Optimism, Avalanche, BNB Chain, Monad and 100+ networks. Open source.",
  keywords: [
    "AI wallet",
    "AI agent wallet",
    "EVM wallet generator",
    "crypto wallet API",
    "non-custodial wallet",
    "Ethereum wallet",
    "Base wallet",
    "Polygon wallet",
    "Optimism wallet",
    "Monad wallet",
    "wallet generation API",
    "LLM wallet",
    "autonomous agent wallet",
    "bot wallet",
    "Web3 AI",
    "AI crypto",
    "mnemonic generator",
    "private key generator",
    "HD wallet",
    "BIP39",
  ],
  authors: [{ name: "ClawKeys Labs" }],
  creator: "ClawKeys Labs",
  publisher: "ClawKeys Labs",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://clawkeys.xyz",
    siteName: "ClawKeys",
    title: "ClawKeys - Instant Wallet Generation for AI Agents",
    description:
      "Generate non-custodial EVM wallets for AI agents in milliseconds. No accounts, no KYC. Support for 100+ EVM networks. Open source.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClawKeys - Instant Wallets for AI Agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawKeys - Instant Wallet Generation for AI Agents",
    description:
      "Generate non-custodial EVM wallets for AI agents in milliseconds. No accounts, no KYC. 100+ networks supported.",
    images: ["/og-image.png"],
    creator: "@clawkeys",
  },
  alternates: {
    canonical: "https://clawkeys.xyz",
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ClawKeys",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    description:
      "Non-custodial wallet generation API for AI agents. Generate EVM wallets instantly via API.",
    url: "https://clawkeys.xyz",
    author: {
      "@type": "Organization",
      name: "ClawKeys Labs",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Instant wallet generation",
      "Non-custodial",
      "100+ EVM networks supported",
      "BIP39 mnemonic support",
      "Open source",
      "API access",
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0A0A0A" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
