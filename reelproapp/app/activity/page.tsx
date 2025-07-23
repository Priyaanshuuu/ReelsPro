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
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-white mb-6">Activity</h2>
      {notifications.length === 0 ? (
        <div className="text-gray-400 text-center">No notifications yet.</div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li key={n._id} className="bg-[#22223b] rounded-lg p-4 flex items-center gap-4">
              {n.type === "like" ? (
                <Heart className="text-pink-500" />
              ) : (
                <MessageCircle className="text-blue-400" />
              )}
              <div>
                <span className="font-semibold text-white">{n.from?.name || "Someone"}</span>
                {n.type === "like" ? (
                  <> liked your reel </>
                ) : (
                  <>
                    commented: <span className="italic text-gray-300">"{n.comment}"</span>
                  </>
                )}
                <span
                  className="ml-2 text-indigo-400 hover:underline cursor-pointer"
                  onClick={() => router.push(`/reel/${n.reel?._id}`)}
                >
                  {n.reel?.caption ? `(${n.reel.caption})` : ""}
                </span>
                <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}