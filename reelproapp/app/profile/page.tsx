"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Heart, MessageCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReelType } from '@/lib/types';

interface ReelGridProps {
  reels: ReelType[];
}

export default function ReelGrid({ reels=[] }: ReelGridProps) {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  if (reels.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center">
        <Play className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Reels Yet</h3>
        <p className="text-muted-foreground max-w-md">
          Reels you create will appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-2 mt-4">
      {reels.map((reel, index) => (
        <div
          key={index}
          className="relative aspect-[9/16] bg-muted/30 rounded-md overflow-hidden cursor-pointer group"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => router.push(`/reel/${reel.id}`)}
        >
          {/* Thumbnail */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${reel.thumbnailUrl})` }}
          />
          
          {/* Hover overlay */}
          <div className={cn(
            "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            hoveredIndex === index && "opacity-100"
          )}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="h-8 w-8 text-white" />
            </div>
            
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Heart className="h-3.5 w-3.5 text-white mr-1" />
                  <span className="text-xs text-white">{reel.likes}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-3.5 w-3.5 text-white mr-1" />
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
  );
}