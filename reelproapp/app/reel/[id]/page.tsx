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

  if (!reel) return <div className="text-white">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <video src={reel.videoUrl} poster={reel.thumbnailUrl} controls className="w-full rounded-lg" />
      <h2 className="text-xl font-bold mt-4 text-white">{reel.caption}</h2>
      {/* aur bhi details dikha sakte ho */}
    </div>
  );
}