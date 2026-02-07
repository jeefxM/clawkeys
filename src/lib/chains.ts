/**
 * Supported blockchain networks for ClawKeys wallet generation
 */

export const EVM_CHAINS = {
  // Mainnets
  ethereum: {
    id: "eip155:1",
    name: "Ethereum",
    chainId: 1,
    rpcUrl: "https://eth.llamarpc.com",
    explorer: "https://etherscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    testnet: false,
  },
  base: {
    id: "eip155:8453",
    name: "Base",
    chainId: 8453,
    rpcUrl: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    testnet: false,
  },
  arbitrum: {
    id: "eip155:42161",
    name: "Arbitrum One",
    chainId: 42161,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    testnet: false,
  },
  optimism: {
    id: "eip155:10",
    name: "Optimism",
    chainId: 10,
    rpcUrl: "https://mainnet.optimism.io",
    explorer: "https://optimistic.etherscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    testnet: false,
  },
  polygon: {
    id: "eip155:137",
    name: "Polygon",
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    testnet: false,
  },

  // Testnets
  baseSepolia: {
    id: "eip155:84532",
    name: "Base Sepolia",
    chainId: 84532,
    rpcUrl: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    testnet: true,
    faucets: {
      gas: "https://www.alchemy.com/faucets/base-sepolia",
      usdc: "https://faucet.circle.com/",
    },
  },
  monadTestnet: {
    id: "eip155:10143",
    name: "Monad Testnet",
    chainId: 10143,
    rpcUrl: "https://testnet-rpc.monad.xyz",
    explorer: "https://testnet.monadexplorer.com",
    nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
    testnet: true,
    faucets: {
      gas: "https://faucet.monad.xyz",
      usdc: "https://faucet.circle.com/",
    },
  },
  sepolia: {
    id: "eip155:11155111",
    name: "Sepolia",
    chainId: 11155111,
    rpcUrl: "https://rpc.sepolia.org",
    explorer: "https://sepolia.etherscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    testnet: true,
    faucets: {
      gas: "https://sepoliafaucet.com/",
    },
  },
} as const;

export type ChainKey = keyof typeof EVM_CHAINS;
export type Chain = (typeof EVM_CHAINS)[ChainKey];

// Default chains for new wallets
export const DEFAULT_CHAINS: ChainKey[] = ["baseSepolia", "monadTestnet", "base"];

// Get chain by chainId
export function getChainById(chainId: number): Chain | null {
  return Object.values(EVM_CHAINS).find((c) => c.chainId === chainId) || null;
}

// Get all testnets
export function getTestnets(): Chain[] {
  return Object.values(EVM_CHAINS).filter((c) => c.testnet);
}

// Get all mainnets
export function getMainnets(): Chain[] {
  return Object.values(EVM_CHAINS).filter((c) => !c.testnet);
}
