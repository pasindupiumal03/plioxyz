"use client";

import { useState, useEffect } from "react";
import {
  Gamepad2,
  Film,
  BarChart3,
  ImageIcon,
  Map,
  Bot,
  TrendingUp,
  MessageSquare,
  Search,
  Zap,
  Wallet,
  Settings,
} from "lucide-react";
import Navigation from "@/components/navigation";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import particles to avoid SSR issues
const ParticlesBackground = dynamic(
  () => import("@/components/particles-background"),
  {
    ssr: false,
  }
);

import React from "react";

type ToolCard = {
  name: string;
  desc: string;
  icon: React.ReactNode;
  gradient: string;
  action: string;
  restricted?: boolean;
  comingSoon?: boolean;
};

const toolCards: ToolCard[] = [
  {
    name: "Torrent Games",
    desc: "Access a collection of games available for download.",
    icon: <Gamepad2 className="w-6 h-6 text-white" />,
    gradient: "from-blue-600 to-purple-600",
    action: "games",
  },
  {
    name: "Torrent Movies",
    desc: "Browse and download your favorite movies and TV shows.",
    icon: <Film className="w-6 h-6 text-white" />,
    gradient: "from-purple-600 to-indigo-600",
    action: "movies",
  },
  {
    name: "Token Analytics",
    desc: "Deep dive into any Solana token with detailed analytics ",
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    gradient: "from-emerald-600 to-teal-600",
    action: "analytics",
  },
  {
    name: "Image Generator",
    desc: "Generate and download AI images.",
    icon: <ImageIcon className="w-6 h-6 text-white" />,
    gradient: "from-orange-500 to-red-500",
    action: "images",
  },
  {
    name: "Roadmap",
    desc: "Check out our development roadmap and upcoming features.",
    icon: <Map className="w-6 h-6 text-white" />,
    gradient: "from-cyan-500 to-blue-500",
    action: "roadmap",
  },
  {
    name: "AI Chatbot",
    desc: "Get instant answers to your blockchain questions.",
    icon: <Bot className="w-6 h-6 text-white" />,
    gradient: "from-violet-600 to-purple-600",
    action: "chat",
  },
  {
    name: "Crypto Market",
    desc: "Track cryptocurrency prices and market data.",
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    gradient: "from-green-600 to-emerald-600",
    action: "market",
  },
  {
    name: "More Tools",
    desc: "Coming soon - Stay tuned for more exciting features!",
    icon: <Zap className="w-6 h-6 text-white" />,
    gradient: "from-amber-500 to-orange-500",
    action: "more-tools",
    comingSoon: true,
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<ToolCard | null>(null);
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

  const handleToolCardClick = (card: ToolCard) => {
    if (card.comingSoon || card.restricted) return;

    // Dispatch a custom event that the Navigation component can listen to
    const event = new CustomEvent("toolSelected", {
      detail: { action: card.action },
    });
    window.dispatchEvent(event);
  };

  // Listen for tool selection from the sidebar
  useEffect(() => {
    const handleToolSelected = (event: Event) => {
      const customEvent = event as CustomEvent<{ action: string }>;
      const action = customEvent.detail?.action;
      if (action) {
        const tool = toolCards.find((tool) => tool.action === action);
        if (tool) {
          setActiveTool(tool);
        }
      }
    };

    window.addEventListener(
      "toolSelected",
      handleToolSelected as EventListener
    );
    return () => {
      window.removeEventListener(
        "toolSelected",
        handleToolSelected as EventListener
      );
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background matching homepage */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        {/* Enhanced network pattern matching homepage */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <pattern
                id="network"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="50" cy="50" r="2" fill="rgba(71,85,105,0.6)" />
                <line
                  x1="50"
                  y1="50"
                  x2="100"
                  y2="0"
                  stroke="rgba(71,85,105,0.4)"
                  strokeWidth="1"
                />
                <line
                  x1="50"
                  y1="50"
                  x2="100"
                  y2="100"
                  stroke="rgba(71,85,105,0.4)"
                  strokeWidth="1"
                />
                <line
                  x1="50"
                  y1="50"
                  x2="0"
                  y2="100"
                  stroke="rgba(71,85,105,0.4)"
                  strokeWidth="1"
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

        {/* Enhanced floating particles matching homepage */}
        <div className="absolute inset-0">
          {particleStyles.map((style, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-slate-500/50 rounded-full animate-pulse"
              style={style}
            />
          ))}
        </div>

        {/* Reduced overlay for better pattern visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/5" />
      </div>

      <div className="min-h-screen w-full flex relative z-10">
        <Navigation />
        <main className="flex-1 p-6 md:p-12 flex flex-col items-center w-full min-h-screen bg-transparent">
          <div className="w-full max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent font-extrabold">
                  $LUNESHARK{" "}
                </span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-extrabold">
                  Features
                </span>
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Explore our suite of tools designed to enhance your experience
              </p>
            </div>

            {/* Tool Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {toolCards.map((card, index) => (
                <div
                  key={index}
                  className={`group relative ${
                    card.comingSoon || card.restricted ? "" : "cursor-pointer"
                  }`}
                  onClick={() => handleToolCardClick(card)}
                >
                  <div className="bg-white/80 backdrop-blur-md border border-gray-200 p-8 rounded-2xl h-full relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-lg shadow-sm">
                    <div
                      className={
                        card.comingSoon || card.restricted ? "opacity-70" : ""
                      }
                    >
                      {/* Subtle gradient background overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                      />

                      {/* Icon */}
                      <div className="relative mb-6">
                        <div
                          className={`relative w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.gradient} text-white shadow-lg`}
                        >
                          {card.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {card.name}
                        </h3>
                        <p className="text-gray-600 mb-4">{card.desc}</p>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {card.restricted && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300">
                            Premium
                          </span>
                        )}
                        {card.comingSoon && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hover effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <style jsx global>{`
            @keyframes gradient-x {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }

            .animate-gradient-x {
              background-size: 200% auto;
              animation: gradient-x 8s ease infinite;
            }

            .glass-navbar {
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px); /* For Safari support */
            }
          `}</style>
        </main>
      </div>
    </div>
  );
}
