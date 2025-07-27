"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Heart, MessageCircle, Lock, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Reel {
  _id: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  likes?: number | string[];
  comments?: number | any[];
  isPrivate?: boolean;
  user?: { name?: string; image?: string };
  caption?: string;
}

export default function ReelGrid() {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [reels, setReels] = useState<Reel[]>([]);
  const { data: session } = useSession();

  // Best-effort user name extraction
  const userName =
    session?.user?.name ||
    session?.user?.username ||
    (session?.user?.email ? session.user.email.split("@")[0] : "User");
  const userImage = session?.user?.image;

  const userId = session?.user?._id || session?.user?.id;

  // Fetch user's own reels
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/reels?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setReels(data));
  }, [userId]);

  // Profile stats
  const totalLikes = reels.reduce(
    (sum, reel) => sum + (Array.isArray(reel.likes) ? reel.likes.length : Number(reel.likes) || 0),
    0
  );
  const totalComments = reels.reduce(
    (sum, reel) => sum + (Array.isArray(reel.comments) ? reel.comments.length : Number(reel.comments) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-10 px-2">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center bg-[#181824]/90 rounded-2xl shadow-xl border border-[#23234a] p-8 mb-10">
          <div className="relative">
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-lg object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center border-4 border-indigo-500 shadow-lg">
                <User className="h-14 w-14 text-white/80" />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mt-4 mb-1 drop-shadow-lg">
            {userName}
          </h1>
          <p className="text-indigo-300 text-base mb-4">
            @{userName}
          </p>
          <div className="flex gap-8 justify-center mt-2">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">{reels.length}</span>
              <span className="text-xs text-gray-400">Reels</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">{totalLikes}</span>
              <span className="text-xs text-gray-400">Likes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">{totalComments}</span>
              <span className="text-xs text-gray-400">Comments</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 mt-2 text-center tracking-tight drop-shadow-lg">
          {userName}&apos;s Reels
        </h2>
        {reels.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg shadow-inner">
            <Play className="h-16 w-16 text-indigo-500 mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Reels Yet</h3>
            <p className="text-gray-400 max-w-md">
              Reels you create will appear here. Start uploading and sharing!
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
                onClick={() => router.push(`/reel/${reel._id}`)}
              >
                {/* Thumbnail */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300 scale-100 group-hover:scale-105"
                  style={{ backgroundImage: `url(${reel.thumbnailUrl || ""})` }}
                />

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