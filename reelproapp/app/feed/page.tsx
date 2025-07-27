"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import Navigation from "@/app/components/navigation";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Music, User, X } from "lucide-react";
import VideoPlayer from "@/app/components/video";
import { useToast } from "@/app/hooks/use-toast";
import Image from "next/image";

type Comment = {
  user?: {
    _id?: string;
    name?: string;
    image?: string;
  };
  text: string;
  date?: Date;
};

type Reel = {
  _id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  username?: string;
  date?: string;
  audio?: string;
  likes?: string[] | number; // ✅ Array ya number dono
  comments?: Comment[];
  shares?: number;
  user?: {
    _id?: string;
    name?: string;
    image?: string;
  };
};

export default function FeedPage() {
  const { toast } = useToast();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const [savedVideos, setSavedVideos] = useState<string[]>([]);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [openCommentsFor, setOpenCommentsFor] = useState<string | null>(null);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ✅ Helper function for likes count
  const getLikesCount = (likes?: string[] | number): number => {
    if (Array.isArray(likes)) return likes.length;
    if (typeof likes === 'number') return likes;
    return 0;
  };

  // ✅ FIXED: Fetch all reels from API
  useEffect(() => {
    const fetchReels = async () => {
      try {
        console.log("🚀 Fetching reels...");
        
        const response = await fetch("/api/reels", {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📦 API Response:", data);

        if (data.success && Array.isArray(data.reels)) {
          console.log("📊 Setting reels:", data.reels.length);
          setReels(data.reels);
        } else {
          setReels([]);
        }

      } catch (error) {
        console.error("❌ Fetch error:", error);
        setReels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  // Intersection Observer for active video
  useEffect(() => {
    if (!reels.length) return;
    
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setCurrentVideoIndex(idx);
          }
        });
      },
      { threshold: 0.6 }
    );

    const currentRefs = videoRefs.current;
    
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [reels]);

  // Toggle like
  const toggleLike = async (id: string) => {
    try {
      const res = await fetch("/api/reels/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reelId: id }),
      });
      const data = await res.json();
      setReels((prev) =>
        prev.map((reel) =>
          reel._id === id ? { ...reel, likes: data.likes } : reel
        )
      );
      setLikedVideos((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  // Toggle save
  const toggleSave = async (id: string) => {
    try {
      const res = await fetch("/api/saved-reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelId: id }),
      });
      const data = await res.json();
      setSavedVideos((prev) =>
        data.saved
          ? [...prev, id]
          : prev.filter((i) => i !== id)
      );
      toast({
        description: data.saved
          ? "Video saved to your collection"
          : "Video removed from saved",
        duration: 1500,
      });
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  // Handle share
  const handleShare = () => {
    toast({
      description: "Sharing options opened",
      duration: 1500,
    });
  };

  // Handle comment submit
  const handleCommentSubmit = async (e: React.FormEvent, reelId: string) => {
    e.preventDefault();
    const text = commentTexts[reelId]?.trim();
    if (!text) return;
    
    try {
      const res = await fetch("/api/reels/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelId, text }),
      });
      const data = await res.json();
      if (data.comments) {
        setReels((prev) =>
          prev.map((reel) =>
            reel._id === reelId ? { ...reel, comments: data.comments } : reel
          )
        );
        setCommentTexts((prev) => ({ ...prev, [reelId]: "" }));
      } else if (data.error) {
        toast({ description: data.error, duration: 2000 });
      }
    } catch (error) {
      console.error("Comment error:", error);
    }
  };

  // Handle comment input change
  const handleCommentChange = (reelId: string, value: string) => {
    setCommentTexts((prev) => ({ ...prev, [reelId]: value }));
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <span className="text-white text-lg">Loading reels...</span>
        </div>
      </>
    );
  }

  // Empty state
  if (reels.length === 0) {
    return (
      <>
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg shadow-inner">
          <span className="text-white text-lg mb-4">No reels yet!</span>
          <Link 
            href="/upload" 
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg text-white transition-colors"
          >
            Upload First Reel
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory flex flex-col items-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        {reels.map((video, index) => (
          <div
            key={video._id}
            data-index={index}
            ref={el => { videoRefs.current[index] = el; }}
            className="min-h-screen w-full flex justify-center items-center snap-center relative"
          >
            {/* ✅ Fixed container with proper positioning */}
            <div className="relative w-[360px] max-w-full h-[640px] rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-black">
              
              {/* Video Player - Full height */}
              <div className="absolute inset-0">
                <VideoPlayer
                  video={{
                    id: Number(video._id),
                    username: video.user?.name || "user",
                    date: video.date || "",
                    caption: video.caption,
                    audio: video.audio || "Original Audio",
                    videoUrl: video.videoUrl,
                    thumbnailUrl: video.thumbnailUrl,
                    likes: getLikesCount(video.likes),
                    comments: Array.isArray(video.comments) ? video.comments.length : 0,
                    shares: video.shares ?? 0,
                  }}
                  isActive={currentVideoIndex === index}
                />
              </div>

              {/* ✅ Fixed Interaction buttons - Right side */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-4 z-10">
                {/* Like button */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-white/20 h-12 w-12 border border-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(video._id);
                    }}
                  >
                    <Heart className={`h-7 w-7 ${likedVideos.includes(video._id) ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <span className="text-xs mt-1 text-white font-bold text-shadow">
                    {getLikesCount(video.likes)}
                  </span>
                </div>

                {/* Comment button */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-white/20 h-12 w-12 border border-white/20"
                    onClick={() => setOpenCommentsFor(video._id)}
                  >
                    <MessageCircle className="h-7 w-7" />
                  </Button>
                  <span className="text-xs mt-1 text-white font-bold text-shadow">
                    {Array.isArray(video.comments) ? video.comments.length : 0}
                  </span>
                </div>

                {/* Share button */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-white/20 h-12 w-12 border border-white/20"
                    onClick={handleShare}
                  >
                    <Share2 className="h-7 w-7" />
                  </Button>
                  <span className="text-xs mt-1 text-white font-bold text-shadow">
                    {video.shares ?? 0}
                  </span>
                </div>

                {/* Save button */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-white/20 h-12 w-12 border border-white/20"
                    onClick={() => toggleSave(video._id)}
                  >
                    <Bookmark className={`h-7 w-7 ${savedVideos.includes(video._id) ? "fill-white text-white" : ""}`} />
                  </Button>
                </div>

                {/* More options button */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-white/20 h-12 w-12 border border-white/20"
                  >
                    <MoreHorizontal className="h-7 w-7" />
                  </Button>
                </div>
              </div>

              {/* ✅ Bottom overlay with user info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <div className="flex items-start mb-3">
                  <Link
                    href={`/profile/${video.user?._id || "user"}`}
                    className="flex items-center flex-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 mr-3 overflow-hidden">
                      {video.user?.image ? (
                        <div className="relative w-10 h-10">
                          <Image 
                            src={video.user.image} 
                            alt={video.user.name || "user"} 
                            fill
                            className="object-cover rounded-full"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        @{video.user?.name || "user"}
                      </p>
                      <p className="text-xs text-white/70">{video.date || ""}</p>
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-black text-xs px-3 py-1"
                  >
                    Follow
                  </Button>
                </div>
                
                <p className="text-white text-sm mb-2 line-clamp-2">
                  {video.caption}
                </p>
                
                <div className="flex items-center text-white/80">
                  <Music className="h-3 w-3 mr-1" />
                  <p className="text-xs">{video.audio || "Original Audio"}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Fixed Comment Modal */}
      {openCommentsFor && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center">
          <div className="bg-[#18181b] w-full sm:w-[400px] max-h-[70vh] rounded-t-2xl sm:rounded-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Comments</h3>
              <button
                className="text-white/70 hover:text-white"
                onClick={() => setOpenCommentsFor(null)}
                aria-label="Close comments"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4">
              {reels.find(r => r._id === openCommentsFor)?.comments?.length ? (
                reels.find(r => r._id === openCommentsFor)!.comments!.map((comment, idx) => (
                  <div key={idx} className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {comment.user?.image ? (
                        <div className="relative w-8 h-8">
                          <Image 
                            src={comment.user.image} 
                            alt={comment.user.name || "User"} 
                            fill
                            className="object-cover rounded-full"
                            sizes="32px"
                          />
                        </div>
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">
                          {comment.user?.name || "Anonymous"}
                        </span>
                        <span className="text-white/50 text-xs">
                          {comment.date ? new Date(comment.date).toLocaleTimeString() : "now"}
                        </span>
                      </div>
                      <p className="text-white/90 text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-white/30 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">No comments yet</p>
                  <p className="text-white/40 text-xs">Be the first to comment!</p>
                </div>
              )}
            </div>
            
            <form
              onSubmit={e => handleCommentSubmit(e, openCommentsFor)}
              className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-2 border border-white/10"
            >
              <input
                type="text"
                value={commentTexts[openCommentsFor] || ""}
                onChange={e => handleCommentChange(openCommentsFor, e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none text-sm"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!commentTexts[openCommentsFor]?.trim()}
                className="text-blue-400 font-semibold hover:text-blue-300 disabled:text-white/30 transition-colors text-sm px-2"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}