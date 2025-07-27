"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Play, Heart, MessageCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Define proper types
interface Comment {
  _id: string;
  text: string;
  user: string;
  createdAt: Date;
}

interface Reel {
  _id: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  likes?: number | string[];
  comments?: number | Comment[];
  isPrivate?: boolean;
  user?: { name?: string; image?: string };
  caption?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export default function UserProfile() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reels, setReels] = useState<Reel[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Fetch user profile
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    // Fetch user's reels
    const fetchReels = async () => {
      try {
        const response = await fetch(`/api/reels?userId=${userId}`);
        const data = await response.json();
        setReels(data);
      } catch (error) {
        console.error("Failed to fetch reels:", error);
      }
    };

    fetchUser();
    fetchReels();
  }, [userId]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-10 px-2 flex justify-center items-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-10 px-2">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center bg-[#181824]/90 rounded-2xl shadow-xl border border-[#23234a] p-8 mb-10">
          <div className="relative">
            {user.image ? (
              <div className="relative w-28 h-28 rounded-full border-4 border-indigo-500 shadow-lg overflow-hidden">
                <Image
                  src={user.image}
                  alt={`${user.name} profile picture`}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center border-4 border-indigo-500 shadow-lg">
                <User className="h-14 w-14 text-white/80" />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mt-4 mb-1 drop-shadow-lg">
            {user.name}
          </h1>
          <p className="text-indigo-300 text-base mb-4">
            @{user.name}
          </p>
          <div className="flex gap-8 justify-center mt-2">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">{reels.length}</span>
              <span className="text-xs text-gray-400">Reels</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 mt-2 text-center tracking-tight drop-shadow-lg">
          {user.name}&apos;s Reels
        </h2>
        {reels.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
            <Play className="h-16 w-16 text-indigo-500 mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Reels Yet</h3>
            <p className="text-gray-400 max-w-md">
              This user hasn&apos;t shared any reels yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {reels.map((reel, index) => (
              <div
                key={reel._id}
                className="relative aspect-[9/16] bg-black/40 rounded-xl overflow-hidden cursor-pointer group transition-all shadow-lg hover:shadow-2xl border border-gray-700"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Thumbnail */}
                {reel.thumbnailUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={reel.thumbnailUrl}
                      alt={`Reel by ${user.name}`}
                      fill
                      className="object-cover transition-all duration-300 scale-100 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white/50" />
                  </div>
                )}

                {/* Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between",
                    hoveredIndex === index && "opacity-100"
                  )}
                >
                  <div className="flex items-center justify-center h-full">
                    <Play className="h-12 w-12 text-white drop-shadow-lg" />
                  </div>
                  <div className="flex items-center justify-between px-4 pb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-white mr-1" />
                        <span className="text-sm text-white">
                          {Array.isArray(reel.likes) ? reel.likes.length : reel.likes ?? 0}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-5 w-5 text-white mr-1" />
                        <span className="text-sm text-white">
                          {Array.isArray(reel.comments) ? reel.comments.length : reel.comments ?? 0}
                        </span>
                      </div>
                    </div>
                    {reel.isPrivate && (
                      <div className="bg-black/60 p-1 rounded-full">
                        <Lock className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}