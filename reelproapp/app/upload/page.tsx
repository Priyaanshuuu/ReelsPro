// pages/Upload.tsx

import { useState } from "react";
import { IKUploadResponse } from "imagekitio-next";
import FileUpload from "../components/FileUpload";
import Navigation from "../components/navigation";
import { Film, Image, X, Loader } from "lucide-react";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

export default function Upload() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");

  const handleVideoUploadSuccess = (res: IKUploadResponse) => {
    setVideoUrl(res.url);
    setUploading(false);
    setUploadProgress(100);
  };

  const handleVideoProgress = (progress: number) => {
    setUploading(true);
    setUploadProgress(progress);
  };

  const handleRemoveVideo = () => {
    setVideoUrl(null);
    setUploadProgress(0);
    setUploading(false);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send videoUrl, caption, tags to your API
    console.log("Submitted:", { videoUrl, caption, tags });
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
              {/* Left Column */}
              <div>
                {!videoUrl ? (
                  <div className="relative h-96 border-2 border-dashed rounded-xl bg-black/30 backdrop-blur-md p-6 flex flex-col items-center justify-center transition-all border-gray-500 hover:bg-black/40 transform hover:scale-105 duration-300">
                    <div className="flex flex-col items-center text-center">
                      <Film className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Drag and drop your video</h3>
                      <p className="text-sm text-gray-400 mb-6">MP4, WebM, or OGG. Max 100MB.</p>

                      <FileUpload
                        onSuccess={handleVideoUploadSuccess}
                        onProgress={handleVideoProgress}
                        fileType="video"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative h-96 rounded-lg overflow-hidden bg-black shadow-lg">
                    <video src={videoUrl} className="h-full w-full object-contain" controls />
                    <Button
                      type="button"
                      className="absolute top-2 right-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition"
                      onClick={handleRemoveVideo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {error && <p className="mt-2 text-red-500 text-sm text-center">{error}</p>}
              </div>

              {/* Right Column */}
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
                    disabled={uploading}
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
                    disabled={uploading}
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

                {uploading && (
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
                    disabled={!videoUrl || uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader className="mr-2 h-5 w-5 animate-spin" />
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