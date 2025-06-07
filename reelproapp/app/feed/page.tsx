"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import Navigation from '@/app/components/navigation';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Music, User } from 'lucide-react';
import VideoPlayer from '@/app/components/video/page';
import { useToast } from '@/app/hooks/use-toast';
import { mockVideos } from '@/lib/mock-data';

export default function FeedPage() {
  const { toast } = useToast();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<number[]>([]);
  const [savedVideos, setSavedVideos] = useState<number[]>([]);
  const videoContainerRef = useRef<HTMLDivElement>(null);

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

  // Attach scroll event listener
  useEffect(() => {
    const container = videoContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Toggle like
  const toggleLike = (index: number) => {
    setLikedVideos(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
    
    if (!likedVideos.includes(index)) {
      toast({
        description: "Video added to your likes",
        duration: 1500,
      });
    }
  };

  // Toggle save
  const toggleSave = (index: number) => {
    setSavedVideos(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
    
    toast({
      description: savedVideos.includes(index) 
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

  return (
    <>
      <Navigation />
      
      {/* Video feed container */}
      <div 
        ref={videoContainerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
      >
        {mockVideos.map((video, index) => (
          <div 
            key={index}
            className="h-screen w-full snap-start snap-always relative"
          >
            <VideoPlayer
              video={video}
              isActive={currentVideoIndex === index}
            />
            
            {/* Video overlay with user info and caption */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="max-w-screen-sm mx-auto">
                <div className="flex items-start mb-2">
                  <Link href={`/profile/${video.username}`} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-border mr-3">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-white">@{video.username}</p>
                      <p className="text-xs text-white/70">{video.date}</p>
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
                  <p className="text-sm">{video.audio}</p>
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
                  onClick={() => toggleLike(index)}
                >
                  <Heart className={`h-6 w-6 ${likedVideos.includes(index) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <span className="text-xs mt-1 text-white font-medium">{video.likes + (likedVideos.includes(index) ? 1 : 0)}</span>
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
                <span className="text-xs mt-1 text-white font-medium">{video.comments}</span>
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
                <span className="text-xs mt-1 text-white font-medium">{video.shares}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white h-12 w-12"
                  onClick={() => toggleSave(index)}
                >
                  <Bookmark className={`h-6 w-6 ${savedVideos.includes(index) ? 'fill-white text-white' : ''}`} />
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
        ))}
      </div>
    </>
  );
}