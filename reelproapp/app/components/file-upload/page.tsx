// components/FileUpload.tsx
import { IKUpload } from 'imagekitio-react';

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress: (progress: number) => void;
}

export default function FileUpload({ onSuccess, onProgress }: FileUploadProps) {
  return (
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
      fileType="video"
    />
  );
}
