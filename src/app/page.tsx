"use client";

import { useState, useEffect } from "react";
import {
  generatePrivateKey,
  privateKeyToAccount,
  english,
  generateMnemonic,
} from "viem/accounts";
import { HDKey } from "@scure/bip32";
import { mnemonicToSeedSync } from "@scure/bip39";

const SAMPLE_ADDRESSES = [
  "0x71C...4F2A",
  "0xA3B...9E1D",
  "0x8F2...C7B3",
  "0xD4E...2A8F",
  "0x5C9...F1E6",
  "0xB7A...3D4C",
  "0x2E8...6B9A",
];

const DEFAULT_HD_PATH = "m/44'/60'/0'/0/0";

interface GeneratedWallet {
  address: string;
  privateKey: string;
  mnemonic?: string;
  hdPath?: string;
}

function generateWallet(withMnemonic: boolean = true): GeneratedWallet {
  if (withMnemonic) {
    const mnemonic = generateMnemonic(english, 128); // 12 words
    const seed = mnemonicToSeedSync(mnemonic);
    const hdKey = HDKey.fromMasterSeed(seed);
    const derivedKey = hdKey.derive(DEFAULT_HD_PATH);

    if (!derivedKey.privateKey) {
      throw new Error("Failed to derive private key from mnemonic");
    }

    const privateKeyBytes = derivedKey.privateKey;
    const privateKey = `0x${Array.from(privateKeyBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")}` as `0x${string}`;
    const account = privateKeyToAccount(privateKey);

    return {
      address: account.address,
      privateKey,
      mnemonic,
      hdPath: DEFAULT_HD_PATH,
    };
  }

  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  return {
    address: account.address,
    privateKey,
  };
}

