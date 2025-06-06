"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, X } from "lucide-react";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export default function ImageGenerator({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const generateImageWithOpenAI = async (
    promptText: string
  ): Promise<GeneratedImage> => {
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      const imageUrl = data.url || (data.data && data.data[0]?.url);

      if (!imageUrl) {
        throw new Error("No image URL returned from API");
      }

      return {
        id: `img-${Date.now()}`,
        url: imageUrl,
        prompt: promptText,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    try {
      setIsGenerating(true);
      const newImage = await generateImageWithOpenAI(prompt);
      setGeneratedImages((prev) => [newImage, ...prev].slice(0, 12));
      setPrompt("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpen = (imageUrl: string) => {
    window.open(imageUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">AI Image Generator</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={promptInputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all resize-none"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {prompt.length}/1000
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium px-6 h-auto rounded-xl whitespace-nowrap"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          {generatedImages.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Generated Images
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group rounded-xl overflow-hidden bg-gray-800 hover:shadow-lg hover:shadow-purple-500/20 transition-shadow"
                  >
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <p className="text-white text-sm line-clamp-3 mb-3">
                        {image.prompt}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
                          onClick={() => handleOpen(image.url)}
                        >
                          <ImageIcon className="w-4 h-4 mr-1.5" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <ImageIcon className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">
                No images generated yet
              </h3>
              <p className="text-gray-400 max-w-md">
                Enter a prompt and click "Generate" to create your first
                AI-generated image.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
