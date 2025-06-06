"use server";
import axios from "axios";

const DEXSCREENER_BASE_API_URL = "https://api.dexscreener.com";
// Get API configuration from environment variables
const SOLANA_TRACKER_API_URL =
  process.env.NEXT_PUBLIC_SOLANA_TRACKER_API_URL ||
  "https://data.solanatracker.io";
const SOLANA_TRACKER_API_KEY = process.env.SOLANA_TRACKER_API_KEY || "";

if (!SOLANA_TRACKER_API_KEY) {
  console.warn(
    "SOLANA_TRACKER_API_KEY is not set. Some features may not work correctly."
  );
}

export const getTrendingTokens = async () => {
  try {
    const response = await axios.get(
      `${SOLANA_TRACKER_API_URL}/tokens/trending`,
      {
        headers: { "x-api-key": SOLANA_TRACKER_API_KEY },
      }
    );
    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      return { tokens: [] };
    }
  } catch (error) {
    console.error("Error fetching trending tokens:", error);
    return { tokens: [] };
  }
};

export const getTokenData = async (address: string) => {
  try {
    const response = await axios.get(
      `${SOLANA_TRACKER_API_URL}/tokens/${address}`,
      {
        headers: { "x-api-key": SOLANA_TRACKER_API_KEY },
      }
    );
    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      console.warn("No data found for address:", address);
      return null;
    }
  } catch (error) {
    console.error("Error fetrching token data: ", error);
    return null;
  }
};
