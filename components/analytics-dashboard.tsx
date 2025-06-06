"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  RefreshCw,
  Search,
  Copy,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTokenData, getTrendingTokens } from "@/lib/api";
import Image from "next/image";

export default function AnalyticsDashboard({
  onClose,
}: {
  onClose: () => void;
}) {
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [bestPool, setBestpool] = useState<{
    liquidity: number;
    price: number;
    marketCap?: number;
    volume?: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  type TokenInfo = {
    token: {
      name: string;
      symbol: string;
      mint: string;
      image?: string;
    };
    risk: {
      score: number;
      risks: Array<{
        name: string;
        description: string;
        level: "warning" | "danger";
        score?: number;
      }>;
    };
    events: {
      [key: string]: {
        priceChangePercentage: number;
      };
    };
    pools: Array<{
      liquidity: {
        usd: number;
      };
      price: {
        usd: number;
      };
      marketCap?: {
        usd: number;
      };
      txns?: {
        volume: number;
      };
    }>;
    holders: number;
  };

  type TrendingToken = {
    token: {
      name: string;
      symbol: string;
      mint: string;
      uri: string;
      decimals: number;
      hasFileMetaData: boolean;
      createdOn: string;
      description: string;
      image: string;
      showName: boolean;
      twitter?: string;
    };
    pools: Array<{
      liquidity: {
        quote: number;
        usd: number;
      };
      price: {
        quote: number;
        usd: number;
      };
      tokenSupply: number;
      lpBurn: number;
      tokenAddress: string;
      marketCap: {
        quote: number;
        usd: number;
      };
      decimals: number;
      security: {
        freezeAuthority: string | null;
        mintAuthority: string | null;
      };
      quoteToken: string;
      market: string;
      lastUpdated: number;
      txns: {
        buys: number;
        total: number;
        volume: number;
        sells: number;
      };
      deployer: string | null;
      poolId: string;
    }>;
    events: {
      [key: string]: {
        priceChangePercentage: number;
      };
    };
    risk: {
      rugged: boolean;
      risks: string[];
      score: number;
      jupiterVerified: boolean;
    };
    buysCount: number;
    sellsCount: number;
  };

  // Set trending tokens on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchTrendingTokens = async () => {
        const trendingTokens = await getTrendingTokens();
        setTrendingTokens(trendingTokens);
        setTrendingLoading(false); // <-- fix: set loading to false after fetch
        if (inputRef.current) {
          inputRef.current.focus();
        }
      };

      fetchTrendingTokens();
    }, 1000); // 1 second

    return () => clearTimeout(timer);
  }, []);

  const analyzeToken = async (passedAddress?: string) => {
    setLoading(true);
    const addressToAnalyze = passedAddress || tokenAddress.trim();
    setTokenAddress(addressToAnalyze);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const tokenData = await getTokenData(addressToAnalyze);
      setTokenInfo(tokenData);

      const validPools: Array<{
        liquidity: { usd: number };
        price: { usd: number };
        marketCap?: { usd: number };
        txns?: { volume: number };
      }> = tokenData.pools.filter(
        (pool: {
          liquidity: { usd: number };
          price: { usd: number };
          marketCap?: { usd: number };
          txns?: { volume: number };
        }) => pool.price && pool.price.usd > 0
      );
      const sortedPools = validPools.sort(
        (a, b) => b.liquidity.usd - a.liquidity.usd
      );

      if (sortedPools) {
        setBestpool({
          liquidity: sortedPools[0].liquidity.usd,
          price: sortedPools[0].price.usd,
          marketCap: sortedPools[0].marketCap?.usd,
          volume: sortedPools[0].txns?.volume,
        });
      } else {
        setBestpool({
          liquidity: tokenInfo?.pools[0].liquidity.usd || 0,
          price: tokenInfo?.pools[0].price.usd || 0,
          marketCap: tokenInfo?.pools[0].marketCap?.usd,
          volume: tokenInfo?.pools[0].txns?.volume,
        });
      }
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching token data:", error);
      setError(
        "Failed to fetch token data. Please check the address or try again later."
      );
      setLoading(false);
      setBestpool(null);
    }
  };

  // Handle token search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeToken();
  };

  // Handle trending token click
  const handleTrendingTokenClick = (address: string) => {
    analyzeToken(address);
  };

  // Handle input change: reset tokenInfo and bestPool if input is cleared
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(e.target.value);
    if (e.target.value.trim() === "") {
      setTokenInfo(null);
      setBestpool(null);
      setError(null);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-3xl md:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-800">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Token Analytics
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={18} className="sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-gray-800">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={tokenAddress}
                onChange={handleInputChange}
                placeholder="Enter token address or symbol"
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !tokenAddress}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Analyze
            </Button>
          </form>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4">
          {/* Loading Spinner */}
          {loading && tokenAddress && !tokenInfo && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-sm">Fetching token details...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-200 px-4 py-3 rounded-lg mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {/* Token Info Section */}
          {tokenInfo && !loading ? (
            <>
              <div className="border-2 border-gray-800 rounded-xl w-full flex flex-col sm:flex-row items-center justify-between m-2 p-3 gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      tokenInfo?.token.image ||
                      "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                    }
                    alt="Token Image"
                    width={48}
                    height={48}
                    className="rounded-full w-12 h-12 sm:w-14 sm:h-14"
                  />
                  <div>
                    <h4 className="text-gray-400 text-sm sm:text-base">
                      {tokenInfo?.token.name}
                    </h4>
                    <div className="flex items-center">
                      <h5 className="text-blue-300 text-xs sm:text-sm truncate">
                        {`${
                          tokenInfo?.token.mint.slice(0, 4).concat("...") ?? ""
                        } `}
                      </h5>
                      {tokenInfo?.token.mint && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(tokenInfo.token.mint);
                            window.alert(
                              `Address copied to clipboard: ${tokenInfo.token.mint}`
                            );
                          }}
                          className="ml-1 text-gray-500 hover:text-white"
                          title="Copy address"
                        >
                          <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto">
                  <div className="border-2 border-gray-800 rounded-xl flex flex-col items-center p-2 sm:p-3">
                    <h6 className="text-gray-400 text-xs sm:text-sm">
                      Current Price
                    </h6>
                    <h5 className="text-white text-sm sm:text-base">
                      {bestPool?.price != null
                        ? `$${bestPool.price.toFixed(6)}`
                        : "-"}
                    </h5>
                  </div>
                  <div className="border-2 border-gray-800 rounded-xl flex flex-col items-center p-2 sm:p-3">
                    <h6 className="text-gray-400 text-xs sm:text-sm">
                      24h Change
                    </h6>
                    <h5
                      className={`text-sm sm:text-base ${
                        tokenInfo?.events["24h"].priceChangePercentage != null
                          ? tokenInfo?.events["24h"].priceChangePercentage > 0
                            ? "text-green-400"
                            : "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {tokenInfo?.events["24h"]?.priceChangePercentage
                        ?.toFixed(2)
                        .concat("%") ?? "-"}
                    </h5>
                  </div>
                  <div className="border-2 border-gray-800 rounded-xl flex flex-col items-center p-2 sm:p-3">
                    <h6 className="text-gray-400 text-xs sm:text-sm">
                      Market Cap
                    </h6>
                    <h5 className="text-white text-sm sm:text-base">
                      {(bestPool?.marketCap ?? "").toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      }) ?? "-"}
                    </h5>
                  </div>
                  <div className="border-2 border-gray-800 rounded-xl flex flex-col items-center p-2 sm:p-3">
                    <h6 className="text-gray-400 text-xs sm:text-sm">
                      24H Volume
                    </h6>
                    <h5 className="text-white text-sm sm:text-base">
                      {(bestPool?.volume ?? "").toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      }) ?? "-"}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-white m-2 w-[100%]">
                <div className="border-2 border-gray-800 rounded-xl p-4">
                  <h4 className="text-sm sm:text-base my-2">
                    Holder Statistics
                  </h4>
                  <div className="flex justify-between">
                    <h5 className="text-gray-400 text-xs sm:text-sm my-3">
                      Total Holders
                    </h5>
                    <h5 className="text-white text-sm sm:text-base my-3">
                      {tokenInfo?.holders ?? "-"}
                    </h5>
                  </div>
                </div>
                <div className="border-2 border-gray-800 rounded-xl p-4">
                  <h4 className="text-sm sm:text-base my-2">Risk Assessment</h4>
                  <div className="flex justify-between">
                    <h5 className="text-gray-400 text-xs sm:text-sm my-3">
                      Risk Score
                    </h5>
                    <h5
                      className={`text-sm sm:text-base my-3 ${
                        tokenInfo?.risk.score != null
                          ? tokenInfo.risk.score >= 7
                            ? "text-red-600"
                            : tokenInfo.risk.score <= 3
                            ? "text-green-400"
                            : "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    >
                      {tokenInfo?.risk.score?.toString().concat("/10") ?? "-"}
                    </h5>
                  </div>
                </div>
                <div className="border-2 border-gray-800 rounded-xl p-4">
                  <h4 className="text-sm sm:text-base my-2 mx-2">
                    Price Changes
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <h5 className="text-gray-400 text-xs sm:text-sm my-3">
                      1h
                    </h5>
                    <h5
                      className={`text-sm sm:text-base my-3 ${
                        tokenInfo?.events["1h"].priceChangePercentage != null
                          ? tokenInfo.events["1h"].priceChangePercentage > 0
                            ? "text-green-400"
                            : "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {tokenInfo?.events["1h"].priceChangePercentage != null
                        ? tokenInfo.events["1h"].priceChangePercentage
                            .toFixed(2)
                            .concat("%")
                        : "-"}
                    </h5>
                    <h5 className="text-gray-400 text-xs sm:text-sm my-3">
                      24h
                    </h5>
                    <h5
                      className={`text-sm sm:text-base my-3 ${
                        tokenInfo?.events["24h"].priceChangePercentage != null
                          ? tokenInfo.events["24h"].priceChangePercentage > 0
                            ? "text-green-400"
                            : "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {tokenInfo?.events["24h"].priceChangePercentage
                        ?.toFixed(2)
                        .concat("%") ?? "-"}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-x-hidden">
                <iframe
                  src={`https://dexscreener.com/solana/${tokenAddress}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=dark&theme=light&chartStyle=0&chartType=usd&interval=15`}
                  className="w-full h-full border-0 max-w-full"
                  allowFullScreen
                ></iframe>
              </div>
            </>
          ) : null}

          {/* Trending Tokens */}
          {!tokenInfo && !loading && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-medium text-white mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-400" />
                Trending Tokens
              </h3>
              {trendingTokens.length > 0 ? (
                <div className="m-2 sm:m-4">
                  {trendingTokens.map((token, i) => (
                    <button
                      key={i}
                      onClick={() => handleTrendingTokenClick(token.token.mint)}
                      className="bg-gray-800 hover:bg-gray-750 m-2 sm:m-4 w-full rounded-lg p-3 sm:p-4 text-left transition-colors overflow-hidden"
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                          {token.token.image ? (
                            <img
                              src={token.token.image}
                              alt={token.token.symbol}
                              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full p-1"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  token.token.symbol || "Token"
                                )}&background=7e22ce&color=fff`;
                              }}
                            />
                          ) : (
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                              {token.token.symbol?.charAt(0).toUpperCase() ||
                                "?"}
                            </div>
                          )}
                          <div className="font-medium text-white text-sm sm:text-base truncate">
                            {token.token.name || "Unknown Token"}
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400 ml-1 truncate">
                          {token.token.mint}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : !trendingLoading ? (
                <div className="text-center py-6 sm:py-8 text-gray-400">
                  <p className="text-sm">No trending tokens found</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-purple-500 mb-4"></div>
                  <p className="text-sm">Fetching trending tokens...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-800 text-center text-xs sm:text-sm text-gray-500">
          <p>
            Data provided by{" "}
            <a
              href="https://dexscreener.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline"
            >
              DexScreener
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
