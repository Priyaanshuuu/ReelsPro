"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Reel = {
  _id: string;
  thumbnailUrl: string;
  caption: string;
  // add other properties if needed
};

export default function ProfilePage() {
  const params = useParams();
  const id = params.id;
  const [reels, setReels] = useState<Reel[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/reels?userId=${id}`)
      .then(res => res.json())
      .then(data => setReels(Array.isArray(data)? data: []));
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg mb-4">
            <span className="text-3xl text-white font-bold">
              {id?.toString().slice(0, 2).toUpperCase() || "U"}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow">
            Users Reels
          </h2>
          <p className="text-gray-400 mb-2 text-center">
            All reels uploaded by this user will appear below.
          </p>
        </div>
        {!Array.isArray(reels)|| reels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-white text-lg opacity-70">No reels uploaded yet.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {reels.map((reel) => (
              <div
                key={reel._id}
                className="bg-black/60 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col items-center transition-transform hover:scale-105 cursor-pointer"
              >
                <img
                  src={reel.thumbnailUrl}
                  alt="thumbnail"
                  className="w-full aspect-[9/16] object-cover"
                />
                <div className="p-3 w-full">
                  <p className="text-white text-sm truncate">{reel.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}