export default function Home() {
  const [copiedDocs, setCopiedDocs] = useState(false);
  const [copiedGen, setCopiedGen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [addressIndex, setAddressIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setAddressIndex((prev) => (prev + 1) % SAMPLE_ADDRESSES.length);
        setIsAnimating(false);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const docsCommand = `curl -s https://clawkeys.xyz/agent-guide.md`;
  const generateCommand = `npx clawkeys generate --mnemonic`;

  const copyDocsCommand = () => {
    navigator.clipboard.writeText(docsCommand);
    setCopiedDocs(true);
    setTimeout(() => setCopiedDocs(false), 2000);
  };

  const copyGenCommand = () => {
    navigator.clipboard.writeText(generateCommand);
    setCopiedGen(true);
    setTimeout(() => setCopiedGen(false), 2000);
  };

  const generateAndDownload = () => {
    setGenerating(true);

    try {
      // Generate wallet locally - never touches network
      const wallet = generateWallet(true);

      // Build file content
      const content = `# CLAWKEYS WALLET
# Generated: ${new Date().toISOString()}
# WARNING: Save this file securely. This is the only copy.
# Generated locally - key never touched any server.

ADDRESS=${wallet.address}
PRIVATE_KEY=${wallet.privateKey}
${wallet.mnemonic ? `MNEMONIC="${wallet.mnemonic}"` : ""}
${wallet.hdPath ? `HD_PATH=${wallet.hdPath}` : ""}

# SUPPORTED CHAINS
# Your wallet works on ALL EVM chains with the same address.
# Base Sepolia (84532): https://sepolia.base.org
# Monad Testnet (10143): https://testnet-rpc.monad.xyz
# Sepolia (11155111): https://rpc.sepolia.org
# Ethereum (1): https://eth.llamarpc.com
# Base (8453): https://mainnet.base.org

# NEXT STEPS
# 1. Save this file securely
# 2. Get testnet tokens from faucets
# 3. Set EVM_PRIVATE_KEY in your environment
# 4. Start transacting

# https://clawkeys.xyz
`;

      // Trigger download
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "clawkeys.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Generation failed:", err);
    }

    setGenerating(false);
  };

  return (
    <div className="bg-[#0A0A0A] text-[#F2F2F2] min-h-screen font-mono selection:bg-[#FFD700] selection:text-black p-4">
      <div className="dither-overlay"></div>

      {/* --- COMPRESSED HEADER --- */}
      <nav className="border border-white/20 flex justify-between items-center px-4 py-2 mb-8 bg-[#0D0D0D]">
        <div className="text-[12px] font-bold tracking-tighter">CLAWKEYS.XYZ</div>
        <div className="flex gap-6 text-[10px] uppercase tracking-widest text-white/60">
          <a href="#agent-guide" className="hover:text-[#FFD700] transition-colors">Agent Guide</a>
          <a href="/agent-guide.md" className="hover:text-[#FFD700] transition-colors">Docs</a>
          <span className="text-[#FFD700] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#FFD700] animate-pulse"></span> LOCAL_GEN
          </span>
        </div>
      </nav>

      {/* --- AGENT GUIDE SECTION --- */}
      <section id="agent-guide" className="border border-[#FFD700] bg-[#0D0D0D] mb-4 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#FFD700] text-lg">{">"}</span>
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#FFD700]">
            AI Agent? Start Here
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Read Docs */}
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">1. Read the docs</p>
            <div
              onClick={copyDocsCommand}
              className="bg-black border border-white/20 p-4 font-mono text-[11px] cursor-pointer hover:border-[#FFD700] transition-colors group relative"
            >
              <code className="text-[#FFD700]">$</code>{" "}
              <code className="text-white/90">{docsCommand}</code>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-white/40 group-hover:text-[#FFD700] transition-colors">
                {copiedDocs ? "COPIED!" : "CLICK TO COPY"}
              </span>
            </div>
          </div>
          {/* Generate Locally */}
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">2. Generate locally</p>
            <div
              onClick={copyGenCommand}
              className="bg-black border border-white/20 p-4 font-mono text-[11px] cursor-pointer hover:border-[#FFD700] transition-colors group relative"
            >
              <code className="text-[#FFD700]">$</code>{" "}
              <code className="text-white/90">{generateCommand}</code>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-white/40 group-hover:text-[#FFD700] transition-colors">
                {copiedGen ? "COPIED!" : "CLICK TO COPY"}
              </span>
            </div>
          </div>
        </div>
        <p className="text-[9px] text-white/40 mt-4">
          Keys generated locally. Zero network calls. Never touch any server.
        </p>
      </section>

      {/* --- HERO SECTION --- */}
      <section className="grid grid-cols-1 md:grid-cols-12 border border-white/20 bg-[#0D0D0D] mb-4">
        <div className="md:col-span-7 p-8 border-r border-white/10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-black leading-none mb-4 tracking-tighter uppercase">
            Instant Wallets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-white/20">for AI Agents.</span>
          </h1>
          <p className="text-[11px] text-white/50 max-w-sm mb-6 leading-relaxed">
            Local entropy generation. Enable your LLMs, bots, and autonomous scripts to hold assets, sign txns, and exist on-chain. Keys never leave your machine.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-4">
              <button
                onClick={generateAndDownload}
                disabled={generating}
                className="bg-[#FFD700] text-black text-[10px] font-bold px-4 py-2 hover:bg-white transition-all active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? "GENERATING..." : "GENERATE & DOWNLOAD"}
              </button>
              <a
                href="/agent-guide.md"
                className="border border-white/20 text-[10px] px-4 py-2 hover:bg-white/5 transition-all inline-flex items-center"
              >
                DOCS
              </a>
            </div>
            <p className="text-[9px] text-white/40">
              Generated in your browser. No server. No network calls.
            </p>
          </div>
        </div>

        {/* --- ANIMATED DITHER AI AREA --- */}
        <div className="md:col-span-5 relative overflow-hidden h-[300px] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#FFD700_0%,_transparent_70%)] animate-pulse"></div>
          <div className="relative z-10 w-32 h-32 border-2 border-[#FFD700] flex flex-col items-center justify-center group">
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-white"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-white"></div>
            <div
              className={`text-[10px] text-[#FFD700] transition-all duration-300 ${
                isAnimating ? "blur-sm opacity-0 scale-95" : "blur-0 opacity-100 scale-100"
              }`}
            >
              {SAMPLE_ADDRESSES[addressIndex]}
            </div>
            <div className="w-full h-[1px] bg-white/20 mt-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Main Feature */}
        <div className="md:col-span-2 border border-white/20 p-4 bg-[#0D0D0D] hover:border-[#FFD700] transition-colors">
          <div className="text-[#FFD700] text-[10px] mb-2 font-bold uppercase tracking-widest">// Local Generation</div>
          <div className="h-24 bg-gradient-to-br from-[#FFD700]/5 to-transparent border border-white/10 mb-2 flex items-center justify-center">
            <code className="text-[10px] text-white/40">{`npx clawkeys generate --mnemonic`}</code>
          </div>
          <p className="text-[11px] text-white/70">Generate wallets locally in &lt;100ms. Zero network calls. Keys never leave your machine.</p>
        </div>

        {/* Card 2: Security */}
        <div className="border border-white/20 p-4 bg-[#0D0D0D] hover:border-[#FFD700] transition-colors flex flex-col justify-between">
          <div className="text-[10px] font-bold text-white/40 mb-8">SEC_01</div>
          <div>
             <h3 className="text-xs font-bold mb-1">TRUE LOCAL GEN</h3>
             <p className="text-[10px] text-white/50">Keys generated on your machine. Never touch any server.</p>
          </div>
        </div>

        {/* Card 3: Chains */}
        <div className="border border-white/20 p-4 bg-[#0D0D0D] flex flex-col justify-between hover:border-[#FFD700]">
           <div className="grid grid-cols-4 gap-2">
              <img src="https://assets.coingecko.com/coins/images/279/small/ethereum.png" alt="ETH" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity" title="Ethereum" />
              <img src="https://avatars.githubusercontent.com/u/108554348" alt="Base" className="w-8 h-8 rounded-full opacity-60 hover:opacity-100 transition-opacity" title="Base" />
              <img src="https://assets.coingecko.com/coins/images/25244/small/Optimism.png" alt="OP" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity" title="Optimism" />
              <img src="https://assets.coingecko.com/coins/images/4713/small/polygon.png" alt="MATIC" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity" title="Polygon" />
              <img src="https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png" alt="AVAX" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity" title="Avalanche" />
              <img src="https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png" alt="BNB" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity" title="BNB Chain" />
              <img src="https://files.svgcdn.io/token-branded/monad.png" alt="Monad" className="w-8 h-8 rounded-full opacity-60 hover:opacity-100 transition-opacity" title="Monad" />
              <span className="w-8 h-8 flex items-center justify-center text-[9px] text-white/40 border border-white/20 rounded">+100</span>
           </div>
           <div className="text-[10px] mt-3 uppercase font-bold tracking-tighter">All EVM Networks</div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="mt-8 pt-4 border-t border-white/10 text-[9px] text-white/30 flex justify-between uppercase">
        <div className="flex items-center gap-3">
          <span>&copy;2026 CLAWKEYS LABS</span>
          <a href="https://github.com/jeefxM/clawkeys" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD700] transition-colors flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            OPEN SOURCE
          </a>
          <a href="https://www.npmjs.com/package/clawkeys" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD700] transition-colors">
            NPM
          </a>
        </div>
        <div>LOCAL GENERATION</div>
      </footer>
    </div>
  );
}
