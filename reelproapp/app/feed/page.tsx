"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import Navigation from "@/app/components/navigation";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Music, User, X } from "lucide-react";
import VideoPlayer from "@/app/components/video/page";
import { useToast } from "@/app/hooks/use-toast";

type Comment = {
  user?: {
    _id?: string;
    name?: string;
    image?: string;
  };
  text: string;
};

type Reel = {
  _id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  username?: string;
  date?: string;
  audio?: string;
  likes?: number;
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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const [savedVideos, setSavedVideos] = useState<string[]>([]);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [openCommentsFor, setOpenCommentsFor] = useState<string | null>(null);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch all reels from API
  useEffect(() => {
    fetch("api/reels")
      .then((res) => res.json())
      .then((data) => {
        setReels(Array.isArray(data) ? data : []);
      });
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
    videoRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => {
      videoRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [reels]);

  // Toggle like
  const toggleLike = async (id: string) => {
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
  };

  // Toggle save (persistent)
  const toggleSave = async (id: string) => {
    const res = await fetch("/api/reels/save", {
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
  };

  // Handle comment input change
  const handleCommentChange = (reelId: string, value: string) => {
    setCommentTexts((prev) => ({ ...prev, [reelId]: value }));
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
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory flex flex-col items-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {reels.map((video, index) => (
          <div
            key={video._id}
            data-index={index}
            ref={el => (videoRefs.current[index] = el)}
            className="min-h-screen w-full flex justify-center items-center snap-center relative"
            style={{ scrollSnapAlign: "center" }}
          >
            <div className="relative w-[360px] max-w-full aspect-[9/16] flex flex-col items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-black">
              <VideoPlayer
                video={{
                  id: video._id,
                  username: video.user?.name || "user",
                  date: video.date || "",
                  caption: video.caption,
                  audio: video.audio || "Original Audio",
                  videoUrl: video.videoUrl,
                  thumbnailUrl: video.thumbnailUrl,
                  likes: video.likes ?? 0,
                  comments: Array.isArray(video.comments) ? video.comments.length : 0,
                  shares: video.shares ?? 0,
                }}
                isActive={currentVideoIndex === index}
              />

              {/* Overlay with user info and caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="max-w-screen-sm mx-auto">
                  <div className="flex items-start mb-2">
                    <Link
                      href={`/profile/${video.user?._id || "user"}`}
                      className="flex items-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-border mr-3 overflow-hidden">
                        {video.user?.image ? (
                          <img src={video.user.image} alt={video.user.name || "user"} className="w-10 h-10 object-cover rounded-full" />
                        ) : (
                          <User className="h-5 w-5 text-primary-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          @{video.user?.name || "user"}
                        </p>
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
                  <div className="flex items-center text-white/80 mb-2">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(video._id)
                    }}
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
                    onClick={() => setOpenCommentsFor(video._id)}
                  >
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                  <span className="text-xs mt-1 text-white font-medium">
                    {Array.isArray(video.comments) ? video.comments.length : 0}
                  </span>
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

      {/* Comment Modal */}
      {openCommentsFor && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center">
          <div className="bg-[#18181b] w-full sm:w-[400px] max-h-[70vh] rounded-t-2xl sm:rounded-2xl p-4 flex flex-col">
            <button
              className="self-end text-white mb-2"
              onClick={() => setOpenCommentsFor(null)}
              aria-label="Close comments"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex-1 overflow-y-auto">
              {reels.find(r => r._id === openCommentsFor)?.comments?.length ? (
                reels.find(r => r._id === openCommentsFor)!.comments!.map((comment, idx) => (
                  <div key={idx} className="flex items-start gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center overflow-hidden">
                      {comment.user?.image ? (
                        <img src={comment.user.image} alt={comment.user.name || "User"} className="w-8 h-8 object-cover rounded-full" />
                      ) : (
                        <User className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-white text-sm">
                        {comment.user?.name || "User"}
                      </span>
                      <span className="text-white text-sm ml-2">{comment.text}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-white/60 text-sm">No comments yet. Be the first!</div>
              )}
            </div>
            <form
              onSubmit={e => handleCommentSubmit(e, openCommentsFor)}
              className="flex items-center gap-2 mt-2 bg-black/40 rounded-lg px-2 py-1"
            >
              <input
                type="text"
                value={commentTexts[openCommentsFor] || ""}
                onChange={e => handleCommentChange(openCommentsFor, e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-white placeholder:text-white/60 outline-none"
              />
              <button
                type="submit"
                className="text-blue-400 font-semibold hover:text-blue-600"
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