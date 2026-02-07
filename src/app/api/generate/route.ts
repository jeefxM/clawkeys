import { NextRequest, NextResponse } from "next/server";
import { generateWallet } from "~/lib/wallet";
import { EVM_CHAINS, DEFAULT_CHAINS, type ChainKey } from "~/lib/chains";

// Simple in-memory rate limiter (resets on server restart)
// In production, use Redis or similar
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const DAILY_LIMIT = 5;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    // Reset or create new record
    rateLimitMap.set(ip, { count: 1, resetAt: now + dayInMs });
    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  }

  if (record.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: DAILY_LIMIT - record.count };
}

/**
 * GET /api/generate
 *
 * Generate a new EVM wallet for AI agents.
 *
 * Query params:
 * - mnemonic: "true" to generate with 12-word mnemonic
 * - words: "24" for 24-word mnemonic (default 12)
 *
 * Returns wallet address, private key, and optionally mnemonic.
 * IMPORTANT: Credentials are only shown once. Save them securely!
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Daily limit reached (5/day). Try again tomorrow." },
        { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
      );
    }

    const { searchParams } = new URL(request.url);
    const withMnemonic = searchParams.get("mnemonic") === "true";
    const words = searchParams.get("words") === "24" ? 24 : 12;

    // Generate the wallet
    const wallet = generateWallet({
      withMnemonic,
      mnemonicWords: words,
    });

    // Build chain info for default chains
    const chains = DEFAULT_CHAINS.map((key) => {
      const chain = EVM_CHAINS[key];
      return {
        name: chain.name,
        chainId: chain.chainId,
        rpcUrl: chain.rpcUrl,
        explorer: chain.explorer,
        testnet: chain.testnet,
        faucets: "faucets" in chain ? chain.faucets : undefined,
      };
    });

    // Build response
    const response: Record<string, unknown> = {
      success: true,
      wallet: {
        address: wallet.address,
        privateKey: wallet.privateKey,
      },
      chains,
      instructions: {
        step1: "Save your private key securely - it will NOT be shown again!",
        step2: "Your wallet works on ALL EVM chains with the same address",
        step3: "For testnets: Get gas from faucets listed above",
        step4: "Set EVM_PRIVATE_KEY environment variable in your agent",
      },
    };

    // Add mnemonic if generated
    if (wallet.mnemonic) {
      response.wallet = {
        ...response.wallet as object,
        mnemonic: wallet.mnemonic,
        hdPath: wallet.hdPath,
      };
      response.instructions = {
        ...(response.instructions as object),
        mnemonic_warning: "Write down your mnemonic phrase and store it offline!",
        derivation: "Use hdPath to derive the same wallet from your mnemonic",
      };
    }

    return NextResponse.json(
      { ...response, rateLimit: { remaining: rateLimit.remaining, limit: DAILY_LIMIT } },
      { headers: { "X-RateLimit-Remaining": String(rateLimit.remaining) } }
    );
  } catch (error) {
    console.error("[ClawKeys] Generate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate wallet" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/generate
 *
 * Generate wallet with custom options or batch generate.
 *
 * Body:
 * - count: number of wallets to generate (max 10)
 * - mnemonic: true to generate with mnemonic
 * - words: 12 or 24 for mnemonic length
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Daily limit reached (5/day). Try again tomorrow." },
        { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const count = Math.min(Math.max(Number(body.count) || 1, 1), 10);
    const withMnemonic = body.mnemonic === true;
    const words = body.words === 24 ? 24 : 12;

    const wallets = [];

    for (let i = 0; i < count; i++) {
      const wallet = generateWallet({
        withMnemonic,
        mnemonicWords: words,
      });

      wallets.push({
        index: i,
        address: wallet.address,
        privateKey: wallet.privateKey,
        ...(wallet.mnemonic && {
          mnemonic: wallet.mnemonic,
          hdPath: wallet.hdPath,
        }),
      });
    }

    // Build chain info
    const chains = DEFAULT_CHAINS.map((key) => {
      const chain = EVM_CHAINS[key];
      return {
        name: chain.name,
        chainId: chain.chainId,
        rpcUrl: chain.rpcUrl,
        testnet: chain.testnet,
      };
    });

    return NextResponse.json(
      {
        success: true,
        count: wallets.length,
        wallets,
        chains,
        warning: "Save all private keys securely - they will NOT be shown again!",
        rateLimit: { remaining: rateLimit.remaining, limit: DAILY_LIMIT },
      },
      { headers: { "X-RateLimit-Remaining": String(rateLimit.remaining) } }
    );
  } catch (error) {
    console.error("[ClawKeys] Batch generate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate wallets" },
      { status: 500 }
    );
  }
}
