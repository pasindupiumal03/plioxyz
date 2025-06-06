"use client";

import type React from "react";

import {
  X,
  TrendingUp,
  Activity,
  Bot,
  Search,
  Smartphone,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "IN PROGRESS" | "PLANNED" | "RESEARCHING";
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

interface ProjectRoadmapProps {
  onClose: () => void;
}

const roadmapItems: RoadmapItem[] = [
  {
    id: "1",
    title: "Crypto Market Dashboard",
    description:
      "Show current prices for SOL and other major cryptos (BTC, ETH, LUNESHARK, and more trending meme coins) directly within the panel. Automatic AI price analysis by Google Gemini so you always know where the market is headed. Powered by lightning fast price APIs.",
    status: "IN PROGRESS",
    icon: TrendingUp,
    iconColor: "bg-gradient-to-br from-purple-500 to-pink-500",
  },
  {
    id: "2",
    title: "Solana Status & Gas Tracker",
    description:
      "Display key network health indicators like current TPS and estimated priority fees (gas) for low, medium, and high priority transactions. Helps you decide the best time to transact and know when the market is heating up 🔥",
    status: "PLANNED",
    icon: Activity,
    iconColor: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    id: "3",
    title: "AI Chat Context Enhancement",
    description:
      "Giving the chatbot complete, real-time context over the entire application state (like live wallet balances, dynamic API content). This involves advanced techniques like Function Calling or Retrieval Augmented Generation (RAG), which I am exploring for future integration.",
    status: "RESEARCHING",
    icon: Bot,
    iconColor: "bg-gradient-to-br from-violet-500 to-purple-500",
  },
  {
    id: "4",
    title: "Dex Screener Volume Tracker",
    description:
      'Track real-time trading volume surges across Solana tokens on Dex Screener. Identify which coins are pumping "right now" so you don\'t miss the next big move.',
    status: "PLANNED",
    icon: Search,
    iconColor: "bg-gradient-to-br from-fuchsia-500 to-pink-500",
  },
  {
    id: "5",
    title: "Android Mobile App",
    description:
      "Develop a native Android application to bring the LUNESHARK Holder Panel features to mobile devices for enhanced accessibility and convenience. Potential for push notifications for market alerts and search feature for cracked APKs (free paid apps).",
    status: "PLANNED",
    icon: Smartphone,
    iconColor: "bg-gradient-to-br from-violet-500 to-indigo-500",
  },
  {
    id: "6",
    title: "Ad-Funded Buybacks",
    description:
      "Incorporate unobtrusive advertisements for users who do not meet the $LUNESHARK holding requirement. Revenue generated from these ads will be used to facilitate buybacks of $LUNESHARK tokens, directly benefiting holders.",
    status: "PLANNED",
    icon: DollarSign,
    iconColor: "bg-gradient-to-br from-emerald-500 to-green-500",
  },
];

export default function ProjectRoadmap({ onClose }: ProjectRoadmapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN PROGRESS":
        return "bg-blue-600/80 text-blue-100";
      case "PLANNED":
        return "bg-yellow-600/80 text-yellow-100";
      case "RESEARCHING":
        return "bg-purple-600/80 text-purple-100";
      default:
        return "bg-gray-600/80 text-gray-100";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-auto shadow-2xl">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold text-white mb-1">
              Project Roadmap
            </h2>
            <p className="text-gray-400 text-sm font-light">
              Upcoming Features & Enhancements
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {roadmapItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-5 hover:bg-gray-800/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 group"
            >
              {/* Header with icon and title */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${item.iconColor} shadow-lg transform transition-transform group-hover:scale-110`}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    item.status
                  )} shadow-inner tracking-wide`}
                >
                  {item.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed font-light pl-10 tracking-wide">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
