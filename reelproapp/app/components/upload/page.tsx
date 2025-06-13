"use client";
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
const UploadExample = () => {
    // State to keep track of the current upload progress (percentage)
    const [progress, setProgress] = useState(0);

    // Create a ref for the file input element to access its files easily
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create an AbortController instance to provide an option to cancel the upload if needed.
    const abortController = new AbortController();

    /**
     * Authenticates and retrieves the necessary upload credentials from the server.
     *
     * This function calls the authentication API endpoint to receive upload parameters like signature,
     * expire time, token, and publicKey.
     *
     * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
     * @throws {Error} Throws an error if the authentication request fails.
     */
    const authenticator = async () => {
        try {
            // Perform the request to the upload authentication endpoint.
            const response = await fetch("/api/upload-auth");
            if (!response.ok) {
                // If the server response is not successful, extract the error text for debugging.
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            // Parse and destructure the response JSON for upload credentials.
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            // Log the original error for debugging before rethrowing a new error.
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    /**
     * Handles the file upload process.
     *
     * This function:
     * - Validates file selection.
     * - Retrieves upload authentication credentials.
     * - Initiates the file upload via the ImageKit SDK.
     * - Updates the upload progress.
     * - Catches and processes errors accordingly.
     */
    const handleUpload = async () => {
        // Access the file input element using the ref
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select a file to upload");
            return;
        }

        // Extract the first file from the file input
        const file = fileInput.files[0];

        // Retrieve authentication parameters for the upload.
        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        // Call the ImageKit SDK upload function with the required parameters and callbacks.
        try {
            const uploadResponse = await upload({
                // Authentication parameters
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name, // Optionally set a custom file name
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                // Abort signal to allow cancellation of the upload if needed.
                abortSignal: abortController.signal,
            });
            console.log("Upload response:", uploadResponse);
        } catch (error) {
            // Handle specific error types provided by the ImageKit SDK.
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                // Handle any other errors that may occur.
                console.error("Upload error:", error);
            }
        }
    };



  /*return (
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
            {/* Upload Area }
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

            {/* Details }
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
);*/
  }

