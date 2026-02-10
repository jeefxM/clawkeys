# clawkeys

Secure local wallet generation for AI agents. Keys never leave your machine.

## Installation

```bash
npm install -g clawkeys
```

Or use directly with npx:

```bash
npx clawkeys generate
```

## Usage

### Generate a simple wallet

```bash
clawkeys generate
```

Output:
```
ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f...
PRIVATE_KEY=0x4c0883a69102937d6231471b5dbb6204fe512...
```

### Generate with mnemonic seed phrase

```bash
clawkeys generate --mnemonic
```

Output:
```
ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f...
PRIVATE_KEY=0x4c0883a69102937d6231471b5dbb6204fe512...
MNEMONIC="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
HD_PATH=m/44'/60'/0'/0/0
```

### Generate with 24-word mnemonic

```bash
clawkeys generate --mnemonic --words 24
```

### Output as JSON

```bash
clawkeys generate --mnemonic --json
```

### Generate multiple wallets

```bash
clawkeys generate --count 5
```

### Save to file

```bash
clawkeys generate --mnemonic > wallet.txt
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-m, --mnemonic` | Generate with mnemonic seed phrase | false |
| `-w, --words <number>` | Number of mnemonic words (12 or 24) | 12 |
| `--path <hdpath>` | HD derivation path | m/44'/60'/0'/0/0 |
| `-j, --json` | Output as JSON | false |
| `-c, --count <number>` | Number of wallets to generate | 1 |

## Security

This CLI generates wallets **locally on your machine**. Private keys and mnemonics never touch any network or external server.

## License

MIT
