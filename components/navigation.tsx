"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  Film,
  BarChart3,
  ImageIcon,
  Map,
  Bot,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TorrentGameSearch from "./torrent-game-search";
import TorrentMovieSearch from "./torrent-movie-search";
import ProjectRoadmap from "./project-roadmap";
import PlioBot from "./plio-bot";
import CryptoMarket from "./crypto-market";
import AnalyticsDashboard from "./analytics-dashboard";
import ImageGenerator from "./image-generator";
import Notification from "./notification";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "react-toastify";
import axios from "axios";

const menuItems = [
  { icon: Gamepad2, label: "Games", action: "games" },
  { icon: Film, label: "Movies", action: "movies" },
  { icon: BarChart3, label: "Analytics", action: "analytics" },
  { icon: ImageIcon, label: "Images", action: "images" },
  { icon: Map, label: "Roadmap", action: "roadmap" },
  { icon: Bot, label: "PlioBot", action: "chat" },
  { icon: TrendingUp, label: "Crypto Market", action: "market" },
];

const PLIO_TOKEN_MINT = "2E7ZJe3n9mAnyW1AvouZY8EbfWBssvxov116Mma3pump";
const MIN_PLIO_BALANCE = 50000;

export default function Navigation() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [plioBalance, setPlioBalance] = useState(0);
  const { walletAddress, loadingTokens } = useWallet();

  const getPlioBalance = useCallback(async (): Promise<number> => {
    if (!walletAddress) return -1;
    try {
      const response = await axios.get(`/api/plio-balance`, {
        params: { wallet: walletAddress, plioMint: PLIO_TOKEN_MINT },
      });
      return response.data.balance;
    } catch (error) {
      console.error("Error fetching token balance from server:", error);
      return -1;
    }
  }, [walletAddress]);

  // Handle menu item click with async balance check
  const handleMenuItemClick = useCallback(
    async (action: string) => {
      setIsOpen(false);

      if (!walletAddress) {
        setActiveModal("WalletNotConnectedNotification");
        return;
      }

      if (["analytics", "images"].includes(action)) {
        if (loadingTokens) {
          toast.info("Please wait, loading token balances...");
          return;
        }

        const latestBalance = await getPlioBalance();

        setPlioBalance(latestBalance);
        if (latestBalance === -1) {
          setActiveModal("PlioBalanceError");
          return;
        }
        if (latestBalance < MIN_PLIO_BALANCE) {
          setActiveModal("PlioBalanceNotification");
          return;
        }
      }

      setActiveModal(action);
    },
    [walletAddress, getPlioBalance, loadingTokens]
  );

  // Listen for toolSelected events dispatched from dashboard or elsewhere
  useEffect(() => {
    const handleToolSelected = (event: Event) => {
      const customEvent = event as CustomEvent<{ action: string }>;
      const action = customEvent.detail?.action;
      if (action) {
        handleMenuItemClick(action);
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
  }, [handleMenuItemClick]);

  // Escape key to close menu/modals
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      getPlioBalance().then(setPlioBalance);
    }
  }, [walletAddress, getPlioBalance]);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className="hidden lg:flex fixed left-0 top-0 h-[200vh] bg-white/80 backdrop-blur-md w-20 flex-col items-center py-6 z-40 border-r border-gray-200 shadow-lg"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div
          className="mb-8 cursor-pointer"
          onClick={() => router.push("/")}
          aria-label="Go to homepage"
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity mb-10 border border-gray-200 shadow-sm">
            <img
              src="/luneshark_logo.png"
              alt="Luneshark Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col space-y-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:shadow-gray-300/50 group transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 border border-gray-200/50 hover:border-gray-300"
              aria-label={item.label}
              onClick={() => handleMenuItemClick(item.action)}
            >
              <item.icon className="text-gray-600 w-5 h-5 group-hover:text-gray-800 transition-colors" />
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-0 left-0 bg-white/80 backdrop-blur-md border border-gray-200 hover:bg-white text-gray-700 z-50 shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-label="Mobile navigation menu"
        >
          <nav className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-md border-r border-gray-200 p-6 shadow-xl">
            {/* Logo */}
            <div className="mb-8 mt-12">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src="/luneshark_logo.png"
                    alt="Luneshark Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-gray-800 font-bold text-xl">Plio</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:shadow-gray-300/50 transform hover:-translate-x-1 active:translate-x-0 active:scale-[0.98] w-full text-left border border-gray-200/50 hover:border-gray-300"
                  onClick={() => handleMenuItemClick(item.action)}
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Modals */}
      {activeModal === "PlioBalanceNotification" && (
        <Notification
          title="Insufficient $Luneshark Balance"
          message={`You need at least ${MIN_PLIO_BALANCE.toLocaleString()} $Luneshark to access this feature.`}
          type="error"
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "WalletNotConnectedNotification" && (
        <Notification
          title="Wallet not connected"
          message={`Please connect your wallet to use this feature.`}
          type="warning"
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "PlioBalanceError" && (
        <Notification
          title="Server issue"
          message={`Error while retrieving $Luneshark balance. Try again`}
          type="warning"
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "games" && (
        <TorrentGameSearch onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "movies" && (
        <TorrentMovieSearch onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "roadmap" && (
        <ProjectRoadmap onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "chat" && (
        <PlioBot onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "market" && (
        <CryptoMarket onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "analytics" && (
        <AnalyticsDashboard onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "images" && (
        <ImageGenerator onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}
