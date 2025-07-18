"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { VideoType } from "@/lib/types";

interface VideoPlayerProps {
  video: VideoType;
  isActive: boolean;
}

export default function VideoPlayer({ video, isActive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // Handle play/pause on active change
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isActive) {
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Autoplay prevented:", err);
            setIsPlaying(false);
          });
      }
    } else {
      vid.pause();
      setIsPlaying(false);
      vid.currentTime = 0;
      setProgress(0);
    }
  }, [isActive]);

  // Update progress bar
  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (vid && vid.duration > 0) {
      setProgress((vid.currentTime / vid.duration) * 100);
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Video element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        poster={video.thumbnailUrl}
      />

      {/* Click overlay */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={togglePlayPause}
      />

      {/* Play icon */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="h-16 w-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="h-8 w-8 text-white" />
          </div>
        </div>
      )}

      {/* Mute toggle */}
      <button
        className="absolute top-4 right-4 z-20 p-2 bg-black/30 rounded-full backdrop-blur-sm"
        onClick={toggleMute}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5 text-white" />
        ) : (
          <Volume2 className="h-5 w-5 text-white" />
        )}
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div
          className="h-full bg-white transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
