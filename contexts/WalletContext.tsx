"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

type TokenBalance = {
  mint: string;
  balance: number;
  decimals: number;
  uiAmount: number;
};

type WalletContextType = {
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  connecting: boolean;
  getTokenBalance: (
    tokenMintAddress: string,
    decimals?: number
  ) => Promise<number | null>;
  getAllTokenBalances: () => Promise<TokenBalance[]>;
  refreshTokenBalances: () => Promise<void>;
  tokenBalances: TokenBalance[];
  loadingTokens: boolean;
  connection: Connection;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({
  children,
  rpcEndpoint = "https://api.devnet.solana.com",
}: {
  children: ReactNode;
  rpcEndpoint?: string;
}) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [connection] = useState(() => new Connection(rpcEndpoint));

  // Debug: Log RPC endpoint being used
  useEffect(() => {
    console.log(
      "🔧 [DEBUG] WalletProvider initialized with RPC endpoint:",
      rpcEndpoint
    );
  }, [rpcEndpoint]);

  // Load wallet address on mount, but only attempt auto-connect if explicitly allowed
  useEffect(() => {
    if (typeof window === "undefined") return;

    // console.log(
    //   "🔧 [DEBUG] Checking for saved wallet address and auto-connect preference"
    // );
    const savedAddress = localStorage.getItem("walletAddress");
    const shouldAutoConnect = localStorage.getItem("autoConnect") === "true";

    // console.log("🔧 [DEBUG] Saved address:", savedAddress);
    // console.log("🔧 [DEBUG] Should auto-connect:", shouldAutoConnect);

    if (
      savedAddress &&
      shouldAutoConnect &&
      window.solana &&
      window.solana.isPhantom
    ) {
      console.log("🔧 [DEBUG] Attempting auto-connect to Phantom wallet");
      window.solana
        .connect({ onlyIfTrusted: true })
        .then((resp: { publicKey: { toString: () => string } }) => {
          const address = resp.publicKey.toString();
          // console.log("🔧 [DEBUG] Auto-connect successful, address:", address);
          if (address === savedAddress) {
            setWalletAddress(address);
            // console.log(
            //   "✅ [DEBUG] Address matches saved address, wallet connected"
            // );
          } else {
            console.log("⚠️ [DEBUG] Address mismatch, clearing saved data");
            localStorage.removeItem("walletAddress");
            localStorage.removeItem("autoConnect");
          }
        })
        .catch((error) => {
          // console.error("❌ [DEBUG] Auto-connect failed:", error);
          localStorage.removeItem("walletAddress");
          localStorage.removeItem("autoConnect");
        });
    } else {
      console.log("🔧 [DEBUG] Auto-connect conditions not met");
    }
  }, []);

  // Auto-load token balances when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      console
        .log
        // "🔧 [DEBUG] Wallet address changed, refreshing token balances"
        ();
      refreshTokenBalances();
    } else {
      // console.log("🔧 [DEBUG] No wallet address, clearing token balances");
      setTokenBalances([]);
    }
  }, [walletAddress]);

  const connectWallet = async () => {
    // console.log("🔧 [DEBUG] Starting wallet connection process");
    setConnecting(true);
    let tries = 0;

    while (typeof window !== "undefined" && !window.solana && tries < 10) {
      // console.log(
      //   `🔧 [DEBUG] Waiting for Phantom wallet... (attempt ${tries + 1}/10)`
      // );
      await new Promise((res) => setTimeout(res, 200));
      tries++;
    }

    try {
      if (
        typeof window !== "undefined" &&
        window.solana &&
        window.solana.isPhantom
      ) {
        // console.log(
        //   "🔧 [DEBUG] Phantom wallet detected, attempting connection"
        // );
        const resp = await window.solana.connect();
        const address = resp.publicKey.toString();
        console.log(
          "✅ [DEBUG] Wallet connected successfully, address:",
          address
        );

        setWalletAddress(address);
        localStorage.setItem("walletAddress", address);
        localStorage.setItem("autoConnect", "true");
        // console.log("🔧 [DEBUG] Wallet address saved to localStorage");
      } else {
        // console.error("❌ [DEBUG] Phantom wallet not found");
        // alert(
        //   // "Phantom wallet not found. Please install the Phantom extension."
        // );
      }
    } catch (err) {
      // console.error("❌ [DEBUG] Error connecting wallet:", err);
    } finally {
      setConnecting(false);
      // console.log("🔧 [DEBUG] Connection process completed");
    }
  };

  const disconnectWallet = async () => {
    // console.log("🔧 [DEBUG] Starting wallet disconnection process");
    setWalletAddress(null);
    setTokenBalances([]);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("autoConnect");
    // console.log("🔧 [DEBUG] Wallet data cleared from state and localStorage");

    if (
      typeof window !== "undefined" &&
      window.solana &&
      window.solana.isPhantom
    ) {
      try {
        await window.solana.disconnect();
        // console.log("✅ [DEBUG] Wallet disconnected successfully");
      } catch (error) {
        // console.error("❌ [DEBUG] Error disconnecting wallet:", error);
      }
    }
  };

  const isValidPublicKey = (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  const getTokenBalance = useCallback(
    async (
      tokenMintAddress: string,
      decimals: number = 9
    ): Promise<number | null> => {
      // console.log("🔧 [DEBUG] Starting getTokenBalance");
      // console.log("🔧 [DEBUG] Token mint address:", tokenMintAddress);
      // console.log("🔧 [DEBUG] Decimals:", decimals);
      // console.log("🔧 [DEBUG] Wallet address:", walletAddress);

      if (!walletAddress) {
        console.warn("⚠️ [DEBUG] Wallet not connected");
        return null;
      }

      // Validate addresses
      if (!isValidPublicKey(walletAddress)) {
        // console.error("❌ [DEBUG] Invalid wallet address:", walletAddress);
        return null;
      }

      if (!isValidPublicKey(tokenMintAddress)) {
        // console.error(
        //   "❌ [DEBUG] Invalid token mint address:",
        //   tokenMintAddress
        // );
        return null;
      }

      try {
        // console.log("🔧 [DEBUG] Creating PublicKey objects");
        const userPublicKey = new PublicKey(walletAddress);
        const tokenMintPublicKey = new PublicKey(tokenMintAddress);

        // console.log("🔧 [DEBUG] Getting associated token address");
        const associatedTokenAddress = await getAssociatedTokenAddress(
          tokenMintPublicKey,
          userPublicKey
        );

        // console.log(
        //   "🔧 [DEBUG] Associated token address:",
        //   associatedTokenAddress.toString()
        // );

        try {
          // console.log("🔧 [DEBUG] Fetching token account info");
          const tokenAccount = await getAccount(
            connection,
            associatedTokenAddress
          );

          const rawBalance = Number(tokenAccount.amount);
          const balance = rawBalance / Math.pow(10, decimals);

          // console.log("🔧 [DEBUG] Raw token balance:", rawBalance);
          // console.log("🔧 [DEBUG] Formatted token balance:", balance);
          // console.log("✅ [DEBUG] Token balance retrieved successfully");

          return balance;
        } catch (tokenError: any) {
          if (tokenError.name === "TokenAccountNotFoundError") {
            // console.log("⚠️ [DEBUG] Token account not found - balance is 0");
            return 0;
          }
          // console.error("❌ [DEBUG] Token account error:", tokenError);
          throw tokenError;
        }
      } catch (error) {
        // console.error("❌ [DEBUG] Error in getTokenBalance:", error);
        return null;
      }
    },
    [walletAddress, connection]
  );

  const getAllTokenBalances = useCallback(async (): Promise<TokenBalance[]> => {
    console.log("🔧 [DEBUG] Starting getAllTokenBalances");
    console.log("🔧 [DEBUG] Wallet address:", walletAddress);

    if (!walletAddress) {
      console.warn("⚠️ [DEBUG] No wallet address provided");
      return [];
    }

    if (!isValidPublicKey(walletAddress)) {
      console.error(
        "❌ [DEBUG] Invalid wallet address for getAllTokenBalances"
      );
      return [];
    }

    try {
      console.log("🔧 [DEBUG] Creating user PublicKey");
      const userPublicKey = new PublicKey(walletAddress);

      console.log("🔧 [DEBUG] Fetching token accounts from RPC");
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        userPublicKey,
        {
          programId: new PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          ),
        }
      );

      console.log(
        "🔧 [DEBUG] Raw token accounts found:",
        tokenAccounts.value.length
      );

      const balances: TokenBalance[] = tokenAccounts.value
        .map((account, index) => {
          const parsedInfo = account.account.data.parsed.info;
          const tokenAmount = parsedInfo.tokenAmount;

          console.log(`🔧 [DEBUG] Token ${index + 1}:`);
          console.log(`  - Mint: ${parsedInfo.mint}`);
          console.log(`  - Raw amount: ${tokenAmount.amount}`);
          console.log(`  - Decimals: ${tokenAmount.decimals}`);
          console.log(`  - UI amount: ${tokenAmount.uiAmount}`);

          return {
            mint: parsedInfo.mint,
            balance: Number(tokenAmount.amount),
            decimals: tokenAmount.decimals,
            uiAmount: tokenAmount.uiAmount || 0,
          };
        })
        .filter((token) => {
          const hasBalance = token.uiAmount > 0;
          console.log(
            `🔧 [DEBUG] Token ${token.mint} has balance: ${hasBalance}`
          );
          return hasBalance;
        });

      console.log("✅ [DEBUG] Final filtered token balances:", balances.length);
      console.log("🔧 [DEBUG] Token balances:", balances);

      return balances;
    } catch (error) {
      console.error("❌ [DEBUG] Error in getAllTokenBalances:", error);
      return [];
    }
  }, [walletAddress, connection]);

  const refreshTokenBalances = useCallback(async () => {
    // console.log("🔧 [DEBUG] Starting refreshTokenBalances");

    if (!walletAddress) {
      // console.log("🔧 [DEBUG] No wallet address, clearing token balances");
      setTokenBalances([]);
      return;
    }

    setLoadingTokens(true);
    // console.log("🔧 [DEBUG] Set loading tokens to true");

    try {
      // console.log("🔧 [DEBUG] Calling getAllTokenBalances");
      const balances = await getAllTokenBalances();
      // console.log("🔧 [DEBUG] Got balances, updating state");
      setTokenBalances(balances);
      // console.log("✅ [DEBUG] Token balances refreshed successfully");
    } catch (error) {
      // console.error("❌ [DEBUG] Error refreshing token balances:", error);
      setTokenBalances([]);
    } finally {
      setLoadingTokens(false);
      // console.log("🔧 [DEBUG] Set loading tokens to false");
    }
  }, [walletAddress, getAllTokenBalances]);

  // Debug: Log state changes
  // useEffect(() => {
  //   console.log("🔧 [DEBUG] Wallet address state changed:", walletAddress);
  // }, [walletAddress]);

  // useEffect(() => {
  //   console.log("🔧 [DEBUG] Token balances state changed:", tokenBalances);
  // }, [tokenBalances]);

  // useEffect(() => {
  //   console.log("🔧 [DEBUG] Loading tokens state changed:", loadingTokens);
  // }, [loadingTokens]);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        connectWallet,
        disconnectWallet,
        connecting,
        getTokenBalance,
        getAllTokenBalances,
        refreshTokenBalances,
        tokenBalances,
        loadingTokens,
        connection,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
