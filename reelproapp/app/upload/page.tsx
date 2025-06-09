"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { useToast } from '@/app/hooks/use-toast';
import { Upload, Film, Image, X, Loader2 } from 'lucide-react';
import Navigation from '@/app/components/navigation';

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
    if (!isDragging) setIsDragging(true);
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleVideoFile(e.target.files[0]);
    }
  };

  const handleVideoFile = (file: File) => {
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));

    toast({
      title: "Video selected",
      description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
    });
  };

  const handleRemoveVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white px-4 py-10">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold">Upload Video</h1>
          <p className="text-gray-400 mt-1">Share your video with the ReelsPro community</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Upload Area */}
            <div>
              {!videoPreview ? (
                <div
                  className={`relative h-96 border-2 border-dashed rounded-xl bg-black/30 backdrop-blur-md p-6 flex flex-col items-center justify-center transition-all
                    ${isDragging 
                      ? "border-indigo-400 bg-indigo-900/20" 
                      : "border-gray-500 hover:bg-black/40"
                    } transform transition-transform hover:scale-105 duration-300`}
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
                    <Film className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Drag and drop your video</h3>
                    <p className="text-sm text-gray-400 mb-6">MP4, WebM, or OGG. Max 100MB.</p>
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:opacity-90 transition-all px-6 py-2 flex items-center"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Select File
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative h-96 rounded-lg overflow-hidden bg-black shadow-lg">
                  <video src={videoPreview} className="h-full w-full object-contain" controls />
                  <Button
                    type="button"
                    className="absolute top-2 right-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition"
                    onClick={handleRemoveVideo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="caption" className="text-white font-semibold">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Write a caption..."
                  className="resize-none min-h-[100px] bg-black/20 border border-gray-600 rounded-md text-white placeholder-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={150}
                  disabled={isUploading}
                />
                <p className="text-xs text-gray-400 text-right">{caption.length}/150</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-white font-semibold">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Add tags separated by commas"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={isUploading}
                  className="bg-black/20 border border-gray-600 rounded-md text-white placeholder-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-semibold">Thumbnail</Label>
                <div className="border border-gray-600 rounded-lg p-4 bg-black/30 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-4 text-gray-400">
                    <Image className="h-5 w-5" />
                    <span className="text-sm">Choose a thumbnail</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="aspect-[9/16] rounded-lg bg-white/10 hover:bg-white/20 hover:ring-2 hover:ring-indigo-400 backdrop-blur-md flex items-center justify-center text-lg font-semibold transition-all text-white cursor-pointer shadow-lg"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:opacity-90 transition-all px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                  disabled={!videoFile || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
    </div>
  </>
);

}
