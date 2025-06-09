"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Heart, MessageCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReelType } from "@/lib/types";

interface ReelGridProps {
  reels: ReelType[];
}



export default function ReelGrid({ reels = [] }: ReelGridProps) {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg shadow-lg">
        <Play className="h-16 w-16 text-gray-500 mb-4" />
        <h3 className="text-2xl font-semibold text-white mb-2">No Reels Yet</h3>
        <p className="text-gray-400 max-w-md">
          Reels you create will appear here. Start uploading and sharing!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {reels.map((reel, index) => (
          <div
            key={index}
            className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer group shadow-lg bg-black/20 backdrop-blur-sm transition-transform hover:scale-[1.03]"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => router.push(`/reel/${reel.id}`)}
          >
            {/* Thumbnail */}
            <div
              className="absolute inset-0 bg-cover bg-center filter brightness-90"
              style={{ backgroundImage: `url(${reel.thumbnailUrl})` }}
            />

            {/* Hover overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between",
                hoveredIndex === index && "opacity-100"
              )}
            >
              <div className="flex items-center justify-center mt-6">
                <Play className="h-10 w-10 text-white drop-shadow-lg" />
              </div>

              <div className="flex items-center justify-between px-3 pb-3 text-white text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                    <Heart className="h-4 w-4" />
                    <span>{reel.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                    <MessageCircle className="h-4 w-4" />
                    <span>{reel.comments}</span>
                  </div>
                </div>

                {reel.isPrivate && (
                  <div className="bg-black/60 p-1 rounded-full backdrop-blur-sm">
                    <Lock className="h-4 w-4 text-white" />
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

