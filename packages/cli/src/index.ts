#!/usr/bin/env node

import { Command } from "commander";
import { generatePrivateKey, privateKeyToAccount, english, generateMnemonic } from "viem/accounts";
import { HDKey } from "@scure/bip32";
import { mnemonicToSeedSync } from "@scure/bip39";

const DEFAULT_HD_PATH = "m/44'/60'/0'/0/0";

interface WalletOutput {
  address: string;
  privateKey: string;
  mnemonic?: string;
  hdPath?: string;
}

function generateWallet(options: {
  mnemonic?: boolean;
  words?: 12 | 24;
  hdPath?: string;
}): WalletOutput {
  const { mnemonic: withMnemonic = false, words = 12, hdPath = DEFAULT_HD_PATH } = options;

  if (withMnemonic) {
    const strength = words === 24 ? 256 : 128;
    const mnemonic = generateMnemonic(english, strength);
    const seed = mnemonicToSeedSync(mnemonic);
    const hdKey = HDKey.fromMasterSeed(seed);
    const derivedKey = hdKey.derive(hdPath);

    if (!derivedKey.privateKey) {
      throw new Error("Failed to derive private key from mnemonic");
    }

    const privateKey = `0x${Buffer.from(derivedKey.privateKey).toString("hex")}`;
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    return {
      address: account.address,
      privateKey,
      mnemonic,
      hdPath,
    };
  }

  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  return {
    address: account.address,
    privateKey,
  };
}

function formatEnv(wallet: WalletOutput): string {
  let output = `ADDRESS=${wallet.address}\n`;
  output += `PRIVATE_KEY=${wallet.privateKey}\n`;
  if (wallet.mnemonic) {
    output += `MNEMONIC="${wallet.mnemonic}"\n`;
  }
  if (wallet.hdPath) {
    output += `HD_PATH=${wallet.hdPath}\n`;
  }
  return output;
}

function formatJson(wallet: WalletOutput): string {
  return JSON.stringify(wallet, null, 2);
}

const program = new Command();

program
  .name("clawkeys")
  .description("Secure local wallet generation for AI agents")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate a new EVM wallet locally")
  .option("-m, --mnemonic", "Generate with mnemonic seed phrase", false)
  .option("-w, --words <number>", "Number of mnemonic words (12 or 24)", "12")
  .option("--path <hdpath>", "HD derivation path", DEFAULT_HD_PATH)
  .option("-j, --json", "Output as JSON", false)
  .option("-c, --count <number>", "Number of wallets to generate", "1")
  .action((options) => {
    const count = parseInt(options.count, 10);
    const words = parseInt(options.words, 10) as 12 | 24;

    if (words !== 12 && words !== 24) {
      console.error("Error: --words must be 12 or 24");
      process.exit(1);
    }

    if (count < 1 || count > 100) {
      console.error("Error: --count must be between 1 and 100");
      process.exit(1);
    }

    const wallets: WalletOutput[] = [];

    for (let i = 0; i < count; i++) {
      const wallet = generateWallet({
        mnemonic: options.mnemonic,
        words,
        hdPath: options.path,
      });
      wallets.push(wallet);
    }

    if (options.json) {
      console.log(count === 1 ? formatJson(wallets[0]) : JSON.stringify(wallets, null, 2));
    } else {
      wallets.forEach((wallet, index) => {
        if (count > 1) {
          console.log(`# Wallet ${index + 1}`);
        }
        console.log(formatEnv(wallet));
      });
    }
  });

// Default command - just run generate
program
  .action(() => {
    program.commands.find(cmd => cmd.name() === 'generate')?.parse(process.argv);
  });

program.parse();
