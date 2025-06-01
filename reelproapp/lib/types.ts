export interface VideoType {
  id: number;
  username: string;
  date: string;
  caption: string;
  audio: string;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface CommentType {
  id: number;
  username: string;
  text: string;
  likes: number;
  time: string;
  isAuthor: boolean;
}

export interface UserProfileType {
  username: string;
  name: string;
  bio: string;
  avatar: string;
  website?: string;
  reelsCount: number;
  followers: number;
  following: number;
  likes: number;
  reels: ReelType[];
  savedReels: ReelType[];
}

export interface ReelType {
  id: number;
  thumbnailUrl: string;
  likes: number;
  comments: number;
  isPrivate?: boolean;
}