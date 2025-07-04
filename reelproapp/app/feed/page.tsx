"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import Navigation from "@/app/components/navigation";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Music, User } from "lucide-react";
import VideoPlayer from "@/app/components/video/page";
import { useToast } from "@/app/hooks/use-toast";

type Reel = {
  _id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  username?: string;
  date?: string;
  audio?: string;
  likes?: number;
  comments?: number;
  shares?: number;
};

export default function FeedPage() {
  const { toast } = useToast();
  const [reels, setReels] = useState<Reel[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const [savedVideos, setSavedVideos] = useState<string[]>([]);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Fetch all reels from API
  useEffect(() => {
    fetch("/api/reels")
      .then((res) => res.json())
      .then((data) => setReels(data));
  }, []);

  // Handle video scrolling
  const handleScroll = () => {
    if (videoContainerRef.current) {
      const container = videoContainerRef.current;
      const scrollTop = container.scrollTop;
      const videoHeight = container.clientHeight;
      const index = Math.round(scrollTop / videoHeight);
      if (index !== currentVideoIndex) {
        setCurrentVideoIndex(index);
      }
    }
  };

  useEffect(() => {
    const container = videoContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [currentVideoIndex]);

  // Toggle like
  const toggleLike = (id: string) => {
    setLikedVideos((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    if (!likedVideos.includes(id)) {
      toast({
        description: "Video added to your likes",
        duration: 1500,
      });
    }
  };

  // Toggle save
  const toggleSave = (id: string) => {
    setSavedVideos((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    toast({
      description: savedVideos.includes(id)
        ? "Video removed from saved"
        : "Video saved to your collection",
      duration: 1500,
    });
  };

  // Handle share
  const handleShare = () => {
    toast({
      description: "Sharing options opened",
      duration: 1500,
    });
  };

  if (reels.length === 0) {
    return (
      <>
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg shadow-inner">
          <span className="text-white text-lg">No reels yet!</span>
        </div>
      </>
    );
  }

  return (
    <>
  <Navigation />
  <div
    ref={videoContainerRef}
    className="h-screen w-full overflow-y-scroll snap-y snap-mandatory flex flex-col items-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
    style={{ scrollSnapType: "y mandatory" }}
  >
    {reels.map((video, index) => (
      <div
        key={video._id}
        className="min-h-screen w-full flex justify-center items-center snap-center relative"
        style={{ scrollSnapAlign: "center" }}
      >
        <div className="relative w-[360px] max-w-full aspect-[9/16] flex flex-col items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-black my-8">
          <VideoPlayer
            video={{
              id: typeof video._id === "string" ? Number(video._id) || 0 : 0,
              username: video.username || "user",
              date: video.date || "",
              caption: video.caption,
              audio: video.audio || "Original Audio",
              videoUrl: video.videoUrl,
              thumbnailUrl: video.thumbnailUrl,
              likes: video.likes ?? 0,
              comments: video.comments ?? 0,
              shares: video.shares ?? 0,
            }}
            isActive={currentVideoIndex === index}
          />

          {/* Overlay with user info and caption */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="max-w-screen-sm mx-auto">
              <div className="flex items-start mb-2">
                <Link href={`/profile/${video.username || "user"}`} className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-border mr-3">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-white">@{video.username || "user"}</p>
                    <p className="text-xs text-white/70">{video.date || ""}</p>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-white/70 hover:text-white hover:bg-white/10"
                >
                  Follow
                </Button>
              </div>
              <p className="text-white mb-3">{video.caption}</p>
              <div className="flex items-center text-white/80">
                <Music className="h-4 w-4 mr-2" />
                <p className="text-sm">{video.audio || "Original Audio"}</p>
              </div>
            </div>
          </div>

          {/* Interaction buttons */}
          <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white h-12 w-12"
                onClick={() => toggleLike(video._id)}
              >
                <Heart className={`h-6 w-6 ${likedVideos.includes(video._id) ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <span className="text-xs mt-1 text-white font-medium">{video.likes ?? 0}</span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white h-12 w-12"
                onClick={() => {
                  toast({
                    description: "Comments opened",
                    duration: 1500,
                  });
                }}
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
              <span className="text-xs mt-1 text-white font-medium">{video.comments ?? 0}</span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white h-12 w-12"
                onClick={handleShare}
              >
                <Share2 className="h-6 w-6" />
              </Button>
              <span className="text-xs mt-1 text-white font-medium">{video.shares ?? 0}</span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white h-12 w-12"
                onClick={() => toggleSave(video._id)}
              >
                <Bookmark className={`h-6 w-6 ${savedVideos.includes(video._id) ? "fill-white text-white" : ""}`} />
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white h-12 w-12"
              >
                <MoreHorizontal className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</>
  );
}