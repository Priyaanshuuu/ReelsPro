"use client";

import { IKUpload, IKContext } from "imagekitio-react";
import { useCallback } from "react";

// ✅ Define proper types for ImageKit
interface UploadResponse {
  url: string;
  fileId: string;
  name: string;
  size: number;
  filePath: string;
  tags?: string[];
  isPrivateFile: boolean;
  customCoordinates: string | null;
  fileType: string;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
}

interface UploadProgress {
  loaded: number;
  total: number;
  lengthComputable: boolean;
}

interface AuthResponse {
  signature: string;
  expire: number;
  token: string;
}

interface FileUploadProps {
  onSuccess: (res: UploadResponse) => void;
  onProgress: (progress: number) => void;
  accept?: string;
  fileName?: string;
  folder?: string;
}

export default function FileUpload({ 
  onSuccess, 
  onProgress,
  accept = "video/*",
  fileName = "video-upload.mp4",
  folder = "/videos"
}: FileUploadProps) {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

  // ✅ Authenticator function with proper typing
  const authenticator = useCallback(async (): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/imagekit-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${response.status} - ${errorText}`);
      }
      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error("ImageKit authentication error:", error);
      throw error;
    }
  }, []);

  // ✅ Progress handler with proper typing
  const handleUploadProgress = (progress: UploadProgress) => {
    if (progress.lengthComputable) {
      const percent = Math.round((progress.loaded / progress.total) * 100);
      onProgress(percent);
    }
  };

  // ✅ Success handler with proper typing
  const handleSuccess = (res: UploadResponse) => {
    console.log("Upload successful:", res);
    onSuccess(res);
  };

  return (
    <IKContext
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        accept={accept}
        fileName={fileName}
        useUniqueFileName={true}
        folder={folder}
        onSuccess={handleSuccess}
        onError={(err: unknown) => {
          console.error("Upload Error:", err);
        }}
        onUploadProgress={handleUploadProgress}
        onUploadStart={() => {
          console.log("Upload started");
          onProgress(0);
        }}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer text-center bg-gray-50 hover:bg-gray-100"
        style={{
          minHeight: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      />
    </IKContext>
  );
}