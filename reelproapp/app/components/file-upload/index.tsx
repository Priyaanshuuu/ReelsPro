"use client";

import { IKUpload, IKContext } from "imagekitio-react";
import { useCallback } from "react";

interface FileUploadProps {
  onSuccess: (res: unknown) => void;
  onProgress: (progress: number) => void;
}

export default function FileUpload({ onSuccess, onProgress }: FileUploadProps) {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

  // Yeh naya authenticator function hai jo /api/imagekit-auth se signature fetch karega
  const authenticator = useCallback(async () => {
    const response = await fetch("/api/imagekit-auth");
    if (!response.ok) {
      throw new Error("Failed to fetch authentication parameters");
    }
    const data = await response.json();
    return data; // { signature, expire, token }
  }, []);

  return (
    <IKContext
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
      accept="video/*"
        fileName="video-upload.mp4"
        useUniqueFileName={true}
        folder="/videos"
        onSuccess={onSuccess}
        onError={(err) => console.error("Upload Error:", err)}
        onUploadProgress={(progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          onProgress(percent);
        }}
        className="your-optional-classes"
      />
    </IKContext>
  );
}
