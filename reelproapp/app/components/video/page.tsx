"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
//import { cn } from '@/lib/utils';
import { VideoType } from '@/lib/types';

interface VideoPlayerProps {
  video: VideoType;
  isActive: boolean;
}

export default function VideoPlayer({ video, isActive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  
  // Handle play/pause when active changes
  useEffect(() => {
    if (isActive && videoRef.current) {
      // Delay play for smoother experience
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay was prevented
            setIsPlaying(false);
          });
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);
  
  // Reset video when not active
  useEffect(() => {
    if (!isActive && videoRef.current) {
      videoRef.current.currentTime = 0;
      setProgress(0);
    }
  }, [isActive]);
  
  // Update progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      const progressPercent = (current / total) * 100;
      setProgress(progressPercent);
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
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
      
      {/* Tap overlay for play/pause */}
      <div 
        className="absolute inset-0 z-10"
        onClick={togglePlayPause}
      />
      
      {/* Play/Pause button that shows briefly when state changes */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="h-16 w-16 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="h-8 w-8 text-white" />
          </div>
        </div>
      )}
      
      {/* Volume control - always visible */}
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
          className="h-full bg-white"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}