"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";

interface Reel {
  _id: string;
  thumbnailUrl?: string;
  caption?: string;
}

export default function SavedReelsPage() {
  const [savedReels, setSavedReels] = useState<Reel[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/saved-reels")
      .then(res => res.json())
      .then(data => setSavedReels(data.savedReels || []));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-10 px-2">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-tight drop-shadow-lg">
          Saved Reels
        </h2>
        {savedReels.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg shadow-inner">
            <Play className="h-16 w-16 text-indigo-500 mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Saved Reels</h3>
            <p className="text-gray-400 max-w-md">
              Reels you save will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {savedReels.map((reel) => (
              <div
                key={reel._id}
                className="relative aspect-[9/16] bg-black/40 rounded-xl overflow-hidden cursor-pointer group transition-all shadow-lg hover:shadow-2xl border border-gray-700"
                onClick={() => router.push(`/reel/${reel._id}`)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300 scale-100 group-hover:scale-105"
                  style={{ backgroundImage: `url(${reel.thumbnailUrl || ""})` }}
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="p-3">
                    <div className="text-white text-sm truncate">{reel.caption}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}