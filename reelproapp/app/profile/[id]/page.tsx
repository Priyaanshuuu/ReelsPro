"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const params = useParams();
  const id = params.id;
  type Reel = {
    _id: string;
    thumbnailUrl: string;
    caption: string;
    // add other properties if needed
  };
  const [reels, setReels] = useState<Reel[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/reels?userId=${id}`)
      .then(res => res.json())
      .then(data => setReels(data));
  }, [id]);

  return (
    <div>
      <h2 className="text-2xl text-white mb-4">Users Reels</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {reels.map((reel) => (
          <div key={reel._id} className="bg-black/40 rounded-lg p-2">
            <img src={reel.thumbnailUrl} alt="thumbnail" className="w-full rounded" />
            <p className="text-white mt-2">{reel.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}