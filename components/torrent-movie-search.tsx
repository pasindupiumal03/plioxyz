"use client";

import type React from "react";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Movie {
  id: string;
  title: string;
  year: string;
  quality: string;
  size: string;
  source: string;
  desc: string;
}

interface TorrentMovieSearchProps {
  onClose: () => void;
}

const BASE_API_URL = "https://plio-backend.onrender.com";

export default function TorrentMovieSearch({
  onClose,
}: TorrentMovieSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await fetch(
        `${BASE_API_URL}/torrents/search?q=${encodeURIComponent(
          searchQuery
        )}&type=Movies`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch torrents");
      }
      const data = await response.json();

      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Error searching torrents:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6 shadow-2xl">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Torrent Movie Search
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search input */}
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search for Movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-gray-800/60 border-gray-700 text-white"
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
          >
            {isSearching ? (
              <>
                <Loader2 className="ml-1 h-4 w-4 animate-spin" />
                <p className="mr-1">Searching...</p>
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>

        {/* Search tip */}
        <p className="text-gray-400 text-sm mb-6 truncate">
          Tip: Use specific terms for better results (e.g., 'spider-man' works,
          'spiderman' might not).
        </p>

        {/* Loading indicator */}
        {isSearching && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin mb-4"></div>
          </div>
        )}

        {/* Search results */}
        {!isSearching && hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-x-hidden">
            {searchResults.map((movie, id) => (
              <div
                key={id}
                className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 max-w-full"
              >
                <h3 className="text-white font-semibold mb-2 text-center truncate">
                  {movie.title}
                </h3>
                <div className="flex justify-center items-center gap-2 text-xs text-gray-400 mb-4 flex-wrap">
                  <span className="truncate">Size: {movie.size}</span>
                  <span>|</span>
                  <span className="truncate">
                    Source:{" "}
                    <span className="text-orange-400">{movie.source}</span>
                  </span>
                </div>
                {movie.desc ? (
                  <Link
                    href={movie.desc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white inline-block text-center py-2 rounded"
                  >
                    Download Link
                  </Link>
                ) : (
                  <span className="w-full inline-block text-center text-gray-500 py-2">
                    No download link
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No results state */}
        {!isSearching && hasSearched && searchResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg mb-2">No results found</p>
            <p className="text-gray-400">Try different search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
