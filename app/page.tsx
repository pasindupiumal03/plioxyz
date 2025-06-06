"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Twitter,
  Send,
  Globe,
  Shield,
  Wallet,
  Rocket,
  Copy,
  ExternalLink,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/contexts/WalletContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";

// Dynamically import particles to avoid SSR issues
const ParticlesBackground = dynamic(
  () => import("@/components/particles-background"),
  { ssr: false }
);

export default function HomePage() {
  const { walletAddress, connecting, connectWallet, disconnectWallet } =
    useWallet();
  const router = useRouter();
  const isWalletConnected = !!walletAddress;
  const [plioBalance, setPlioBalance] = useState<number | null>(null);
  const [particleStyles, setParticleStyles] = useState<
    Array<React.CSSProperties>
  >([]);

  // Generate particle styles on the client side after hydration
  useEffect(() => {
    const generateRandomStyle = (): React.CSSProperties => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    });

    setParticleStyles(Array.from({ length: 20 }, generateRandomStyle));
  }, []);

  const handleConnectWallet = async () => {
    if (isWalletConnected) {
      await disconnectWallet();
      setPlioBalance(null);
    } else {
      await connectWallet();
      // Simulate fetching Plio balance (replace with actual API call)
      setTimeout(() => {
        setPlioBalance(0); // Set to 0 as shown in the image
      }, 1000);
    }
  };

  // Copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here if you want
  };

  // Check if user has enough $LUNESHARK for premium features
  const hasEnoughPlio = plioBalance !== null && plioBalance >= 50000;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with off-white gradient */}
      <Navigation />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <pattern
                id="network"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="1.5" fill="rgba(100,116,139,0.4)" />
                <line
                  x1="30"
                  y1="30"
                  x2="60"
                  y2="0"
                  stroke="rgba(100,116,139,0.2)"
                  strokeWidth="0.5"
                />
                <line
                  x1="30"
                  y1="30"
                  x2="60"
                  y2="60"
                  stroke="rgba(100,116,139,0.2)"
                  strokeWidth="0.5"
                />
                <line
                  x1="30"
                  y1="30"
                  x2="0"
                  y2="60"
                  stroke="rgba(100,116,139,0.2)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#network)" />
          </svg>
        </div>

        {/* Particles Background */}
        <div className="absolute inset-0">
          <ParticlesBackground />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {particleStyles.map((style, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-slate-300/40 rounded-full animate-pulse"
              style={style}
            />
          ))}
        </div>

        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-white/10" />
      </div>

      {/* Navigation */}
      <div className="fixed top-0 right-0 w-fit p-2 z-50">
        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="flex items-center space-x-1 bg-white/80 border border-gray-200 text-gray-700 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 transition-colors duration-200 backdrop-blur-md shadow-sm">
            <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">
              {connecting
                ? "Connecting..."
                : isWalletConnected
                ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
                : "Connect Wallet"}
            </span>
            {isWalletConnected && (
              <Button
                size="icon"
                variant="ghost"
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1 rounded-md"
                onClick={() => copyToClipboard(walletAddress)}
              >
                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            )}
          </div>

          {isWalletConnected && (
            <div className="flex items-center bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full px-2 py-0.5">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full mr-1 sm:mr-1.5 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-medium">
                Connected
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 pt-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <img
                src="/luneshark_logo.png"
                alt="Luneshark Logo"
                className="w-full h-full object-cover rounded-3xl shadow-xl border border-gray-200"
              />
            </div>

            {/* Social Icons */}
            <div className="flex justify-center space-x-4 mb-8">
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/80 hover:bg-white border border-gray-200 text-gray-700 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() =>
                  window.open(
                    "https://x.com/Luneshark",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <img
                  src="/x-twitter-brands-solid.svg"
                  alt="twitter"
                  className="w-5 h-5 rounded-md object-cover"
                />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/80 hover:bg-white border border-gray-200 text-gray-700 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() =>
                  window.open(
                    "https://telegram.org/Luneshark",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <img
                  src="/telegram.png"
                  alt="Telegram"
                  className="w-5 h-5 rounded-md object-cover"
                />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/80 hover:bg-white border border-gray-200 text-gray-700 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() =>
                  window.open(
                    "https://pump.fun/coin/2E7ZJe3n9mAnyW1AvouZY8EbfWBssvxov116Mma3pump",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <img
                  src="/Pump_fun_logo.png"
                  alt="Pumpfun"
                  className="w-5 h-5 rounded-md object-cover"
                />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/80 hover:bg-white border border-gray-200 text-gray-700 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200 p-2"
                onClick={() =>
                  window.open(
                    "https://dexscreener.com/solana/2cgwesvhz9gftdyqvbcje7lwvyoxk7oj35qega56vjfy",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <img
                  src="/dexscreener.jpg"
                  alt="DexScreener"
                  className="w-5 h-5 rounded-md object-cover"
                />
              </Button>
            </div>
          </div>

          <div className="mb-6 lg:mb-8 flex items-center justify-center gap-2">
            <p className="text-xs sm:text-sm font-mono break-all px-4 py-2 bg-white/80 rounded-lg border border-gray-200 text-gray-600 shadow-sm">
              2E7ZJe3n9mAnyW1AvouZY8EbfWBssvxov116Mma3pump
            </p>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/80 hover:bg-white border border-gray-200 text-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
              onClick={() =>
                copyToClipboard("2E7ZJe3n9mAnyW1AvouZY8EbfWBssvxov116Mma3pump")
              }
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {/* Main Heading */}
          <div className="relative mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <span className="relative">
                <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent font-extrabold">
                  $LUNESHARK
                </span>
                <span className="mx-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Holder
                </span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-extrabold">
                  Panel
                </span>
              </span>
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={() => router.push("/dashboard")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
            >
              <Rocket className="w-6 h-6 mr-3" />
              Launch Luneshark
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleConnectWallet}
              disabled={connecting}
              className="bg-white/80 border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 font-semibold px-8 py-6 text-lg backdrop-blur-md transition-all duration-300 hover:scale-105 disabled:opacity-50 shadow-sm hover:shadow-md"
            >
              <Wallet className="w-6 h-6 mr-3" />
              {connecting
                ? "Connecting..."
                : isWalletConnected
                ? "Disconnect Wallet"
                : "Connect Wallet"}
            </Button>
          </div>

          {/* Description */}
          <div className="space-y-4 text-gray-700 max-w-2xl mx-auto">
            <p className="text-xl font-medium flex items-center justify-center">
              <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
              Access exclusive holder tools
            </p>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
              <p className="text-lg mb-3 flex items-center justify-center text-gray-800">
                <Shield className="w-5 h-5 mr-2 text-emerald-500" />
                <span className="font-semibold">Current Requirement:</span>
              </p>
              <Badge className="ml-2 mb-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-sm">
                50,000 $LUNESHARK
              </Badge>

              <p className="text-base text-gray-600 leading-relaxed text-center">
                Connect your wallet to view token details and access exclusive
                holder tools.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          {isWalletConnected && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <Card className="bg-white/80 border-gray-200 backdrop-blur-md p-6 hover:bg-white hover:shadow-lg transition-all duration-300 shadow-sm">
                <TrendingUp className="w-8 h-8 text-emerald-500 mb-4 mx-auto" />
                <h3 className="text-gray-800 font-semibold mb-2">
                  Real-time Analytics
                </h3>
                <p className="text-gray-600 text-sm">
                  Track your holdings and market performance
                </p>
              </Card>

              <Card className="bg-white/80 border-gray-200 backdrop-blur-md p-6 hover:bg-white hover:shadow-lg transition-all duration-300 shadow-sm">
                <Shield className="w-8 h-8 text-blue-500 mb-4 mx-auto" />
                <h3 className="text-gray-800 font-semibold mb-2">
                  Exclusive Access
                </h3>
                <p className="text-gray-600 text-sm">
                  Holder-only features and premium tools
                </p>
              </Card>

              <Card className="bg-white/80 border-gray-200 backdrop-blur-md p-6 hover:bg-white hover:shadow-lg transition-all duration-300 shadow-sm">
                <Sparkles className="w-8 h-8 text-purple-500 mb-4 mx-auto" />
                <h3 className="text-gray-800 font-semibold mb-2">
                  Advanced Tools
                </h3>
                <p className="text-gray-600 text-sm">
                  Professional trading and analysis suite
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
