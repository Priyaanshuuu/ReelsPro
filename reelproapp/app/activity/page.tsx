"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle } from "lucide-react";

export default function ActivityPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => setNotifications(data.notifications || []));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181824] via-[#1a1a2e] to-[#0f3460] py-10 px-2 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-[#181824]/90 rounded-2xl shadow-2xl border border-[#23234a] p-6">
        <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-tight drop-shadow-lg">
          Activity
        </h2>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
            <Heart className="h-12 w-12 text-indigo-500 mb-4" />
            <span className="text-gray-400 text-lg">No notifications yet.</span>
          </div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li
                key={n._id}
                className="bg-[#23234a] rounded-xl p-5 flex items-center gap-4 shadow-lg border border-[#2d2d5a] hover:bg-[#28284d] transition"
              >
                <div className="flex-shrink-0">
                  {n.type === "like" ? (
                    <Heart className="text-pink-500 w-7 h-7" />
                  ) : (
                    <MessageCircle className="text-blue-400 w-7 h-7" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-white">{n.from?.name || "Someone"}</span>
                  {n.type === "like" ? (
                    <> <span className="text-gray-300">liked your reel</span> </>
                  ) : (
                    <>
                      <span className="text-gray-300">commented:</span>{" "}
                      <span className="italic text-indigo-300">"{n.comment}"</span>
                    </>
                  )}
                  <span
                    className="ml-2 text-indigo-400 hover:underline cursor-pointer"
                    onClick={() => router.push(`/reel/${n.reel?._id}`)}
                  >
                    {n.reel?.caption ? `(${n.reel.caption})` : ""}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}