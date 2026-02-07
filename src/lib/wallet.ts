import {
  generatePrivateKey,
  privateKeyToAccount,
  english,
  generateMnemonic,
  mnemonicToAccount,
} from "viem/accounts";
import { HDKey } from "@scure/bip32";
import { mnemonicToSeedSync } from "@scure/bip39";

export interface GeneratedWallet {
  address: `0x${string}`;
  privateKey: `0x${string}`;
  mnemonic?: string;
  hdPath?: string;
}

export interface WalletOptions {
  /** Generate with mnemonic (12 or 24 words) */
  withMnemonic?: boolean;
  /** Number of mnemonic words (12 or 24, default 12) */
  mnemonicWords?: 12 | 24;
  /** HD derivation path (default: m/44'/60'/0'/0/0) */
  hdPath?: string;
}

const DEFAULT_HD_PATH = "m/44'/60'/0'/0/0";

/**
 * Generate a new EVM wallet
 *
 * @param options - Wallet generation options
 * @returns Generated wallet with address and private key
 */
export function generateWallet(options: WalletOptions = {}): GeneratedWallet {
  const { withMnemonic = false, mnemonicWords = 12, hdPath = DEFAULT_HD_PATH } = options;

  if (withMnemonic) {
    // Generate mnemonic-based HD wallet
    const strength = mnemonicWords === 24 ? 256 : 128;
    const mnemonic = generateMnemonic(english, strength);

    // Derive private key from mnemonic
    const seed = mnemonicToSeedSync(mnemonic);
    const hdKey = HDKey.fromMasterSeed(seed);
    const derivedKey = hdKey.derive(hdPath);

    if (!derivedKey.privateKey) {
      throw new Error("Failed to derive private key from mnemonic");
    }

    const privateKey = `0x${Buffer.from(derivedKey.privateKey).toString("hex")}` as `0x${string}`;
    const account = privateKeyToAccount(privateKey);

    return {
      address: account.address,
      privateKey,
      mnemonic,
      hdPath,
    };
  }

  // Generate simple private key wallet
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  return {
    address: account.address,
    privateKey,
  };
}

/**
 * Derive wallet from existing mnemonic
 */
export function walletFromMnemonic(
  mnemonic: string,
  hdPath: string = DEFAULT_HD_PATH
): GeneratedWallet {
  const seed = mnemonicToSeedSync(mnemonic);
  const hdKey = HDKey.fromMasterSeed(seed);
  const derivedKey = hdKey.derive(hdPath);

  if (!derivedKey.privateKey) {
    throw new Error("Failed to derive private key from mnemonic");
  }

  const privateKey = `0x${Buffer.from(derivedKey.privateKey).toString("hex")}` as `0x${string}`;
  const account = privateKeyToAccount(privateKey);

  return {
    address: account.address,
    privateKey,
    mnemonic,
    hdPath,
  };
}

/**
 * Get wallet from private key
 */
export function walletFromPrivateKey(privateKey: `0x${string}`): GeneratedWallet {
  const account = privateKeyToAccount(privateKey);

  return {
    address: account.address,
    privateKey,
  };
}

/**
 * Validate a private key format
 */
export function isValidPrivateKey(key: string): boolean {
  if (!key.startsWith("0x")) return false;
  if (key.length !== 66) return false;
  return /^0x[0-9a-fA-F]{64}$/.test(key);
}

/**
 * Validate a mnemonic phrase
 */
export function isValidMnemonic(phrase: string): boolean {
  const words = phrase.trim().split(/\s+/);
  return words.length === 12 || words.length === 24;
}

/**
 * Derive multiple wallets from a single mnemonic
 */
export function deriveMultipleWallets(
  mnemonic: string,
  count: number = 5,
  basePath: string = "m/44'/60'/0'/0"
): GeneratedWallet[] {
  const seed = mnemonicToSeedSync(mnemonic);
  const hdKey = HDKey.fromMasterSeed(seed);
  const wallets: GeneratedWallet[] = [];

  for (let i = 0; i < count; i++) {
    const path = `${basePath}/${i}`;
    const derivedKey = hdKey.derive(path);

    if (!derivedKey.privateKey) {
      throw new Error(`Failed to derive private key at path ${path}`);
    }

    const privateKey = `0x${Buffer.from(derivedKey.privateKey).toString("hex")}` as `0x${string}`;
    const account = privateKeyToAccount(privateKey);

    wallets.push({
      address: account.address,
      privateKey,
      mnemonic,
      hdPath: path,
    });
  }

  return wallets;
}
