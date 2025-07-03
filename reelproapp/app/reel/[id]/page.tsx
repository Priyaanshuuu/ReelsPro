"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Reel = {
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  // Add other properties as needed
};

export default function ReelDetails() {
  const { id } = useParams();
  const [reel, setReel] = useState<Reel | null>(null);

  useEffect(() => {
    fetch(`/api/reels/${id}`)
      .then((res) => res.json())
      .then((data) => setReel(data));
  }, [id]);

  if (!reel)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <span className="text-white text-lg">Loading...</span>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-4 py-10">
      <div className="max-w-xl w-full bg-black/60 rounded-2xl shadow-2xl border border-gray-700 p-6 flex flex-col items-center">
        <video
          src={reel.videoUrl}
          poster={reel.thumbnailUrl}
          controls
          className="w-full rounded-xl shadow-lg border border-gray-800 bg-black"
        />
        <h2 className="text-2xl font-bold text-white mt-6 mb-2 text-center drop-shadow">
          {reel.caption}
        </h2>
        {/* Add more details here if needed */}
        <div className="mt-4 flex justify-center">
          <img
            src={reel.thumbnailUrl}
            alt="Thumbnail"
            className="w-32 h-48 object-cover rounded-lg border border-gray-700 shadow"
          />
        </div>
      </div>
    </div>
  );
}