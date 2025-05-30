"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Upload, Film, Image, X, Loader2 } from 'lucide-react';
import Navigation from '@/components/navigation';

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };
  
  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        handleVideoFile(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a video file.",
        });
      }
    }
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleVideoFile(file);
    }
  };
  
  // Process video file
  const handleVideoFile = (file: File) => {
    setVideoFile(file);
    
    // Create a preview URL
    const preview = URL.createObjectURL(file);
    setVideoPreview(preview);
    
    toast({
      title: "Video selected",
      description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
    });
  };
  
  // Remove selected video
  const handleRemoveVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast({
        variant: "destructive",
        title: "No video selected",
        description: "Please upload a video to continue.",
      });
      return;
    }
    
    // Simulate upload
    setIsUploading(true);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          setTimeout(() => {
            setIsUploading(false);
            toast({
              title: "Upload complete",
              description: "Your video has been published!",
            });
            router.push('/feed');
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };
  
  return (
    <>
      <Navigation />
      
      <div className="container max-w-4xl pt-8 pb-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Upload Video</h1>
          <p className="text-muted-foreground">Share your video with the ReelsPro community</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Video upload area */}
            <div>
              {!videoPreview ? (
                <div 
                  className={`relative border-2 border-dashed rounded-lg h-96 flex flex-col items-center justify-center p-6 transition-all ${
                    isDragging 
                      ? "border-primary/70 bg-primary/5" 
                      : "border-border/60 bg-muted/20 hover:bg-muted/30"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  
                  <div className="flex flex-col items-center text-center">
                    <Film className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Drag and drop your video</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      MP4, WebM, or OGG. Maximum file size 100MB.
                    </p>
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Select File
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative h-96 rounded-lg overflow-hidden bg-black">
                  <video
                    src={videoPreview}
                    className="h-full w-full object-contain"
                    controls
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full"
                    onClick={handleRemoveVideo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Video details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Write a caption for your video..."
                  className="resize-none min-h-[100px]"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={150}
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {caption.length}/150
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Add tags separated by commas (e.g., travel, nature)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={isUploading}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <div className="border border-border rounded-lg p-4 bg-card/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Image className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Choose a thumbnail for your video</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className="aspect-[9/16] rounded bg-muted flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!videoFile || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>Post</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}