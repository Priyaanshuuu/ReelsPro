"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2, User } from "lucide-react";
import Image from "next/image";

// Define proper types
interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
}

interface Reel {
  _id: string;
  videoUrl: string;
  thumbnailUrl?: string;
  caption: string;
  likes: number;
  comments: Comment[];
  user: {
    _id: string;
    name: string;
    image?: string;
  };
}

export default function ReelPage() {
  const params = useParams();
  const reelId = params.id as string;
  const [reel, setReel] = useState<Reel | null>(null);

  useEffect(() => {
    if (!reelId) return;

    const fetchReel = async () => {
      try {
        const response = await fetch(`/api/reels/${reelId}`);
        const data = await response.json();
        setReel(data);
      } catch (error) {
        console.error("Failed to fetch reel:", error);
      }
    };

    fetchReel();
  }, [reelId]);

  if (!reel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-10 px-2 flex justify-center items-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-10 px-2">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Section */}
          <div className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden">
            <video
              src={reel.videoUrl}
              controls
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="bg-[#181824]/90 rounded-2xl p-6 border border-[#23234a]">
            {/* User Info */}
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                {reel.user.image ? (
                  <div className="relative w-12 h-12">
                    <Image
                      src={reel.user.image}
                      alt={`${reel.user.name} profile picture`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold">{reel.user.name}</h3>
                <p className="text-gray-400 text-sm">@{reel.user.name}</p>
              </div>
            </div>

            {/* Caption */}
            <p className="text-white mb-6">{reel.caption}</p>

            {/* Stats */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-white">{reel.likes}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-white">{reel.comments.length}</span>
              </div>
              <div className="flex items-center">
                <Share2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-white">Share</span>
              </div>
            </div>

            {/* Comments */}
            <div>
              <h4 className="text-white font-semibold mb-4">Comments</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reel.comments.map((comment) => (
                  <div key={comment._id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      {comment.user.image ? (
                        <div className="relative w-8 h-8">
                          <Image
                            src={comment.user.image}
                            alt={`${comment.user.name} profile picture`}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{comment.user.name}</p>
                      <p className="text-gray-300 text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}