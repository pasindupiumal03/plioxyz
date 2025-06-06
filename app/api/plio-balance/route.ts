import { NextRequest } from "next/server";
import axios from "axios";

type ShyftApiResponse = {
  success: boolean;
  message: string;
  result: {
    address: string;
    balance: number;
    info: {
      name: string;
      symbol: string;
      image: string;
      metadata_uri: string;
      decimals: number;
    };
    isFrozen: boolean;
  };
};

const SHYFT_API_KEY = process.env.SHYFT_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");
  const plioMint = searchParams.get("plioMint");

  if (!wallet) {
    return new Response(JSON.stringify({ error: "Missing wallet address" }), {
      status: 400,
    });
  }

  try {
    const response = await axios.get<ShyftApiResponse>(
      "https://api.shyft.to/sol/v1/wallet/token_balance",
      {
        params: {
          network: "mainnet-beta",
          wallet,
          token: plioMint,
        },
        headers: {
          "x-api-key": SHYFT_API_KEY!,
        },
      }
    );

    const data = response.data;

    if (data.success) {
      return new Response(JSON.stringify({ balance: data.result.balance }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(
        JSON.stringify({ error: "Failed to fetch balance" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
