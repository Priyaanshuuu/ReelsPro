"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MoreHorizontal } from 'lucide-react';
import { CommentType } from '@/lib/types';

interface CommentItemProps {
  comment: CommentType;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  
  return (
    <div className="flex gap-3 py-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={`/placeholder-avatar.jpg`} />
        <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-medium mr-2">@{comment.username}</span>
            {comment.isAuthor && (
              <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">Author</span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{comment.time}</span>
        </div>
        
        <p className="mt-0.5 text-sm">{comment.text}</p>
        
        <div className="flex items-center gap-4 mt-2">
          <button 
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleLike}
          >
            <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{likeCount > 0 ? likeCount : ''}</span>
          </button>
          
          <button className="text-xs text-muted-foreground hover:text-foreground">
            Reply
          </button>
        </div>
      </div>
      
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}