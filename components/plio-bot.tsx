"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface PlioBotProps {
  onClose: () => void;
}

export default function PlioBot({ onClose }: PlioBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNiceMode, setIsNiceMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          isNiceMode,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-800 to-slate-700 p-6 border-b border-slate-600/50">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4 ml-24 lg:m-0">
              {/* Mode Toggle Buttons */}
              <div className="flex space-x-2 sm:items-center pt-24 lg:p-0">
                <Button
                  size="sm"
                  variant={isNiceMode ? "default" : "outline"}
                  onClick={() => setIsNiceMode(true)}
                  className={`text-xs font-medium transition-all duration-300 ${
                    isNiceMode
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                      : "border-slate-500 text-slate-300 hover:text-white hover:border-slate-400 bg-slate-800/50"
                  }`}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Nice
                </Button>
                <Button
                  size="sm"
                  variant={!isNiceMode ? "default" : "outline"}
                  onClick={() => setIsNiceMode(false)}
                  className={`text-xs font-medium transition-all duration-300 ${
                    !isNiceMode
                      ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg shadow-red-500/25"
                      : "border-slate-500 text-slate-300 hover:text-white hover:border-slate-400 bg-slate-800/50"
                  }`}
                >
                  <Bot className="w-3 h-3 mr-1" />
                  Crude
                </Button>
              </div>
            </div>

            {/* Title */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Bot className="w-6 h-6 mr-2 text-cyan-400" />
                LunesharkBot Chat
                <span className="text-yellow-400 ml-2">✨</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Currently in {isNiceMode ? "nice" : "crude"} mode
              </p>
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-gray-600 hover:bg-slate-700/50 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${
                    isNiceMode
                      ? "from-cyan-500 to-blue-600"
                      : "from-red-500 to-orange-500"
                  } rounded-full flex items-center justify-center mx-auto shadow-lg ${
                    isNiceMode ? "shadow-cyan-500/25" : "shadow-red-500/25"
                  }`}
                >
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-lg font-medium">
                    Welcome to LunesharkBot! 👋
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    Ask me about Luneshark, Solana, or the tools available!
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Currently in {isNiceMode ? "nice" : "crude"} mode
                  </p>
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-end space-x-3 animate-in slide-in-from-bottom duration-300 ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {!message.isUser && (
                <div
                  className={`w-8 h-8 bg-gradient-to-br ${
                    isNiceMode
                      ? "from-cyan-500 to-blue-600"
                      : "from-red-500 to-orange-500"
                  } rounded-full flex items-center justify-center shadow-lg ${
                    isNiceMode ? "shadow-cyan-500/25" : "shadow-red-500/25"
                  } mb-1`}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`flex flex-col ${
                  message.isUser ? "items-end" : "items-start"
                } max-w-xs lg:max-w-md`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                    message.isUser
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/25"
                      : isNiceMode
                      ? "bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-slate-700/25 border border-slate-600/50"
                      : "bg-gradient-to-r from-red-900/50 to-orange-900/50 text-white shadow-red-900/25 border border-red-800/50"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                <span className="text-xs text-slate-500 mt-1 px-2">
                  {formatTime(message.timestamp)}
                </span>
              </div>

              {message.isUser && (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25 mb-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end space-x-3 animate-in slide-in-from-bottom duration-300">
              <div
                className={`w-8 h-8 bg-gradient-to-br ${
                  isNiceMode
                    ? "from-cyan-500 to-blue-600"
                    : "from-red-500 to-orange-500"
                } rounded-full flex items-center justify-center shadow-lg ${
                  isNiceMode ? "shadow-cyan-500/25" : "shadow-red-500/25"
                } mb-1`}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col items-start max-w-xs lg:max-w-md">
                <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-slate-700/25 border border-slate-600/50 px-4 py-3 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div
                        className={`w-2 h-2 ${
                          isNiceMode ? "bg-cyan-400" : "bg-red-500"
                        } rounded-full animate-bounce`}
                      ></div>
                      <div
                        className={`w-2 h-2 ${
                          isNiceMode ? "bg-cyan-400" : "bg-red-500"
                        } rounded-full animate-bounce`}
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className={`w-2 h-2 ${
                          isNiceMode ? "bg-cyan-400" : "bg-red-500"
                        } rounded-full animate-bounce`}
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-slate-300 text-xs">
                      LunesharkBot is thinking...
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 mt-1 px-2">now</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-700 border-t border-slate-600/50">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleKeyPress(e);
                  }
                }}
                placeholder="Ask LunesharkBot anything..."
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl pr-12 py-3 transition-all duration-200"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25 rounded-xl px-6 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              size="lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-500">
              Press Enter to send • Shift+Enter for new line
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>AI Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
