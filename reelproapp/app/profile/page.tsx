"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Heart, MessageCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
//import { ReelType } from "@/lib/types";

interface Reel {
  id: string;
  thumbnailUrl: string;
  likes: number;
  comments: number;
  isPrivate: boolean;
}

interface ReelGridProps {
  reels?: Reel[];
}

export default function ReelGrid({ reels = [] }: ReelGridProps) {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg shadow-inner">
        <Play className="h-16 w-16 text-gray-500 mb-4" />
        <h3 className="text-2xl font-semibold text-white mb-2">No Reels Yet</h3>
        <p className="text-gray-400 max-w-md">
          Reels you create will appear here. Start uploading and sharing!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4 pb-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {reels.map((reel, index) => (
          <div
            key={index}
            className="relative aspect-[9/16] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg overflow-hidden cursor-pointer group transition-all shadow-md hover:shadow-xl"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => router.push(`/reel/${reel.id}`)}
          >
            {/* Thumbnail */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300 scale-100 group-hover:scale-105"
              style={{ backgroundImage: `url(${reel.thumbnailUrl})` }}
            />

            {/* Hover overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                hoveredIndex === index && "opacity-100"
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="h-10 w-10 text-white" />
              </div>

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 text-white mr-1" />
                    <span className="text-xs text-white">{reel.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 text-white mr-1" />
                    <span className="text-xs text-white">{reel.comments}</span>
                  </div>
                </div>

                {reel.isPrivate && (
                  <div className="bg-black/50 p-1 rounded-full">
                    <Lock className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

