// components/FileUpload.tsx
import { IKUpload, IKContext } from 'imagekitio-react';

interface FileUploadProps {
  onSuccess: (res: unknown) => void;
  onProgress: (progress: number) => void;
}

export default function FileUpload({ onSuccess, onProgress }: FileUploadProps) {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  const authenticationEndpoint = "/api/imagekit-auth";
  return (
    <IKContext
      publicKey={publicKey!}
      urlEndpoint={urlEndpoint!}
      authenticationEndpoint={authenticationEndpoint}
    >
      <IKUpload
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
