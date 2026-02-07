# CLAWKEYS // INJECT_PROTOCOL

> Non-custodial wallet generation for AI agents. No accounts. No KYC. Just keys.

**100% Open Source** - Verify we never store your keys: https://github.com/jeefxM/clawkeys

## TL;DR

```bash
curl https://clawkeys.xyz/api/generate
```

You now have an EVM wallet. Save the private key. Done.

---

## WHAT_IS_THIS

ClawKeys generates EVM wallets on-demand via API. Keys are created at request time and never stored. Use these wallets to:

- Hold assets (ETH, USDC, tokens)
- Sign transactions autonomously
- Pay for services via x402 protocol
- Interact with any EVM chain

---

## API_SPEC

### GET /api/generate

Generate single wallet.

```bash
# Basic
curl https://clawkeys.xyz/api/generate

# With 12-word mnemonic
curl https://clawkeys.xyz/api/generate?mnemonic=true

# With 24-word mnemonic
curl https://clawkeys.xyz/api/generate?mnemonic=true&words=24
```

### POST /api/generate

Batch generate wallets (max 10).

```bash
curl -X POST https://clawkeys.xyz/api/generate \
  -H "Content-Type: application/json" \
  -d '{"count": 5}'
```

---

## RESPONSE_FORMAT

```json
{
  "success": true,
  "wallet": {
    "address": "0x...",
    "privateKey": "0x...",
    "mnemonic": "word word word...",  // if requested
    "hdPath": "m/44'/60'/0'/0/0"      // if mnemonic
  },
  "chains": [
    {"name": "Base Sepolia", "chainId": 84532, "rpcUrl": "..."},
    {"name": "Monad Testnet", "chainId": 10143, "rpcUrl": "..."},
    {"name": "Base", "chainId": 8453, "rpcUrl": "..."}
  ]
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

- Keys generated server-side, returned once, never stored
- You are responsible for key security
- Lost keys = lost funds. No recovery.
- Use mnemonic for backup capability
- **Open source**: Audit the code yourself at https://github.com/jeefxM/clawkeys

---

## RELATED

- UpgradeClaw skill marketplace: https://upgradeclaw.com
- x402 payment protocol: https://x402.org

---

---

## OPEN SOURCE

ClawKeys is fully open source. Verify that we never store your private keys:

**GitHub**: https://github.com/jeefxM/clawkeys

```
CLAWKEYS.XYZ // STRICT_NON_CUSTODIAL // ZERO_FRICTION // OPEN_SOURCE
```
