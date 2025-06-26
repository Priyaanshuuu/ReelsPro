"use client";

import { useState } from "react";
import FileUpload from "../components/file-upload/page";
import Navigation from "../components/navigation";
import { Film, Image, X, Loader } from "lucide-react";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import ImageKit from "imagekit-javascript"
import { set } from "mongoose";

interface UploadResponse {
  url: string;
  [key: string]: unknown;
}

export default function Upload() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [selectedThumbnail, setSelectedThumbnail] = useState<number | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  const handleVideoUploadSuccess = (res: unknown) => {
    if (
      res &&
      typeof res === "object" &&
      res !== null &&
      "url" in res &&
      typeof (res as UploadResponse).url === "string"
    ) {
      const typedRes = res as UploadResponse;
      setVideoUrl(typedRes.url);
      setUploading(false);
      setUploadProgress(100);
    } else {
      setUploading(false);
      setError("Upload response is invalid.");
    }
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
    setSelectedThumbnail(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", { videoUrl, caption, tags, selectedThumbnail });
    // Optional: Add your backend API call here
  };

  const handleThumbnailFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailUploading(true);

    const authres = await fetch("../api/imagekit-auth/route.ts");
    const auth = await authres.json();

    const ik = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      urlEndpoint: auth.urlEndpoint,
    });
    ik.upload({
      file,
      fileName: file.name,
      tags: ["reelspro-thumbnail"],
      signature: auth.signature,
      token: auth.token,
      expire: auth.expire,
    })
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Upload Video</h1>
          <p className="text-gray-400 mb-8">Share your video with the ReelsPro community</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Video Upload Section */}
            <div>
              {!videoUrl ? (
                <div className="h-96 border-2 border-dashed border-gray-500 rounded-xl bg-black/30 backdrop-blur-md p-6 flex flex-col items-center justify-center hover:bg-black/40 transition-transform transform hover:scale-105">
                  <Film className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Drag and drop your video</h3>
                  <p className="text-sm text-gray-400 mb-4">MP4, WebM, or OGG. Max 100MB.</p>
                  <FileUpload onSuccess={handleVideoUploadSuccess} onProgress={handleVideoProgress} />
                </div>
              ) : (
                <div className="relative h-96 bg-black shadow-md rounded-lg overflow-hidden">
                  <video src={videoUrl} className="w-full h-full object-contain" controls />
                  <Button
                    type="button"
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md"
                    onClick={handleRemoveVideo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {error && <p className="text-sm text-red-500 mt-2 text-center">{error}</p>}
            </div>

            {/* Metadata Inputs */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="caption" className="font-semibold text-white">Caption</Label>
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

              <div>
                <Label htmlFor="tags" className="font-semibold text-white">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Add tags separated by commas"
                  className="bg-black/20 border border-gray-600 rounded-md text-white placeholder-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={uploading}
                />
              </div>

              {/* Thumbnail Selection */}
              <div>
                <Label className="font-semibold text-white">Thumbnail</Label>
                <div className="bg-black/30 border border-gray-600 rounded-lg p-4 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-gray-400 mb-3">
                    <Image className="h-5 w-5" />
                    <span className="text-sm">Choose a thumbnail</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedThumbnail(i)}
                        className={`aspect-[9/16] flex items-center justify-center rounded-lg font-bold cursor-pointer transition-all shadow-lg 
                          ${selectedThumbnail === i
                            ? "bg-indigo-600 ring-2 ring-indigo-300"
                            : "bg-white/10 hover:bg-white/20 hover:ring-2 hover:ring-indigo-400"}`}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:opacity-90 px-6 py-3 flex items-center justify-center disabled:opacity-50"
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
          </form>
        </div>
      </div>
    </>
  );
}
