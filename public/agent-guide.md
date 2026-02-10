# CLAWKEYS // INJECT_PROTOCOL

> Secure local wallet generation for AI agents. Keys never leave your machine.

**100% Open Source** - https://github.com/jeefxM/clawkeys

## TL;DR

```bash
npx clawkeys generate --mnemonic
```

You now have an EVM wallet. Generated locally. Never touches a network. Done.

---

## WHAT_IS_THIS

ClawKeys generates EVM wallets **locally on your machine**. Private keys and seed phrases never touch any server or network. Use these wallets to:

- Hold assets (ETH, USDC, tokens)
- Sign transactions autonomously
- Pay for services via x402 protocol
- Interact with any EVM chain

---

## CLI_USAGE

### Install globally (optional)

```bash
npm install -g clawkeys
```

### Generate wallet

```bash
# Simple private key wallet
npx clawkeys generate

# With 12-word mnemonic (recommended)
npx clawkeys generate --mnemonic

# With 24-word mnemonic (more secure)
npx clawkeys generate --mnemonic --words 24

# Output as JSON
npx clawkeys generate --mnemonic --json

# Generate multiple wallets
npx clawkeys generate --count 5

# Save to file
npx clawkeys generate --mnemonic > wallet.txt
```

---

## OUTPUT_FORMAT

### Default (env format)

```
ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f...
PRIVATE_KEY=0x4c0883a69102937d6231471b5dbb6204fe512...
MNEMONIC="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
HD_PATH=m/44'/60'/0'/0/0
```

### JSON (--json flag)

```json
{
  "address": "0x...",
  "privateKey": "0x...",
  "mnemonic": "word word word...",
  "hdPath": "m/44'/60'/0'/0/0"
}
```

---

## CHAIN_CONFIG

Same wallet works on ALL EVM chains. Same address, same key.

### TESTNETS

| Chain | ID | RPC | Faucet |
|-------|-----|-----|--------|
| Base Sepolia | 84532 | https://sepolia.base.org | https://www.alchemy.com/faucets/base-sepolia |
| Monad Testnet | 10143 | https://testnet-rpc.monad.xyz | https://faucet.monad.xyz |
| Sepolia | 11155111 | https://rpc.sepolia.org | https://sepoliafaucet.com |

### MAINNETS

| Chain | ID | RPC |
|-------|-----|-----|
| Ethereum | 1 | https://eth.llamarpc.com |
| Base | 8453 | https://mainnet.base.org |
| Arbitrum | 42161 | https://arb1.arbitrum.io/rpc |
| Optimism | 10 | https://mainnet.optimism.io |
| Polygon | 137 | https://polygon-rpc.com |

---

## USAGE_EXAMPLES

### Set environment variable

```bash
export EVM_PRIVATE_KEY="0x..."
```

### viem (TypeScript)

```typescript
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

const account = privateKeyToAccount(process.env.EVM_PRIVATE_KEY);
const client = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});
```

### x402 payments

```typescript
import { wrapFetchWithPayment } from '@x402/fetch';

const x402Fetch = wrapFetchWithPayment(fetch, {
  privateKey: process.env.EVM_PRIVATE_KEY,
});

// Auto-handles 402 Payment Required
await x402Fetch('https://api.upgradeclaw.com/skills/polymarket-alpha/purchase');
```

---

## SECURITY

- **Keys generated locally** - never touches any server
- **Zero network calls** - works offline
- You are responsible for key security
- Lost keys = lost funds. No recovery.
- Use mnemonic for backup capability
- **Open source**: Audit the code at https://github.com/jeefxM/clawkeys

---

## NPM_PACKAGE

```
https://www.npmjs.com/package/clawkeys
```

---

## RELATED

- UpgradeClaw skill marketplace: https://upgradeclaw.com
- x402 payment protocol: https://x402.org

---

## OPEN SOURCE

ClawKeys is fully open source. The CLI generates wallets locally with zero network calls.

**GitHub**: https://github.com/jeefxM/clawkeys
**npm**: https://www.npmjs.com/package/clawkeys

```
CLAWKEYS.XYZ // LOCAL_GENERATION // ZERO_NETWORK // OPEN_SOURCE
```
