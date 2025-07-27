"use client";

import { useState } from "react";
import FileUpload from "../components/file-upload/page";
import Navigation from "../components/navigation";
import { Film, X, Loader } from "lucide-react";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import ImageKit from "imagekit-javascript";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface UploadResponse {
  url: string;
  [key: string]: unknown;
}

// Define ImageKit callback types


interface ImageKitResult {
  url: string;
  fileId: string;
  name: string;
  [key: string]: unknown;
}

export default function Upload() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?._id;

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl || !thumbnailUrl) {
      setError("Please upload both video and thumbnail before submitting.");
      return;
    }

    if (!userId) {
      setError("User not logged in");
      return;
    }

    try {
      const res = await fetch("/api/reels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          videoUrl,
          thumbnailUrl,
          caption,
          tags: tags.split(",").map(tag => tag.trim()),
          userId
        })
      });

      if (res.ok) {
        alert("Video uploaded successfully!");
        // Reset form
        setVideoUrl(null);
        setThumbnailUrl(null);
        setCaption("");
        setTags("");
        setUploadProgress(0);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to post reel");
      }
    } catch (error) {
      setError("An error occurred while uploading the video.");
      console.error("Upload error:", error);
    }
  };

  const handleThumbnailFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setError("No file selected.");
      return;
    }

    setThumbnailUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/imagekit-auth");
      const auth = await authRes.json();

      if (!auth.signature || !auth.token || !auth.expire) {
        throw new Error("Invalid authentication parameters.");
      }

      const ik = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
      });

      ik.upload(
        {
          file,
          fileName: file.name,
          tags: ["reelspro-thumbnail"],
          signature: auth.signature,
          token: auth.token,
          expire: auth.expire,
        },
        (err: Error | null, result: ImageKitResult | null) => {
          setThumbnailUploading(false);
          console.log("Upload callback - err:", err);
          console.log("Upload callback - result:", result);

          if (err || !result) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
            setError(`Thumbnail upload failed: ${errorMessage}`);
          } else {
            setThumbnailUrl(result.url);
          }
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to authenticate: ${errorMessage}`);
      setThumbnailUploading(false);
      console.error("Auth error:", err);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Upload Video</h1>
          <p className="text-gray-400 mb-8">Share your video with the ReelsPro community</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Video Upload */}
            <div>
              {!videoUrl ? (
                <div className="h-96 border-2 border-dashed border-gray-500 rounded-xl bg-black/30 backdrop-blur-md p-6 flex flex-col items-center justify-center hover:bg-black/40 transition-transform transform hover:scale-105">
                  <Film className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Drag and drop your video</h3>
                  <p className="text-sm text-gray-400 mb-4">MP4, WebM, or OGV. Max 100MB.</p>
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

            {/* Right Section */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="resize-none min-h-[100px] bg-black/20 border border-gray-600 rounded-md text-white"
                  maxLength={150}
                  disabled={uploading}
                />
                <p className="text-xs text-gray-400 text-right">{caption.length}/150</p>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Add tags separated by commas"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="bg-black/20 border border-gray-600 rounded-md text-white"
                  disabled={uploading}
                />
              </div>

              <div>
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <div className="bg-black/30 border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-3">
                    <span className="text-sm">Choose a thumbnail</span>
                  </div>
                  <Input 
                    id="thumbnail"
                    type="file" 
                    accept="image/*" 
                    onChange={handleThumbnailFile} 
                    disabled={thumbnailUploading}
                  />
                  {thumbnailUploading && (
                    <p className="text-sm text-indigo-400 mt-2">Uploading thumbnail...</p>
                  )}
                  {thumbnailUrl && (
                    <div className="mt-3 relative w-32 h-20 rounded-lg border border-gray-500 overflow-hidden">
                      <Image
                        src={thumbnailUrl}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  )}
                </div>
              </div>

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

              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:opacity-90 px-6 py-3 disabled:opacity-50"
                disabled={!videoUrl || !thumbnailUrl || uploading || thumbnailUploading}
              >
                {uploading || thumbnailUploading ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    {thumbnailUploading ? "Uploading Thumbnail..." : "Uploading..."}
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}